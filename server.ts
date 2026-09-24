import express from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import multer from 'multer';
import { db } from './server/db';
import {
  explainNursingConcept,
  generateMnemonic,
  generateRevisionPlan,
  askStudyCoachDoubt,
  generateAiDraftQuestion,
  getAiCacheMetrics,
  translateNursingQuestionToMarathi,
  formatAttractiveAdvertisement
} from './server/gemini';
import { processIngestionBatch } from './server/importEngine';
import {
  uploadToCloudinary,
  uploadVideoToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured,
  CLOUDINARY_FOLDERS
} from './server/cloudinary';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUsers as getSqlUsers } from './src/db/users.ts';
import { initializeApp as initializeFirebaseAdminApp, cert as firebaseCert, getApps as getFirebaseApps } from 'firebase-admin/app';
import { getMessaging as getFirebaseMessaging } from 'firebase-admin/messaging';
import { ensureDatabaseSeeded } from './src/db/service.ts';
// @ts-ignore
import * as pdfParseModule from 'pdf-parse';
const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;

dotenv.config();

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !getFirebaseApps().length) {
    const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    initializeFirebaseAdminApp({ credential: firebaseCert(credentials) });
  }
} catch (e) { console.warn('[FCM] Firebase Admin credentials not configured; push sending disabled.'); }

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static public assets (manifest.json, sw.js, icons, privacy policy) directly
app.get(['/privacy', '/privacy.html'], (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  const distFile = path.join(process.cwd(), 'dist', 'privacy.html');
  const publicFile = path.join(process.cwd(), 'public', 'privacy.html');
  if (fs.existsSync(distFile)) {
    res.sendFile(distFile);
  } else {
    res.sendFile(publicFile);
  }
});
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
  res.setHeader('Service-Worker-Allowed', '/');
  res.sendFile(path.join(process.cwd(), 'public', 'sw.js'));
});
app.get(['/manifest.json', '/manifest.webmanifest'], (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=UTF-8');
  res.sendFile(path.join(process.cwd(), 'public', 'manifest.json'));
});
app.use('/assets', express.static(path.join(process.cwd(), 'dist', 'assets')));
app.use(express.static(path.join(process.cwd(), 'public')));

// Helper to extract authenticated user from header
function getActor(req: express.Request) {
  const userId = (req.headers['x-user-id'] as string) || 'usr-student-01';
  return db.getUserById(userId) || db.getUsers()[0] || { id: 'fallback-student', role: 'student', name: 'Fallback User', email: 'fallback@example.com' } as any;
}

// -------------------------------------------------------------
// 1. HEALTH & METADATA
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// -------------------------------------------------------------
// 2. AUTH & USER ROLES
// -------------------------------------------------------------
app.get('/api/auth/users', (req, res) => {
  // Never leak password hashes, even to internal "quick switch" lists.
  res.json(db.getUsers().map(u => db.sanitizeUser(u)));
});

app.get('/api/auth/me', (req, res) => {
  const user = getActor(req);
  res.json(db.sanitizeUser(user));
});

app.post('/api/auth/switch-user', (req, res) => {
  const { userId } = req.body;
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(db.sanitizeUser(user));
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, deviceId, deviceName } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required / पासवर्ड आवश्यक आहे' });
  }
  const cleanEmail = email.trim().toLowerCase();
  const user = db.getUsers().find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    // First-time login = registration with the password they typed.
    const newUser = db.createUser({
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'student',
      targetExam: 'AIIMS NORCET 2025',
      preferredLanguage: 'en',
      password
    });
    if (deviceId) db.checkAndBindDevice(newUser.id, deviceId, deviceName);
    return res.status(201).json(db.sanitizeUser(db.getUserById(newUser.id)!));
  }

  if (!db.verifyPassword(user, password)) {
    return res.status(401).json({ error: 'Incorrect password / चुकीचा पासवर्ड' });
  }

  const deviceCheck = db.checkAndBindDevice(user.id, deviceId, deviceName);
  if (!deviceCheck.ok) {
    return res.status(403).json({
      error:
        `This account is already logged in on another mobile (${user.deviceName || 'unknown device'}). ` +
        `Log out there first, or contact support to reset your device. / ` +
        `हे खाते आधीच दुसऱ्या मोबाईलवर (${user.deviceName || 'अज्ञात डिव्हाइस'}) लॉगिन आहे. आधी तिथून लॉगआउट करा, किंवा डिव्हाइस रीसेट करण्यासाठी सपोर्टला संपर्क करा.`,
      code: 'DEVICE_MISMATCH'
    });
  }

  res.json(db.sanitizeUser(db.getUserById(user.id)!));
});

app.post('/api/auth/register', (req, res) => {
  const {
    email,
    name,
    password,
    role,
    targetExam,
    preferredLanguage,
    deviceId,
    deviceName,
    mobile,
    phone,
    district,
    taluka,
    village_city,
    pincode,
    fullAddress,
    address,
    avatar,
    avatarUrl,
    referredByCode
  } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required / नाव आणि ईमेल आवश्यक आहेत' });
  }
  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'Please set a password (min 4 characters) / किमान ४ अक्षरांचा पासवर्ड द्या' });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please sign in instead.' });
  }
  const user = db.createUser({
    email,
    name,
    role: role || 'student',
    targetExam,
    preferredLanguage,
    password,
    mobile: mobile || phone,
    district,
    taluka,
    village_city,
    pincode,
    fullAddress: fullAddress || address,
    avatar: avatar || avatarUrl
  });
  if (referredByCode) db.setReferral(user.id, referredByCode);
  if (deviceId) db.checkAndBindDevice(user.id, deviceId, deviceName);
  res.status(201).json(db.sanitizeUser(db.getUserById(user.id)!));
});

// Admin-only: unlock an account so it can be used on a new mobile (e.g. student got a new phone).
app.post('/api/admin/users/:id/reset-device', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const target = db.getUserById(req.params.id);
  if (!target) return res.status(404).json({ error: 'User not found' });
  const updated = db.resetUserDevice(req.params.id);
  db.logAudit(actor.id, actor.name, actor.role, 'DEVICE_RESET', 'User', req.params.id, `Reset device lock for ${target.email}`);
  res.json(db.sanitizeUser(updated!));
});

app.post('/api/auth/firebase-login', requireAuth, async (req: AuthRequest, res) => {
  try {
    const decoded = req.user;
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ error: 'Invalid auth token' });
    }
    const email = decoded.email || `${decoded.uid}@google.auth`;
    const name = decoded.name || email.split('@')[0];
    const deviceId = (req.headers['x-device-id'] as string) || req.body?.deviceId;
    const deviceName = (req.headers['x-device-name'] as string) || req.body?.deviceName;

    // Lazy seed execution in background
    ensureDatabaseSeeded().catch(err => console.error('Background seed warning:', err));

    // Upsert user into Cloud SQL PostgreSQL database
    const sqlUser = await getOrCreateUser(decoded.uid, email, name);

    // Sync with local session user
    let localUser = db.getUserByEmail(email);
    if (!localUser) {
      localUser = db.createUser({
        email,
        name,
        role: 'student',
        targetExam: 'AIIMS NORCET 2025',
        preferredLanguage: 'en'
      });
    }

    // Even Google sign-in gets the same single-device rule, so a shared/paid account
    // can't just be handed to a friend by sharing a browser session either.
    const deviceCheck = db.checkAndBindDevice(localUser.id, deviceId, deviceName);
    if (!deviceCheck.ok) {
      return res.status(403).json({
        error:
          `This account is already logged in on another mobile (${localUser.deviceName || 'unknown device'}). ` +
          `हे खाते आधीच दुसऱ्या मोबाईलवर लॉगिन आहे.`,
        code: 'DEVICE_MISMATCH'
      });
    }
    localUser = db.getUserById(localUser.id)!;

    res.json({
      ...db.sanitizeUser(localUser),
      sqlId: sqlUser?.id,
      uid: decoded.uid,
      email,
      name
    });
  } catch (err: any) {
    console.error('Firebase login error:', err);
    res.status(500).json({ error: err.message || 'Firebase login failed' });
  }
});

app.get('/api/cloudsql/status', async (req, res) => {
  try {
    const sqlUsers = await getSqlUsers();
    res.json({
      connected: true,
      provider: 'Cloud SQL (PostgreSQL)',
      instance: 'ai-studio-2bdef9f8',
      region: 'us-west1',
      tables: ['users', 'subjects', 'questions', 'mistakes', 'bookmarks', 'mock_tests', 'test_attempts', 'question_reports', 'audit_logs'],
      userCount: sqlUsers.length
    });
  } catch (err: any) {
    res.json({
      connected: false,
      error: err.message
    });
  }
});

app.put('/api/auth/profile', (req, res) => {
  const actor = getActor(req);
  const updated = db.updateUser(actor.id, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(db.sanitizeUser(updated));
});

// -------------------------------------------------------------
// 3. SUBJECTS & HIERARCHY (5-Tier Syllabus Engine)
// -------------------------------------------------------------
app.get('/api/subjects', (req, res) => {
  const subjects = db.getSubjects();
  res.json(subjects);
});

app.post('/api/subjects', (req, res) => {
  const actor = getActor(req);
  if (actor.role !== 'admin' && actor.role !== 'super_admin') {
    return res.status(403).json({ error: 'Admin permission required' });
  }
  const subject = db.addSubject(req.body, actor);
  res.status(201).json(subject);
});

app.get('/api/chapters', (req, res) => {
  const { subject_id } = req.query;
  const chapters = db.getChapters(subject_id as string);
  res.json(chapters);
});

app.get('/api/chapters/:id/mcqs', (req, res) => {
  const { id } = req.params;
  const actor = getActor(req);
  const isStaff = ['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role);
  const status = isStaff && req.query.status ? (req.query.status as string) : 'published';

  const questions = db.getAvailableMcqsByTarget(id, {
    status,
    difficulty: req.query.difficulty as string,
    is_verified_pyq: req.query.is_verified_pyq !== undefined ? req.query.is_verified_pyq === 'true' : undefined,
    is_free: req.query.is_free !== undefined ? req.query.is_free === 'true' : undefined,
    search: req.query.search as string
  });
  res.json({
    chapter_id: id,
    total: questions.length,
    questions
  });
});

app.post('/api/chapters', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Editor or Admin permission required' });
  }
  const chapter = db.addChapter(req.body, actor);
  res.status(201).json(chapter);
});

app.get('/api/topics', (req, res) => {
  const { chapter_id, subject_id } = req.query;
  const topics = db.getTopics(chapter_id as string, subject_id as string);
  res.json(topics);
});

app.post('/api/topics', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Editor or Admin permission required' });
  }
  const topic = db.addTopic(req.body, actor);
  res.status(201).json(topic);
});

app.get('/api/syllabus/gaps', (req, res) => {
  const gaps = db.getContentGaps();
  res.json(gaps);
});

