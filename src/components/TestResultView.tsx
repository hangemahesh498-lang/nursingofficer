import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TestAttempt, Question, MockTest } from '../types';
import jsPDF from 'jspdf';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Share2,
  Download,
  Play,
  FileText,
  Lock,
  Unlock,
  Shield,
  Sparkles
} from 'lucide-react';
import { SecureVideoPlayer } from './SecureVideoPlayer';

interface TestResultViewProps {
  attempt: TestAttempt;
  questions: Question[];
  test?: MockTest;
  onRetest: () => void;
  onGoToMistakes: () => void;
  onBackToDashboard: () => void;
  onNavigateToPro?: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  attempt,
  questions,
  test,
  onRetest,
  onGoToMistakes,
  onBackToDashboard,
  onNavigateToPro
}) => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
  const [filterType, setFilterType] = useState<'all' | 'wrong' | 'correct' | 'unattempted'>('all');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const getYoutubeId = (url?: string) => {
    if (!url) return '';
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0] || '';
    if (url.includes('watch?v=')) return url.split('watch?v=')[1]?.split('&')[0] || '';
    if (url.includes('embed/')) return url.split('embed/')[1]?.split('?')[0] || '';
    return url.trim();
  };

  // Video access permissions
  const isVideoHidden = Boolean(test?.hide_video);
  const isPaidOnly = test?.video_access_mode === 'paid_test_only';
  const hasVideoAccess = !isPaidOnly ||
    Boolean(currentUser?.isPremium) ||
    Boolean(currentUser?.hasTestSeriesAccess) ||
    Boolean(test?.id && currentUser?.unlocked_test_ids?.includes(test.id)) ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin';

  const questionMap = new Map<string, Question>();
  questions.forEach(q => questionMap.set(q.id, q));

  const answersWithQuestions = attempt.answers.map(ans => ({
    ...ans,
    question: questionMap.get(ans.question_id)
  })).filter(a => !!a.question);

  const filteredAnswers = answersWithQuestions.filter(a => {
    if (filterType === 'wrong') return !a.is_correct && a.selected_option !== null;
    if (filterType === 'correct') return a.is_correct;
    if (filterType === 'unattempted') return a.selected_option === null;
    return true;
  });

  const totalQuestionsCalculated = attempt.answers?.length || (attempt.correct_count + attempt.wrong_count + attempt.unattempted_count) || test?.total_questions || 100;
  const percentage = Math.round((attempt.score / (attempt.total_marks || totalQuestionsCalculated || 100)) * 100);
  const isQualified = percentage >= 50; // standard qualifying bench

  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();

      // Top Decorative Line
      doc.setFillColor(37, 99, 235); // Blue 600
      doc.rect(0, 0, 210, 4, 'F');

      // Header Dark Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 4, 210, 36, 'F');

      doc.setTextColor(56, 189, 248); // sky-400
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('NURSING OFFICER ONLINE TEST SERIES', 15, 18);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICIAL EXAMINATION PERFORMANCE REPORT & VERIFIED SCORECARD', 15, 26);

      doc.setTextColor(203, 213, 225);
      doc.setFontSize(8);
      doc.text('Nursing Officer Recruitment CBT Exam Simulation System • Maharashtra & AIIMS NORCET', 15, 33);

      // Student / Candidate & Exam Info Box
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 46, 180, 34, 3, 3, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Exam Paper: ${attempt.test_title}`, 20, 54);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Candidate Name: ${attempt.user_name || 'Registered Candidate'}`, 20, 62);
      doc.text(`Attempt ID: ${attempt.id ? attempt.id.slice(0, 14) : 'ATT-' + Date.now().toString().slice(-8)}`, 20, 70);
      doc.text(`Completed Date: ${new Date(attempt.completed_at || Date.now()).toLocaleString('en-IN')}`, 20, 76);

      doc.text(`Total Duration: ${Math.round((attempt.time_spent_seconds || 0) / 60)} Mins`, 125, 62);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(isQualified ? 16 : 220, isQualified ? 149 : 38, isQualified ? 193 : 38);
      doc.text(`Result Status: ${isQualified ? 'PASSED / QUALIFIED' : 'NEEDS REMEDIATION'}`, 125, 70);

      // Big Score Summary Box
      if (isQualified) {
        doc.setFillColor(240, 253, 244); // emerald-50
        doc.setDrawColor(34, 197, 94);
      } else {
        doc.setFillColor(254, 242, 242); // rose-50
        doc.setDrawColor(244, 63, 94);
      }
      doc.roundedRect(15, 85, 180, 34, 3, 3, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL MARKS SCORED: ${attempt.score.toFixed(2)} / ${attempt.total_marks || totalQuestionsCalculated}`, 25, 97);

      doc.setFontSize(15);
      doc.setTextColor(isQualified ? 21 : 225, isQualified ? 128 : 29, isQualified ? 61 : 72);
      doc.text(`PERCENTAGE: ${percentage}%`, 25, 110);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Accuracy: ${attempt.accuracy_percentage}% | Negative Deduction: Included (-0.33 / -0.25)`, 110, 110);

      // Detailed Performance Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 126, 180, 9, 'F');
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('METRIC / TEST PARAMETER', 20, 132);
      doc.text('COUNT / VALUE', 130, 132);

      let y = 142;
      const metrics = [
        ['Total Questions In Test', `${totalQuestionsCalculated} Questions`],
        ['Correct Answers (+1.0 mark)', `${attempt.correct_count || 0} Correct`],
        ['Incorrect Answers (-Negative mark)', `${attempt.wrong_count || 0} Incorrect`],
        ['Unattempted Questions', `${attempt.unattempted_count || (totalQuestionsCalculated - (attempt.correct_count || 0) - (attempt.wrong_count || 0))} Unattempted`],
        ['Accuracy Rate', `${attempt.accuracy_percentage || Math.round(((attempt.correct_count || 0) / ((attempt.correct_count || 0) + (attempt.wrong_count || 0) || 1)) * 100)}%`],
        ['Time Spent', `${Math.floor((attempt.time_spent_seconds || 0) / 60)}m ${(attempt.time_spent_seconds || 0) % 60}s`]
      ];

      metrics.forEach(([label, val]) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(label, 20, y);
        doc.setFont('helvetica', 'bold');
        doc.text(val, 130, y);
        doc.setDrawColor(241, 245, 249);
        doc.line(15, y + 2, 195, y + 2);
        y += 8;
      });

      // App Branding & Promotional Banner on Scorecard
      doc.setFillColor(238, 242, 255); // indigo-50
      doc.setDrawColor(199, 210, 254);
      doc.roundedRect(15, 198, 180, 32, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setTextColor(67, 56, 202);
      doc.setFont('helvetica', 'bold');
      doc.text('🌟 Prepare for DMER, DHS, ZP, ESIC & AIIMS NORCET with Nursing Officer BY MH', 20, 207);

      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.text('• 6000+ Subject-wise Clinical Question Bank with Bilingual Marathi/English Explanations', 20, 214);
      doc.text('• Timed CBT Mock Tests, Official Previous Year Question (PYQ) Hub, and AI Mistake Notebook', 20, 220);
      doc.text('• Join Maharashtra\'s leading Nursing Examination Preparation Community', 20, 226);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'italic');
      doc.text('Generated by Nursing Officer Online Test Series Platform • Verified Digital Scorecard', 15, 280);

      doc.save(`Nursing_Officer_Result_${attempt.test_title.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* YouTube Video Explanation Banner (Visible ONLY if enable_youtube_video is ON and NOT hidden) */}
      {!isVideoHidden && test?.enable_youtube_video && test?.youtube_url && (
        hasVideoAccess ? (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-500/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
                <Play className="w-6 h-6 fill-current text-white ml-0.5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-rose-100 mb-1">
                  <span>🔴 LIVE Video Analysis</span>
                </div>
                <h3 className="font-black text-base sm:text-lg text-white">
                  {language === 'mr' ? '▶️ या चाचणीचे संपूर्ण व्हिडिओ विश्लेषण पहा' : '▶️ Watch Full Video Explanation'}
                </h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  {language === 'mr'
                    ? 'शिक्षकांनी या टेस्ट मधील सर्व प्रश्नांचे सविस्तर विश्लेषण ॲपमध्ये सुरक्षित उपलब्ध केले आहे.'
                    : 'Detailed step-by-step video analysis for all questions explained by expert faculty.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowVideoModal(true)}
              className="px-5 py-3 bg-white hover:bg-rose-50 text-rose-700 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <span>{language === 'mr' ? 'व्हिडिओ प्ले करा' : 'Watch Video'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-500/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/30 text-[11px] font-black text-purple-200 mb-1 border border-purple-400/30">
                  <Lock className="w-3 h-3" />
                  <span>फक्त पेड सदस्यांसाठी (PAID MEMBERS ONLY)</span>
                </div>
                <h3 className="font-black text-base sm:text-lg text-white">
                  {language === 'mr' ? '🔒 या चाचणीचे व्हिडिओ विश्लेषण सशुल्क उपलब्ध आहे' : '🔒 Video Explanation Restricted to Paid Members'}
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  {language === 'mr'
                    ? 'या टेस्ट मधील सर्व १०० प्रश्नांचे सविस्तर व्हिडिओ स्पष्टीकरण पाहण्यासाठी टेस्ट सिरीज पास मिळवा.'
                    : 'Unlock premium video breakdown for this entire test with test series pass.'}
                </p>
              </div>
            </div>

            {onNavigateToPro && (
              <button
                onClick={onNavigateToPro}
                className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md shrink-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{language === 'mr' ? '💎 टेस्ट सिरीज पास अनलॉक करा' : '💎 Unlock Test Pass'}</span>
              </button>
            )}
          </div>
        )
      )}

      {/* Embedded Secure In-App Video Player Modal (Protected against external leaks) */}
      {showVideoModal && test?.youtube_url && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl space-y-4 p-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 font-bold text-sm text-rose-400">
                <Play className="w-4 h-4 fill-current" />
                <span className="truncate max-w-lg">{test.title_mr || test.title_en} — सविस्तर व्हिडिओ विश्लेषण</span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer text-xs font-bold"
              >
                ✕ बंद करा
              </button>
            </div>

            <SecureVideoPlayer
              youtubeVideoId={getYoutubeId(test.youtube_url)}
              title={test.title_mr || test.title_en}
              currentUser={currentUser}
              onClose={() => setShowVideoModal(false)}
            />

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>सुरक्षित व्हिडिओ प्लेअर: हे व्याख्यान केवळ नर्सिंग ऑफिसर ॲपच्या अधिकृत विद्यार्थ्यांसाठी आहे.</span>
              </span>
              <span>स्क्रीन रेकॉर्डिंग / शेअरिंग प्रतिबंधित</span>
            </div>
          </div>
        </div>
      )}

      {/* Result Card Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isQualified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isQualified ? 'NORCET Qualified Range' : 'Remediation Recommended'}
              </span>
              <span className="text-xs text-slate-400">ID: {attempt.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{attempt.test_title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Completed on {new Date(attempt.completed_at).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={generatePDFReport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                title="Admin Only: Download Scorecard PDF"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'mr' ? 'ॲडमिन: गुणपत्रिका डाउनलोड' : 'Admin: Download Scorecard'}</span>
              </button>
            )}

            <button
              onClick={onRetest}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test</span>
            </button>

            {attempt.wrong_count > 0 && (
              <button
                onClick={onGoToMistakes}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Open Mistake Notebook ({attempt.wrong_count})</span>
              </button>
            )}
          </div>
        </div>

        {/* Score Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Final Score</div>
            <div className="text-2xl font-extrabold text-teal-700">
              {attempt.score} <span className="text-xs font-normal text-slate-400">/ {attempt.total_marks}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Includes -0.33 negative mark</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Accuracy</div>
            <div className="text-2xl font-extrabold text-slate-900">{attempt.accuracy_percentage}%</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {attempt.correct_count} of {attempt.correct_count + attempt.wrong_count} attempted
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Time Invested</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {Math.floor(attempt.time_spent_seconds / 60)}m {attempt.time_spent_seconds % 60}s
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ~{Math.round(attempt.time_spent_seconds / (attempt.answers.length || 1))}s per question
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Score Breakdown</div>
            <div className="flex items-center gap-2 text-xs font-bold mt-2">
              <span className="text-emerald-600">✓ {attempt.correct_count}</span>
              <span className="text-rose-600">✗ {attempt.wrong_count}</span>
              <span className="text-slate-400">○ {attempt.unattempted_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question by Question Review Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">
            Question-by-Question Clinical Review
          </h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({answersWithQuestions.length})
            </button>
            <button
              onClick={() => setFilterType('wrong')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'wrong' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-700'
              }`}
            >
              Incorrect ({attempt.wrong_count})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700'
              }`}
            >
              Correct ({attempt.correct_count})
            </button>
            <button
              onClick={() => setFilterType('unattempted')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'unattempted' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Skipped ({attempt.unattempted_count})
            </button>
          </div>
        </div>

        {/* Questions Detailed Review List */}
        <div className="space-y-4">
          {filteredAnswers.map((item, idx) => {
            const q = item.question!;
            const isAnswered = item.selected_option !== null;
            const isCorrect = item.is_correct;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 ${
                  !isAnswered
                    ? 'border-slate-200'
                    : isCorrect
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Item #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {!isAnswered ? (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        Unattempted
                      </span>
                    ) : isCorrect ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1.00)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (-0.33)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-900 leading-relaxed">
                  {q.question_en}
                </div>
                {q.question_mr && q.question_mr.trim().toLowerCase() !== q.question_en.trim().toLowerCase() && (
                  <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    {q.question_mr}
                  </div>
                )}

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                    const optEn = q[`option_${optKey.toLowerCase()}_en` as keyof Question] as string;
                    const optMr = q[`option_${optKey.toLowerCase()}_mr` as keyof Question] as string;
                    const isUserChoice = item.selected_option === optKey;
                    const isCorrectChoice = q.correct_option === optKey;

                    let optStyle = 'border-slate-200 bg-white text-slate-700';
                    if (isCorrectChoice) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    } else if (isUserChoice && !isCorrectChoice) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-semibold';
                    }

                    return (
                      <div
                        key={optKey}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-2 ${optStyle}`}
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-md border flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                            {optKey}
                          </span>
                          <div className="flex flex-col">
                            <span className="leading-snug">{optEn}</span>
                            {optMr && optMr.trim().toLowerCase() !== optEn.trim().toLowerCase() && (
                              <span className="text-[11px] text-slate-600 font-normal mt-0.5 leading-snug">{optMr}</span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          {isCorrectChoice && <span className="text-emerald-700 text-[11px] font-bold block">✓ Correct</span>}
                          {isUserChoice && !isCorrectChoice && <span className="text-rose-700 text-[11px] font-bold block">Your Choice</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rationale */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                    <span>Clinical Rationale / स्पष्टीकरण:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{q.explanation_en}</p>
                  {q.explanation_mr && (
                    <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                      {q.explanation_mr}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-center">
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
