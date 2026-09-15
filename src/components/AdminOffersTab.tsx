import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { PromoCode, SystemSettings } from '../types';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Megaphone,
  Bell,
  Wrench,
  Percent,
  IndianRupee,
  Calendar,
  Save,
  Loader2,
  Sparkles,
  Edit2,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AdminOffersTabProps {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const AdminOffersTab: React.FC<AdminOffersTabProps> = ({ showToast }) => {
  const { language } = useLanguage();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // New Promo Code Form State
  const [showCreatePromo, setShowCreatePromo] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(50);
  const [validTill, setValidTill] = useState('2026-12-31');
  const [promoDescription, setPromoDescription] = useState('');

  // Settings State Form
  const [tickerActive, setTickerActive] = useState(true);
  const [tickerTextMr, setTickerTextMr] = useState('');
  const [tickerTextEn, setTickerTextEn] = useState('');
  const [tickerSpeed, setTickerSpeed] = useState<number>(30);

  const [chapterBannerMr, setChapterBannerMr] = useState('');
  const [chapterBannerEn, setChapterBannerEn] = useState('');

  const [popupActive, setPopupActive] = useState(true);
  const [popupTitleMr, setPopupTitleMr] = useState('');
  const [popupMessageMr, setPopupMessageMr] = useState('');
  const [popupBadgeMr, setPopupBadgeMr] = useState('');
  const [popupPromoCode, setPopupPromoCode] = useState('');

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [codes, sysSettings] = await Promise.all([
        api.getPromoCodes(),
        api.getSettings()
      ]);
      setPromoCodes(codes);
      setSettings(sysSettings);

      if (sysSettings) {
        setTickerActive(sysSettings.ticker_active !== false);
        setTickerTextMr(sysSettings.ticker_text_mr || '🎉 विशेष सराव ऑफर: MH50 प्रोमो कोड वापरा आणि ५०% सूट मिळवा! 🎉');
        setTickerTextEn(sysSettings.ticker_text_en || '🎉 Special Offer: Use code MH50 to get 50% OFF! 🎉');
        setTickerSpeed(sysSettings.ticker_speed || 30);

        setChapterBannerMr(sysSettings.chapter_banner_text_mr || '📢 DHS / DMER महाराष्ट्र आरोग्य भरती परीक्षा सराव उपलब्ध');
        setChapterBannerEn(sysSettings.chapter_banner_text_en || '📢 DHS / DMER Maharashtra Health Exam Practice Available');

        setPopupActive(sysSettings.offer_popup_active !== false);
        setPopupTitleMr(sysSettings.offer_popup_title_mr || '🔥 विशेष सवलत ऑफर! (Flat 50% OFF)');
        setPopupMessageMr(sysSettings.offer_popup_message_mr || 'सर्व १८ नर्सिंग विषयांचे सराव प्रश्नसंच, ५०+ ग्रँड मॉक टेस्ट्स आणि ऑल-इंडिया प्रेडिक्टर ५०% डिस्काउंटसह मिळवा!');
        setPopupBadgeMr(sysSettings.offer_popup_badge_mr || 'मर्यादित कालावधी ऑफर');
        setPopupPromoCode(sysSettings.offer_popup_promo_code || 'MH50');

        setMaintenanceMode(sysSettings.maintenance_mode || false);
        setMaintenanceMessage(sysSettings.maintenance_message || 'ॲपमध्ये नवीन सुधारणा जोडण्याचे काम सुरू आहे. थोड्या वेळाने पुन्हा प्रयत्न करा.');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load offers data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      showToast('प्रोमो कोड नाव टाकणे आवश्यक आहे', 'error');
      return;
    }
    try {
      await api.createPromoCode({
        code: newCode.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: Number(discountValue) || 0,
        valid_till: validTill,
        is_active: true,
        description: promoDescription
      });
      showToast(`प्रोमो कोड '${newCode.toUpperCase()}' जोडला गेला!`, 'success');
      setNewCode('');
      setPromoDescription('');
      setShowCreatePromo(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create promo code', 'error');
    }
  };

  const handleTogglePromoActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.updatePromoCode(id, { is_active: !currentStatus });
      showToast('प्रोमो कोड स्टेटस अपडेट झाला', 'success');
      loadData();
    } catch (err: any) {
      showToast('Status update failed', 'error');
    }
  };

  const handleDeletePromo = async (id: string, code: string) => {
    if (!confirm(`तुम्हाला नक्की '${code}' हा प्रोमो कोड डिलीट करायचा आहे का?`)) return;
    try {
      await api.deletePromoCode(id);
      showToast(`प्रोमो कोड '${code}' डिलीट झाला`, 'success');
      loadData();
    } catch (err: any) {
      showToast('Failed to delete promo code', 'error');
    }
  };

  const handleSaveMarketingSettings = async () => {
    try {
      setIsSavingSettings(true);
      await api.updateSettings({
        ticker_active: tickerActive,
        ticker_text_mr: tickerTextMr,
        ticker_text_en: tickerTextEn,
        ticker_speed: Number(tickerSpeed) || 30,
        chapter_banner_text_mr: chapterBannerMr,
        chapter_banner_text_en: chapterBannerEn,
        offer_popup_active: popupActive,
        offer_popup_title_mr: popupTitleMr,
        offer_popup_message_mr: popupMessageMr,
        offer_popup_badge_mr: popupBadgeMr,
        offer_popup_promo_code: popupPromoCode,
        maintenance_mode: maintenanceMode,
        maintenance_message: maintenanceMessage
      });
      showToast('सर्व ऑफर, स्पीड व चाप्टर नोटीफिकेशन सेटिंग्ज सुरक्षित सेव्ह झाल्या!', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-500" />
            <span>ऑफर, प्रोमो कोड व मेंटेनन्स मोड व्यवस्थापन</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            विद्यार्थ्यांसाठी डिस्काउंट प्रोमो कोड तयार करा, वरची फिरणारी ऑफर पट्टी बदला, पॉपअप नोटीफिकेशन सेट करा किंवा ॲप मेंटेनन्सवर टाका.
          </p>
        </div>

        <button
          onClick={handleSaveMarketingSettings}
          disabled={isSavingSettings}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>सेटिंग्ज सेव्ह करा</span>
        </button>
      </div>

      {/* SECTION 1: PROMO CODE MANAGEMENT */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              <span>सक्रिय प्रोमो कोड्स (Discount Coupons)</span>
            </h3>
            <p className="text-xs text-slate-500">
              विद्यार्थी Razorpay किंवा QR पेमेंट करताना हे कोड टाकून सूट मिळवू शकतात.
            </p>
          </div>

          <button
            onClick={() => setShowCreatePromo(!showCreatePromo)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>नवीन प्रोमो कोड जोडा</span>
          </button>
        </div>

        {/* Create Promo Code Form Modal / Dropdown */}
        {showCreatePromo && (
          <form onSubmit={handleCreatePromoCode} className="bg-slate-50 p-4 rounded-xl border border-blue-200 space-y-4 animate-in fade-in">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">नवीन डिस्काउंट प्रोमो कोड फॉर्म</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">प्रोमो कोड (Code Name)*</label>
                <input
                  type="text"
                  placeholder="उदा. FESTIVE50"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">सूट प्रकार (Discount Type)</label>
                <select
                  value={discountType}
                  onChange={e => setDiscountType(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="percentage">टक्केवारी (%) Percentage Off</option>
                  <option value="fixed">नक्की रक्कम (₹) Fixed Amount Off</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">सूट मूल्य (Discount Value)*</label>
                <input
                  type="number"
                  placeholder="50"
                  value={discountValue}
                  onChange={e => setDiscountValue(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">अंतिम तारीख (Valid Till)</label>
                <input
                  type="date"
                  value={validTill}
                  onChange={e => setValidTill(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">विवरण / टीप (Description)</label>
              <input
                type="text"
                placeholder="उदा. ५०% फेस्टिव्ह डिस्काउंट सर्व प्लॅन्सवर"
                value={promoDescription}
                onChange={e => setPromoDescription(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreatePromo(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                प्रोमो कोड सेव्ह करा
              </button>
            </div>
          </form>
        )}

        {/* Promo Code Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">कोड (Code)</th>
                <th className="p-3">सूट (Discount)</th>
                <th className="p-3">मुदत (Valid Till)</th>
                <th className="p-3">वापर संख्या (Used)</th>
                <th className="p-3">स्टेटस (Status)</th>
                <th className="p-3 text-right">कृती (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    कोणताही प्रोमो कोड जोडलेला नाही.
                  </td>
                </tr>
              ) : (
                promoCodes.map(promo => (
                  <tr key={promo.id} className="hover:bg-slate-50">
                    <td className="p-3 font-black text-slate-900 tracking-wider">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-mono text-xs">
                        {promo.code}
                      </span>
                      {promo.description && (
                        <span className="block text-[10px] text-slate-500 font-normal mt-0.5">{promo.description}</span>
                      )}
                    </td>

                    <td className="p-3 font-bold text-emerald-700">
                      {promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `₹${promo.discount_value} OFF`}
                    </td>

                    <td className="p-3 text-slate-600">
                      {promo.valid_till || 'अनंत (Unlimited)'}
                    </td>

                    <td className="p-3 font-semibold text-slate-700">
                      {promo.usage_count || 0} वेळा
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleTogglePromoActive(promo.id, promo.is_active)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                          promo.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {promo.is_active ? 'सक्रिय (Active)' : 'बंद (Inactive)'}
                      </button>
                    </td>

                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleDeletePromo(promo.id, promo.code)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Promo Code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: TOP SCROLLING TICKER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-600" />
              <span>फिरणारी ऑफर पट्टी (Top Marquee Ticker)</span>
            </h3>
            <p className="text-xs text-slate-500">
              ॲपच्या वरच्या बाजूला फिरणारी टेक्स्ट घोषणा दाखवा किंवा बंद करा.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={tickerActive}
              onChange={e => setTickerActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">मराठी मजकूर (Ticker Text Marathi)</label>
            <input
              type="text"
              value={tickerTextMr}
              onChange={e => setTickerTextMr(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              placeholder="🎉 विशेष सराव ऑफर: MH50 प्रोमो कोड वापरा आणि ५०% सूट मिळवा! 🎉"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">इंग्रजी मजकूर (Ticker Text English)</label>
            <input
              type="text"
              value={tickerTextEn}
              onChange={e => setTickerTextEn(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              placeholder="🎉 Special Offer: Use promo code MH50 to get 50% OFF! 🎉"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            🏃‍♂️ फिरणारा स्पीड (Ticker Speed: हळू / जलद - सेकंदात)
          </label>
          <select
            value={tickerSpeed}
            onChange={e => setTickerSpeed(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
          >
            <option value={15}>⚡ खूप जलद (Fast - 15 Seconds)</option>
            <option value={30}>⚖️ मध्यम / नॉर्मल (Normal - 30 Seconds)</option>
            <option value={50}>🐢 अतिशय हळू (Slow - 50 Seconds)</option>
            <option value={80}>🐌 अत्यंत संत (Very Slow - 80 Seconds)</option>
          </select>
        </div>
      </div>

      {/* SECTION 2.5: CHAPTER / SUBJECTS LIVE ANNOUNCEMENT BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-rose-600" />
            <span>चाप्टर / विषय सूचीवरील लाइव्ह नोटीस बॅनर (Chapter Live Announcement Banner)</span>
          </h3>
          <p className="text-xs text-slate-500">
            विद्यार्थी जेव्हा चॅप्टर किंवा विषय निवडतात, तेव्हा वर दिसणारी "DHS / DMER सराव परीक्षा उपलब्ध" ही सूचना येथे बदलू शकता.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">मराठी सूचना (Chapter Banner Marathi)</label>
            <input
              type="text"
              value={chapterBannerMr}
              onChange={e => setChapterBannerMr(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              placeholder="📢 DHS / DMER महाराष्ट्र आरोग्य भरती परीक्षा सराव उपलब्ध"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">इंग्रजी सूचना (Chapter Banner English)</label>
            <input
              type="text"
              value={chapterBannerEn}
              onChange={e => setChapterBannerEn(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              placeholder="📢 DHS / DMER Maharashtra Health Exam Practice Available"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: APP OPENING OFFER POPUP */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>ॲप ओपन केल्यावर ऑफर नोटीफिकेशन (Offer Popup Dialog)</span>
            </h3>
            <p className="text-xs text-slate-500">
              विद्यार्थ्यांनी ॲप उघडताच त्यांना डिस्काउंट ऑफरचा सुंदर पॉपअप दिसेल.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={popupActive}
              onChange={e => setPopupActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">पॉपअप शीर्षक (Title)</label>
            <input
              type="text"
              value={popupTitleMr}
              onChange={e => setPopupTitleMr(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">संलग्न प्रोमो कोड (Promo Code Highlight)</label>
            <input
              type="text"
              value={popupPromoCode}
              onChange={e => setPopupPromoCode(e.target.value.toUpperCase())}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">पॉपअप संदेश / तपशील (Message)</label>
            <textarea
              rows={2}
              value={popupMessageMr}
              onChange={e => setPopupMessageMr(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: MAINTENANCE MODE */}
      <div className="bg-white rounded-2xl border border-amber-300 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" />
              <span>मेंटेनन्स मोड (Maintenance Mode)</span>
            </h3>
            <p className="text-xs text-amber-700">
              हे चालू केल्यावर सर्व विद्यार्थ्यांना 'ॲप सध्या मेंटेनन्सवर आहे' असा मेसेज दिसेल. फक्त अ‍ॅडमिन लॉग इन करून ॲप मधील बदल पडताळू (verify) शकतात.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={e => setMaintenanceMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">विद्यार्थ्यांना दाखवण्याचा मेसेज (Maintenance Message)</label>
          <input
            type="text"
            value={maintenanceMessage}
            onChange={e => setMaintenanceMessage(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            placeholder="ॲपमध्ये नवीन वैशिष्ट्ये व सुधारणा जोडण्याचे काम सुरू आहे. थोड्या वेळाने प्रयत्न करा."
          />
        </div>
      </div>

    </div>
  );
};