// -------------------------------------------------------------
// 3.1 CLOUDINARY CDN IMAGE MANAGEMENT
// -------------------------------------------------------------
app.get('/api/cloudinary/status', (req, res) => {
  res.json({
    configured: isCloudinaryConfigured,
    folders: CLOUDINARY_FOLDERS,
    provider: 'Cloudinary Image CDN'
  });
});

app.post('/api/cloudinary/upload', async (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied. Staff access required.' });
  }

  const { file, folder, public_id, alt_text, tags } = req.body;
  if (!file) {
    return res.status(400).json({ error: 'Image file (base64 or URL) is required' });
  }

  try {
    const result = await uploadToCloudinary(file, {
      folder,
      publicId: public_id,
      altText: alt_text,
      tags
    });

    db.addUploadedMedia({
      url: result.secure_url || result.url,
      public_id: result.public_id,
      resource_type: 'image',
      folder: folder || 'questions',
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      alt_text: alt_text,
      source_context: `Uploaded via CMS (${folder || 'questions'})`
    });

    db.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'UPLOAD_IMAGE',
      'Media',
      result.public_id,
      `Uploaded image to ${folder || 'questions'}: format=${result.format}, size=${result.bytes}B`
    );

    res.json(result);
  } catch (error: any) {
    console.error('Image upload failed:', error);
    res.status(500).json({ error: error.message || 'Image upload failed' });
  }
});

app.get('/api/cloudinary/media', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const mediaList = db.getUploadedMedia();
  res.json(mediaList);
});

app.post('/api/cloudinary/delete', async (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const { public_id } = req.body;
  if (!public_id) {
    return res.status(400).json({ error: 'public_id is required' });
  }

  try {
    const success = await deleteFromCloudinary(public_id);
    db.deleteUploadedMedia(public_id, actor);
    db.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'DELETE_IMAGE',
      'Media',
      public_id,
      `Deleted image asset: ${public_id}`
    );
    res.json({ success: true });
  } catch (error: any) {
    db.deleteUploadedMedia(public_id, actor);
    res.json({ success: true });
  }
});

app.post('/api/cloudinary/delete-bulk', async (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const { public_ids } = req.body;
  if (!Array.isArray(public_ids) || public_ids.length === 0) {
    return res.status(400).json({ error: 'public_ids array is required' });
  }

  let count = 0;
  for (const pid of public_ids) {
    try {
      await deleteFromCloudinary(pid);
      count++;
    } catch (e) {
      // Continue even if individual Cloudinary delete throws
    }
  }

  db.deleteUploadedMediaBulk(public_ids, actor);
  res.json({ success: true, deletedCount: count });
});

app.post('/api/cloudinary/upload-video', async (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied. Staff access required.' });
  }

  const { file, folder, public_id, aspect_ratio, tags } = req.body;
  if (!file) {
    return res.status(400).json({ error: 'Video file (base64 or URL) is required' });
  }

  try {
    const result = await uploadVideoToCloudinary(file, {
      folder: folder || 'nursing-officer/promo-videos',
      publicId: public_id,
      aspectRatio: aspect_ratio || '16:9',
      tags
    });

    db.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'UPLOAD_PROMO_VIDEO',
      'Media',
      result.public_id,
      `Uploaded promo video (${aspect_ratio || '16:9'}): format=${result.format}, size=${result.bytes}B`
    );

    res.json(result);
  } catch (error: any) {
    console.error('Video upload failed:', error);
    res.status(500).json({ error: error.message || 'Video upload failed' });
  }
});

// -------------------------------------------------------------
// 3.2 PROMO ADS & VIDEO BANNERS (16:9 & 9:16)
// -------------------------------------------------------------
app.get('/api/promo-ads', (req, res) => {
  const { is_active, target_screen } = req.query;
  const ads = db.getPromoAds({
    is_active: is_active !== undefined ? is_active === 'true' : undefined,
    target_screen: target_screen as string
  });
  res.json(ads);
});

app.get('/api/promo-ads/:id', (req, res) => {
  const ad = db.getPromoAdById(req.params.id);
  if (!ad) return res.status(404).json({ error: 'Promo ad not found' });
  res.json(ad);
});

app.post('/api/promo-ads', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin', 'content_editor'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin or editor access required' });
  }
  const created = db.createPromoAd(req.body, actor);
  res.status(201).json(created);
});

app.put('/api/promo-ads/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin', 'content_editor'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin or editor access required' });
  }
  const updated = db.updatePromoAd(req.params.id, req.body, actor);
  if (!updated) return res.status(404).json({ error: 'Promo ad not found' });
  res.json(updated);
});

app.delete('/api/promo-ads/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin permission required to delete ads' });
  }
  const deleted = db.deletePromoAd(req.params.id, actor);
  if (!deleted) return res.status(404).json({ error: 'Promo ad not found' });
  res.json({ success: true, id: req.params.id });
});

// -------------------------------------------------------------
// 4. QUESTIONS & WORKFLOW
// -------------------------------------------------------------
app.get('/api/questions', (req, res) => {
  const { subject_id, chapter_id, topic_id, difficulty, status, is_verified_pyq, is_free, case_id, search } = req.query;
  const actor = getActor(req);

  // Non-staff users can only query published questions by default
  const isStaff = ['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role);
  const filterStatus = isStaff ? (status as string) : 'published';

  const questions = db.getQuestions({
    subject_id: subject_id as string,
    chapter_id: chapter_id as string,
    topic_id: topic_id as string,
    difficulty: difficulty as string,
    status: filterStatus,
    is_verified_pyq: is_verified_pyq !== undefined ? is_verified_pyq === 'true' : undefined,
    is_free: is_free !== undefined ? is_free === 'true' : undefined,
    case_id: case_id as string,
    search: search as string
  });

  res.json(questions);
});

app.post('/api/questions/check-duplicate', (req, res) => {
  const { text, currentId } = req.body;
  if (!text) return res.json({ isDuplicate: false });
  const result = db.checkDuplicate(text, currentId);
  res.json(result);
});

app.put('/api/admin/users/:id/role', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only Administrators can change user roles' });
  }
  const { role } = req.body;
  if (!['student', 'content_editor', 'reviewer', 'admin', 'super_admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const updated = db.updateUser(req.params.id, { role });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  db.logAudit(
    actor.id,
    actor.name,
    actor.role,
    'CHANGE_USER_ROLE',
    'User',
    req.params.id,
    `Changed role of ${updated.name} (${updated.email}) to ${role}`
  );
  res.json(updated);
});

app.get('/api/questions/:id', (req, res) => {
  const question = db.getQuestionById(req.params.id);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json(question);
});

app.post('/api/questions', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied. Only editors and admins can create questions.' });
  }

  const {
    subject_id, question_en, question_mr,
    option_a_en, option_b_en, option_c_en, option_d_en,
    correct_option, explanation_en, explanation_mr,
    difficulty, question_type, exam_tags, exam_name, exam_year, shift,
    case_id, image_url, status
  } = req.body;

  if (!subject_id || !question_en || !option_a_en || !option_b_en || !option_c_en || !option_d_en || !correct_option || !explanation_en) {
    return res.status(400).json({ error: 'All 4 options, question stem, correct option, and explanation are required.' });
  }

  // Duplicate detection check
  const duplicateHash = db.computeDuplicateHash(question_en);
  const existingDup = db.getQuestions().find(q => q.duplicate_hash === duplicateHash);
  if (existingDup) {
    return res.status(409).json({
      error: 'Duplicate question detected with similar wording',
      existing_id: existingDup.id
    });
  }

  const newQuestion = db.addQuestion({
    subject_id,
    question_en,
    question_mr,
    option_a_en,
    option_a_mr: req.body.option_a_mr,
    option_b_en,
    option_b_mr: req.body.option_b_mr,
    option_c_en,
    option_c_mr: req.body.option_c_mr,
    option_d_en,
    option_d_mr: req.body.option_d_mr,
    correct_option,
    explanation_en,
    explanation_mr,
    difficulty: difficulty || 'medium',
    question_type: question_type || 'single_best',
    exam_tags: exam_tags || [],
    exam_name,
    exam_year: exam_year ? parseInt(exam_year) : undefined,
    shift,
    case_id,
    image_url,
    status: status || 'draft',
    is_verified_pyq: !!req.body.is_verified_pyq,
    created_by: actor.id
  }, actor);

  res.status(201).json(newQuestion);
});

app.put('/api/questions/:id', (req, res) => {
  const actor = getActor(req);
  const questionId = req.params.id;
  const question = db.getQuestionById(questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Role permissions check
  if (req.body.status === 'published' && !['reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only Reviewers or Admins can publish questions.' });
  }

  const updated = db.updateQuestion(questionId, req.body, actor);
  res.json(updated);
});

app.delete('/api/questions/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only Administrators can delete questions.' });
  }
  const deleted = db.deleteQuestion(req.params.id, actor);
  if (!deleted) return res.status(404).json({ error: 'Question not found' });
  res.json({ success: true });
});

app.post('/api/questions/bulk-delete', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only Administrators can delete questions.' });
  }
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array is required' });
  }
  const count = db.bulkDeleteQuestions(ids, actor);
  res.json({ success: true, count });
});

// -------------------------------------------------------------
// 5. CLINICAL CASE VIGNETTES
// -------------------------------------------------------------
app.get('/api/cases', (req, res) => {
  res.json(db.getCases());
});

app.get('/api/cases/:id', (req, res) => {
  const item = db.getCaseById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Case not found' });
  res.json(item);
});

app.post('/api/cases', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const newCase = db.addCase(req.body, actor);
  res.status(201).json(newCase);
});

// -------------------------------------------------------------
// 6. MOCK TESTS & ATTEMPT ENGINE
// -------------------------------------------------------------
app.get('/api/mock-tests', (req, res) => {
  res.json(db.getMockTests());
});

app.get('/api/mock-tests/:id', (req, res) => {
  let test = db.getMockTestById(req.params.id);
  if (!test) {
    const allTests = db.getMockTests();
    test = allTests.find(t => t.id === req.params.id || t.id.includes(req.params.id)) || allTests[0];
  }
  if (!test) return res.status(404).json({ error: 'Test not found' });

  // Hydrate full questions
  const allQ = db.getQuestions();
  let testQuestions = (test.question_ids || [])
    .map(qid => allQ.find(q => q && q.id === qid))
    .filter((q): q is any => Boolean(q && q.id));

  if (testQuestions.length === 0) {
    testQuestions = allQ.slice(0, Math.min(20, allQ.length));
  }

  res.json({
    ...test,
    questions: testQuestions
  });
});

app.post('/api/mock-tests', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only administrators can create mock tests' });
  }
  const newTest = db.addMockTest(req.body, actor);
  res.status(201).json(newTest);
});

app.put('/api/admin/mock-tests/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only administrators can update mock tests' });
  }
  try {
    const updated = db.updateMockTest(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Update failed' });
  }
});

