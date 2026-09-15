import React, { useState, useEffect } from 'react';
import { PushNotification, UserProfile } from '../types';
import { api } from '../lib/api';
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
  Smartphone
} from 'lucide-react';

interface AdminPushNotificationsTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminPushNotificationsTab: React.FC<AdminPushNotificationsTabProps> = ({ showToast }) => {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Form fields
  const [titleMr, setTitleMr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [messageMr, setMessageMr] = useState('');
  const [messageEn, setMessageEn] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'user' | 'free_users' | 'pro_users'>('all');
  const [targetUserId, setTargetUserId] = useState('');
  const [targetTab, setTargetTab] = useState<string>('dashboard');
  const [actionUrl, setActionUrl] = useState('');

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
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMr && !titleEn) {
      showToast('नोटीफिकेशनचे शीर्षक टाका (Title is required)', 'error');
      return;
    }
    if (targetType === 'user' && !targetUserId) {
      showToast('कृपया वैयक्तिक सदस्य निवडा (Select a target user)', 'error');
      return;
    }

    try {
      setSending(true);
      const selectedUser = users.find(u => u.id === targetUserId);
      await api.sendPushNotification({
        title_mr: titleMr,
        title_en: titleEn || titleMr,
        message_mr: messageMr,
        message_en: messageEn || messageMr,
        target_type: targetType,
        target_user_id: targetType === 'user' ? targetUserId : undefined,
        target_user_name: selectedUser ? selectedUser.name : undefined,
        target_tab: targetTab,
        action_url: actionUrl || undefined
      });

      showToast('पुश नोटीफिकेशन यशस्वीपणे पाठवले!', 'success');
      setTitleMr('');
      setTitleEn('');
      setMessageMr('');
      setMessageEn('');
      setActionUrl('');
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

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/20">
            <Bell className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span>लाइव्ह पुश नोटीफिकेशन ब्रॉडकास्ट</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">पुश नोटीफिकेशन मॅनेजर (Push Notifications)</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
            सर्व सदस्यांना किंवा विशिष्ट सदस्याला नवीन सराव पेपर, भरती जाहिरात, किंवा ऑफरचे पुश नोटीफिकेशन पाठवा.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none">
          <Smartphone className="w-64 h-64 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Create Push Notification */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Send className="w-5 h-5 text-blue-600" />
            <h3>नवीन नोटीफिकेशन पाठवा</h3>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
            {/* Target Audience Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                कोणाला पाठवायचे? (Target Audience)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('all')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                    targetType === 'all'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>सर्व सदस्य ({users.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('free_users')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                    targetType === 'free_users'
                      ? 'bg-amber-50 border-amber-600 text-amber-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>फ्री सदस्य</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('pro_users')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                    targetType === 'pro_users'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>PRO सदस्य</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('user')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                    targetType === 'user'
                      ? 'bg-purple-50 border-purple-600 text-purple-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>एकच सदस्य</span>
                </button>
              </div>
            </div>

            {/* Individual user select if targetType is 'user' */}
            {targetType === 'user' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  सदस्य निवडा (Select Member)
                </label>
                <select
                  value={targetUserId}
                  onChange={e => setTargetUserId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="">-- योग्य सदस्य निवडा --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email || u.mobile || 'No Contact'}) - {u.isPremium ? '★ PRO' : 'Free'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Notification Title Marathi */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                शीर्षक मराठीत (Notification Title Marathi) *
              </label>
              <input
                type="text"
                value={titleMr}
                onChange={e => setTitleMr(e.target.value)}
                placeholder="उदा. नवीन मॉक टेस्ट उपलब्ध झाली!"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Notification Title English */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Title in English (Optional)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={e => setTitleEn(e.target.value)}
                placeholder="e.g., New Mock Test Released!"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Notification Message Marathi */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                सविस्तर संदेश मराठीत (Message Marathi) *
              </label>
              <textarea
                value={messageMr}
                onChange={e => setMessageMr(e.target.value)}
                placeholder="उदा. DMER Nurse Exam साठी विशेष सराव प्रश्नपत्रिका आता सोडवा."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Target App Tab */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                नोटीफिकेशनवर क्लिक केल्यावर कोणते पेज उघडायचे? (Redirect Screen)
              </label>
              <select
                value={targetTab}
                onChange={e => setTargetTab(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              >
                <option value="dashboard">होम डॅशबोर्ड (Home)</option>
                <option value="chapters">विषयवार चॅप्टर (Chapter Practice)</option>
                <option value="mocks">मॉक टेस्ट (Mock Test)</option>
                <option value="notice">भरती नोटीस (Notice Board)</option>
                <option value="ebooks">E-Books & नोट्स (Study Material)</option>
                <option value="premium">प्रीमियम प्लॅन (Go PRO)</option>
              </select>
            </div>

            {/* Optional Custom Action Link */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                कस्टम लिंक (Custom Web Link - optional)
              </label>
              <input
                type="url"
                value={actionUrl}
                onChange={e => setActionUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>पुश नोटीफिकेशन पाठवा</span>
            </button>
          </form>
        </div>

        {/* Right List: History of Broadcast Notifications */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <span>पाठवलेले नोटीफिकेशन्स (Sent History)</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
              {notifications.length} नोटीफिकेशन्स
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                अजून कोणतेही नोटीफिकेशन पाठवलेले नाही.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 transition-all flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            n.target_type === 'all'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : n.target_type === 'pro_users'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : n.target_type === 'free_users'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-purple-100 text-purple-800 border border-purple-200'
                          }`}
                        >
                          {n.target_type === 'all'
                            ? 'सर्व सदस्य'
                            : n.target_type === 'pro_users'
                            ? 'PRO सदस्य'
                            : n.target_type === 'free_users'
                            ? 'फ्री सदस्य'
                            : `सदस्य: ${n.target_user_name || n.target_user_id}`}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(n.sent_at).toLocaleString('mr-IN')}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm">{n.title_mr || n.title_en}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{n.message_mr || n.message_en}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteNotification(n.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="नोटीफिकेशन डिलीट करा"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <div>
                      पाठवणारे: <span className="font-semibold text-slate-700">{n.sent_by_name}</span>
                    </div>
                    {n.target_tab && (
                      <div className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                        स्क्रीन: {n.target_tab}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
