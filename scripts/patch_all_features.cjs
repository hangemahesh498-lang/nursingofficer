const fs = require('fs');
const path = require('path');

console.log('--- Starting NursingPrep Features Patching ---');

let code = fs.readFileSync('public/assets/index-CY7ixHhG.js', 'utf8');

// Helper to escape regex special chars
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// -------------------------------------------------------------
// 1. ENHANCED AD MANAGER COMPONENT (Admin CMS - Promo Ads)
// -------------------------------------------------------------
const EnhancedAdManagerCode = `
const EnhancedAdManager = ({ showToast }) => {
  const { language: lang } = Ds();
  const [ads, setAds] = k.useState([]);
  const [loading, setLoading] = k.useState(true);
  const [saving, setSaving] = k.useState(false);
  const [uploading, setUploading] = k.useState(false);
  const [uploadProgress, setUploadProgress] = k.useState('');
  const [editingAd, setEditingAd] = k.useState(null);
  const [showModal, setShowModal] = k.useState(false);
  const [previewAd, setPreviewAd] = k.useState(null);
  const [filterPlacement, setFilterPlacement] = k.useState('all');
  
  const [formData, setFormData] = k.useState({
    title_en: '',
    title_mr: '',
    description_en: '',
    description_mr: '',
    aspect_ratio: '16:9',
    media_type: 'image',
    video_url: '',
    thumbnail_url: '',
    cta_text_en: 'Apply Online / Join Batch',
    cta_text_mr: 'ऑनलाईन अर्ज करा / बॅच जॉईन करा',
    cta_link: 'upgrade-pro',
    target_screen: 'all',
    is_active: true,
    sponsor_tag: 'Nursing Officer BY MH'
  });

  const loadAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/promo-ads');
      const data = await res.json();
      setAds(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      showToast && showToast('जाहिराती लोड करता आल्या नाहीत / Failed to load ads', 'error');
    } finally {
      setLoading(false);
    }
  };

  k.useEffect(() => {
    loadAds();
  }, []);

  const openCreateModal = () => {
    setEditingAd(null);
    setFormData({
      title_en: '',
      title_mr: '',
      description_en: '',
      description_mr: '',
      aspect_ratio: '16:9',
      media_type: 'image',
      video_url: '',
      thumbnail_url: '',
      cta_text_en: 'Apply Online / Join Batch',
      cta_text_mr: 'ऑनलाईन अर्ज करा / बॅच जॉईन करा',
      cta_link: 'upgrade-pro',
      target_screen: 'all',
      is_active: true,
      sponsor_tag: 'Nursing Officer BY MH'
    });
    setShowModal(true);
  };

  const openEditModal = (ad) => {
    setEditingAd(ad);
    setFormData({
      title_en: ad.title_en || '',
      title_mr: ad.title_mr || '',
      description_en: ad.description_en || '',
      description_mr: ad.description_mr || '',
      aspect_ratio: ad.aspect_ratio || '16:9',
      media_type: ad.media_type || (ad.video_url && ad.video_url.includes('.mp4') ? 'video' : 'image'),
      video_url: ad.video_url || ad.image_url || '',
      thumbnail_url: ad.thumbnail_url || '',
      cta_text_en: ad.cta_text_en || 'Apply Online',
      cta_text_mr: ad.cta_text_mr || 'ऑनलाईन अर्ज करा',
      cta_link: ad.cta_link || 'upgrade-pro',
      target_screen: ad.target_screen || 'all',
      is_active: ad.is_active !== undefined ? ad.is_active : true,
      sponsor_tag: ad.sponsor_tag || 'Nursing Officer BY MH'
    });
    setShowModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(\`अपलोड होत आहे: \${file.name} (\${(file.size / (1024 * 1024)).toFixed(1)} MB)...\`);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        try {
          if (file.type.startsWith('video/')) {
            const res = await fetch('/api/admin/cloudinary/upload-video', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file: base64, folder: 'nursing-officer/promo-videos', aspect_ratio: formData.aspect_ratio })
            });
            const data = await res.json();
            if (data.secure_url || data.url) {
              setFormData(prev => ({
                ...prev,
                video_url: data.secure_url || data.url,
                thumbnail_url: data.thumbnail_url || prev.thumbnail_url,
                media_type: 'video'
              }));
              showToast && showToast('व्हिडिओ यशस्वीपणे अपलोड झाला!', 'success');
            } else {
              setFormData(prev => ({ ...prev, video_url: base64, media_type: 'video' }));
              showToast && showToast('व्हिडिओ स्थानिकरित्या जोडला गेला', 'info');
            }
          } else {
            const res = await fetch('/api/admin/cloudinary/upload-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file: base64, folder: 'nursing-officer/ads' })
            });
            const data = await res.json();
            if (data.secure_url || data.url) {
              setFormData(prev => ({
                ...prev,
                video_url: data.secure_url || data.url,
                thumbnail_url: data.secure_url || data.url,
                media_type: 'image'
              }));
              showToast && showToast('जाहिरात इमेज यशस्वीपणे अपलोड झाली!', 'success');
            } else {
              setFormData(prev => ({ ...prev, video_url: base64, media_type: 'image' }));
              showToast && showToast('इमेज स्थानिकरित्या जोडली गेली', 'info');
            }
          }
        } catch (err) {
          setFormData(prev => ({ ...prev, video_url: base64, media_type: file.type.startsWith('video/') ? 'video' : 'image' }));
          showToast && showToast('इमेज लोड झाली!', 'info');
        } finally {
          setUploading(false);
          setUploadProgress('');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setUploadProgress('');
      showToast && showToast('फाईल प्रक्रिया अयशस्वी', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title_mr.trim() && !formData.title_en.trim()) {
      showToast && showToast('कृपया जाहिरातीचे शीर्षक प्रविष्ट करा', 'error');
      return;
    }
    if (!formData.video_url.trim()) {
      showToast && showToast('कृपया इमेज/व्हिडिओ अपलोड करा किंवा लिंक टाका', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingAd) {
        const res = await fetch(\`/api/promo-ads/\${editingAd.id}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const updated = await res.json();
        setAds(prev => prev.map(a => a.id === editingAd.id ? updated : a));
        showToast && showToast('जाहिरात यशस्वीपणे अपडेट केली!', 'success');
      } else {
        const res = await fetch('/api/promo-ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const created = await res.json();
        setAds(prev => [created, ...prev]);
        showToast && showToast('नवीन जाहिरात यशस्वीपणे पब्लिश केली!', 'success');
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      showToast && showToast('जाहिरात सेव्ह करताना त्रुटी आली', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (ad) => {
    try {
      const newStatus = !ad.is_active;
      const res = await fetch(\`/api/promo-ads/\${ad.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ad, is_active: newStatus })
      });
      const updated = await res.json();
      setAds(prev => prev.map(a => a.id === ad.id ? updated : a));
      showToast && showToast(newStatus ? 'जाहिरात सक्रिय केली (Active)' : 'जाहिरात निष्क्रिय केली (Inactive)', 'info');
    } catch (err) {
      showToast && showToast('स्थिती बदलताना त्रुटी आली', 'error');
    }
  };

  const handleDelete = async (ad) => {
    if (!window.confirm(\`तुम्हाला "\${ad.title_mr || ad.title_en}" ही जाहिरात कायमची हटवायची आहे का?\`)) return;
    try {
      await fetch(\`/api/promo-ads/\${ad.id}\`, { method: 'DELETE' });
      setAds(prev => prev.filter(a => a.id !== ad.id));
      showToast && showToast('जाहिरात यशस्वीपणे हटवली!', 'success');
    } catch (err) {
      showToast && showToast('हटवताना त्रुटी आली', 'error');
    }
  };

  const filteredAds = ads.filter(a => filterPlacement === 'all' || a.target_screen === filterPlacement);

  return e.jsxs('div', { className: 'space-y-6', children: [
    // Header Banner
    e.jsxs('div', { className: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4', children: [
      e.jsxs('div', { className: 'space-y-1', children: [
        e.jsxs('div', { className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-1 border border-amber-400/30', children: [
          e.jsx('span', { children: '📢' }),
          e.jsx('span', { children: 'Ad & Announcement CMS Hub' })
        ]}),
        e.jsx('h2', { className: 'text-2xl font-black tracking-tight', children: lang === 'mr' ? 'जाहिराती व सूचना नियंत्रण केंद्र' : 'Advertisements & Announcements CMS' }),
        e.jsx('p', { className: 'text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed', children: lang === 'mr' ? 'भरती जाहिराती, नवीन बॅच बॅनर्स, पोस्टर (9:16 / 16:9), आणि प्रायोजित लिंक्स अपलोड करा व थेट ॲपमध्ये दाखवा.' : 'Manage recruitment flyers, new batch promos, vertical/horizontal banners, and call-to-action cards.' })
      ]}),
      e.jsxs('button', { onClick: openCreateModal, className: 'px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition cursor-pointer flex items-center gap-2 shrink-0 active:scale-95', children: [
        e.jsx('span', { className: 'text-lg', children: '➕' }),
        e.jsx('span', { children: lang === 'mr' ? 'नवीन जाहिरात अपलोड करा' : 'Create New Advertisement' })
      ]})
    ]}),

    // Filter Bar & Stats
    e.jsxs('div', { className: 'flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs', children: [
      e.jsxs('div', { className: 'flex items-center gap-2', children: [
        e.jsx('span', { className: 'text-xs font-extrabold text-slate-700', children: lang === 'mr' ? 'स्थान फिल्टर:' : 'Placement:' }),
        e.jsxs('div', { className: 'flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0', children: [
          e.jsx('button', { onClick: () => setFilterPlacement('all'), className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${filterPlacement === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}\`, children: lang === 'mr' ? 'सर्व जाहिराती' : 'All Placements' }),
          e.jsx('button', { onClick: () => setFilterPlacement('all'), className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${filterPlacement === 'home' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}\`, children: lang === 'mr' ? 'होम स्क्रीन (Home)' : 'Home Screen' }),
          e.jsx('button', { onClick: () => setFilterPlacement('notes'), className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${filterPlacement === 'notes' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}\`, children: lang === 'mr' ? 'अभ्यास नोट्स (Notes)' : 'Study Notes' })
        ]})
      ]}),
      e.jsxs('div', { className: 'text-xs font-bold text-slate-500 flex items-center gap-3', children: [
        e.jsxs('span', { children: ['एकूण जाहिराती: ', e.jsx('strong', { className: 'text-slate-900', children: ads.length })] }),
        e.jsxs('span', { children: ['सक्रिय (Active): ', e.jsx('strong', { className: 'text-emerald-600', children: ads.filter(a => a.is_active).length })] })
      ]})
    ]}),

    // Ad Cards Grid
    loading ? e.jsxs('div', { className: 'p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border border-slate-200', children: [
      e.jsx('span', { className: 'animate-spin text-2xl', children: '🔄' }),
      e.jsx('p', { className: 'text-xs font-bold', children: 'जाहिराती लोड होत आहेत...' })
    ]}) : filteredAds.length === 0 ? e.jsxs('div', { className: 'p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3', children: [
      e.jsx('div', { className: 'text-4xl', children: '📢' }),
      e.jsx('h3', { className: 'text-base font-bold text-slate-800', children: 'कोणतीही जाहिरात अपलोड केलेली नाही' }),
      e.jsx('p', { className: 'text-xs text-slate-500 max-w-md mx-auto', children: 'वर दिलेल्या "नवीन जाहिरात अपलोड करा" बटणावर क्लिक करून भरती नोटीस, बॅनर किंवा पोस्टर जोडा.' }),
      e.jsx('button', { onClick: openCreateModal, className: 'px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700 transition', children: 'पहिली जाहिरात जोडा' })
    ]}) : e.jsx('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5', children:
      filteredAds.map(ad => e.jsxs('div', { key: ad.id, className: \`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between \${ad.is_active ? 'border-slate-200' : 'border-slate-300 bg-slate-50/70 opacity-75'}\`, children: [
        e.jsxs('div', { children: [
          // Media Thumbnail
          e.jsxs('div', { className: 'relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center group', children: [
            ad.media_type === 'video' ? e.jsx('video', { src: ad.video_url, poster: ad.thumbnail_url, className: 'w-full h-full object-cover', controls: false, muted: true }) : e.jsx('img', { src: ad.video_url || ad.image_url || '/icon.png', alt: ad.title_mr || ad.title_en, className: 'w-full h-full object-cover group-hover:scale-105 transition duration-300' }),
            e.jsxs('div', { className: 'absolute top-3 left-3 flex items-center gap-1.5', children: [
              e.jsx('span', { className: \`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider \${ad.is_active ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-700 text-slate-300'}\`, children: ad.is_active ? '✓ Active' : 'Off' }),
              e.jsx('span', { className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs border border-white/20', children: ad.aspect_ratio || '16:9' })
            ]}),
            e.jsx('div', { className: 'absolute top-3 right-3', children:
              e.jsx('span', { className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur-xs', children: ad.target_screen === 'all' ? 'All Screens' : ad.target_screen })
            })
          ]}),

          // Content info
          e.jsxs('div', { className: 'p-5 space-y-2', children: [
            e.jsx('h3', { className: 'font-extrabold text-sm text-slate-900 line-clamp-1 leading-snug', children: ad.title_mr || ad.title_en }),
            ad.title_en && ad.title_mr && e.jsx('p', { className: 'text-[11px] font-medium text-slate-500 line-clamp-1', children: ad.title_en }),
            (ad.description_mr || ad.description_en) && e.jsx('p', { className: 'text-xs text-slate-600 line-clamp-2 leading-relaxed', children: ad.description_mr || ad.description_en }),
            e.jsxs('div', { className: 'pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100', children: [
              e.jsxs('span', { className: 'font-semibold truncate max-w-[150px]', children: ['🔗 ', ad.cta_link || 'Direct Action'] }),
              e.jsx('span', { className: 'font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md', children: ad.cta_text_mr || ad.cta_text_en || 'Learn More' })
            ]})
          ]})
        ]}),

        // Action Buttons Footer
        e.jsxs('div', { className: 'p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2', children: [
          e.jsx('button', { type: 'button', onClick: () => handleToggleActive(ad), className: \`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1 \${ad.is_active ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'}\`, children: ad.is_active ? 'बंद करा (Disable)' : 'सुरू करा (Activate)' }),
          e.jsxs('div', { className: 'flex items-center gap-1.5', children: [
            e.jsx('button', { type: 'button', onClick: () => openEditModal(ad), className: 'p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer text-xs font-bold transition', title: 'Edit Ad', children: '✏️ Edit' }),
            e.jsx('button', { type: 'button', onClick: () => handleDelete(ad), className: 'p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 cursor-pointer text-xs font-bold transition', title: 'Delete Ad', children: '🗑️' })
          ]})
        ]})
      ]})
    )},

    // Create / Edit Modal
    showModal && e.jsx('div', { className: 'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150', children:
      e.jsxs('div', { className: 'bg-white rounded-3xl border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150', children: [
        // Modal Header
        e.jsxs('div', { className: 'px-6 py-4 bg-slate-900 text-white flex items-center justify-between', children: [
          e.jsxs('div', { className: 'flex items-center gap-2.5', children: [
            e.jsx('span', { className: 'text-xl', children: '📢' }),
            e.jsx('h3', { className: 'font-black text-base', children: editingAd ? 'जाहिरात संपादित करा (Edit Ad)' : 'नवीन जाहिरात / नोटीस तयार करा (Create Ad)' })
          ]}),
          e.jsx('button', { onClick: () => setShowModal(false), className: 'w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition', children: '✕' })
        ]}),

        // Modal Form
        e.jsxs('form', { onSubmit: handleSave, className: 'p-6 space-y-4 overflow-y-auto text-xs', children: [
          // Title MR & EN
          e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4', children: [
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'जाहिरात शीर्षक (मराठी) *' }),
              e.jsx('input', { type: 'text', required: true, value: formData.title_mr, onChange: ev => setFormData({ ...formData, title_mr: ev.target.value }), placeholder: 'उदा. महाराष्ट्र DHS स्टाफ नर्स भरती - विशेष बॅच', className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white' })
            ]}),
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'Title (English)' }),
              e.jsx('input', { type: 'text', value: formData.title_en, onChange: ev => setFormData({ ...formData, title_en: ev.target.value }), placeholder: 'e.g. DHS Maharashtra Staff Nurse Special Batch', className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white' })
            ]})
          ]}),

          // Description MR & EN
          e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4', children: [
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'वर्णन / हायलाइट्स (मराठी)' }),
              e.jsx('textarea', { rows: 2, value: formData.description_mr, onChange: ev => setFormData({ ...formData, description_mr: ev.target.value }), placeholder: 'उदा. सर्व १८ विषयांच्या नोट्स, १००+ टेस्ट सिरीज व थेट मार्गदर्शन मिळवा.', className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white' })
            ]}),
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'Description (English)' }),
              e.jsx('textarea', { rows: 2, value: formData.description_en, onChange: ev => setFormData({ ...formData, description_en: ev.target.value }), placeholder: 'e.g. Complete syllabus coverage with high-yield notes and test series.', className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white' })
            ]})
          ]}),

          // Media Upload & Aspect Ratio
          e.jsxs('div', { className: 'p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3', children: [
            e.jsxs('div', { className: 'flex items-center justify-between', children: [
              e.jsx('label', { className: 'font-extrabold text-slate-900', children: 'इमेज / व्हिडिओ पोस्टर अपलोड करा (Media Asset) *' }),
              e.jsxs('div', { className: 'flex items-center gap-2', children: [
                e.jsx('span', { className: 'text-slate-500', children: 'Format:' }),
                e.jsxs('select', { value: formData.aspect_ratio, onChange: ev => setFormData({ ...formData, aspect_ratio: ev.target.value }), className: 'p-1 rounded-lg bg-white border border-slate-300 font-bold', children: [
                  e.jsx('option', { value: '16:9', children: 'Horizontal Banner (16:9)' }),
                  e.jsx('option', { value: '9:16', children: 'Vertical Story / Reel (9:16)' }),
                  e.jsx('option', { value: '1:1', children: 'Square Poster (1:1)' })
                ]})
              ]})
            ]}),
            e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3', children: [
              e.jsxs('div', { children: [
                e.jsx('label', { className: 'block text-[11px] font-bold text-slate-600 mb-1', children: 'थेट डिव्हाइसवरून फाईल निवडा:' }),
                e.jsx('input', { type: 'file', accept: 'image/*,video/*', onChange: handleFileUpload, disabled: uploading, className: 'w-full p-2 bg-white rounded-xl border border-slate-200 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer' }),
                uploadProgress && e.jsx('p', { className: 'text-[11px] font-semibold text-blue-700 mt-1 animate-pulse', children: uploadProgress })
              ]}),
              e.jsxs('div', { children: [
                e.jsx('label', { className: 'block text-[11px] font-bold text-slate-600 mb-1', children: 'किंवा इमेज / व्हिडिओ URL टाका:' }),
                e.jsx('input', { type: 'text', value: formData.video_url, onChange: ev => setFormData({ ...formData, video_url: ev.target.value }), placeholder: 'https://res.cloudinary.com/... or image link', className: 'w-full p-2.5 bg-white rounded-xl border border-slate-200 text-slate-900 font-mono text-[11px]' })
              ]})
            ]}),
            formData.video_url && e.jsxs('div', { className: 'flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200', children: [
              e.jsx('img', { src: formData.video_url, alt: 'Preview', className: 'w-14 h-10 object-cover rounded-lg bg-slate-100' }),
              e.jsxs('div', { className: 'truncate flex-1', children: [
                e.jsx('span', { className: 'font-bold text-emerald-700 block', children: '✓ Media Attached' }),
                e.jsx('span', { className: 'text-[10px] text-slate-400 font-mono truncate block', children: formData.video_url })
              ]})
            ]})
          ]}),

          // CTA Details
          e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4', children: [
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'बटन मजकूर (Button Text Marathi)' }),
              e.jsx('input', { type: 'text', value: formData.cta_text_mr, onChange: ev => setFormData({ ...formData, cta_text_mr: ev.target.value }), placeholder: 'उदा. ऑनलाईन अर्ज करा / बॅच मिळवा', className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white' })
            ]}),
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'बटन लिंक / ॲक्शन (CTA Target Screen or URL)' }),
              e.jsx('input', { type: 'text', value: formData.cta_link, onChange: ev => setFormData({ ...formData, cta_link: ev.target.value }), placeholder: 'upgrade-pro, mock-tests, materials, or https://...', className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white' })
            ]})
          ]}),

          // Placement & Active Toggle
          e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100', children: [
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'जाहिरात स्थान (Target Placement)' }),
              e.jsxs('select', { value: formData.target_screen, onChange: ev => setFormData({ ...formData, target_screen: ev.target.value }), className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900', children: [
                e.jsx('option', { value: 'all', children: 'सर्वत्र (All Screens & Carousel)' }),
                e.jsx('option', { value: 'home', children: 'होम स्क्रीन टॉप बॅनर (Home Screen)' }),
                e.jsx('option', { value: 'notes', children: 'अभ्यास नोट्स पेज (Study Notes)' }),
                e.jsx('option', { value: 'popup', children: 'पॉपअप नोटीस (Popup Alert)' })
              ]})
            ]}),
            e.jsxs('div', { className: 'flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 self-end', children: [
              e.jsxs('div', { children: [
                e.jsx('span', { className: 'font-bold text-slate-900 block', children: 'सक्रिय स्थिती (Status)' }),
                e.jsx('span', { className: 'text-[11px] text-slate-500', children: formData.is_active ? 'ॲपमध्ये लगेच दिसेल' : 'लपवून ठेवा (Draft)' })
              ]}),
              e.jsx('button', { type: 'button', onClick: () => setFormData(prev => ({ ...prev, is_active: !prev.is_active })), className: \`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition \${formData.is_active ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}\`, children: formData.is_active ? 'Active ✓' : 'Inactive' })
            ]})
          ]}),

          // Submit footer
          e.jsxs('div', { className: 'pt-3 border-t border-slate-100 flex items-center justify-end gap-3', children: [
            e.jsx('button', { type: 'button', onClick: () => setShowModal(false), className: 'px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition', children: 'रद्द करा (Cancel)' }),
            e.jsxs('button', { type: 'submit', disabled: saving || uploading, className: 'px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black cursor-pointer shadow-md transition disabled:opacity-50 flex items-center gap-1.5', children: [
              saving && e.jsx('span', { className: 'animate-spin', children: '🔄' }),
              e.jsx('span', { children: saving ? 'सेव्ह होत आहे...' : editingAd ? '💾 बदल सेव्ह करा (Update)' : '🚀 जाहिरात पब्लिश करा (Publish Ad)' })
            ]})
          ]})
        ]})
      ]})
    )
  ]});
};
`;