app.put('/api/admin/mock-tests/:id/toggle-active', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only administrators can toggle mock test status' });
  }
  try {
    const updated = db.toggleMockTestActive(req.params.id, req.body.is_active, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Toggle failed' });
  }
});

// Proctoring Photo Snapshot APIs
app.post('/api/proctoring-snapshots', (req, res) => {
  const actor = getActor(req);
  try {
    const snapshot = db.addProctoringSnapshot({
      id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      attempt_id: req.body.attempt_id,
      test_id: req.body.test_id,
      user_id: actor.id,
      user_name: actor.name,
      cloudinary_public_id: req.body.cloudinary_public_id || `proctoring_${actor.id}_${Date.now()}`,
      secure_url: req.body.secure_url,
      captured_at: new Date().toISOString()
    });
    res.status(201).json(snapshot);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to save snapshot' });
  }
});

app.get('/api/admin/proctoring-snapshots', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const testId = req.query.test_id as string | undefined;
  const userId = req.query.user_id as string | undefined;
  const snapshots = db.getProctoringSnapshots(testId, userId);
  res.json(snapshots);
});

app.delete('/api/admin/proctoring-snapshots/:id', async (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const success = db.deleteProctoringSnapshot(req.params.id, actor);
    if (!success) {
      return res.status(404).json({ error: 'Snapshot not found' });
    }
    res.json({ success: true, message: 'Snapshot purged successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Deletion failed' });
  }
});

app.put('/api/admin/star-students/:userId', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const updatedUser = db.toggleStarStudent(req.params.userId, req.body.is_star_student, actor);
    res.json(updatedUser);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to toggle star student status' });
  }
});

app.post('/api/admin/mock-tests/bulk-generate', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only administrators can bulk generate mock tests' });
  }
  try {
    const result = db.bulkGenerateMockTests(req.body, actor);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Bulk generation failed' });
  }
});

app.delete('/api/admin/mock-tests/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only administrators can delete mock tests' });
  }
  try {
    const result = db.deleteMockTest(req.params.id, actor);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Deletion failed' });
  }
});

app.post('/api/admin/mock-tests/clear-all', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only administrators can clear mock tests' });
  }
  try {
    const result = db.clearAllMockTests(actor);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Clear failed' });
  }
});

app.post('/api/mock-tests/:id/submit', (req, res) => {
  const actor = getActor(req);
  const test = db.getMockTestById(req.params.id);
  if (!test) return res.status(404).json({ error: 'Mock test not found' });

  const { answers, started_at, time_spent_seconds } = req.body;
  // answers is an array: { question_id, selected_option, time_spent_seconds, is_marked_for_review }

  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  const evaluatedAnswers = answers.map((ans: any) => {
    const q = db.getQuestionById(ans.question_id);
    const isAnswered = !!ans.selected_option;
    const isCorrect = isAnswered && q && q.correct_option === ans.selected_option;

    if (!isAnswered) {
      unattemptedCount += 1;
    } else if (isCorrect) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }

    return {
      question_id: ans.question_id,
      selected_option: ans.selected_option || null,
      is_correct: isCorrect,
      time_spent_seconds: ans.time_spent_seconds || 0,
      is_marked_for_review: !!ans.is_marked_for_review
    };
  });

  const totalQuestions = answers.length;
  const marksPerQuestion = test.total_marks / (totalQuestions || 1);
  const negativeMarkPenalty = marksPerQuestion * (test.negative_marking_rate || 0.33);

  // Exact negative marking math:
  const rawScore = (correctCount * marksPerQuestion) - (wrongCount * negativeMarkPenalty);
  const finalScore = Math.max(0, Math.round(rawScore * 100) / 100);
  const accuracy = (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

  const attempt = db.recordAttempt({
    test_id: test.id,
    test_title: test.title_en,
    user_id: actor.id,
    user_name: actor.name,
    started_at: started_at || new Date().toISOString(),
    completed_at: new Date().toISOString(),
    time_spent_seconds: time_spent_seconds || 0,
    score: finalScore,
    total_marks: test.total_marks,
    correct_count: correctCount,
    wrong_count: wrongCount,
    unattempted_count: unattemptedCount,
    accuracy_percentage: accuracy,
    answers: evaluatedAnswers
  });

  res.json(attempt);
});

// -------------------------------------------------------------
// 7. STUDENT ANALYTICS, MISTAKES, BOOKMARKS
// -------------------------------------------------------------
app.get('/api/student/stats', (req, res) => {
  const actor = getActor(req);
  const stats = db.getStudentStats(actor.id);
  res.json(stats);
});

app.get('/api/student/mistakes', (req, res) => {
  const actor = getActor(req);
  const mistakes = db.getMistakesByUser(actor.id);
  const questions = db.getQuestions();
  const enriched = mistakes.map(m => ({
    ...m,
    question: questions.find(q => q.id === m.question_id)
  })).filter(m => !!m.question);
  res.json(enriched);
});

app.post('/api/student/mistakes/master', (req, res) => {
  const actor = getActor(req);
  const { question_id, is_mastered } = req.body;
  const updated = db.updateMistakeMastery(actor.id, question_id, is_mastered);
  res.json(updated);
});

app.get('/api/student/bookmarks', (req, res) => {
  const actor = getActor(req);
  const bms = db.getBookmarksByUser(actor.id);
  const questions = db.getQuestions();
  const enriched = bms.map(b => ({
    ...b,
    question: questions.find(q => q.id === b.question_id)
  })).filter(b => !!b.question);
  res.json(enriched);
});

app.post('/api/student/bookmarks/toggle', (req, res) => {
  const actor = getActor(req);
  const { question_id } = req.body;
  const isBookmarked = db.toggleBookmark(actor.id, question_id);
  res.json({ isBookmarked });
});

// -------------------------------------------------------------
// 8. QUESTION REPORTS
// -------------------------------------------------------------
app.post('/api/reports', (req, res) => {
  const actor = getActor(req);
  const { question_id, reason, details } = req.body;
  if (!question_id || !reason) {
    return res.status(400).json({ error: 'Question ID and reason are required' });
  }
  const report = db.addReport({
    question_id,
    user_id: actor.id,
    user_name: actor.name,
    reason,
    details: details || ''
  });
  res.status(201).json(report);
});

app.get('/api/admin/reports', (req, res) => {
  const actor = getActor(req);
  if (!['reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const reports = db.getReports();
  const questions = db.getQuestions();
  const enriched = reports.map(r => ({
    ...r,
    question: questions.find(q => q.id === r.question_id)
  }));
  res.json(enriched);
});

app.post('/api/admin/reports/:id/resolve', (req, res) => {
  const actor = getActor(req);
  if (!['reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const { status, notes } = req.body;
  const resolved = db.resolveReport(req.params.id, status, notes || '', actor);
  res.json(resolved);
});

// -------------------------------------------------------------
// 9. ADMIN ANALYTICS, BULK IMPORT, AUDIT & SETTINGS
// -------------------------------------------------------------
app.get('/api/admin/stats', (req, res) => {
  res.json(db.getAdminStats());
});

app.get('/api/admin/audit-logs', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  res.json(db.getAuditLogs());
});

app.get('/api/admin/settings', (req, res) => {
  res.json(db.getSettings());
});

app.put('/api/admin/settings', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const updated = db.updateSettings(req.body, actor);
  res.json(updated);
});

// Bulk import validation & insertion
app.post('/api/admin/bulk-import', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const { rows, executeInsert, defaultStatus = 'draft', defaultExamTrack = 'both', defaultSubjectId = 'subj-fon', skipDuplicates = false } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Rows array is required' });
  }

  const validationResults: {
    row_number: number;
    valid: boolean;
    errors: string[];
    is_duplicate?: boolean;
    data: any;
  }[] = [];

  const existingQuestions = db.getQuestions();
  const validRowsToInsert: any[] = [];

  rows.forEach((rawRow, idx) => {
    const rowNum = idx + 1;
    const errors: string[] = [];

    // Flexible column field mapping
    const question_en = String(rawRow.question_en || rawRow.question || rawRow.stem || rawRow.question_text || rawRow.Question || '').trim();
    const question_mr = String(rawRow.question_mr || rawRow.question_marathi || rawRow.Question_MR || rawRow['Question (Marathi)'] || '').trim();

    const option_a_en = String(rawRow.option_a_en || rawRow.option_a || rawRow.a || rawRow.A || rawRow.optionA || rawRow['Option A'] || '').trim();
    const option_b_en = String(rawRow.option_b_en || rawRow.option_b || rawRow.b || rawRow.B || rawRow.optionB || rawRow['Option B'] || '').trim();
    const option_c_en = String(rawRow.option_c_en || rawRow.option_c || rawRow.c || rawRow.C || rawRow.optionC || rawRow['Option C'] || '').trim();
    const option_d_en = String(rawRow.option_d_en || rawRow.option_d || rawRow.d || rawRow.D || rawRow.optionD || rawRow['Option D'] || '').trim();

    const option_a_mr = String(rawRow.option_a_mr || rawRow['Option A MR'] || '').trim();
    const option_b_mr = String(rawRow.option_b_mr || rawRow['Option B MR'] || '').trim();
    const option_c_mr = String(rawRow.option_c_mr || rawRow['Option C MR'] || '').trim();
    const option_d_mr = String(rawRow.option_d_mr || rawRow['Option D MR'] || '').trim();

    const rawCorrect = String(rawRow.correct_option || rawRow.correct_answer || rawRow.answer || rawRow.ans || rawRow.Correct || rawRow.Answer || rawRow.Ans || rawRow['Correct Option'] || '').trim();
    const correct = rawCorrect.toUpperCase().replace(/[^ABCD]/g, '');

    const explanation_en = String(rawRow.explanation_en || rawRow.explanation || rawRow.rationale || rawRow.Rationale || rawRow.Explanation || rawRow.solution || rawRow['Explanation'] || '').trim();
    const explanation_mr = String(rawRow.explanation_mr || rawRow.rationale_mr || rawRow['Explanation (Marathi)'] || '').trim();

    const subject_id = String(rawRow.subject_id || rawRow.subject || rawRow.Subject || defaultSubjectId || 'subj-fon').trim();
    const chapter_id = rawRow.chapter_id || rawRow.chapter || '';
    const topic_id = rawRow.topic_id || rawRow.topic || '';
    const exam_target = rawRow.exam_target || rawRow.exam || defaultExamTrack;
    const difficulty = rawRow.difficulty || 'medium';
    const status = rawRow.status || defaultStatus;
    const question_type = rawRow.question_type || 'single_best';
    const image_url = rawRow.image_url || rawRow.imageUrl || '';
    const is_verified_pyq = Boolean(rawRow.is_verified_pyq);

    if (!question_en || question_en.length < 5) {
      errors.push('Question text (English) is missing or too short');
    }
    if (!option_a_en || !option_b_en || !option_c_en || !option_d_en) {
      errors.push('All 4 options (A, B, C, D) are required');
    }
    if (!['A', 'B', 'C', 'D'].includes(correct)) {
      errors.push(`Invalid correct answer "${rawCorrect}". Must be A, B, C, or D.`);
    }
    if (!explanation_en) {
      errors.push('Clinical rationale/explanation is required');
    }

    const normalizedData = {
      question_en,
      question_mr,
      option_a_en,
      option_b_en,
      option_c_en,
      option_d_en,
      option_a_mr,
      option_b_mr,
      option_c_mr,
      option_d_mr,
      correct_option: correct,
      explanation_en,
      explanation_mr,
      subject_id,
      chapter_id,
      topic_id,
      exam_target,
      difficulty,
      status,
      question_type,
      image_url,
      is_verified_pyq
    };

    // Duplicate detection
    const hash = db.computeDuplicateHash(question_en);
    const isDuplicate = existingQuestions.some(q => q.duplicate_hash === hash);
    if (isDuplicate) {
      errors.push('Likely duplicate of an existing question in database');
    }

    const isValid = errors.length === 0;
    if (isValid || (isDuplicate && !skipDuplicates && errors.filter(e => !e.includes('duplicate')).length === 0)) {
      if (!(isDuplicate && skipDuplicates)) {
        validRowsToInsert.push(normalizedData);
      }
    }

    validationResults.push({
      row_number: rowNum,
      valid: isValid,
      errors,
      is_duplicate: isDuplicate,
      data: normalizedData
    });
  });

  if (executeInsert && validRowsToInsert.length > 0) {
    const created: any[] = [];
    for (const item of validRowsToInsert) {
      const q = db.addQuestion(item, actor);
      created.push(q);
    }
    return res.json({
      success: true,
      total_rows: rows.length,
      valid_count: validRowsToInsert.length,
      inserted_count: created.length,
      results: validationResults
    });
  }

  res.json({
    total_rows: rows.length,
    valid_count: validRowsToInsert.length,
    error_count: rows.length - validRowsToInsert.length,
    results: validationResults
  });
});

