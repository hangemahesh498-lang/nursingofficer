import React, { useState, useEffect, useMemo } from 'react';
import { PushNotification, UserProfile, NotificationTargetType } from '../types';
import { api } from '../lib/api';
import { registerForPushNotifications } from '../lib/firebase-messaging';
import {
  Bell,
  Send,
  Users,
  UserCheck,
  User,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Smartphone,
  Image as ImageIcon,
  Calendar,
  Volume2,
  Radio,
  Search,
  Filter,
  Eye,
  Layers,
  Clock,
  BookOpen,
  GraduationCap,
  PlayCircle,
  Crown,
  AlertTriangle,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface AdminPushNotificationsTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminPushNotificationsTab: React.FC<AdminPushNotificationsTabProps> = ({ showToast }) => {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [testing, setTesting] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Form fields
  const [titleMr, setTitleMr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [messageMr, setMessageMr] = useState('');
  const [messageEn, setMessageEn] = useState('');
  const [targetType, setTargetType] = useState<NotificationTargetType>('all');
  const [userSearch, setUserSearch] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [targetTab, setTargetTab] = useState<string>('dashboard');
  const [actionUrl, setActionUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // History filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<string>('all');

  const loadData = async () => {
    try {
      setLoading(true);
      const [notifsRes, userStatsRes] = await Promise.all([
        api.getPushNotifications(),
        api.getUserStats()
      ]);
      setNotifications(notifsRes);
      setUsers(userStatsRes.users || []);
    } catch (err: any) {
      showToast(err.message || 'नोटीफिकेशन्स लोड करता आले नाहीत', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (typeof Notification !== 'undefined') {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Filtered users for individual selection
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users.slice(0, 50);
    const q = userSearch.toLowerCase();
    return users.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.mobile?.includes(q)
    ).slice(0, 50);
  }, [users, userSearch]);

  // Audience Count Estimates
  const audienceCount = useMemo(() => {
    switch (targetType) {
      case 'all': return users.length;
      case 'free_users': return users.filter(u => !u.isPremium).length;
      case 'pro_users': return users.filter(u => u.isPremium).length;
      case 'plan_mcq': return users.filter(u => u.hasMcqAccess).length;
      case 'plan_test_series': return users.filter(u => u.hasTestSeriesAccess).length;
      case 'plan_youtube': return users.filter(u => u.hasYoutubeAccess).length;
      case 'plan_combo': return users.filter(u => u.hasMcqAccess && u.hasTestSeriesAccess && u.hasYoutubeAccess).length;
      case 'expiring_soon': return users.filter(u => u.isPremium && (u.daysRemaining ?? 0) > 0 && (u.daysRemaining ?? 0) <= 7).length;
      case 'user':
      case 'individual':
        return targetUserId ? 1 : 0;
      default: return users.length;
    }
  }, [targetType, users, targetUserId]);

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('तुमचा ब्राउझर वेब पुश सपोर्ट करत नाही', 'error');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        const token = await registerForPushNotifications();
        if (token) {
          showToast('ब्राउझर नोटीफिकेशन परवानगी यशस्वी व टोकन रजिस्टर्ड!', 'success');
        } else {
          showToast('नोटीफिकेशन परवानगी मिळाली!', 'success');
        }
      } else {
        showToast('नोटीफिकेशन परवानगी नाकारली गेली.', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'परवानगी मिळवण्यात त्रुटी आली', 'error');
    }
  };

  const handleSendTestNotification = async () => {
    try {
      setTesting(true);
      const title = titleMr || titleEn || '🔔 [चाचणी] टेस्ट नोटीफिकेशन';
      const message = messageMr || messageEn || 'पुश नोटीफिकेशन, आवाज व डीप-लिंक चाचणी यशस्वी!';

      const res = await api.sendTestPushNotification({
        title,
        message,
        image_url: imageUrl || undefined,
        target_tab: targetTab,
        action_url: actionUrl || undefined
      });

      // Also trigger local browser notification if permitted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SHOW_TEST_NOTIFICATION',
              title,
              message,
              imageUrl,
              targetTab
            });
          } else {
            new Notification(title, {
              body: message,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: 'test-direct',
              ...(imageUrl ? { image: imageUrl } as any : {})
            });
          }
        } catch (localErr) {
          console.warn('Local Notification fallback:', localErr);
        }
      }

      showToast(`चाचणी नोटीफिकेशन पाठवले! (${res.message || 'यशस्वी'})`, 'success');
    } catch (err: any) {
      showToast(err.message || 'चाचणी नोटीफिकेशन पाठवण्यात त्रुटी आली', 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMr && !titleEn) {
      showToast('नोटीफिकेशनचे शीर्षक टाका (Title is required)', 'error');
      return;
    }
    if ((targetType === 'user' || (targetType as any) === 'individual') && !targetUserId) {
      showToast('कृपया वैयक्तिक सदस्य निवडा (Select a target member)', 'error');
      return;
    }

    let scheduledFor: string | undefined;
    if (isScheduled) {
      if (!scheduledDate || !scheduledTime) {
        showToast('कृपया शेड्युलची तारीख आणि वेळ निवडा', 'error');
        return;
      }
      scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    }

    try {
      setSending(true);
      const selectedUser = (users || []).find(u => u?.id === targetUserId);
      const result = await api.sendPushNotification({
        title_mr: titleMr,
        title_en: titleEn || titleMr,
        message_mr: messageMr,
        message_en: messageEn || messageMr,
        target_type: targetType,
        target_user_id: targetType === 'user' || (targetType as any) === 'individual' ? targetUserId : undefined,
        target_user_name: selectedUser ? selectedUser.name : undefined,
        target_tab: targetTab,
        action_url: actionUrl || undefined,
        image_url: imageUrl || undefined,
        icon_url: iconUrl || undefined,
        scheduled_for: scheduledFor
      });

      const countMsg = result.targeted_candidates
        ? ` (${result.targeted_candidates} सदस्यांना पाठवले)`
        : '';
      showToast(`पुश नोटीफिकेशन यशस्वीपणे पाठवले!${countMsg}`, 'success');

      // Reset form
      setTitleMr('');
      setTitleEn('');
      setMessageMr('');
      setMessageEn('');
      setActionUrl('');
      setImageUrl('');
      setIconUrl('');
      setIsScheduled(false);
      setScheduledDate('');
      setScheduledTime('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'नोटीफिकेशन पाठवताना त्रुटी आली', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm('हे नोटीफिकेशन डिलीट करायचे आहे का?')) return;
    try {
      await api.deletePushNotification(id);
      showToast('नोटीफिकेशन डिलीट केले', 'info');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'डिलीट अयशस्वी', 'error');
    }
  };

  const filteredHistory = useMemo(() => {
    return notifications.filter(n => {
      if (historyFilter !== 'all' && n.target_type !== historyFilter) return false;
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase();
        const tMatch = (n.title_mr && n.title_mr.toLowerCase().includes(q)) ||
                       (n.title_en && n.title_en.toLowerCase().includes(q));
        const mMatch = (n.message_mr && n.message_mr.toLowerCase().includes(q)) ||
                       (n.message_en && n.message_en.toLowerCase().includes(q));
        const uMatch = n.target_user_name && n.target_user_name.toLowerCase().includes(q);
        return tMatch || mMatch || uMatch;
      }
      return true;
    });
  }, [notifications, historyFilter, historySearch]);

  const targetScreens = [
    { value: 'dashboard', label: '🏠 मुख्य डॅशबोर्ड (Home Dashboard)' },
    { value: 'chapters', label: '📖 विषय व चॅप्टर प्रॅक्टिस (Chapters & MCQ)' },
    { value: 'mocks', label: '📝 मॉक टेस्ट सिरीज (Mock Tests)' },
    { value: 'notice', label: '📢 नवीन भरती जाहिराती (Recruitment Notices)' },
    { value: 'ebooks', label: '📚 E-Books आणि नोट्स (Study Material)' },
    { value: 'youtube_lectures', label: '📺 व्हिडिओ लेक्चर्स (YouTube Classes)' },
    { value: 'premium', label: '👑 PRO सबस्क्रिप्शन प्लॅन्स (Upgrade Plan)' },
    { value: 'pyq', label: '🏛️ मागील वर्षांच्या प्रश्नपत्रिका (PYQ Hub)' },
    { value: 'clinical_cases', label: '🩺 क्लिनिकल केस स्टडीज (Clinical Scenarios)' },
    { value: 'profile', label: '👤 प्रोफाइल आणि स्कोअरकार्ड (Student Profile)' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/20">
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Firebase Cloud Messaging (FCM) ब्रॉडकास्ट हब</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">पुश नोटीफिकेशन मॅनेजर (Push Notifications)</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
              सर्व विद्यार्थ्यांपर्यंत इन्स्टंट सूचना, परीक्षा अलर्ट, बॅनर इमेजेस आणि डायरेक्ट डीप-लिंक्स पाठवा.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {notificationPermission !== 'granted' ? (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
              >
                <Radio className="w-4 h-4" />
                <span>या डिव्हाइसवर नोटीफिकेशन चालू करा</span>
              </button>
            ) : (
              <div className="px-3 py-2 bg-white/15 border border-white/20 rounded-2xl text-xs font-semibold flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>डिव्हाइस नोटीफिकेशन ॲक्टिव्ह</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSendTestNotification}
              disabled={testing}
              className="px-4 py-2.5 bg-white text-blue-800 hover:bg-blue-50 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin text-blue-700" /> : <Smartphone className="w-4 h-4 text-blue-700" />}
              <span>टेस्ट नोटीफिकेशन पाठवा</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <Smartphone className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* OS Notification Sound & Vibration Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs flex items-start gap-3 text-slate-700">
        <Volume2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900">
            🔔 Android / iOS ऑपरेटिंग सिस्टीम साउंड आणि व्हायब्रेशन चॅनेल:
          </p>
          <p className="text-slate-600 leading-relaxed">
            नोटीफिकेशनचा आवाज आणि व्हायब्रेशन हे युझरच्या डिव्हाइसच्या ऑपरेटिंग सिस्टीम (Android/iOS) नोटिफिकेशन चॅनेल आणि व्हॉल्यूम/डीएनडी (DND) सेटिंग्जनुसार आपोआप नियंत्रित होते. वेब ॲप्लिकेशनमध्ये <span className="font-semibold text-slate-800">High Priority Alert Channel</span> व <span className="font-semibold text-slate-800">Default Sound</span> पूर्णपणे कॉन्फिगर केलेले आहे.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Create & Send Push Notification */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Send className="w-4 h-4 text-blue-600" />
                <h3>नवीन पुश नोटीफिकेशन तयार करा</h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-xs border border-blue-100">
                <Users className="w-3.5 h-3.5" />
                <span>अंदाजे लक्ष्यित विद्यार्थी: {audienceCount}</span>
              </div>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
              {/* Target Audience Options */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  १. कोणाला पाठवायचे? (Target Audience) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetType('all')}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-start gap-1 transition-all ${
                      targetType === 'all'
                        ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-600" /> सर्व विद्यार्थी</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-md">{users.length}</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500">All registered students</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('free_users')}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-start gap-1 transition-all ${
                      targetType === 'free_users'
                        ? 'bg-amber-50 border-amber-600 text-amber-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-amber-600" /> फ्री विद्यार्थी</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-md">{users.filter(u => !u.isPremium).length}</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500">Free / Non-PRO users</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('pro_users')}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-start gap-1 transition-all ${
                      targetType === 'pro_users'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className="flex items-center gap-1"><Crown className="w-3.5 h-3.5 text-emerald-600" /> सर्व PRO सदस्य</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">{users.filter(u => u.isPremium).length}</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500">All active paid users</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('plan_mcq')}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-start gap-1 transition-all ${
                      targetType === 'plan_mcq'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-indigo-600" /> MCQ प्लॅन</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">{users.filter(u => u.hasMcqAccess).length}</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500">MCQ Bank Subscribers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('plan_test_series')}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-start gap-1 transition-all ${
                      targetType === 'plan_test_series'
                        ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-teal-600" /> टेस्ट सिरीज</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded-md">{users.filter(u => u.hasTestSeriesAccess).length}</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500">Mock Test Subscribers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('plan_youtube')}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-start gap-1 transition-all ${
                      targetType === 'plan_youtube'
                        ? 'bg-rose-50 border-rose-600 text-rose-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className="flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5 text-rose-600" /> व्हिडिओ लेक्चर्स</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded-md">{users.filter(u => u.hasYoutubeAccess).length}</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500">Video Course Subscribers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('plan_combo')}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-start gap-1 transition-all ${
                      targetType === 'plan_combo'
                        ? 'bg-purple-50 border-purple-600 text-purple-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className="flex items-center gap-1"><Crown className="w-3.5 h-3.5 text-purple-600" /> कॉम्बो ऑल-इन-वन</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-md">{users.filter(u => u.hasMcqAccess && u.hasTestSeriesAccess && u.hasYoutubeAccess).length}</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500">Complete Master Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('expiring_soon')}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-start gap-1 transition-all ${
                      targetType === 'expiring_soon'
                        ? 'bg-orange-50 border-orange-600 text-orange-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-600" /> मुदत संपत आलेले</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-md">{users.filter(u => u.isPremium && (u.daysRemaining ?? 0) > 0 && (u.daysRemaining ?? 0) <= 7).length}</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500">Expiring in ≤ 7 days</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('user')}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-start gap-1 transition-all ${
                      targetType === 'user' || (targetType as any) === 'individual'
                        ? 'bg-cyan-50 border-cyan-600 text-cyan-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-cyan-600" /> एकच विद्यार्थी</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-cyan-100 text-cyan-800 rounded-md">१</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500">Individual Student</span>
                  </button>
                </div>
              </div>

              {/* Individual Student Search & Select */}
              {(targetType === 'user' || (targetType as any) === 'individual') && (
                <div className="p-3 bg-cyan-50/50 border border-cyan-200 rounded-2xl space-y-2">
                  <label className="block font-bold text-slate-800">
                    विद्यार्थी शोधा व निवडा (Search & Select Student) *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="नाव, ईमेल किंवा मोबाईल नंबर टाका..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <select
                    value={targetUserId}
                    onChange={e => setTargetUserId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">-- विद्यार्थी निवडा ({filteredUsers.length} सापडले) --</option>
                    {filteredUsers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email || u.mobile || 'No Contact'}) - {u.isPremium ? `★ PRO (${u.plan_name || 'Active'})` : 'Free'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Titles: Marathi & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    २. शीर्षक मराठीत (Notification Title Marathi) *
                  </label>
                  <input
                    type="text"
                    value={titleMr}
                    onChange={e => setTitleMr(e.target.value)}
                    placeholder="उदा. 🔔 नवीन DMER मॉक टेस्ट उपलब्ध!"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Title in English (Optional)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={e => setTitleEn(e.target.value)}
                    placeholder="e.g., 🔔 New Mock Test Released!"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Messages: Marathi & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    ३. सविस्तर संदेश मराठीत (Message Marathi) *
                  </label>
                  <textarea
                    value={messageMr}
                    onChange={e => setMessageMr(e.target.value)}
                    placeholder="उदा. डीएमईआर स्टाफ नर्स परीक्षेसाठी १०० प्रश्नांची विशेष सराव टेस्ट सोडवा आणि ऑल महाराष्ट्र रँक तपासा."
                    rows={3}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Message in English (Optional)
                  </label>
                  <textarea
                    value={messageEn}
                    onChange={e => setMessageEn(e.target.value)}
                    placeholder="e.g., Practice the latest 100 questions mock test and check your All-Maharashtra rank now."
                    rows={3}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Rich Media: Banner Image URL & Icon URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>बॅनर इमेज URL (Big Image Banner - Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... किंवा इमेज लिंक"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                    <span>कस्टम आयकॉन URL (App/Notice Icon - Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={iconUrl}
                    onChange={e => setIconUrl(e.target.value)}
                    placeholder="/pwa-192x192.png किंवा आयकॉन लिंक"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Redirect Action & Target Screen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    ४. क्लिक केल्यावर कोणते पेज उघडायचे? (Redirect Screen) *
                  </label>
                  <select
                    value={targetTab}
                    onChange={e => setTargetTab(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    {targetScreens.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>कस्टम वेब लिंक (External / Custom URL - Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={actionUrl}
                    onChange={e => setActionUrl(e.target.value)}
                    placeholder="https://t.me/NursingofficerAPP किंवा वेबसाइट लिंक"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Optional Scheduling */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isScheduled}
                      onChange={e => setIsScheduled(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>भविष्यातील तारखेसाठी शेड्युल करा (Schedule for Later)</span>
                  </label>
                  {isScheduled && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                      शेड्युलिंग मोड
                    </span>
                  )}
                </div>

                {isScheduled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-medium text-slate-600 mb-1">तारीख (Date)</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={e => setScheduledDate(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:ring-2 focus:ring-blue-600"
                        required={isScheduled}
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-600 mb-1">वेळ (Time)</label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={e => setScheduledTime(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:ring-2 focus:ring-blue-600"
                        required={isScheduled}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-all active:scale-98"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>नोटीफिकेशन ब्रॉडकास्ट होत आहे...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isScheduled ? 'नोटीफिकेशन शेड्युल करा' : 'आताच पुश नोटीफिकेशन पाठवा'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  disabled={testing}
                  className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>टेस्ट नोटीफिकेशन</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Android Notification Mockup & Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Mobile Notification Shade Preview */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>लाईव्ह Android नोटिफिकेशन प्रिव्ह्यू</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
                Android 14 / OS Style
              </span>
            </div>

            {/* Android Lockscreen / Status Bar Simulation */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-3">
              {/* Notification Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-xs">
                    +
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">Nursing Officer Exam Prep</span>
                  <span className="text-[10px] text-slate-500">• Just now</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                </div>
              </div>

              {/* Notification Content */}
              <div className="space-y-1 pl-1">
                <h4 className="font-extrabold text-sm text-white leading-tight">
                  {titleMr || titleEn || '🔔 DMER / AIIMS NORCET विशेष मॉक टेस्ट'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {messageMr || messageEn || 'नवीन सराव प्रश्नपत्रिका उपलब्ध झाली आहे. आत्ताच टेस्ट सोडवून महाराष्ट्र रँक तपासा.'}
                </p>
              </div>

              {/* Optional Rich Image Banner Preview */}
              {imageUrl ? (
                <div className="rounded-xl overflow-hidden border border-slate-700 mt-2 bg-slate-950 max-h-48">
                  <img
                    src={imageUrl}
                    alt="Notification Banner"
                    className="w-full h-auto object-cover"
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : null}

              {/* Interactive Action Buttons */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-semibold text-[11px]"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                >
                  <span>उघडा (Open)</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Target Destination Indicator */}
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-medium">Redirecting Screen:</span>
                <span className="font-bold text-blue-400">{targetTab}</span>
              </div>
              {actionUrl && (
                <div className="flex items-center justify-between text-slate-300 truncate">
                  <span className="font-medium">Custom Link:</span>
                  <span className="font-mono text-[10px] text-amber-300 truncate max-w-[180px]">{actionUrl}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Audience Breakdown stats */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>विद्यार्थी गट संख्या (Live Student Segments)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-600">सर्व नोंदणीकृत:</span>
                <span className="font-black text-slate-900">{users.length}</span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <span className="text-emerald-800 font-semibold">PRO सदस्य:</span>
                <span className="font-black text-emerald-900">{users.filter(u => u.isPremium).length}</span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                <span className="text-amber-800 font-semibold">फ्री सदस्य:</span>
                <span className="font-black text-amber-900">{users.filter(u => !u.isPremium).length}</span>
              </div>
              <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <span className="text-indigo-800 font-semibold">MCQ ॲक्सेस:</span>
                <span className="font-black text-indigo-900">{users.filter(u => u.hasMcqAccess).length}</span>
              </div>
              <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100 flex items-center justify-between">
                <span className="text-teal-800 font-semibold">टेस्ट सिरीज:</span>
                <span className="font-black text-teal-900">{users.filter(u => u.hasTestSeriesAccess).length}</span>
              </div>
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between">
                <span className="text-rose-800 font-semibold">व्हिडिओ ॲक्सेस:</span>
                <span className="font-black text-rose-900">{users.filter(u => u.hasYoutubeAccess).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>पाठवलेले नोटीफिकेशन्स (Sent History & Audit)</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
              {filteredHistory.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="इतिहास शोधा..."
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
              />
            </div>

            <select
              value={historyFilter}
              onChange={e => setHistoryFilter(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
            >
              <option value="all">सर्व गट (All Audiences)</option>
              <option value="all">👥 सर्व विद्यार्थी</option>
              <option value="pro_users">⭐ PRO सदस्य</option>
              <option value="free_users">🆓 फ्री सदस्य</option>
              <option value="user">👤 वैयक्तिक विद्यार्थी</option>
            </select>

            <button
              onClick={loadData}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="रिफ्रेश करा"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              कोणतेही नोटीफिकेशन सापडले नाही.
            </div>
          ) : (
            filteredHistory.map(n => (
              <div
                key={n.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between gap-3 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          n.target_type === 'all'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : n.target_type === 'pro_users'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : n.target_type === 'free_users'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : n.target_type === 'plan_mcq'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : n.target_type === 'plan_test_series'
                            ? 'bg-teal-100 text-teal-800 border border-teal-200'
                            : n.target_type === 'plan_youtube'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {n.target_type === 'all'
                          ? '👥 सर्व विद्यार्थी'
                          : n.target_type === 'pro_users'
                          ? '👑 PRO सदस्य'
                          : n.target_type === 'free_users'
                          ? '🆓 फ्री सदस्य'
                          : n.target_type === 'plan_mcq'
                          ? '📚 MCQ प्लॅन'
                          : n.target_type === 'plan_test_series'
                          ? '📝 टेस्ट सिरीज'
                          : n.target_type === 'plan_youtube'
                          ? '📺 व्हिडिओ लेक्चर्स'
                          : `👤 ${n.target_user_name || n.target_user_id || 'वैयक्तिक'}`}
                      </span>

                      {n.recipient_count !== undefined && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200/70 text-slate-700 rounded-md">
                          {n.recipient_count} प्राप्तकर्ते
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(n.sent_at).toLocaleString('mr-IN')}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm">{n.title_mr || n.title_en}</h4>
                    <p className="text-slate-600 leading-relaxed">{n.message_mr || n.message_en}</p>

                    {n.image_url && (
                      <div className="pt-2">
                        <img
                          src={n.image_url}
                          alt="Notification banner"
                          className="h-20 w-auto rounded-xl border border-slate-200 object-cover"
                          onError={e => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteNotification(n.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="नोटीफिकेशन डिलीट करा"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
                  <div>
                    पाठवणारे Admin: <span className="font-semibold text-slate-800">{n.sent_by_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {n.target_tab && (
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                        स्क्रीन: {n.target_tab}
                      </span>
                    )}
                    {n.action_url && (
                      <a
                        href={n.action_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1 font-mono text-[10px]"
                      >
                        <span>लिंक उघडा</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