// Replace sT with EnhancedAdManager
if (!code.includes("const EnhancedAdManager =")) {
  code = code.replace("const Z9=", EnhancedAdManagerCode + "\nconst Z9=");
}
code = code.replace(/h==="promo_ads"&&e\.jsx\(sT,\{showToast:Rt\}\)/g, 'h==="promo_ads"&&e.jsx(EnhancedAdManager,{showToast:Rt})');


// -------------------------------------------------------------
// 2. ENHANCED STUDY MATERIALS & NOTES CMS (Admin + JSON Upload)
// -------------------------------------------------------------
const EnhancedNotesCmsCode = `
const EnhancedNotesCms = ({ materials, subjects, onRefresh, showToast }) => {
  const { language: lang } = Ds();
  const [showAddModal, setShowAddModal] = k.useState(false);
  const [showSubjectModal, setShowSubjectModal] = k.useState(false);
  const [uploadingJson, setUploadingJson] = k.useState(false);
  const [editingNote, setEditingNote] = k.useState(null);
  const [filterSubject, setFilterSubject] = k.useState('all');
  const [filterType, setFilterType] = k.useState('all');
  const [searchQuery, setSearchQuery] = k.useState('');
  const [saving, setSaving] = k.useState(false);

  // Subject creation state
  const [newSubject, setNewSubject] = k.useState({
    name_mr: '',
    name_en: '',
    code: '',
    description_mr: '',
    description_en: '',
    category: 'core_nursing',
    icon_name: 'BookOpen',
    color: 'teal',
    is_active: true
  });

  // Note form state
  const [noteForm, setNoteForm] = k.useState({
    title_mr: '',
    title_en: '',
    description_mr: '',
    description_en: '',
    content_mr: '',
    subject_id: (subjects && subjects[0]?.id) || 'subj-peds',
    category: 'notes',
    exam: 'AIIMS NORCET, ESIC & DHS/DMER महाराष्ट्र',
    is_free: true,
    price_inr: 0,
    author: 'MH Nursing Academy',
    source: 'INC Standard Protocol / MoHFW',
    read_time_minutes: 8,
    tags: 'High Yield, Nursing Notes',
    summary_points: '',
    clinical_tips: '',
    mnemonics: '',
    file_url: ''
  });

  const openNewNoteModal = () => {
    setEditingNote(null);
    setNoteForm({
      title_mr: '',
      title_en: '',
      description_mr: '',
      description_en: '',
      content_mr: '',
      subject_id: (subjects && subjects[0]?.id) || 'subj-peds',
      category: 'notes',
      exam: 'AIIMS NORCET, ESIC & DHS/DMER महाराष्ट्र',
      is_free: true,
      price_inr: 0,
      author: 'MH Nursing Academy',
      source: 'INC Standard Protocol / MoHFW',
      read_time_minutes: 8,
      tags: 'High Yield, Nursing Notes',
      summary_points: '',
      clinical_tips: '',
      mnemonics: '',
      file_url: ''
    });
    setShowAddModal(true);
  };

  const openEditNoteModal = (note) => {
    setEditingNote(note);
    setNoteForm({
      title_mr: note.title_mr || note.title || '',
      title_en: note.title_en || note.title || '',
      description_mr: note.description_mr || note.description || '',
      description_en: note.description_en || note.description || '',
      content_mr: note.content_mr || note.content || '',
      subject_id: note.subject_id || (subjects && subjects[0]?.id) || 'subj-peds',
      category: note.category || 'notes',
      exam: note.exam || 'AIIMS NORCET / महाराष्ट्र नर्सिंग',
      is_free: note.is_free !== undefined ? note.is_free : (note.price_inr === 0 || !note.is_premium),
      price_inr: note.price_inr !== undefined ? note.price_inr : (note.is_free ? 0 : 49),
      author: note.author || 'MH Nursing Academy',
      source: note.source || 'INC Standard Protocol',
      read_time_minutes: note.read_time_minutes || 8,
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : (note.tags || ''),
      summary_points: Array.isArray(note.summary_points) ? note.summary_points.join('\\n') : (note.summary_points || ''),
      clinical_tips: note.clinical_tips || '',
      mnemonics: note.mnemonics || '',
      file_url: note.file_url || ''
    });
    setShowAddModal(true);
  };

  const handleJsonFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingJson(true);
    try {
      const text = await file.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        showToast && showToast('अवैध JSON फाईल फॉरमॅट / Invalid JSON format', 'error');
        setUploadingJson(false);
        return;
      }
      const notesArray = Array.isArray(parsed) ? parsed : (parsed.notes || [parsed]);
      const res = await fetch('/api/admin/study-materials/bulk-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesArray })
      });
      const result = await res.json();
      if (result.success) {
        showToast && showToast(\`🚀 \${result.imported} नवीन नोट्स व \${result.updated} अपडेटेड नोट्स यशस्वीपणे जोडल्या!\`, 'success');
        onRefresh && onRefresh();
      } else {
        showToast && showToast(result.error || 'अपलोड अयशस्वी', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast && showToast('JSON अपलोड करताना अडचण आली', 'error');
    } finally {
      setUploadingJson(false);
      e.target.value = '';
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteForm.title_mr.trim() && !noteForm.title_en.trim()) {
      showToast && showToast('कृपया नोट्सचे शीर्षक प्रविष्ट करा', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...noteForm,
        title: noteForm.title_mr || noteForm.title_en,
        tags: noteForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        summary_points: noteForm.summary_points.split('\\n').map(p => p.trim()).filter(Boolean),
        price_inr: noteForm.is_free ? 0 : Number(noteForm.price_inr || 49),
        is_premium: !noteForm.is_free
      };

      if (editingNote) {
        const res = await fetch(\`/api/admin/study-materials/\${editingNote.id}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const updated = await res.json();
        showToast && showToast('नोट्स यशस्वीपणे अपडेट केल्या!', 'success');
      } else {
        const res = await fetch('/api/admin/study-materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const created = await res.json();
        showToast && showToast('नवीन अभ्यास नोट्स यशस्वीपणे पब्लिश केल्या!', 'success');
      }
      setShowAddModal(false);
      onRefresh && onRefresh();
    } catch (err) {
      console.error(err);
      showToast && showToast('नोट्स सेव्ह करताना त्रुटी आली', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNewSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.name_mr.trim() || !newSubject.name_en.trim()) {
      showToast && showToast('कृपया मराठी व इंग्रजी नाव दोन्ही भरा', 'error');
      return;
    }
    try {
      const subId = newSubject.code ? \`subj-\${newSubject.code.toLowerCase()}\` : \`subj-\${Date.now()}\`;
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSubject, id: subId })
      });
      const data = await res.json();
      showToast && showToast(\`नवीन विषय "\${newSubject.name_mr}" यशस्वीपणे जोडला!\`, 'success');
      setShowSubjectModal(false);
      setNewSubject({
        name_mr: '',
        name_en: '',
        code: '',
        description_mr: '',
        description_en: '',
        category: 'core_nursing',
        icon_name: 'BookOpen',
        color: 'teal',
        is_active: true
      });
      onRefresh && onRefresh();
    } catch (err) {
      showToast && showToast('विषय सेव्ह करताना त्रुटी आली', 'error');
    }
  };

  const handleDeleteNote = async (note) => {
    if (!window.confirm(\`तुम्हाला "\${note.title_mr || note.title}" ही नोट कायमची हटवायची आहे का?\`)) return;
    try {
      await fetch(\`/api/admin/study-materials/\${note.id}\`, { method: 'DELETE' });
      showToast && showToast('नोट्स यशस्वीपणे हटवली!', 'success');
      onRefresh && onRefresh();
    } catch (err) {
      showToast && showToast('हटवताना त्रुटी आली', 'error');
    }
  };

  const getSubjectName = (subId) => {
    const sub = (subjects || []).find(s => s.id === subId);
    return sub ? (lang === 'mr' ? sub.name_mr : sub.name_en) : subId;
  };

  const filteredMaterials = (materials || []).filter(m => {
    const titleMatch = (m.title_mr || m.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (m.title_en || m.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (m.description_mr || '').toLowerCase().includes(searchQuery.toLowerCase());
    const subjectMatch = filterSubject === 'all' || m.subject_id === filterSubject;
    const typeMatch = filterType === 'all' || (filterType === 'free' ? m.is_free : !m.is_free);
    return titleMatch && subjectMatch && typeMatch;
  });

  return e.jsxs('div', { className: 'space-y-6', children: [
    // Header
    e.jsxs('div', { className: 'bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-md border border-teal-800/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4', children: [
      e.jsxs('div', { className: 'space-y-1', children: [
        e.jsxs('div', { className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold mb-1 border border-teal-400/30', children: [
          e.jsx('span', { children: '📚' }),
          e.jsx('span', { children: 'Study Notes & Materials CMS Engine' })
        ]}),
        e.jsx('h2', { className: 'text-2xl font-black tracking-tight', children: lang === 'mr' ? 'अभ्यास नोट्स व विषय व्यवस्थापन' : 'Study Notes & Subject Management' }),
        e.jsx('p', { className: 'text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed', children: lang === 'mr' ? 'JSON फाईल अपलोड करा, मोफत किंवा सशुल्क दर ठरवा, नवीन विषय जोडा आणि विद्यार्थ्यांना एकदम आकर्षक मराठी नोट्स उपलब्ध करून द्या.' : 'Bulk upload JSON notes, set free/paid prices, manage dynamic subjects, and publish rich high-yield study materials.' })
      ]}),

      // Action Buttons
      e.jsxs('div', { className: 'flex flex-wrap items-center gap-2.5 shrink-0', children: [
        // JSON Upload Button
        e.jsxs('label', { className: 'px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition active:scale-95', children: [
          uploadingJson ? e.jsx('span', { className: 'animate-spin', children: '🔄' }) : e.jsx('span', { children: '📥' }),
          e.jsx('span', { children: uploadingJson ? 'अपलोड होत आहे...' : (lang === 'mr' ? 'JSON नोट्स फाईल अपलोड' : 'Upload Notes JSON') }),
          e.jsx('input', { type: 'file', accept: '.json', onChange: handleJsonFileUpload, disabled: uploadingJson, className: 'hidden' })
        ]}),

        // Download Template Button
        e.jsxs('a', { href: '/api/admin/study-materials/sample-json', download: 'nursing-notes-sample-template.json', className: 'px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer', children: [
          e.jsx('span', { children: '📄' }),
          e.jsx('span', { children: lang === 'mr' ? 'नमुना JSON' : 'Sample JSON' })
        ]}),

        // Add Subject Button
        e.jsxs('button', { onClick: () => setShowSubjectModal(true), className: 'px-3.5 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer', children: [
          e.jsx('span', { children: '➕' }),
          e.jsx('span', { children: lang === 'mr' ? 'नवीन विषय' : 'Add Subject' })
        ]}),

        // Add Single Note Button
        e.jsxs('button', { onClick: openNewNoteModal, className: 'px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer active:scale-95', children: [
          e.jsx('span', { children: '✍️' }),
          e.jsx('span', { children: lang === 'mr' ? 'नवीन नोट्स लिहा' : 'Create Note' })
        ]})
      ]})
    ]}),

    // Filter & Search Controls
    e.jsxs('div', { className: 'bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3', children: [
      e.jsxs('div', { className: 'sm:col-span-5 relative', children: [
        e.jsx('span', { className: 'absolute left-3.5 top-3 text-slate-400', children: '🔍' }),
        e.jsx('input', { type: 'text', value: searchQuery, onChange: ev => setSearchQuery(ev.target.value), placeholder: lang === 'mr' ? 'शीर्षक किंवा विषयानुसार शोधा...' : 'Search notes by title or keyword...', className: 'w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white' })
      ]}),
      e.jsx('div', { className: 'sm:col-span-4', children:
        e.jsxs('select', { value: filterSubject, onChange: ev => setFilterSubject(ev.target.value), className: 'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500', children: [
          e.jsx('option', { value: 'all', children: lang === 'mr' ? 'सर्व विषय (All Subjects)' : 'All Subjects' }),
          (subjects || []).map(s => e.jsx('option', { key: s.id, value: s.id, children: lang === 'mr' ? s.name_mr : s.name_en }))
        ]})
      ),
      e.jsx('div', { className: 'sm:col-span-3', children:
        e.jsxs('select', { value: filterType, onChange: ev => setFilterType(ev.target.value), className: 'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500', children: [
          e.jsx('option', { value: 'all', children: lang === 'mr' ? 'सर्व दर (All Pricing)' : 'All Pricing' }),
          e.jsx('option', { value: 'free', children: lang === 'mr' ? 'मोफत नोट्स (Free)' : 'Free Notes' }),
          e.jsx('option', { value: 'paid', children: lang === 'mr' ? 'सशुल्क नोट्स (Paid / PRO)' : 'Paid / PRO' })
        ]})
      )
    ]}),

    // Notes List
    filteredMaterials.length === 0 ? e.jsxs('div', { className: 'p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3', children: [
      e.jsx('div', { className: 'text-4xl', children: '📝' }),
      e.jsx('h3', { className: 'text-base font-bold text-slate-800', children: 'कोणत्याही अभ्यास नोट्स सापडल्या नाहीत' }),
      e.jsx('p', { className: 'text-xs text-slate-500 max-w-md mx-auto', children: 'वरील "JSON नोट्स फाईल अपलोड" बटण वापरा किंवा "नवीन नोट्स लिहा" वर क्लिक करा.' })
    ]}) : e.jsx('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4', children:
      filteredMaterials.map(note => e.jsxs('div', { key: note.id, className: 'bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between', children: [
        e.jsxs('div', { className: 'space-y-2.5', children: [
          e.jsxs('div', { className: 'flex items-center justify-between gap-2', children: [
            e.jsx('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200', children: getSubjectName(note.subject_id) }),
            note.is_free ? e.jsx('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300', children: 'मोफत (Free)' }) : e.jsxs('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1', children: [
              e.jsx('span', { children: '💎' }),
              e.jsx('span', { children: \`₹\${note.price_inr || 49} (Paid)\` })
            ]})
          ]}),
          e.jsx('h3', { className: 'font-black text-slate-900 text-base leading-snug', children: note.title_mr || note.title }),
          note.title_en && note.title_mr && e.jsx('p', { className: 'text-xs font-semibold text-slate-500', children: note.title_en }),
          (note.description_mr || note.description) && e.jsx('p', { className: 'text-xs text-slate-600 line-clamp-2 leading-relaxed', children: note.description_mr || note.description }),
          note.clinical_tips && e.jsxs('div', { className: 'p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium', children: [
            e.jsx('strong', { className: 'text-amber-950', children: '🩺 क्लिनिकल टीप: ' }),
            note.clinical_tips
          ]}),
          note.mnemonics && e.jsxs('div', { className: 'p-2 bg-indigo-50/80 rounded-xl border border-indigo-200 text-[11px] text-indigo-900 font-medium', children: [
            e.jsx('strong', { className: 'text-indigo-950', children: '🧠 स्मरण क्लृप्ती: ' }),
            note.mnemonics
          ]})
        ]}),

        e.jsxs('div', { className: 'pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500', children: [
          e.jsxs('span', { className: 'text-[11px]', children: ['⏱️ ', note.read_time_minutes || 8, ' मि. वाचन'] }),
          e.jsxs('div', { className: 'flex items-center gap-2', children: [
            e.jsx('button', { type: 'button', onClick: () => openEditNoteModal(note), className: 'px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition', children: '✏️ संपादन' }),
            e.jsx('button', { type: 'button', onClick: () => handleDeleteNote(note), className: 'px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer transition border border-rose-200', children: '🗑️ डिलीट' })
          ]})
        ]})
      ]}))
    ),

    // Add / Edit Note Modal
    showAddModal && e.jsx('div', { className: 'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150', children:
      e.jsxs('div', { className: 'bg-white rounded-3xl border border-slate-200 max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150', children: [
        e.jsxs('div', { className: 'px-6 py-4 bg-slate-900 text-white flex items-center justify-between', children: [
          e.jsxs('div', { className: 'flex items-center gap-2', children: [
            e.jsx('span', { className: 'text-xl', children: '📝' }),
            e.jsx('h3', { className: 'font-black text-base', children: editingNote ? 'अभ्यास नोट्स संपादित करा (Edit Notes)' : 'नवीन अभ्यास नोट्स लिहा (Write Study Notes)' })
          ]}),
          e.jsx('button', { onClick: () => setShowAddModal(false), className: 'w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition', children: '✕' })
        ]}),

        e.jsxs('form', { onSubmit: handleSaveNote, className: 'p-6 space-y-4 overflow-y-auto text-xs', children: [
          // Title MR & EN
          e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4', children: [
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'नोट्स शीर्षक (मराठी) *' }),
              e.jsx('input', { type: 'text', required: true, value: noteForm.title_mr, onChange: ev => setNoteForm({ ...noteForm, title_mr: ev.target.value }), placeholder: 'उदा. बालरोग शुश्रूषा - राष्ट्रीय लसीकरण वेळापत्रक', className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white' })
            ]}),
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'Title (English)' }),
              e.jsx('input', { type: 'text', value: noteForm.title_en, onChange: ev => setNoteForm({ ...noteForm, title_en: ev.target.value }), placeholder: 'e.g. National Immunization Schedule 2025-26', className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white' })
            ]})
          ]}),

          // Subject & Category
          e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4', children: [
            e.jsxs('div', { children: [
              e.jsxs('div', { className: 'flex items-center justify-between mb-1', children: [
                e.jsx('label', { className: 'font-bold text-slate-800', children: 'विषय निवडा (Subject) *' }),
                e.jsx('button', { type: 'button', onClick: () => setShowSubjectModal(true), className: 'text-[11px] text-teal-700 font-bold hover:underline cursor-pointer', children: '+ नवीन विषय जोडा' })
              ]}),
              e.jsx('select', { value: noteForm.subject_id, onChange: ev => setNoteForm({ ...noteForm, subject_id: ev.target.value }), className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-teal-500', children:
                (subjects || []).map(s => e.jsx('option', { key: s.id, value: s.id, children: \`\${s.name_mr} (\${s.name_en})\` }))
              })
            ]}),
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'प्रकार (Category)' }),
              e.jsxs('select', { value: noteForm.category, onChange: ev => setNoteForm({ ...noteForm, category: ev.target.value }), className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900', children: [
                e.jsx('option', { value: 'notes', children: 'अभ्यास नोट्स (Study Notes)' }),
                e.jsx('option', { value: 'clinical_guide', children: 'क्लिनिकल मार्गदर्शक (Clinical Protocol)' }),
                e.jsx('option', { value: 'formula_sheet', children: 'फॉर्म्युला शीट (Formula Sheet)' }),
                e.jsx('option', { value: 'summary_pdf', children: 'सारांश PDF (Summary Reference)' })
              ]})
            ]})
          ]}),

          // Free vs Paid Pricing Controls
          e.jsxs('div', { className: 'p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3', children: [
            e.jsx('h4', { className: 'font-black text-amber-950 text-xs', children: 'दर आणि ॲक्सेस सेटिंग (Free vs Paid Pricing)' }),
            e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4 items-center', children: [
              e.jsxs('div', { className: 'flex items-center gap-3', children: [
                e.jsx('button', { type: 'button', onClick: () => setNoteForm({ ...noteForm, is_free: true, price_inr: 0 }), className: \`flex-1 py-2.5 rounded-xl font-black text-xs transition cursor-pointer \${noteForm.is_free ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'}\`, children: '✓ मोफत ठेवा (Free Access)' }),
                e.jsx('button', { type: 'button', onClick: () => setNoteForm({ ...noteForm, is_free: false, price_inr: noteForm.price_inr || 49 }), className: \`flex-1 py-2.5 rounded-xl font-black text-xs transition cursor-pointer \${!noteForm.is_free ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-white border border-slate-200 text-slate-700'}\`, children: '💎 सशुल्क दर ठेवा (Paid / PRO)' })
              ]}),
              !noteForm.is_free && e.jsxs('div', { className: 'flex items-center gap-2', children: [
                e.jsx('label', { className: 'font-bold text-amber-950 whitespace-nowrap', children: 'किंमत (₹ INR):' }),
                e.jsx('input', { type: 'number', min: 1, value: noteForm.price_inr, onChange: ev => setNoteForm({ ...noteForm, price_inr: Number(ev.target.value) }), placeholder: '49', className: 'w-24 p-2 bg-white rounded-xl border border-amber-300 font-mono font-bold text-sm text-slate-900' })
              ]})
            ]})
          ]}),

          // Rich Marathi Content
          e.jsxs('div', { children: [
            e.jsxs('div', { className: 'flex justify-between items-center mb-1', children: [
              e.jsx('label', { className: 'font-bold text-slate-800', children: 'संपूर्ण मराठी अभ्यास नोट्स मजकूर (Rich Markdown Content) *' }),
              e.jsx('span', { className: 'text-[11px] text-slate-400', children: 'Supports ## Headings, - Bullets, **Bold**' })
            ]}),
            e.jsx('textarea', { rows: 8, required: true, value: noteForm.content_mr, onChange: ev => setNoteForm({ ...noteForm, content_mr: ev.target.value }), placeholder: '## १. मुख्य मुद्दे\\n- लस आणि डोस...\\n- परिचारिका कृती...', className: 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white leading-relaxed' })
          ]}),

          // Key Points, Clinical Tips, Mnemonics
          e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3', children: [
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: '💡 महत्त्वाचे मुद्दे (Line by line)' }),
              e.jsx('textarea', { rows: 2, value: noteForm.summary_points, onChange: ev => setNoteForm({ ...noteForm, summary_points: ev.target.value }), placeholder: 'मुद्दा १...\\nमुद्दा २...', className: 'w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs' })
            ]}),
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: '🩺 क्लिनिकल टीप (Clinical Pearl)' }),
              e.jsx('textarea', { rows: 2, value: noteForm.clinical_tips, onChange: ev => setNoteForm({ ...noteForm, clinical_tips: ev.target.value }), placeholder: 'नर्सिंग खबरदारी...', className: 'w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs' })
            ]}),
            e.jsxs('div', { children: [
              e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: '🧠 स्मरण क्लृप्ती (Mnemonic)' }),
              e.jsx('textarea', { rows: 2, value: noteForm.mnemonics, onChange: ev => setNoteForm({ ...noteForm, mnemonics: ev.target.value }), placeholder: 'उदा. B-O-H for birth vaccines', className: 'w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs' })
            ]})
          ]}),

          // Submit footer
          e.jsxs('div', { className: 'pt-3 border-t border-slate-100 flex items-center justify-end gap-3', children: [
            e.jsx('button', { type: 'button', onClick: () => setShowAddModal(false), className: 'px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition', children: 'रद्द करा (Cancel)' }),
            e.jsxs('button', { type: 'submit', disabled: saving, className: 'px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black cursor-pointer shadow-md transition disabled:opacity-50 flex items-center gap-1.5', children: [
              saving && e.jsx('span', { className: 'animate-spin', children: '🔄' }),
              e.jsx('span', { children: saving ? 'सेव्ह होत आहे...' : editingNote ? '💾 बदल सेव्ह करा (Update)' : '🚀 नोट्स पब्लिश करा (Publish Note)' })
            ]})
          ]})
        ]})
      ]})
    ),

    // Add Subject Modal
    showSubjectModal && e.jsx('div', { className: 'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150', children:
      e.jsxs('div', { className: 'bg-white rounded-3xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150', children: [
        e.jsxs('div', { className: 'flex items-center justify-between border-b border-slate-100 pb-3', children: [
          e.jsxs('div', { className: 'flex items-center gap-2 font-black text-slate-900 text-sm', children: [
            e.jsx('span', { className: 'text-lg', children: '📚' }),
            e.jsx('h3', { children: 'नवीन विषय जोडा (Add New Subject)' })
          ]}),
          e.jsx('button', { onClick: () => setShowSubjectModal(false), className: 'text-slate-400 hover:text-slate-600 font-bold', children: '✕' })
        ]}),
        e.jsxs('form', { onSubmit: handleSaveNewSubject, className: 'space-y-3 text-xs', children: [
          e.jsxs('div', { children: [
            e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'विषयाचे नाव (मराठी) *' }),
            e.jsx('input', { type: 'text', required: true, value: newSubject.name_mr, onChange: ev => setNewSubject({ ...newSubject, name_mr: ev.target.value }), placeholder: 'उदा. मानसिक आरोग्य शुश्रूषा', className: 'w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold' })
          ]}),
          e.jsxs('div', { children: [
            e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'Subject Name (English) *' }),
            e.jsx('input', { type: 'text', required: true, value: newSubject.name_en, onChange: ev => setNewSubject({ ...newSubject, name_en: ev.target.value }), placeholder: 'e.g. Mental Health Nursing', className: 'w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold' })
          ]}),
          e.jsxs('div', { children: [
            e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'Subject Code (Optional)' }),
            e.jsx('input', { type: 'text', value: newSubject.code, onChange: ev => setNewSubject({ ...newSubject, code: ev.target.value }), placeholder: 'e.g. MHN', className: 'w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono' })
          ]}),
          e.jsxs('div', { className: 'flex items-center justify-end gap-2 pt-2 border-t border-slate-100', children: [
            e.jsx('button', { type: 'button', onClick: () => setShowSubjectModal(false), className: 'px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer', children: 'रद्द करा' }),
            e.jsx('button', { type: 'submit', className: 'px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-black shadow-xs transition cursor-pointer', children: 'विषय सेव्ह करा' })
          ]})
        ]})
      ]})
    )
  ]});
};
`;