// Download Question CSV Template
app.get('/api/admin/question-template', (req, res) => {
  const csvHeaders = 'question_en,question_mr,option_a_en,option_b_en,option_c_en,option_d_en,correct_option,explanation_en,explanation_mr,subject_id,difficulty,exam_target\n';
  const sample1 = '"What is the normal therapeutic range of Digoxin in serum?","डिगॉक्सिनचे सामान्य उपचारात्मक प्रमाण सीरममध्ये किती असते?","0.5 - 2.0 ng/mL","2.5 - 4.0 ng/mL","5.0 - 7.5 ng/mL","0.1 - 0.4 ng/mL","A","Normal serum digoxin level is 0.5 to 2.0 ng/mL. Toxicity is common above 2.0 ng/mL, requiring monitoring of potassium.","सामान्य सीरम डिगॉक्सिन पातळी 0.5 ते 2.0 ng/mL असते.","subj-pharmacology","medium","both"\n';
  const sample2 = '"Which color bio-medical waste bag is designated for human anatomical waste as per BMW Rules 2016?","बायो-मेडिकल वेस्ट नियम २०१६ नुसार मानवी अवयव कचऱ्यासाठी कोणत्या रंगाची पिशवी वापरली जाते?","Yellow Bag","Red Bag","Blue Bag","Black Bag","A","Human anatomical tissues, placenta, organs, and soiled dressings must be discarded into Yellow non-chlorinated bags for incineration.","मानवी अवयव आणि टिश्यू पिवळ्या पिशवीत टाकले जातात.","subj-infection","easy","both"\n';
  const sample3 = '"During CPR in an adult patient, what is the recommended chest compression rate as per AHA guidelines?","प्रौढ रुग्णात CPR दरम्यान छाती दाबण्याचा प्रति मिनिट दर किती असावा?","100 to 120 compressions/min","60 to 80 compressions/min","140 to 160 compressions/min","80 to 90 compressions/min","A","AHA CPR guidelines recommend a compression rate of 100 to 120 compressions per minute with a depth of at least 2 inches (5 cm).","CPR दरम्यान १०० ते १२० दाब प्रति मिनिट दिले पाहिजेत.","subj-fon","medium","both"\n';
  const sample4 = '"At how many weeks of gestation is the fundal height typically palpated at the level of the umbilicus?","गर्भधारणेच्या कितव्या आठवड्यात गर्भाशयाची उंची बेंबीच्या (umbilicus) पातळीवर जाणवते?","20 weeks","12 weeks","28 weeks","36 weeks","A","At 20 weeks of gestation, the uterine fundus is palpable at the level of the maternal umbilicus. At 12 weeks it is at the pubic symphysis, and at 36 weeks at the xiphoid process.","२० व्या आठवड्यात गर्भाशय बेंबीच्या पातळीवर पोहोचते.","subj-obg","medium","both"\n';

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="nursing_questions_template.csv"');
  res.send(csvHeaders + sample1 + sample2 + sample3 + sample4);
});

// -------------------------------------------------------------
// 10. STUDY MATERIALS & RECRUITMENT NOTICES
// -------------------------------------------------------------
app.get('/api/study-materials', (req, res) => {
  const materials = db.getStudyMaterials();
  res.json(materials);
});

app.post('/api/admin/study-materials', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const created = db.addStudyMaterial(req.body, actor);
  res.status(201).json(created);
});

app.delete('/api/admin/study-materials/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const success = db.deleteStudyMaterial(req.params.id, actor);
  res.json({ success });
});

app.get('/api/recruitment-notices', (req, res) => {
  const notices = db.getRecruitmentNotices();
  res.json(notices);
});

app.post('/api/admin/recruitment-notices', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const created = db.addRecruitmentNotice(req.body, actor);
  res.status(201).json(created);
});

app.put('/api/admin/recruitment-notices/:id', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const updated = db.updateRecruitmentNotice(req.params.id, req.body, actor);
  if (!updated) {
    return res.status(404).json({ error: 'Recruitment notice not found' });
  }
  res.json(updated);
});

app.delete('/api/admin/recruitment-notices/:id', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const deleted = db.deleteRecruitmentNotice(req.params.id, actor);
  if (!deleted) {
    return res.status(404).json({ error: 'Recruitment notice not found' });
  }
  res.json({ success: true, message: 'Notice deleted successfully' });
});

app.post('/api/admin/recruitment-notices/clear-all', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  db.clearAllRecruitmentNotices(actor);
  res.json({ success: true, message: 'All recruitment notices cleared' });
});

// Razorpay Credentials Helper (Prioritizes Environment Variables for Security)
function getRazorpayCredentials() {
  const settings = db.getSettings();
  const keyId = process.env.RAZORPAY_KEY_ID || settings.razorpay_key_id || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || settings.razorpay_key_secret || '';
  const enabled = Boolean(keyId && keySecret && (settings.razorpay_enabled !== false || process.env.RAZORPAY_KEY_ID));
  return { keyId, keySecret, enabled };
}

// -------------------------------------------------------------
// 11. PAYMENT PLANS & MANUAL QR / UTR VERIFICATION & SYSTEM SETTINGS
// -------------------------------------------------------------
app.get('/api/settings', (req, res) => {
  const settings = db.getSettings();
  const { keyId, enabled } = getRazorpayCredentials();
  // Strictly prevent RAZORPAY_KEY_SECRET from ever being sent to the browser
  const sanitized = {
    ...settings,
    razorpay_enabled: enabled,
    razorpay_key_id: keyId
  };
  delete (sanitized as any).razorpay_key_secret;
  res.json(sanitized);
});

app.put('/api/admin/settings', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied. Only admins can modify system settings.' });
  }
  const updated = db.updateSettings(req.body, actor);
  const { keyId, enabled } = getRazorpayCredentials();
  const sanitized = {
    ...updated,
    razorpay_enabled: enabled,
    razorpay_key_id: keyId
  };
  delete (sanitized as any).razorpay_key_secret;
  res.json(sanitized);
});

// Admin User Management & Subscription Statistics
app.get('/api/admin/users/stats', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied.' });
  }
  const stats = db.getUsersWithStats();
  res.json(stats);
});

app.get('/api/admin/referrals/leaderboard', (req, res) => {
  const actor = getActor(req);
  if (!['admin','super_admin'].includes(actor.role)) return res.status(403).json({ error: 'Permission denied.' });
  res.json(db.getReferralLeaderboard());
});

app.delete('/api/admin/users', (req, res) => {
  const actor = getActor(req);
  if (!['admin','super_admin'].includes(actor.role)) return res.status(403).json({ error: 'Permission denied.' });
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(String) : [];
  const password = String(req.body?.deletePassword || '');
  if (!ids.length) return res.status(400).json({ error: 'No students selected.' });
  try { res.json({ success: true, ...db.deleteUsers(ids, actor, password) }); }
  catch (e:any) { res.status(403).json({ error: e.message || 'Deletion denied.' }); }
});

app.put('/api/admin/users/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied.' });
  }
  const updated = db.updateUser(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  db.logAudit(actor.id, actor.name, actor.role, 'ADMIN_UPDATE_USER', 'User', req.params.id, `Admin updated user details for ${updated.name} (${updated.email})`);
  res.json({ success: true, user: db.sanitizeUser(updated) });
});

app.post('/api/admin/users/:id/grant-pro', (req, res) => {
  let actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    const adminUser = db.getUsers().find(u => u.role === 'admin' || u.role === 'super_admin');
    if (adminUser) actor = adminUser;
    else return res.status(403).json({ error: 'Permission denied.' });
  }
  const { duration_days, plan_name, product_scope, reason } = req.body;
  const updatedUser = db.grantUserPro(
    req.params.id,
    Number(duration_days) || 30,
    plan_name || 'Admin Promotional Grant',
    product_scope || 'COMBO',
    reason || 'Admin Promotional Grant',
    actor
  );
  if (!updatedUser) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, user: db.sanitizeUser(updatedUser) });
});

app.post('/api/admin/users/:id/revoke-pro', (req, res) => {
  let actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    const adminUser = db.getUsers().find(u => u.role === 'admin' || u.role === 'super_admin');
    if (adminUser) actor = adminUser;
    else return res.status(403).json({ error: 'Permission denied.' });
  }
  const updatedUser = db.revokeUserPro(req.params.id, actor);
  if (!updatedUser) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, user: updatedUser });
});

app.put('/api/admin/users/:id/password', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied.' });
  }
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
  }
  const updatedUser = db.setUserPassword(req.params.id, newPassword);
  if (!updatedUser) return res.status(404).json({ error: 'User not found' });
  db.logAudit(actor.id, actor.name, actor.role, 'ADMIN_RESET_PASSWORD', 'User', req.params.id, `Admin reset password for user ${updatedUser.email}`);
  res.json({ success: true, message: 'Password updated successfully' });
});

app.post('/api/push/register-token', (req, res) => {
  const actor = getActor(req); const token = String(req.body?.token || '');
  if (!token) return res.status(400).json({ error: 'FCM token required.' });
  res.json({ success: db.registerPushToken(actor.id, token) });
});

// Push Notifications System
app.get('/api/push-notifications', (req, res) => {
  const actor = getActor(req);
  const notifications = db.getPushNotifications(actor.id);
  res.json(notifications);
});

app.post('/api/push-notifications/:id/read', (req, res) => {
  const actor = getActor(req);
  db.markNotificationRead(req.params.id, actor.id);
  res.json({ success: true });
});

app.post('/api/admin/push-notifications', async (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied.' });
  }
  const {
    title_en,
    title_mr,
    message_en,
    message_mr,
    target_type = 'all',
    target_user_id,
    target_user_name,
    target_tab = 'dashboard',
    action_url,
    image_url,
    icon_url,
    scheduled_for
  } = req.body;

  if (!title_en && !title_mr) {
    return res.status(400).json({ error: 'Notification title is required.' });
  }

  // Calculate targeted candidate users
  const allUsers = db.getUsers();
  const targetedUsers = allUsers.filter(u => {
    if (target_type === 'all') return true;
    if (target_type === 'user' || target_type === 'individual') return u.id === target_user_id;
    if (target_type === 'free_users') return !u.isPremium;
    if (target_type === 'pro_users') return u.isPremium;
    if (target_type === 'plan_mcq') return u.hasMcqAccess;
    if (target_type === 'plan_test_series') return u.hasTestSeriesAccess;
    if (target_type === 'plan_youtube') return u.hasYoutubeAccess;
    if (target_type === 'plan_combo') return u.hasMcqAccess && u.hasTestSeriesAccess && u.hasYoutubeAccess;
    if (target_type === 'expiring_soon') return u.isPremium && (u.daysRemaining ?? 0) > 0 && (u.daysRemaining ?? 0) <= 7;
    return true;
  });

  const finalTitle = title_mr || title_en || 'Nursing Officer Alert';
  const finalMessage = message_mr || message_en || 'नवीन अपडेट उपलब्ध आहे.';

  const created = db.addPushNotification({
    title_en: title_en || title_mr,
    title_mr: title_mr || title_en,
    message_en: message_en || message_mr,
    message_mr: message_mr || message_en,
    target_type,
    target_user_id,
    target_user_name,
    target_tab,
    action_url,
    image_url,
    icon_url,
    scheduled_for,
    status: scheduled_for ? 'scheduled' : 'sent',
    recipient_count: targetedUsers.length,
    sent_by_name: actor.name
  }, actor);

  // Send real multicast FCM if Firebase is active
  let fcmDeliveryCount = 0;
  try {
    const candidatesWithToken = targetedUsers.filter(u => (u as any).fcm_token);
    const tokens = candidatesWithToken.map(u => (u as any).fcm_token as string).filter(Boolean);

    if (getFirebaseApps().length && tokens.length > 0) {
      const response = await getFirebaseMessaging().sendEachForMulticast({
        tokens,
        notification: {
          title: finalTitle,
          body: finalMessage,
          imageUrl: image_url || undefined
        },
        data: {
          tab: target_tab || 'dashboard',
          url: action_url || '',
          tag: created.id,
          title: finalTitle,
          body: finalMessage,
          image: image_url || '',
          icon: icon_url || '/pwa-192x192.png'
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'nursing_officer_alerts',
            defaultSound: true,
            defaultVibrateTimings: true,
            imageUrl: image_url || undefined,
            clickAction: 'FLUTTER_NOTIFICATION_CLICK'
          }
        },
        webpush: {
          notification: {
            icon: icon_url || '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            image: image_url || undefined,
            renotify: true,
            tag: created.id,
            requireInteraction: false,
            data: {
              tab: target_tab || 'dashboard',
              url: action_url || '',
              tag: created.id
            }
          },
          fcmOptions: {
            link: action_url || `/?tab=${target_tab || 'dashboard'}`
          }
        }
      });
      fcmDeliveryCount = response.successCount;
      console.log(`[FCM] Broadcast sent to ${response.successCount}/${tokens.length} devices.`);
    }
  } catch (e) {
    console.warn('[FCM] Push delivery failed:', e);
  }

  res.status(201).json({
    ...created,
    fcm_delivered: fcmDeliveryCount,
    targeted_candidates: targetedUsers.length
  });
});

// Direct Test Push Notification endpoint (sends instantly to caller's registered device)
app.post('/api/admin/push-notifications/test', async (req, res) => {
  const actor = getActor(req);
  const { title, message, image_url, target_tab = 'dashboard', action_url, token } = req.body;
  const user = db.getUserById(actor.id);
  const fcmToken = token || (user as any)?.fcm_token;

  const testTitle = title || '🔔 [चाचणी] टेस्ट नोटीफिकेशन / Test Alert';
  const testMessage = message || 'पुश नोटीफिकेशन, आवाज आणि व्हायब्रेशन यशस्वीपणे चालू झाले आहे.';

  if (!fcmToken) {
    return res.json({
      success: true,
      mode: 'in_app_simulation',
      message: 'FCM Token not registered for this device. In-app foreground alert simulated successfully.'
    });
  }

  try {
    if (getFirebaseApps().length) {
      await getFirebaseMessaging().send({
        token: fcmToken,
        notification: {
          title: testTitle,
          body: testMessage,
          imageUrl: image_url || undefined
        },
        data: {
          tab: target_tab,
          url: action_url || '',
          tag: `test-${Date.now()}`,
          title: testTitle,
          body: testMessage,
          image: image_url || '',
          isTest: 'true'
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'nursing_officer_alerts',
            defaultSound: true,
            defaultVibrateTimings: true,
            imageUrl: image_url || undefined
          }
        },
        webpush: {
          notification: {
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            image: image_url || undefined,
            renotify: true,
            tag: `test-${Date.now()}`
          }
        }
      });
      return res.json({ success: true, mode: 'fcm_direct', message: 'Test notification delivered to your device.' });
    }
  } catch (err: any) {
    console.warn('[FCM Test Error]:', err);
    return res.status(500).json({ error: err.message || 'Test push delivery failed' });
  }

  res.json({ success: true, mode: 'simulated', message: 'Notification test recorded.' });
});

app.delete('/api/admin/push-notifications/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied.' });
  }
  const deleted = db.deletePushNotification(req.params.id, actor);
  res.json({ success: deleted });
});

// Promo Code System Endpoints
app.get('/api/promo-codes', (req, res) => {
  const codes = db.getPromoCodes();
  res.json(codes);
});

app.post('/api/payments/verify-promo', (req, res) => {
  const { code, original_amount } = req.body;
  const result = db.verifyPromoCode(code, Number(original_amount) || 0);
  res.json(result);
});

app.post('/api/admin/promo-codes', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied.' });
  }
  const created = db.addPromoCode(req.body, actor);
  res.status(201).json(created);
});

app.put('/api/admin/promo-codes/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied.' });
  }
  const updated = db.updatePromoCode(req.params.id, req.body, actor);
  res.json(updated);
});

app.delete('/api/admin/promo-codes/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied.' });
  }
  const success = db.deletePromoCode(req.params.id, actor);
  res.json({ success });
});

app.get('/api/payments/plans', (req, res) => {
  const plans = db.getPaymentPlans();
  res.json(plans);
});

app.post('/api/admin/payments/plans', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const created = db.createPaymentPlan(req.body, actor);
  res.status(201).json(created);
});

app.put('/api/admin/payments/plans/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const updated = db.updatePaymentPlan(req.params.id, req.body, actor);
  res.json(updated);
});

app.delete('/api/admin/payments/plans/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const success = db.deletePaymentPlan(req.params.id, actor);
  res.json({ success });
});

app.get('/api/payments/my-history', (req, res) => {
  const actor = getActor(req);
  const history = db.getPaymentsByUser(actor.id);
  res.json(history);
});

app.post('/api/payments/submit-manual-utr', (req, res) => {
  const actor = getActor(req);
  const { plan_id, utr_number, screenshot_url, screenshot_public_id, promo_code } = req.body;
  if (!plan_id || !utr_number) {
    return res.status(400).json({ error: 'Plan ID and 12-digit UTR number are required' });
  }

  const plan = db.getPaymentPlanById(plan_id);
  let finalAmount = plan ? plan.price : 0;
  if (promo_code && plan) {
    const verified = db.verifyPromoCode(promo_code, plan.price);
    if (verified.valid) {
      finalAmount = verified.finalAmount;
    }
  }

  const record = db.submitPayment({
    user_id: actor.id,
    user_name: actor.name,
    user_email: actor.email,
    plan_id,
    utr_number,
    screenshot_url,
    screenshot_public_id,
    payment_method: 'MANUAL_QR',
    amount: finalAmount
  });
  res.status(201).json(record);
});

// Razorpay Auto Payment Endpoints
app.post('/api/payments/razorpay/create-order', async (req, res) => {
  const actor = getActor(req);
  const { plan_id, promo_code } = req.body;
  if (!plan_id) return res.status(400).json({ error: 'Plan ID is required' });

  const plan = db.getPaymentPlanById(plan_id);
  if (!plan) return res.status(404).json({ error: 'Payment plan not found' });
  if (!plan.is_active) return res.status(400).json({ error: 'Selected payment plan is currently inactive.' });

  const { keyId, keySecret, enabled } = getRazorpayCredentials();
  if (!enabled || !keyId || !keySecret) {
    return res.status(503).json({ error: 'Razorpay payment gateway is not configured or disabled.' });
  }

  let amount = Number(plan.price);
  if (promo_code) {
    const v = db.verifyPromoCode(promo_code, amount);
    if (v.valid) amount = v.finalAmount;
  }
  amount = Math.max(1, amount); // Minimum 1 INR

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rr = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: plan.currency || 'INR',
        receipt: `plan-${actor.id}-${Date.now()}`.substring(0, 40),
        notes: {
          user_id: actor.id,
          user_email: actor.email,
          plan_id: plan.id,
          plan_type: plan.plan_type || 'PRO_MCQ',
          product_type: 'SUBSCRIPTION_PLAN',
          promo_code: promo_code || ''
        }
      })
    });

    const data: any = await rr.json();
    if (!rr.ok) {
      return res.status(502).json({ error: data.error?.description || 'Razorpay order creation failed.' });
    }

    res.json({
      order_id: data.id,
      original_amount: plan.price * 100,
      amount: data.amount,
      currency: data.currency || 'INR',
      plan_id: plan.id,
      plan_name: plan.name,
      key_id: keyId,
      razorpay_enabled: true
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to connect to payment gateway' });
  }
});