// Replace QE with EnhancedNotesCms
if (!code.includes("const EnhancedNotesCms =")) {
  code = code.replace("const Z9=", EnhancedNotesCmsCode + "\nconst Z9=");
}
code = code.replace(/h==="study_materials"&&e\.jsx\(QE,\{materials:je,subjects:N,onRefresh:cs,showToast:Rt\}\)/g, 'h==="study_materials"&&e.jsx(EnhancedNotesCms,{materials:je,subjects:N,onRefresh:cs,showToast:Rt})');


// -------------------------------------------------------------
// 3. ENHANCED STUDENT STUDY NOTES READER (W9)
// -------------------------------------------------------------
const EnhancedStudentNotesCode = `
const EnhancedStudentNotes = ({ onUpgradePro }) => {
  const { language: lang } = Ds();
  const { currentUser: user } = er();
  const isAdmin = (user?.role === 'admin' || user?.role === 'super_admin');
  const isPro = Boolean(user?.isPremium || isAdmin);

  const [materials, setMaterials] = k.useState([]);
  const [subjects, setSubjects] = k.useState([]);
  const [promoAds, setPromoAds] = k.useState([]);
  const [loading, setLoading] = k.useState(true);
  const [searchQuery, setSearchQuery] = k.useState('');
  const [selectedSubject, setSelectedSubject] = k.useState('all');
  const [selectedCategory, setSelectedCategory] = k.useState('all');
  const [activeNote, setActiveNote] = k.useState(null);
  const [fontSize, setFontSize] = k.useState('base'); // sm, base, lg, xl
  const [readerTheme, setReaderTheme] = k.useState('light'); // light, sepia, dark

  k.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mats, subs, ads] = await Promise.all([
          Pe.getStudyMaterials(),
          Pe.getSubjects(),
          Pe.getPromoAds ? Pe.getPromoAds({ is_active: true, target_screen: 'notes' }) : Promise.resolve([])
        ]);
        setMaterials(mats || []);
        setSubjects(subs || []);
        setPromoAds(Array.isArray(ads) ? ads : []);
      } catch (err) {
        console.error('Failed to load notes data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredNotes = materials.filter(m => {
    const titleMR = m.title_mr || m.title || '';
    const titleEN = m.title_en || m.title || '';
    const descMR = m.description_mr || m.description || '';
    const searchLow = searchQuery.toLowerCase();
    const matchesSearch = titleMR.toLowerCase().includes(searchLow) ||
                          titleEN.toLowerCase().includes(searchLow) ||
                          descMR.toLowerCase().includes(searchLow);
    const matchesSubject = selectedSubject === 'all' || m.subject_id === selectedSubject;
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesSubject && matchesCategory;
  });

  const getSubjectName = (subId) => {
    const sub = (subjects || []).find(s => s.id === subId);
    return sub ? (lang === 'mr' ? sub.name_mr : sub.name_en) : 'नर्सिंग अभ्यास';
  };

  const handleOpenNote = (note) => {
    setActiveNote(note);
  };

  // Helper to render markdown content beautifully with styled sections
  const renderFormattedNoteContent = (content) => {
    if (!content) return e.jsx('p', { className: 'text-slate-500 italic', children: 'या नोट्सचे विस्तृत विश्लेषण लवकरच उपलब्ध होईल.' });

    const lines = content.split('\\n');
    return e.jsx('div', { className: 'space-y-4 leading-relaxed font-sans', children:
      lines.map((line, idx) => {
        if (line.startsWith('## ')) {
          return e.jsx('h2', { key: idx, className: 'text-lg sm:text-xl font-black text-slate-900 mt-6 mb-3 pb-2 border-b-2 border-teal-500 flex items-center gap-2', children: line.replace('## ', '') });
        }
        if (line.startsWith('### ')) {
          return e.jsx('h3', { key: idx, className: 'text-base font-extrabold text-teal-900 mt-4 mb-2 bg-teal-50/80 p-2.5 rounded-xl border-l-4 border-teal-600', children: line.replace('### ', '') });
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
          const text = line.replace(/^[\*\-]\s+/, '');
          return e.jsxs('div', { key: idx, className: 'flex items-start gap-2 text-slate-800 pl-2', children: [
            e.jsx('span', { className: 'text-teal-600 font-bold shrink-0 mt-0.5', children: '•' }),
            e.jsx('span', { className: 'text-xs sm:text-sm', dangerouslySetInnerHTML: { __html: text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>') } })
          ]});
        }
        if (line.startsWith('|') && line.endsWith('|')) {
          // simple table line
          return e.jsx('div', { key: idx, className: 'text-xs font-mono bg-slate-50 p-2 rounded border border-slate-200 overflow-x-auto my-1', children: line });
        }
        if (line.trim() === '---') {
          return e.jsx('hr', { key: idx, className: 'my-4 border-slate-200' });
        }
        if (line.trim()) {
          return e.jsx('p', { key: idx, className: 'text-xs sm:text-sm text-slate-700 leading-relaxed', dangerouslySetInnerHTML: { __html: line.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>') } });
        }
        return null;
      })
    });
  };

  return e.jsxs('div', { className: 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-150', children: [
    // Hero Header
    e.jsxs('div', { className: 'bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-800/40', children: [
      e.jsx('div', { className: 'absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none' }),
      e.jsxs('div', { className: 'relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6', children: [
        e.jsxs('div', { className: 'space-y-2', children: [
          e.jsxs('div', { className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold border border-teal-400/30 backdrop-blur-xs', children: [
            e.jsx('span', { children: '📖' }),
            e.jsx('span', { children: lang === 'mr' ? 'प्रमाणित मराठी अभ्यास नोट्स व क्लिनिकल सूत्रे' : 'Official Marathi Study Notes & Clinical Formulas' })
          ]}),
          e.jsx('h1', { className: 'text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white', children: lang === 'mr' ? 'नर्सिंग ऑफिसर अभ्यास नोट्स व क्लिनिकल चार्ट्स' : 'Nursing Officer Study Notes Library' }),
          e.jsx('p', { className: 'text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed', children: lang === 'mr' ? 'AIIMS NORCET, ESIC, DHS/DMER महाराष्ट्र भरतीसाठी उच्च प्राधान्य बालरोग लस वेळापत्रक, आणीबाणी औषधे, GCS स्केल, पार्कलँड फॉर्म्युला व बायोमेडिकल वेस्ट नोट्स.' : 'High-yield pediatric immunization schedules, emergency antidotes, Parkland burns formulas, and Glasgow Coma Scale protocols.' })
        ]}),
        !isPro && e.jsxs('button', { onClick: onUpgradePro, className: 'px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0 active:scale-95', children: [
          e.jsx('span', { className: 'text-lg', children: '💎' }),
          e.jsx('span', { children: lang === 'mr' ? 'सर्व प्रीमियम नोट्स अनलॉक करा (PRO)' : 'Unlock All PRO Notes' })
        ]})
      ]})
    ]}),

    // Promotional Sponsor Banner (if available)
    promoAds && promoAds.length > 0 && e.jsx('div', { className: 'relative rounded-2xl overflow-hidden shadow-md border border-slate-200 group cursor-pointer', onClick: () => promoAds[0].cta_link && (promoAds[0].cta_link.startsWith('http') ? window.open(promoAds[0].cta_link, '_blank') : onUpgradePro()), children:
      e.jsxs('div', { className: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4', children: [
        e.jsxs('div', { className: 'flex items-center gap-3.5', children: [
          e.jsx('div', { className: 'w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0', children: '📢' }),
          e.jsxs('div', { children: [
            e.jsx('span', { className: 'text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full', children: promoAds[0].sponsor_tag || 'Special Notice' }),
            e.jsx('h3', { className: 'font-black text-sm sm:text-base mt-0.5 text-white', children: promoAds[0].title_mr || promoAds[0].title_en }),
            (promoAds[0].description_mr || promoAds[0].description_en) && e.jsx('p', { className: 'text-xs text-white/90 line-clamp-1', children: promoAds[0].description_mr || promoAds[0].description_en })
          ]})
        ]}),
        e.jsxs('span', { className: 'px-4 py-2 bg-slate-950 text-white rounded-xl font-bold text-xs shrink-0 shadow-md group-hover:scale-105 transition flex items-center gap-1.5', children: [
          e.jsx('span', { children: promoAds[0].cta_text_mr || promoAds[0].cta_text_en || 'अधिक माहिती पहा' }),
          e.jsx('span', { children: '→' })
        ]})
      ]})
    }),

    // Subject Pills & Search Filter
    e.jsxs('div', { className: 'bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3.5', children: [
      // Search Box
      e.jsxs('div', { className: 'relative', children: [
        e.jsx('span', { className: 'absolute left-3.5 top-3.5 text-slate-400 text-sm', children: '🔍' }),
        e.jsx('input', { type: 'text', value: searchQuery, onChange: ev => setSearchQuery(ev.target.value), placeholder: lang === 'mr' ? 'अभ्यास नोट्स, औषधे किंवा क्लिनिकल विषय शोधा...' : 'Search study notes, drugs, formulas, topics...', className: 'w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white transition' })
      ]}),

      // Subject Filter Pills
      e.jsxs('div', { className: 'flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none', children: [
        e.jsx('button', { onClick: () => setSelectedSubject('all'), className: \`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer \${selectedSubject === 'all' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}\`, children: lang === 'mr' ? 'सर्व विषय (All)' : 'All Subjects' }),
        (subjects || []).map(s => e.jsx('button', { key: s.id, onClick: () => setSelectedSubject(s.id), className: \`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer \${selectedSubject === s.id ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}\`, children: lang === 'mr' ? s.name_mr : s.name_en }))
      ]})
    ]}),

    // Notes Grid
    loading ? e.jsxs('div', { className: 'p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200', children: [
      e.jsx('span', { className: 'animate-spin text-3xl text-teal-600', children: '🔄' }),
      e.jsx('p', { className: 'text-xs sm:text-sm font-bold', children: lang === 'mr' ? 'अभ्यास नोट्स लोड होत आहेत...' : 'Loading verified study library...' })
    ]}) : filteredNotes.length === 0 ? e.jsxs('div', { className: 'p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2', children: [
      e.jsx('div', { className: 'text-4xl', children: '📚' }),
      e.jsx('h3', { className: 'text-base font-bold text-slate-800', children: lang === 'mr' ? 'कोणत्याही नोट्स सापडल्या नाहीत' : 'No notes found' }),
      e.jsx('p', { className: 'text-xs text-slate-400', children: lang === 'mr' ? 'कृपया शोध शब्द बदला किंवा दुसरा विषय निवडा.' : 'Try changing your search keywords or topic filter.' })
    ]}) : e.jsx('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-5', children:
      filteredNotes.map(note => {
        const isNoteFree = note.is_free !== false && !note.is_premium;
        const isLocked = !isNoteFree && !isPro;

        return e.jsxs('div', { key: note.id, className: \`bg-white rounded-3xl border p-6 transition flex flex-col justify-between shadow-xs hover:shadow-md \${isLocked ? 'border-amber-200 bg-amber-50/15' : 'border-slate-200 hover:border-teal-300'}\`, children: [
          e.jsxs('div', { className: 'space-y-3', children: [
            // Subject & Free/Paid Badges
            e.jsxs('div', { className: 'flex items-center justify-between gap-2', children: [
              e.jsx('span', { className: 'px-3 py-1 rounded-full text-[11px] font-extrabold bg-teal-50 text-teal-900 border border-teal-200', children: getSubjectName(note.subject_id) }),
              isNoteFree ? e.jsx('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300', children: '✓ मोफत वाचन (Free)' }) : e.jsxs('span', { className: 'px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1', children: [
                e.jsx('span', { children: '💎' }),
                e.jsx('span', { children: \`₹\${note.price_inr || 49} PRO\` })
              ]})
            ]}),

            // Title & Description
            e.jsx('h3', { className: 'font-black text-base sm:text-lg text-slate-900 leading-snug', children: lang === 'mr' ? (note.title_mr || note.title) : (note.title_en || note.title) }),
            (note.description_mr || note.description) && e.jsx('p', { className: 'text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed', children: lang === 'mr' ? (note.description_mr || note.description) : (note.description_en || note.description) }),

            // Quick Callout Box (Clinical tip or mnemonic preview)
            note.clinical_tips && e.jsxs('div', { className: 'p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium flex items-start gap-2', children: [
              e.jsx('span', { className: 'text-sm shrink-0', children: '🩺' }),
              e.jsxs('div', { className: 'line-clamp-2', children: [
                e.jsx('strong', { className: 'text-amber-950', children: 'क्लिनिकल टीप: ' }),
                note.clinical_tips
              ]})
            ]})
          ]}),

          // Card Footer Action
          e.jsxs('div', { className: 'mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3', children: [
            e.jsxs('div', { className: 'text-[11px] text-slate-400 font-medium flex items-center gap-1.5', children: [
              e.jsx('span', { children: '⏱️' }),
              e.jsxs('span', { children: [note.read_time_minutes || 8, ' मि. वाचन वेळ'] })
            ]}),
            e.jsxs('button', { onClick: () => handleOpenNote(note), className: \`px-5 py-2.5 rounded-xl font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95 \${isLocked ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-teal-700 hover:bg-teal-800 text-white'}\`, children: [
              e.jsx('span', { children: isLocked ? '🔒' : '📖' }),
              e.jsx('span', { children: isLocked ? 'प्रीमियम नोट्स अनलॉक करा' : (lang === 'mr' ? 'अभ्यास नोट्स वाचा' : 'Read Full Notes') })
            ]})
          ]})
        ]});
      })
    ),

    // Stunning Ultra-Attractive Marathi Notes Reader Modal
    activeNote && e.jsx('div', { className: 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150', children:
      e.jsxs('div', { className: \`w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-150 \${readerTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : readerTheme === 'sepia' ? 'bg-[#fbf0d9] border-[#e2d3b3] text-[#433422]' : 'bg-white border-slate-200 text-slate-900'}\`, children: [
        // Reader Header
        e.jsxs('div', { className: 'px-5 py-4 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0 border-b border-slate-800', children: [
          e.jsxs('div', { className: 'space-y-0.5 min-w-0', children: [
            e.jsxs('div', { className: 'flex items-center gap-2', children: [
              e.jsx('span', { className: 'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30', children: getSubjectName(activeNote.subject_id) }),
              activeNote.is_free ? e.jsx('span', { className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300', children: 'Free' }) : e.jsx('span', { className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300', children: \`PRO ₹\${activeNote.price_inr || 49}\` })
            ]}),
            e.jsx('h3', { className: 'text-sm sm:text-base font-black text-white truncate', children: lang === 'mr' ? (activeNote.title_mr || activeNote.title) : (activeNote.title_en || activeNote.title) })
          ]}),

          // Reader Toolbar & Close
          e.jsxs('div', { className: 'flex items-center gap-2 shrink-0', children: [
            // Font Size Switcher
            e.jsxs('div', { className: 'hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700', children: [
              e.jsx('button', { onClick: () => setFontSize('sm'), className: \`px-2 py-0.5 rounded text-[11px] font-bold \${fontSize === 'sm' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}\`, children: 'A-' }),
              e.jsx('button', { onClick: () => setFontSize('base'), className: \`px-2 py-0.5 rounded text-[11px] font-bold \${fontSize === 'base' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}\`, children: 'A' }),
              e.jsx('button', { onClick: () => setFontSize('lg'), className: \`px-2 py-0.5 rounded text-[11px] font-bold \${fontSize === 'lg' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}\`, children: 'A+' })
            ]}),

            // Theme Switcher
            e.jsxs('div', { className: 'flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700', children: [
              e.jsx('button', { onClick: () => setReaderTheme('light'), className: \`px-2 py-0.5 rounded text-[11px] font-bold \${readerTheme === 'light' ? 'bg-white text-slate-900' : 'text-slate-400'}\`, children: '☀️' }),
              e.jsx('button', { onClick: () => setReaderTheme('sepia'), className: \`px-2 py-0.5 rounded text-[11px] font-bold \${readerTheme === 'sepia' ? 'bg-[#f4ebd0] text-amber-950' : 'text-slate-400'}\`, children: '📖' }),
              e.jsx('button', { onClick: () => setReaderTheme('dark'), className: \`px-2 py-0.5 rounded text-[11px] font-bold \${readerTheme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400'}\`, children: '🌙' })
            ]}),

            e.jsx('button', { onClick: () => setActiveNote(null), className: 'w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition', children: '✕' })
          ]})
        ]}),

        // Reader Body
        e.jsxs('div', { className: 'p-5 sm:p-8 overflow-y-auto space-y-6 select-text', children: [
          // High-Yield Key Points Header Cards
          activeNote.summary_points && (Array.isArray(activeNote.summary_points) ? activeNote.summary_points.length > 0 : activeNote.summary_points) && e.jsxs('div', { className: 'p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border border-teal-500/30 space-y-2', children: [
            e.jsxs('div', { className: 'flex items-center gap-2 font-black text-teal-900 text-xs sm:text-sm', children: [
              e.jsx('span', { children: '💡' }),
              e.jsx('h4', { children: 'परीक्षेसाठी अतिमहत्त्वाचे मुद्दे (High-Yield Takeaways):' })
            ]}),
            e.jsx('ul', { className: 'space-y-1.5 text-xs sm:text-sm text-slate-800 font-medium pl-1', children:
              (Array.isArray(activeNote.summary_points) ? activeNote.summary_points : activeNote.summary_points.split('\\n')).map((pt, i) => e.jsxs('li', { key: i, className: 'flex items-start gap-2', children: [
                e.jsx('span', { className: 'text-teal-600 font-bold shrink-0', children: '✓' }),
                e.jsx('span', { children: pt })
              ]}))
            })
          ]}),

          // Clinical Tips & Mnemonic Callout
          (activeNote.clinical_tips || activeNote.mnemonics) && e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4', children: [
            activeNote.clinical_tips && e.jsxs('div', { className: 'p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 space-y-1', children: [
              e.jsxs('div', { className: 'flex items-center gap-1.5 font-black text-xs', children: [
                e.jsx('span', { children: '🩺' }),
                e.jsx('span', { children: 'क्लिनिकल नर्सिंग अ‍ॅक्शन व खबरदारी:' })
              ]}),
              e.jsx('p', { className: 'text-xs leading-relaxed', children: activeNote.clinical_tips })
            ]}),
            activeNote.mnemonics && e.jsxs('div', { className: 'p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-950 space-y-1', children: [
              e.jsxs('div', { className: 'flex items-center gap-1.5 font-black text-xs', children: [
                e.jsx('span', { children: '🧠' }),
                e.jsx('span', { children: 'स्मरण क्लृप्ती (Exam Mnemonic):' })
              ]}),
              e.jsx('p', { className: 'text-xs leading-relaxed font-semibold', children: activeNote.mnemonics })
            ]})
          ]}),

          // Main Notes Formatted Content
          e.jsx('div', { className: \`prose max-w-none \${fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : fontSize === 'xl' ? 'text-lg' : 'text-sm'}\`, children:
            renderFormattedNoteContent(activeNote.content_mr || activeNote.content || activeNote.description_mr || activeNote.description)
          }),

          // Footer info & Security
          e.jsxs('div', { className: 'pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3', children: [
            e.jsxs('div', { className: 'flex items-center gap-2', children: [
              e.jsx('span', { children: '🏛️' }),
              e.jsxs('span', { children: ['स्रोत: ', activeNote.source || 'INC / MoHFW Standard Curriculum'] })
            ]}),
            e.jsx('button', { onClick: () => setActiveNote(null), className: 'px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer', children: 'वाचन पूर्ण झाले / बंद करा' })
          ]})
        ]})
      ]})
    )
  ]});
};
`;

// Replace W9 with EnhancedStudentNotes
if (!code.includes("const EnhancedStudentNotes =")) {
  code = code.replace("const Z9=", EnhancedStudentNotesCode + "\nconst Z9=");
}
code = code.replace(/l==="materials"&&e\.jsx\(W9,\{onUpgradePro:\(\)=>o\("upgrade-pro"\)\}\)/g, 'l==="materials"&&e.jsx(EnhancedStudentNotes,{onUpgradePro:()=>o("upgrade-pro")})');


// -------------------------------------------------------------
// 4. SECURE YOUTUBE PLAYER ENHANCEMENT (Anti-Copy & Anti-Download)
// -------------------------------------------------------------
const EnhancedSecurePlayerCode = `
const EnhancedSecurePlayer = ({ youtubeVideoId, title, currentUser, onClose }) => {
  const [warningShown, setWarningShown] = k.useState(false);
  const [watermarkPos, setWatermarkPos] = k.useState({ top: '25%', left: '25%' });

  // Floating watermark security
  k.useEffect(() => {
    const positions = [
      { top: '15%', left: '15%' },
      { top: '40%', left: '40%' },
      { top: '25%', left: '60%' },
      { top: '65%', left: '20%' },
      { top: '55%', left: '65%' },
      { top: '30%', left: '45%' },
      { top: '70%', left: '50%' }
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % positions.length;
      setWatermarkPos(positions[idx]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut blockers (anti-copy, screenshot warning)
  k.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        triggerWarning();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S' || e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        triggerWarning();
      }
    };
    const triggerWarning = () => {
      setWarningShown(true);
      setTimeout(() => setWarningShown(false), 3000);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const userName = currentUser?.name || currentUser?.email || 'Nursing Officer Student';
  const userIdentifier = currentUser?.email || currentUser?.mobile || 'Confidential Student Account';
  const studentId = currentUser?.id ? \`ID: \${currentUser.id.substring(0, 8)}\` : 'SECURE_STREAM';

  return e.jsxs('div', {
    className: 'relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl select-none secure-video-shield',
    onContextMenu: (e) => { e.preventDefault(); e.stopPropagation(); setWarningShown(true); },
    style: { userSelect: 'none', WebkitUserSelect: 'none' },
    children: [
      // YouTube Embed Iframe with no-cookie and minimal branding
      e.jsx('iframe', {
        src: \`https://www.youtube-nocookie.com/embed/\${youtubeVideoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1&disablekb=1&playsinline=1&enablejsapi=1\`,
        title: title,
        className: 'w-full h-full border-0 pointer-events-auto',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        allowFullScreen: true
      }),

      // Top Header Transparent Click Shield (prevents clicking YouTube Title or Logo to open youtube.com or copy link)
      e.jsx('div', {
        className: 'absolute top-0 left-0 right-0 h-16 bg-transparent z-20 cursor-default pointer-events-auto',
        onClick: (e) => { e.stopPropagation(); e.preventDefault(); },
        onContextMenu: (e) => { e.preventDefault(); },
        title: '🔒 सुरक्षित व्हिडिओ प्रवाह - लिंक कॉपी करणे प्रतिबंधित आहे'
      }),

      // Top Right Share/Watch Later Click Shield
      e.jsx('div', {
        className: 'absolute top-0 right-0 w-36 h-16 bg-transparent z-20 cursor-default pointer-events-auto',
        onClick: (e) => { e.stopPropagation(); e.preventDefault(); },
        onContextMenu: (e) => { e.preventDefault(); }
      }),

      // Floating Anti-Piracy Watermark
      e.jsx('div', {
        className: 'absolute z-30 pointer-events-none transition-all duration-1000 ease-in-out px-3 py-1 rounded-md bg-black/50 backdrop-blur-xs border border-white/10 shadow-sm',
        style: { top: watermarkPos.top, left: watermarkPos.left },
        children: e.jsxs('div', { className: 'flex items-center gap-1.5 text-[10px] font-mono font-bold text-white/60 tracking-wider', children: [
          e.jsx('span', { className: 'text-red-400', children: '🔒' }),
          e.jsx('span', { children: userName }),
          e.jsx('span', { className: 'text-slate-400', children: '•' }),
          e.jsx('span', { children: studentId })
        ]})
      }),

      // Security Warning Overlay Alert
      warningShown && e.jsx('div', {
        className: 'absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6 text-center animate-in fade-in duration-200',
        children: e.jsxs('div', { className: 'space-y-2 max-w-md', children: [
          e.jsx('div', { className: 'w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-2xl border border-rose-500/30', children: '🔒' }),
          e.jsx('h4', { className: 'text-base font-black text-rose-300', children: 'व्हिडिओ लिंक कॉपी किंवा डाऊनलोड प्रतिबंधित आहे!' }),
          e.jsx('p', { className: 'text-xs text-slate-300 leading-relaxed', children: 'सुरक्षा नियमांनुसार या ॲपमधील व्हिडिओ व्याख्याने केवळ अधिकृत विद्यार्थ्यांसाठी सुरक्षित ठेवण्यात आली आहेत. कॉपी किंवा डाऊनलोडिंग अनुमत नाही.' })
        ]})
      })
    ]
  });
};
`;

// Replace pj with EnhancedSecurePlayer
if (!code.includes("const EnhancedSecurePlayer =")) {
  code = code.replace("const Z9=", EnhancedSecurePlayerCode + "\nconst Z9=");
}
code = code.replace(/e\.jsx\(pj,\{youtubeVideoId:v\.youtube_video_id\|\|"dQw4w9WgXcQ",title:v\.title_en\|\|v\.title_mr,currentUser:r,onClose:\(\)=>N\(null\)\}\)/g, 'e.jsx(EnhancedSecurePlayer,{youtubeVideoId:v.youtube_video_id||"dQw4w9WgXcQ",title:v.title_en||v.title_mr,currentUser:r,onClose:()=>N(null)})');


// -------------------------------------------------------------
// 5. WRITE BACK MODIFIED BUNDLE
// -------------------------------------------------------------
fs.writeFileSync('public/assets/index-CY7ixHhG.js', code, 'utf8');
if (fs.existsSync('dist/assets/index-CY7ixHhG.js')) {
  fs.writeFileSync('dist/assets/index-CY7ixHhG.js', code, 'utf8');
}

console.log('✅ Successfully injected All Enhanced Features into bundle!');