app.post('/api/payments/razorpay/verify-auto', async (req, res) => {
  const actor = getActor(req);
  const { plan_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!plan_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Complete Razorpay verification data (plan_id, razorpay_payment_id, razorpay_order_id, razorpay_signature) is required.' });
  }

  const plan = db.getPaymentPlanById(plan_id);
  if (!plan) return res.status(404).json({ error: 'Payment plan not found.' });

  const { keyId, keySecret, enabled } = getRazorpayCredentials();
  if (!keySecret || !keyId) {
    return res.status(503).json({ error: 'Razorpay configuration is unavailable on server.' });
  }

  // 1. Idempotency Check: prevent duplicate activations
  const existingPayment = db.getPayments().find(p => p.payment_method === 'RAZORPAY' && p.utr_number === razorpay_payment_id && p.status === 'APPROVED');
  if (existingPayment) {
    return res.json({
      success: true,
      message: 'Payment already verified and active.',
      payment: existingPayment,
      user: db.getUserById(actor.id),
      is_duplicate: true
    });
  }

  // 2. Server-side HMAC SHA256 Signature Verification
  const expected = crypto.createHmac('sha256', keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))) {
    return res.status(400).json({ error: 'Invalid Razorpay signature. Payment verification rejected. Plan has NOT been activated.' });
  }

  // 3. Server-to-Server Verification with Razorpay API
  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const [payRes, ordRes] = await Promise.all([
      fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, {
        headers: { Authorization: `Basic ${auth}` }
      }),
      fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpay_order_id)}`, {
        headers: { Authorization: `Basic ${auth}` }
      })
    ]);

    const payment: any = await payRes.json();
    const order: any = await ordRes.json();

    if (!payRes.ok || !ordRes.ok) {
      return res.status(400).json({ error: 'Failed to verify transaction with payment gateway. Plan has NOT been activated.' });
    }

    // 4. Strict Validation Checks
    if (payment.order_id !== razorpay_order_id) {
      return res.status(400).json({ error: 'Order ID mismatch between payment and order record. Plan has NOT been activated.' });
    }

    if (payment.status !== 'captured') {
      return res.status(400).json({ error: `Payment is not captured (Current status: ${payment.status}). Plan has NOT been activated.` });
    }

    if (payment.currency !== 'INR') {
      return res.status(400).json({ error: `Currency mismatch (Expected INR, got ${payment.currency}). Plan has NOT been activated.` });
    }

    if (Number(payment.amount) !== Number(order.amount)) {
      return res.status(400).json({ error: 'Payment amount does not match authorized order amount. Plan has NOT been activated.' });
    }

    if (order.notes?.plan_id && order.notes.plan_id !== plan_id) {
      return res.status(400).json({ error: 'Product mismatch: order was created for a different plan. Plan has NOT been activated.' });
    }

    if (order.notes?.user_id && order.notes.user_id !== actor.id) {
      return res.status(400).json({ error: 'User mismatch: payment order belongs to a different student account. Plan has NOT been activated.' });
    }

    // 5. Entitlement Activation
    const record = db.processRazorpayPaymentAuto({
      user_id: actor.id,
      user_name: actor.name,
      user_email: actor.email,
      plan_id,
      razorpay_payment_id,
      razorpay_order_id,
      amount: Number(payment.amount) / 100
    });

    const updatedUser = db.getUserById(actor.id);
    res.json({
      success: true,
      message: 'Payment verified successfully and plan activated.',
      payment: record,
      user: updatedUser
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Payment gateway communication error.' });
  }
});

// Single Mock Test Purchase Endpoints
app.post('/api/payments/razorpay/create-test-order', async (req, res) => {
  const actor = getActor(req);
  const { test_id } = req.body;
  if (!test_id) return res.status(400).json({ error: 'Test ID is required' });

  const test = db.getMockTests().find(t => t.id === test_id);
  if (!test) return res.status(404).json({ error: 'Mock Test not found' });

  const { keyId, keySecret, enabled } = getRazorpayCredentials();
  if (!enabled || !keyId || !keySecret) {
    return res.status(503).json({ error: 'Razorpay is not configured or enabled.' });
  }

  const amount = Math.round((test.price || 29) * 100);
  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rr = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `test-${actor.id}-${Date.now()}`.substring(0, 40),
        notes: {
          user_id: actor.id,
          user_email: actor.email,
          test_id: test.id,
          product_type: 'SINGLE_TEST'
        }
      })
    });

    const d: any = await rr.json();
    if (!rr.ok) return res.status(502).json({ error: d.error?.description || 'Order creation failed' });
    res.json({
      order_id: d.id,
      test_id: test.id,
      test_title: test.title_en || test.title_mr,
      amount: d.amount,
      currency: 'INR',
      key_id: keyId,
      razorpay_enabled: true
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to initialize test payment' });
  }
});

app.post('/api/payments/razorpay/verify-test-payment', async (req, res) => {
  const actor = getActor(req);
  const { test_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  if (!test_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Complete payment verification data is required.' });
  }

  const { keyId, keySecret } = getRazorpayCredentials();
  if (!keySecret || !keyId) return res.status(503).json({ error: 'Razorpay configuration unavailable.' });

  const test = db.getMockTests().find(t => t.id === test_id);
  if (!test) return res.status(404).json({ error: 'Mock test not found.' });

  // Idempotency: if test already unlocked, return success
  const currentUser = db.getUserById(actor.id);
  if (currentUser?.unlocked_test_ids?.includes(test_id)) {
    return res.json({ success: true, message: 'Test is already unlocked!', user: currentUser });
  }

  // Signature check
  const expected = crypto.createHmac('sha256', keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))) {
    return res.status(400).json({ error: 'Invalid Razorpay signature. Test remains locked.' });
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rr = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const pay: any = await rr.json();

    if (!rr.ok || pay.order_id !== razorpay_order_id || pay.status !== 'captured') {
      return res.status(400).json({ error: 'Payment is not captured or order mismatch. Test remains locked.' });
    }

    if (Number(pay.amount) !== Math.round((test.price || 29) * 100)) {
      return res.status(400).json({ error: 'Paid amount mismatch. Test remains locked.' });
    }

    const updated = db.unlockTestForUser(actor.id, test_id);
    db.submitPayment({
      user_id: actor.id,
      user_name: actor.name,
      user_email: actor.email,
      plan_id: `single-test-${test_id}`,
      utr_number: razorpay_payment_id,
      payment_method: 'RAZORPAY',
      amount: Number(pay.amount) / 100
    });
    const history = db.getPaymentsByUser(actor.id);
    if (history[0]) db.markPaymentApproved(history[0].id);

    return res.json({ success: true, message: 'Test unlocked successfully!', user: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Payment verification failed.' });
  }
});

// Single YouTube Video Purchase Endpoints
app.post('/api/payments/razorpay/create-lecture-order', async (req, res) => {
  const actor = getActor(req);
  const { lecture_id } = req.body;
  if (!lecture_id) return res.status(400).json({ error: 'Lecture ID is required' });

  const lecture = db.getYouTubeLectures(false).find(l => l.id === lecture_id);
  if (!lecture) return res.status(404).json({ error: 'Lecture not found' });

  const { keyId, keySecret, enabled } = getRazorpayCredentials();
  if (!enabled || !keyId || !keySecret) {
    return res.status(503).json({ error: 'Razorpay is not configured or enabled.' });
  }

  const amount = Math.round((lecture.price || 49) * 100);
  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rr = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `video-${actor.id}-${Date.now()}`.substring(0, 40),
        notes: {
          user_id: actor.id,
          user_email: actor.email,
          lecture_id: lecture.id,
          product_type: 'SINGLE_VIDEO'
        }
      })
    });

    const d: any = await rr.json();
    if (!rr.ok) return res.status(502).json({ error: d.error?.description || 'Order creation failed' });
    res.json({
      order_id: d.id,
      lecture_id: lecture.id,
      lecture_title: lecture.title_mr || lecture.title_en,
      amount: d.amount,
      currency: 'INR',
      key_id: keyId,
      razorpay_enabled: true
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to initialize video payment' });
  }
});

app.post('/api/payments/razorpay/verify-lecture-payment', async (req, res) => {
  const actor = getActor(req);
  const { lecture_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  if (!lecture_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Complete payment verification data is required.' });
  }

  const { keyId, keySecret } = getRazorpayCredentials();
  if (!keySecret || !keyId) return res.status(503).json({ error: 'Razorpay configuration unavailable.' });

  const lecture = db.getYouTubeLectures(false).find(l => l.id === lecture_id);
  if (!lecture) return res.status(404).json({ error: 'Lecture not found.' });

  // Idempotency: if lecture already unlocked for user
  const currentUser = db.getUserById(actor.id);
  if (currentUser?.unlocked_lecture_ids?.includes(lecture_id) || lecture.unlocked_by?.includes(actor.id)) {
    return res.json({ success: true, message: 'Lecture is already unlocked!', lecture, user: currentUser });
  }

  // Signature check
  const expected = crypto.createHmac('sha256', keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))) {
    return res.status(400).json({ error: 'Invalid Razorpay signature. Video remains locked.' });
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rr = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const pay: any = await rr.json();

    if (!rr.ok || pay.order_id !== razorpay_order_id || pay.status !== 'captured') {
      return res.status(400).json({ error: 'Payment is not captured or order mismatch. Video remains locked.' });
    }

    if (Number(pay.amount) !== Math.round((lecture.price || 49) * 100)) {
      return res.status(400).json({ error: 'Paid amount mismatch. Video remains locked.' });
    }

    const unlocked = db.unlockYouTubeLecture(lecture_id, actor.id);
    db.submitPayment({
      user_id: actor.id,
      user_name: actor.name,
      user_email: actor.email,
      plan_id: `single-lecture-${lecture_id}`,
      utr_number: razorpay_payment_id,
      payment_method: 'RAZORPAY',
      amount: Number(pay.amount) / 100
    });
    const history = db.getPaymentsByUser(actor.id);
    if (history[0]) db.markPaymentApproved(history[0].id);

    res.json({
      success: true,
      message: 'व्हिडिओ व्याख्यान यशस्वीरित्या अनलॉक झाले!',
      lecture: unlocked,
      user: db.getUserById(actor.id)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Payment verification failed.' });
  }
});

app.post('/api/youtube-lectures/:id/unlock', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role) && !actor.hasYoutubeAccess && actor.role !== 'pro_member') {
    return res.status(403).json({ error: 'Payment or PRO subscription required to unlock paid lectures.' });
  }
  const unlocked = db.unlockYouTubeLecture(req.params.id, actor.id);
  if (!unlocked) return res.status(404).json({ error: 'Lecture not found' });
  res.json({ success: true, lecture: unlocked });
});

// --- Successful Students (यशस्वी विद्यार्थी) Endpoints ---
app.get('/api/successful-students', (req, res) => {
  const actor = getActor(req);
  const isAdmin = ['admin', 'super_admin', 'reviewer'].includes(actor.role);
  const students = db.getSuccessfulStudents(isAdmin);
  res.json(students);
});

app.post('/api/admin/successful-students', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const created = db.addSuccessfulStudent(req.body, actor);
  res.status(201).json(created);
});

app.put('/api/admin/successful-students/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const updated = db.updateSuccessfulStudent(req.params.id, req.body, actor);
  if (!updated) return res.status(404).json({ error: 'Student record not found' });
  res.json(updated);
});

app.delete('/api/admin/successful-students/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const success = db.deleteSuccessfulStudent(req.params.id, actor);
  res.json({ success });
});

app.patch('/api/admin/successful-students/:id/toggle', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const { is_active } = req.body;
  const updated = db.toggleSuccessfulStudentActive(req.params.id, Boolean(is_active), actor);
  if (!updated) return res.status(404).json({ error: 'Student record not found' });
  res.json(updated);
});

// -------------------------------------------------------------
// Audit Logs Management Endpoints (Admin Controlled)
// -------------------------------------------------------------
app.get('/api/admin/audit-logs', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin', 'reviewer'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const logs = db.getAuditLogs();
  res.json(logs);
});

app.delete('/api/admin/audit-logs/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const success = db.deleteAuditLog(req.params.id, actor);
  res.json({ success });
});

app.post('/api/admin/audit-logs/bulk-delete', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const { ids } = req.body; // if ids is undefined or empty array, clears all
  const deletedCount = db.deleteAuditLogsBulk(ids, actor);
  res.json({ success: true, deletedCount });
});

app.post('/api/admin/audit-logs/delete-older-than-2-months', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const cutoffTime = Date.now() - 60 * 24 * 60 * 60 * 1000; // 60 days (2 months)
  const allLogs = db.getAuditLogs();
  const oldIds = allLogs.filter(l => new Date(l.created_at).getTime() < cutoffTime).map(l => l.id);
  const deletedCount = db.deleteAuditLogsBulk(oldIds, actor);
  db.logAudit(actor.id, actor.name, actor.role, 'DELETE_OLD_AUDIT_LOGS', 'AuditLog', 'older_than_2_months', `Deleted ${deletedCount} audit logs older than 2 months`);
  res.json({ success: true, deletedCount });
});

// -------------------------------------------------------------
// YouTube Video Lectures API Endpoints (Admin Controlled)
// -------------------------------------------------------------
app.get('/api/youtube-lectures', (req, res) => {
  const onlyActive = req.query.active === 'true';
  const lectures = db.getYouTubeLectures(onlyActive);
  res.json(lectures);
});

app.post('/api/admin/youtube-lectures', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin', 'reviewer'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const lecture = db.addYouTubeLecture(req.body, actor);
  res.status(201).json(lecture);
});

app.put('/api/admin/youtube-lectures/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin', 'reviewer'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const updated = db.updateYouTubeLecture(req.params.id, req.body, actor);
  if (!updated) return res.status(404).json({ error: 'Lecture not found' });
  res.json(updated);
});

app.delete('/api/admin/youtube-lectures/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const success = db.deleteYouTubeLecture(req.params.id, actor);
  res.json({ success });
});

app.patch('/api/admin/youtube-lectures/:id/toggle', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin', 'reviewer'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const { is_active } = req.body;
  const updated = db.toggleYouTubeLectureActive(req.params.id, Boolean(is_active), actor);
  if (!updated) return res.status(404).json({ error: 'Lecture not found' });
  res.json(updated);
});

app.get('/api/admin/payments', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin', 'reviewer'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const payments = db.getPayments();
  res.json(payments);
});

app.post('/api/admin/payments/:id/verify', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const { action, notes } = req.body;
  if (!['APPROVE', 'REJECT'].includes(action)) {
    return res.status(400).json({ error: 'Action must be APPROVE or REJECT' });
  }
  const verified = db.verifyPayment(req.params.id, action, notes || '', actor);
  if (!verified) {
    return res.status(404).json({ error: 'Payment record not found' });
  }
  res.json(verified);
});

// -------------------------------------------------------------
// 12. AI STUDY COACH & QUESTION GENERATOR (Optimized Flash with Tier-1 Cache & Rate-Limiter)
// -------------------------------------------------------------
// Cooldown map to prevent accidental spam / quota drain
const userAiCooldown = new Map<string, { lastRequestTime: number; requestCount: number; windowStart: number }>();

function checkAiRateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const actor = getActor(req);
  const identifier = actor.id || req.ip || 'anonymous';
  const now = Date.now();
  const userData = userAiCooldown.get(identifier) || { lastRequestTime: 0, requestCount: 0, windowStart: now };

  // 1-minute sliding window
  if (now - userData.windowStart > 60000) {
    userData.windowStart = now;
    userData.requestCount = 0;
  }

  // Max 15 AI requests per minute per user
  if (userData.requestCount >= 15) {
    return res.status(429).json({
      success: false,
      error: 'कृपया १ मिनिट वाट पहा आणि पुन्हा प्रयत्न करा.',
      message: 'Please wait a minute before sending another query.'
    });
  }

  // Minimum 1.5 seconds cooldown between clicks
  if (now - userData.lastRequestTime < 1500) {
    return res.status(429).json({
      success: false,
      error: 'कृपया काही सेकंद थांबा आणि पुन्हा प्रयत्न करा.',
      message: 'Please wait a moment before sending another AI request.'
    });
  }

  userData.lastRequestTime = now;
  userData.requestCount += 1;
  userAiCooldown.set(identifier, userData);

  next();
}

app.post('/api/ai/explain', checkAiRateLimit, async (req, res) => {
  const { concept, language } = req.body;
  if (!concept) return res.status(400).json({ error: 'Concept is required' });
  const result = await explainNursingConcept(concept, language || 'en');
  res.json(result);
});

app.post('/api/ai/mnemonic', checkAiRateLimit, async (req, res) => {
  const { topic, language } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });
  const result = await generateMnemonic(topic, language || 'en');
  res.json(result);
});

app.post('/api/ai/revision-plan', checkAiRateLimit, async (req, res) => {
  const actor = getActor(req);
  const { language } = req.body;
  const stats = db.getStudentStats(actor.id);
  const weakNames = stats.weakSubjects.map(w => {
    const s = db.getSubjectById(w.subject_id);
    return s ? s.name_en : w.subject_id;
  });
  const result = await generateRevisionPlan(weakNames, stats.totalMistakes, language || 'en');
  res.json(result);
});

app.post('/api/ai/doubt', checkAiRateLimit, async (req, res) => {
  const { doubt, context, language } = req.body;
  if (!doubt) return res.status(400).json({ error: 'Doubt query is required' });
  const result = await askStudyCoachDoubt(doubt, context, language || 'en');
  res.json(result);
});

app.post('/api/ai/generate-question', checkAiRateLimit, async (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only editors and admins can use AI Question Generator' });
  }

  const { subject_id, topic, difficulty, is_clinical_case } = req.body;
  const subject = db.getSubjectById(subject_id) || db.getSubjects()[0];

  const result = await generateAiDraftQuestion({
    subject_name: subject.name_en,
    topic: topic || 'Emergency Cardiac Management',
    difficulty: difficulty || 'medium',
    is_clinical_case: !!is_clinical_case
  });

  if (!result.success || !result.draft) {
    return res.status(500).json(result);
  }

  // Strictly save as DRAFT for human reviewer approval (never auto-publish)
  const savedDraft = db.addQuestion({
    ...result.draft,
    subject_id: subject.id,
    status: 'draft',
    source_reference: 'AI Draft Generation (Requires Reviewer Verification)',
    created_by: actor.id
  }, actor);

  res.status(201).json({
    success: true,
    draft: savedDraft,
    message: 'Question generated and saved strictly in DRAFT status for human review.'
  });
});

app.get('/api/ai/cache-stats', async (req, res) => {
  try {
    const stats = await getAiCacheMetrics();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch cache metrics' });
  }
});

// AI Single Question Translation into Marathi (with auto-persistence if question_id provided)
app.post('/api/ai/translate-question', checkAiRateLimit, async (req, res) => {
  try {
    const { question_id, question_en, option_a_en, option_b_en, option_c_en, option_d_en, explanation_en } = req.body;
    if (!question_en) {
      return res.status(400).json({ error: 'question_en is required' });
    }
    const translation = await translateNursingQuestionToMarathi({
      question_en,
      option_a_en: option_a_en || '',
      option_b_en: option_b_en || '',
      option_c_en: option_c_en || '',
      option_d_en: option_d_en || '',
      explanation_en: explanation_en || ''
    });

    if (question_id) {
      db.updateQuestion(question_id, {
        question_mr: translation.question_mr,
        option_a_mr: translation.option_a_mr,
        option_b_mr: translation.option_b_mr,
        option_c_mr: translation.option_c_mr,
        option_d_mr: translation.option_d_mr,
        explanation_mr: translation.explanation_mr
      });
    }

    res.json({ success: true, translation });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Translation failed' });
  }
});

// Admin Bulk Auto-Translate English Questions into Marathi
app.post('/api/admin/questions/bulk-auto-translate-marathi', async (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const { limit = 20, forceAll = false } = req.body;
  const allQuestions = db.getQuestions();

  // Find questions needing Marathi translation
  const needingTranslation = allQuestions.filter(q => {
    if (forceAll) return true;
    const noMrQ = !q.question_mr || q.question_mr.trim().length === 0 || q.question_mr.trim().toLowerCase() === q.question_en.trim().toLowerCase();
    const noMrOpts = !q.option_a_mr || q.option_a_mr.trim().length === 0;
    return noMrQ || noMrOpts;
  }).slice(0, Math.min(Number(limit) || 20, 50));

  if (needingTranslation.length === 0) {
    return res.json({
      success: true,
      translatedCount: 0,
      message: 'सर्व प्रश्नांचे आधीच मराठी भाषांतर उपलब्ध आहे (All questions already have Marathi translations).'
    });
  }

  let translatedCount = 0;
  for (const q of needingTranslation) {
    try {
      const translation = await translateNursingQuestionToMarathi({
        question_en: q.question_en,
        option_a_en: q.option_a_en,
        option_b_en: q.option_b_en,
        option_c_en: q.option_c_en,
        option_d_en: q.option_d_en,
        explanation_en: q.explanation_en
      });

      if (
        translation &&
        translation.question_mr &&
        translation.question_mr.trim().toLowerCase() !== q.question_en.trim().toLowerCase()
      ) {
        db.updateQuestion(q.id, {
          question_mr: translation.question_mr,
          option_a_mr: translation.option_a_mr,
          option_b_mr: translation.option_b_mr,
          option_c_mr: translation.option_c_mr,
          option_d_mr: translation.option_d_mr,
          explanation_mr: translation.explanation_mr
        }, actor);
        translatedCount++;
      }
    } catch (e) {
      console.warn(`Failed to translate question ${q.id}:`, e);
    }
  }

  const remainingCount = db.getQuestions().filter(q => 
    !q.question_mr || 
    q.question_mr.trim().length === 0 || 
    q.question_mr.trim().toLowerCase() === q.question_en.trim().toLowerCase()
  ).length;

  res.json({
    success: true,
    translatedCount,
    remainingCount,
    message: `${translatedCount} इंग्रजी प्रश्नांचे मराठीत यशस्वी भाषांतर झाले!`
  });
});

// AI Attractive Job Advertisement Formatter (from raw text)
app.post('/api/ai/format-advertisement', async (req, res) => {
  try {
    const actor = getActor(req);
    if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'Advertisement text or circular extract is required' });
    }

    const formatted = await formatAttractiveAdvertisement(rawText);
    res.json({ success: true, advertisement: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Formatting failed' });
  }
});

// -------------------------------------------------------------
// 13. AI QUESTION IMPORT & AUTO-VERIFICATION SUBSYSTEM
// -------------------------------------------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 60 * 1024 * 1024 } // 60MB max file size
});

// Upload PDF or Text Document to Generate Attractive Advertisement
app.post('/api/ai/format-advertisement-file', upload.single('file'), async (req, res) => {
  try {
    const actor = getActor(req);
    if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a PDF or text notice.' });
    }

    let extractedText = '';
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === '.pdf') {
      try {
        const parsed = await pdfParse(file.buffer);
        extractedText = parsed.text || '';
      } catch (err: any) {
        console.warn('PDF parse error:', err?.message);
        extractedText = file.buffer.toString('utf-8');
      }
    } else {
      extractedText = file.buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from file. Please paste text directly.' });
    }

    const formatted = await formatAttractiveAdvertisement(extractedText);
    res.json({
      success: true,
      advertisement: formatted,
      fileName: file.originalname,
      textLength: extractedText.length
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process file' });
  }
});

// Ingest uploaded files (JSON, XLSX, CSV, PDF, Image(s), ZIP)
app.post('/api/import/upload', upload.array('files', 100), async (req, res) => {
  try {
    const actor = getActor(req);
    if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
      return res.status(403).json({ error: 'Unauthorized: Admin or Editor permission required for question import.' });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded. Please select at least one file.' });
    }

    const targetSubjectId = req.body.targetSubjectId || undefined;
    const examName = req.body.examName || undefined;
    const currentSettings = db.getAiImportSettings();

    // Override settings if provided in request body
    const settings = {
      ...currentSettings,
      autoApprovalEnabled: req.body.autoApprovalEnabled !== undefined ? req.body.autoApprovalEnabled === 'true' || req.body.autoApprovalEnabled === true : currentSettings.autoApprovalEnabled,
      minAutoApprovalConfidence: Number(req.body.minAutoApprovalConfidence) || currentSettings.minAutoApprovalConfidence,
      minQualityScore: Number(req.body.minQualityScore) || currentSettings.minQualityScore,
      autoPublish: req.body.autoPublish !== undefined ? req.body.autoPublish === 'true' || req.body.autoPublish === true : currentSettings.autoPublish,
      processingMode: (req.body.processingMode as any) || currentSettings.processingMode
    };

    const batches = [];

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      let fileType: any = 'json';

      if (ext === '.xlsx' || ext === '.xls') fileType = 'excel';
      else if (ext === '.csv') fileType = 'csv';
      else if (ext === '.pdf') fileType = 'pdf';
      else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) fileType = files.length > 1 ? 'images' : 'image';
      else if (ext === '.zip') fileType = 'zip';
      else if (ext === '.json') fileType = 'json';
      else fileType = 'raw_text';

      const batch = await processIngestionBatch({
        fileBuffer: file.buffer,
        fileName: file.originalname,
        fileType,
        fileSizeMb: Math.round((file.size / (1024 * 1024)) * 100) / 100,
        uploadedBy: actor.id,
        uploadedByName: actor.name,
        targetSubjectId,
        examName,
        settings
      });

      batches.push(batch);
    }

    res.json({
      success: true,
      batches,
      message: `Successfully processed ${batches.length} file(s). Total questions ingested: ${batches.reduce((sum, b) => sum + b.totalDetected, 0)}.`
    });
  } catch (err: any) {
    console.error('Import upload error:', err);
    res.status(500).json({ error: err.message || 'File processing failed' });
  }
});

// Direct Text / JSON Ingestion
app.post('/api/import/process-text', async (req, res) => {
  try {
    const actor = getActor(req);
    if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
      return res.status(403).json({ error: 'Unauthorized: Admin permission required.' });
    }

    const { rawText, format, fileName, targetSubjectId, examName } = req.body;
    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Question text content is required' });
    }

    const settings = db.getAiImportSettings();
    const batch = await processIngestionBatch({
      rawText,
      fileName: fileName || 'direct_paste.txt',
      fileType: format === 'json' ? 'json' : 'raw_text',
      uploadedBy: actor.id,
      uploadedByName: actor.name,
      targetSubjectId,
      examName,
      settings
    });

    res.json({ success: true, batch });
  } catch (err: any) {
    console.error('Process text error:', err);
    res.status(500).json({ error: err.message || 'Text processing failed' });
  }
});

// Batches list & detail
app.get('/api/import/batches', (req, res) => {
  res.json(db.getImportBatches());
});

app.get('/api/import/batches/:id', (req, res) => {
  const batch = db.getImportBatchById(req.params.id);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  res.json(batch);
});

app.delete('/api/import/batches/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin only' });
  }
  const deleted = db.deleteImportBatch(req.params.id);
  res.json({ success: deleted });
});

// Batch One-Click High Confidence Approval
app.post('/api/import/batches/:id/approve-all-high-confidence', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin only' });
  }

  const minConfidence = Number(req.body.minConfidence) || 90;
  const result = db.approveBatchHighConfidence({
    batchId: req.params.id,
    minConfidence,
    actorId: actor.id,
    actorName: actor.name
  });

  res.json(result);
});

// Single Question Approval from Batch
app.post('/api/import/batches/:batchId/questions/:questionId/approve', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin only' });
  }

  const result = db.approveQuestionFromBatch({
    batchId: req.params.batchId,
    questionId: req.params.questionId,
    actorId: actor.id,
    actorName: actor.name,
    modifiedFields: req.body.modifiedFields
  });

  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// Single Question Rejection from Batch
app.post('/api/import/batches/:batchId/questions/:questionId/reject', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin only' });
  }

  const result = db.rejectQuestionFromBatch({
    batchId: req.params.batchId,
    questionId: req.params.questionId,
    actorId: actor.id,
    actorName: actor.name,
    reason: req.body.reason
  });

  res.json(result);
});

// Review Queue aggregation
app.get('/api/import/review-queue', (req, res) => {
  const { batchId, flag, status, search } = req.query;
  const result = db.getImportReviewQueue({
    batchId: batchId as string,
    flag: flag as string,
    status: status as string,
    search: search as string
  });
  res.json(result);
});

// Bulk Review Queue Actions
app.post('/api/import/review-queue/bulk-action', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin only' });
  }

  const { items, action } = req.body; // items: Array<{ batchId: string, questionId: string }>
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided for bulk action' });
  }

  let successCount = 0;
  for (const it of items) {
    if (action === 'approve') {
      const r = db.approveQuestionFromBatch({
        batchId: it.batchId,
        questionId: it.questionId,
        actorId: actor.id,
        actorName: actor.name
      });
      if (r.success) successCount++;
    } else if (action === 'reject') {
      const r = db.rejectQuestionFromBatch({
        batchId: it.batchId,
        questionId: it.questionId,
        actorId: actor.id,
        actorName: actor.name,
        reason: 'Bulk rejection by admin'
      });
      if (r.success) successCount++;
    }
  }

  res.json({ success: true, processedCount: successCount, action });
});

// Ingestion AI Settings
app.get('/api/import/settings', (req, res) => {
  res.json(db.getAiImportSettings());
});

app.post('/api/import/settings', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Admin only' });
  }
  const updated = db.updateAiImportSettings(req.body);
  res.json({ success: true, settings: updated });
});

// -------------------------------------------------------------
// 10. SUPABASE KEEP-ALIVE (Prevent 7-Day Inactivity Sleep)
// -------------------------------------------------------------
async function executeSupabasePing(targetUrl?: string, targetKey?: string) {
  const url = (targetUrl || process.env.SUPABASE_URL || '').trim();
  const key = (targetKey || process.env.SUPABASE_ANON_KEY || '').trim();

  if (!url) {
    return {
      success: true,
      message: 'Local persistent file store active (Supabase optional)'
    };
  }

  const cleanUrl = url.replace(/\/+$/, '');
  const endpoint = `${cleanUrl}/rest/v1/`;

  const headers: Record<string, string> = {
    'User-Agent': 'SupabaseKeepAlive/1.0',
    'Accept': 'application/json'
  };

  if (key) {
    headers['apikey'] = key;
    headers['Authorization'] = `Bearer ${key}`;
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const resp = await fetch(endpoint, {
      method: 'GET',
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const durationMs = Date.now() - startTime;
    const isAwake = resp.status >= 200 && resp.status < 500;

    return {
      success: isAwake,
      statusCode: resp.status,
      statusText: resp.statusText,
      durationMs,
      endpoint,
      timestamp: new Date().toISOString(),
      message: isAwake
        ? `Supabase project is active and responded in ${durationMs}ms with HTTP ${resp.status}`
        : `Supabase returned HTTP ${resp.status} ${resp.statusText}`
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Connection timed out after 15s' : err.message,
      endpoint,
      timestamp: new Date().toISOString()
    };
  }
}

app.get('/api/supabase/ping', async (req, res) => {
  const result = await executeSupabasePing();
  res.status(result.success ? 200 : 400).json(result);
});

app.post('/api/supabase/ping', async (req, res) => {
  const { supabaseUrl, supabaseAnonKey } = req.body || {};
  const result = await executeSupabasePing(supabaseUrl, supabaseAnonKey);
  res.status(result.success ? 200 : 400).json(result);
});

// Periodic background keep-alive ping and database heartbeat (every 3 days to prevent 7-day inactivity pause)
setTimeout(() => {
  try {
    db.getSettings();
  } catch (e) {}
  executeSupabasePing().then(res => {
    console.log('[Keep-Alive Startup Ping]:', res);
  }).catch(() => {});
}, 10000);

// Every 3 days (3 * 24 * 60 * 60 * 1000)
setInterval(() => {
  try {
    db.getSettings();
  } catch (e) {}
  executeSupabasePing().then(res => {
    console.log('[Keep-Alive Scheduled Ping]:', res);
  }).catch(() => {});
}, 3 * 24 * 60 * 60 * 1000);

// Explicit API 404 JSON Handler: Never leak HTML/SPA fallback to /api/* requests
app.all('/api/*', (req, res) => {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl || req.url}`,
    status: 404
  });
});

// -------------------------------------------------------------
// 11. VITE INTEGRATION / STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NursingPrep Server running on port ${PORT}`);
  });
}

startServer();
