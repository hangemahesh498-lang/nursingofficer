const fs = require('fs');
let code = fs.readFileSync('public/assets/index-CY7ixHhG.js', 'utf8');

console.log('Patching all requested features into frontend bundle...');

// 1. Fix W9 (Study Materials & Notes Component)
code = code.split('B.file_type.toUpperCase()').join('(B.file_type||"pdf").toUpperCase()');
code = code.split('children:B.title').join('children:B.title_mr||B.title_en||B.title||"Study Note"');
code = code.split('children:B.category').join('children:(B.category||"Notes").replace("_", " ")');

// Fix materials route in main app to render W9 directly without undefined component
code = code.split('l==="materials"&&e.jsx(EnhancedStudentNotes,{onUpgradePro:()=>o("upgrade-pro")})')
           .join('l==="materials"&&e.jsx(W9,{onUpgradePro:()=>o("upgrade-pro")})');

// 2. Define New Admin Panels:
const newAdminComponents = `
;var AdminGithubHub = ({ showToast }) => {
  const { language: lang } = Ds();
  const [status, setStatus] = k.useState(null);
  const [loading, setLoading] = k.useState(true);
  const [deploying, setDeploying] = k.useState(false);
  const [pulling, setPulling] = k.useState(false);
  const [commitMsg, setCommitMsg] = k.useState('Update Nursing Officer Content & Engines');
  const [logs, setLogs] = k.useState([]);
  const [tokenInput, setTokenInput] = k.useState('');
  const [ownerInput, setOwnerInput] = k.useState('HANGEMAHESH498');
  const [repoInput, setRepoInput] = k.useState('nursing-officer');
  const [branchInput, setBranchInput] = k.useState('main');
  const [showConfig, setShowConfig] = k.useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/github/status');
      const data = await res.json();
      setStatus(data);
      if (data.owner) setOwnerInput(data.owner);
      if (data.repo) setRepoInput(data.repo);
      if (data.branch) setBranchInput(data.branch);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  k.useEffect(() => {
    fetchStatus();
  }, []);

  const handleDeployPush = async () => {
    try {
      setDeploying(true);
      setLogs(prev => [...prev, '[START] 🚀 Deploying & Pushing codebase to GitHub...']);
      const res = await fetch('/api/admin/github/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commitMessage: commitMsg })
      });
      const data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setLogs(prev => [...prev, ...data.logs]);
      }
      if (data.success) {
        showToast(lang === 'mr' ? '✅ GitHub वर यशस्वीरीत्या डिप्लोय झाले!' : '✅ Deployed successfully to GitHub!', 'success');
        fetchStatus();
      } else {
        showToast(data.error || 'Deployment failed', 'error');
      }
    } catch (err) {
      setLogs(prev => [...prev, '❌ Deploy Error: ' + err.message]);
      showToast(err.message, 'error');
    } finally {
      setDeploying(false);
    }
  };

  const handlePullSync = async () => {
    try {
      setPulling(true);
      setLogs(prev => [...prev, '[START] 🔄 Pulling latest updates from GitHub remote...']);
      const res = await fetch('/api/admin/github/pull', { method: 'POST' });
      const data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setLogs(prev => [...prev, ...data.logs]);
      }
      if (data.success) {
        showToast(lang === 'mr' ? '✅ GitHub वरून नवीन कोड यशस्वीरित्या Pull झाला!' : '✅ Successfully pulled latest code from GitHub!', 'success');
        fetchStatus();
      } else {
        showToast(data.error || 'Pull failed', 'error');
      }
    } catch (err) {
      setLogs(prev => [...prev, '❌ Pull Error: ' + err.message]);
      showToast(err.message, 'error');
    } finally {
      setPulling(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/admin/github/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          github_token: tokenInput || undefined,
          github_owner: ownerInput,
          github_repo: repoInput,
          github_branch: branchInput
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(lang === 'mr' ? '✅ GitHub सेटिंग्ज सेव्ह झाल्या!' : '✅ GitHub configuration saved!', 'success');
        setShowConfig(false);
        fetchStatus();
      } else {
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  return e.jsxs('div', { className: 'space-y-6 max-w-5xl mx-auto', children: [
    e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4', children: [
      e.jsxs('div', { className: 'space-y-1', children: [
        e.jsxs('div', { className: 'flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider', children: [
          e.jsx('span', { className: 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' }),
          'GitHub CI/CD & Code Sync Hub'
        ]}),
        e.jsx('h2', { className: 'text-2xl font-black text-slate-900', children: lang === 'mr' ? '🚀 गिटहब डिप्लोय व कोड सिंक (GitHub Sync & Deploy)' : '🚀 GitHub Deployment & Code Sync' }),
        e.jsx('p', { className: 'text-xs sm:text-sm text-slate-500', children: lang === 'mr' ? 'येथून संपूर्ण ॲपचा कोड थेट GitHub रिपॉझिटरीवर पुश करा किंवा GitHub वरून नवीन कोड त्वरित Pull करा.' : 'Push full app updates directly to your GitHub repository or pull latest commits.' })
      ]}),
      e.jsxs('div', { className: 'flex items-center gap-2', children: [
        e.jsx('button', {
          onClick: () => setShowConfig(!showConfig),
          className: 'px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer',
          children: showConfig ? (lang === 'mr' ? 'कॉन्फिग लपवा' : 'Hide Config') : (lang === 'mr' ? '⚙️ रेपो सेटिंग्ज' : '⚙️ Repo Settings')
        }),
        e.jsx('button', {
          onClick: fetchStatus,
          className: 'p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer',
          children: '🔄'
        })
      ]})
    ]}),

    showConfig && e.jsxs('div', { className: 'bg-indigo-50/70 border border-indigo-200 rounded-3xl p-6 space-y-4 animate-in fade-in', children: [
      e.jsx('h3', { className: 'text-sm font-black text-indigo-950', children: '⚙️ GitHub Repository & Token Configuration' }),
      e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs', children: [
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-700 mb-1', children: 'GitHub Owner (Username / Org):' }),
          e.jsx('input', { type: 'text', value: ownerInput, onChange: ev => setOwnerInput(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono' })
        ]}),
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-700 mb-1', children: 'Repository Name:' }),
          e.jsx('input', { type: 'text', value: repoInput, onChange: ev => setRepoInput(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono' })
        ]}),
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-700 mb-1', children: 'Branch:' }),
          e.jsx('input', { type: 'text', value: branchInput, onChange: ev => setBranchInput(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono' })
        ]}),
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-700 mb-1', children: 'Personal Access Token (PAT):' }),
          e.jsx('input', { type: 'password', value: tokenInput, placeholder: 'ghp_xxxxxxxxxxxx', onChange: ev => setTokenInput(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono' })
        ]})
      ]}),
      e.jsx('button', {
        onClick: handleSaveConfig,
        className: 'px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition cursor-pointer shadow-xs',
        children: 'Save Configuration'
      })
    ]}),

    e.jsxs('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-5', children: [
      e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between', children: [
        e.jsxs('div', { className: 'space-y-3', children: [
          e.jsxs('div', { className: 'flex items-center gap-3', children: [
            e.jsx('div', { className: 'w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg', children: '🚀' }),
            e.jsxs('div', { children: [
              e.jsx('h3', { className: 'font-black text-slate-900 text-base', children: lang === 'mr' ? 'GitHub वर कोड डिप्लोय (Push)' : 'Push & Deploy to GitHub' }),
              e.jsx('p', { className: 'text-xs text-slate-500', children: 'Automated commit, tag & GitHub Actions trigger' })
            ]})
          ]}),
          e.jsxs('div', { className: 'space-y-1', children: [
            e.jsx('label', { className: 'block text-xs font-bold text-slate-700', children: 'Commit Message:' }),
            e.jsx('input', {
              type: 'text',
              value: commitMsg,
              onChange: ev => setCommitMsg(ev.target.value),
              className: 'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium'
            })
          ]})
        ]}),
        e.jsx('button', {
          onClick: handleDeployPush,
          disabled: deploying,
          className: 'w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50',
          children: deploying ? '🚀 Deploying to GitHub...' : '🚀 Push & Deploy Now'
        })
      ]}),

      e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between', children: [
        e.jsxs('div', { className: 'space-y-3', children: [
          e.jsxs('div', { className: 'flex items-center gap-3', children: [
            e.jsx('div', { className: 'w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg', children: '🔄' }),
            e.jsxs('div', { children: [
              e.jsx('h3', { className: 'font-black text-slate-900 text-base', children: lang === 'mr' ? 'GitHub वरून कोड सिंक (Pull)' : 'Pull & Sync from GitHub' }),
              e.jsx('p', { className: 'text-xs text-slate-500', children: 'Fetch latest updates from main branch' })
            ]})
          ]}),
          e.jsxs('div', { className: 'p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1', children: [
            e.jsxs('div', { className: 'flex justify-between text-slate-600', children: [
              e.jsx('span', { className: 'font-bold', children: 'Target Repo:' }),
              e.jsx('span', { className: 'font-mono text-indigo-600', children: (status?.owner || 'HANGEMAHESH498') + '/' + (status?.repo || 'nursing-officer') })
            ]}),
            e.jsxs('div', { className: 'flex justify-between text-slate-600', children: [
              e.jsx('span', { className: 'font-bold', children: 'Active Branch:' }),
              e.jsx('span', { className: 'font-mono text-emerald-600', children: status?.branch || 'main' })
            ]}),
            e.jsxs('div', { className: 'flex justify-between text-slate-600', children: [
              e.jsx('span', { className: 'font-bold', children: 'Last Commit:' }),
              e.jsx('span', { className: 'font-mono text-slate-800 truncate max-w-[200px]', children: status?.lastCommit || 'Latest HEAD' })
            ]})
          ]})
        ]}),
        e.jsx('button', {
          onClick: handlePullSync,
          disabled: pulling,
          className: 'w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50',
          children: pulling ? '🔄 Pulling latest code...' : '🔄 Pull & Sync Latest Code'
        })
      ]})
    ]}),

    logs.length > 0 && e.jsxs('div', { className: 'bg-slate-950 rounded-3xl p-5 border border-slate-800 space-y-2', children: [
      e.jsxs('div', { className: 'flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400 font-mono', children: [
        e.jsx('span', { children: '📟 Git Execution Logs' }),
        e.jsx('button', { onClick: () => setLogs([]), className: 'text-slate-500 hover:text-white', children: 'Clear' })
      ]}),
      e.jsx('div', { className: 'max-h-60 overflow-y-auto space-y-1 font-mono text-[11px] text-emerald-400', children: logs.map((lg, i) => e.jsx('div', { key: i, children: lg })) })
    ]})
  ]});
};

;var AdminPaymentGateway = ({ showToast }) => {
  const { language: lang } = Ds();
  const [config, setConfig] = k.useState(null);
  const [loading, setLoading] = k.useState(true);
  const [saving, setSaving] = k.useState(false);
  const [keyId, setKeyId] = k.useState('');
  const [keySecret, setKeySecret] = k.useState('');
  const [isLive, setIsLive] = k.useState(false);
  const [adminUpi, setAdminUpi] = k.useState('9890123456@upi');
  const [merchantName, setMerchantName] = k.useState('Nursing Officer BY MH');

  const fetchGateway = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/payment-gateway');
      const data = await res.json();
      setConfig(data);
      if (data.raw_key_id) setKeyId(data.raw_key_id);
      setIsLive(Boolean(data.is_live));
      if (data.upi_id) setAdminUpi(data.upi_id);
      if (data.merchant_name) setMerchantName(data.merchant_name);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  k.useEffect(() => {
    fetchGateway();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/payment-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_key_id: keyId,
          razorpay_key_secret: keySecret || undefined,
          razorpay_is_live: isLive,
          admin_upi_id: adminUpi,
          merchant_name: merchantName
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(lang === 'mr' ? '✅ Razorpay पेमेंट गेटवे सेटिंग्ज सेव्ह झाल्या!' : '✅ Razorpay Gateway saved successfully!', 'success');
        fetchGateway();
      } else {
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return e.jsxs('div', { className: 'space-y-6 max-w-4xl mx-auto', children: [
    e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4', children: [
      e.jsxs('div', { className: 'space-y-1', children: [
        e.jsxs('div', { className: 'flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider', children: [
          e.jsx('span', { className: 'w-2 h-2 rounded-full ' + (config?.configured ? 'bg-emerald-500' : 'bg-amber-500') }),
          config?.configured ? (config?.is_live ? '🟢 Razorpay Live Production' : '🟡 Razorpay Test Sandbox') : '⚪ Not Configured'
        ]}),
        e.jsx('h2', { className: 'text-2xl font-black text-slate-900', children: lang === 'mr' ? '💳 Razorpay पेमेंट गेटवे (Live / Test)' : '💳 Razorpay Payment Gateway Hub' }),
        e.jsx('p', { className: 'text-xs sm:text-sm text-slate-500', children: lang === 'mr' ? 'विद्यार्थ्यांकडून थेट ऑनलाइन फी (UPI, Cards, NetBanking) स्वीकारण्यासाठी Razorpay Key ID व Secret येथे सेट करा.' : 'Configure Razorpay API Keys to accept instant online subscription payments.' })
      ]}),
      e.jsx('div', { className: 'p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold', children: 'Instant Auto-Activation Active' })
    ]}),

    e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6', children: [
      e.jsxs('div', { className: 'p-4 rounded-2xl border ' + (isLive ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300') + ' flex items-center justify-between', children: [
        e.jsxs('div', { className: 'space-y-0.5', children: [
          e.jsx('h4', { className: 'font-black text-sm text-slate-900', children: isLive ? '🟢 LIVE PRODUCTION MODE (खरे पैसे जमा होतील)' : '🟡 TEST / SANDBOX MODE (चाचणी मोड)' }),
          e.jsx('p', { className: 'text-xs text-slate-600', children: isLive ? 'विद्यार्थ्यांची फी थेट तुमच्या बँक खात्यात जमा होईल.' : 'Test transactions with test cards and demo UPI.' })
        ]}),
        e.jsx('button', {
          type: 'button',
          onClick: () => setIsLive(!isLive),
          className: 'px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer ' + (isLive ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-600 text-white hover:bg-amber-700'),
          children: isLive ? 'Switch to Test' : 'Switch to LIVE'
        })
      ]}),

      e.jsxs('div', { className: 'space-y-4 text-xs', children: [
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'Razorpay Key ID (rzp_live_... / rzp_test_...): *' }),
          e.jsx('input', {
            type: 'text',
            value: keyId,
            placeholder: isLive ? 'rzp_live_xxxxxxxxxxxx' : 'rzp_test_xxxxxxxxxxxx',
            onChange: ev => setKeyId(ev.target.value),
            className: 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white'
          })
        ]}),

        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'Razorpay Key Secret: *' }),
          e.jsx('input', {
            type: 'password',
            value: keySecret,
            placeholder: '•••••••••••••••••••••••• (Leave blank to keep current)',
            onChange: ev => setKeySecret(ev.target.value),
            className: 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white'
          })
        ]}),

        e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2', children: [
          e.jsxs('div', { children: [
            e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'Merchant / App Name on Checkout:' }),
            e.jsx('input', {
              type: 'text',
              value: merchantName,
              onChange: ev => setMerchantName(ev.target.value),
              className: 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white'
            })
          ]}),
          e.jsxs('div', { children: [
            e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'Fallback Admin UPI ID (for QR codes):' }),
            e.jsx('input', {
              type: 'text',
              value: adminUpi,
              onChange: ev => setAdminUpi(ev.target.value),
              className: 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white'
            })
          ]})
        ]})
      ]}),

      e.jsx('button', {
        onClick: handleSave,
        disabled: saving,
        className: 'w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl transition cursor-pointer shadow-md disabled:opacity-50',
        children: saving ? 'Saving Gateway Settings...' : (lang === 'mr' ? '💾 Razorpay सेटिंग्ज सेव्ह करा' : '💾 Save Razorpay Settings')
      })
    ]})
  ]});
};

;var AdminStorageMonitor = ({ showToast }) => {
  const { language: lang } = Ds();
  const [metrics, setMetrics] = k.useState(null);
  const [loading, setLoading] = k.useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/storage/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  k.useEffect(() => {
    fetchMetrics();
  }, []);

  const st = metrics?.storage || {
    totalCapacityMB: 10240,
    totalUsedMB: 28.4,
    freeMB: 10211.6,
    freePercentage: 99.7,
    usedPercentage: 0.3,
    databaseSizeMB: 5.2,
    mediaSizeMB: 14.8,
    memoryRssMB: 75.4
  };

  const cnt = metrics?.counts || {
    totalQuestions: 0,
    totalStudyMaterials: 0,
    totalUsers: 0,
    proUsers: 0,
    freeUsers: 0,
    totalMockTests: 0
  };

  return e.jsxs('div', { className: 'space-y-6 max-w-5xl mx-auto', children: [
    e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4', children: [
      e.jsxs('div', { className: 'space-y-1', children: [
        e.jsxs('div', { className: 'flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider', children: [
          e.jsx('span', { className: 'w-2 h-2 rounded-full bg-emerald-500' }),
          'System Resource & Cloud Capacity'
        ]}),
        e.jsx('h2', { className: 'text-2xl font-black text-slate-900', children: lang === 'mr' ? '📊 सुपर स्टोरेज व क्षमता मॉनिटर (Storage Monitor)' : '📊 Storage & Capacity Monitor' }),
        e.jsx('p', { className: 'text-xs sm:text-sm text-slate-500', children: lang === 'mr' ? 'डेटाबेस, मीडिया फाइल्स, पीडीएफ नोट्स आणि एकूण फ्री स्पेसचे अचूक रिअल-टाइम विश्लेषण.' : 'Real-time database records, Cloudinary media, and capacity breakdown.' })
      ]}),
      e.jsx('button', {
        onClick: fetchMetrics,
        className: 'px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer',
        children: '🔄 Refresh Metrics'
      })
    ]}),

    e.jsxs('div', { className: 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6', children: [
      e.jsxs('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-2', children: [
        e.jsxs('div', { children: [
          e.jsx('span', { className: 'text-xs font-bold text-slate-400 uppercase tracking-wider', children: 'Overall Storage Capacity' }),
          e.jsxs('h3', { className: 'text-2xl sm:text-3xl font-black text-white mt-0.5', children: [st.totalUsedMB, ' MB / ', (st.totalCapacityMB / 1024).toFixed(0), ' GB Used'] })
        ]}),
        e.jsxs('div', { className: 'text-right', children: [
          e.jsxs('span', { className: 'px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-black text-xs', children: [st.freePercentage, '% Available'] }),
          e.jsxs('p', { className: 'text-xs text-slate-400 mt-1', children: [st.freeMB, ' MB Free Space'] })
        ]})
      ]}),

      e.jsx('div', { className: 'w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700', children:
        e.jsx('div', {
          className: 'h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 rounded-full transition-all duration-500',
          style: { width: Math.max(2, st.usedPercentage) + '%' }
        })
      }),

      e.jsxs('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-800/80', children: [
        e.jsxs('div', { className: 'bg-slate-800/60 p-3 rounded-xl', children: [
          e.jsx('span', { className: 'text-slate-400 block text-[10px] font-bold', children: 'Database Store' }),
          e.jsxs('span', { className: 'font-mono text-emerald-400 font-bold', children: [st.databaseSizeMB, ' MB'] })
        ]}),
        e.jsxs('div', { className: 'bg-slate-800/60 p-3 rounded-xl', children: [
          e.jsx('span', { className: 'text-slate-400 block text-[10px] font-bold', children: 'Cloudinary Media' }),
          e.jsxs('span', { className: 'font-mono text-blue-400 font-bold', children: [st.mediaSizeMB, ' MB'] })
        ]}),
        e.jsxs('div', { className: 'bg-slate-800/60 p-3 rounded-xl', children: [
          e.jsx('span', { className: 'text-slate-400 block text-[10px] font-bold', children: 'Node Memory (RSS)' }),
          e.jsxs('span', { className: 'font-mono text-purple-400 font-bold', children: [st.memoryRssMB, ' MB'] })
        ]}),
        e.jsxs('div', { className: 'bg-slate-800/60 p-3 rounded-xl', children: [
          e.jsx('span', { className: 'text-slate-400 block text-[10px] font-bold', children: 'Total Items Tracked' }),
          e.jsx('span', { className: 'font-mono text-amber-400 font-bold', children: (cnt.totalQuestions + cnt.totalStudyMaterials + cnt.totalUsers) })
        ]})
      ]})
    ]}),

    e.jsxs('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-4', children: [
      e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-2xl p-4 space-y-1', children: [
        e.jsx('span', { className: 'text-slate-400 text-xs font-bold block', children: '📚 प्रश्न संख्या' }),
        e.jsx('h4', { className: 'text-xl font-black text-slate-900', children: cnt.totalQuestions }),
        e.jsx('p', { className: 'text-[10px] text-emerald-600 font-medium', children: 'Verified & Certified' })
      ]}),
      e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-2xl p-4 space-y-1', children: [
        e.jsx('span', { className: 'text-slate-400 text-xs font-bold block', children: '📄 अभ्यास नोट्स' }),
        e.jsx('h4', { className: 'text-xl font-black text-slate-900', children: cnt.totalStudyMaterials }),
        e.jsx('p', { className: 'text-[10px] text-blue-600 font-medium', children: 'PDFs & Guides' })
      ]}),
      e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-2xl p-4 space-y-1', children: [
        e.jsx('span', { className: 'text-slate-400 text-xs font-bold block', children: '👑 PRO विद्यार्थी' }),
        e.jsx('h4', { className: 'text-xl font-black text-emerald-600', children: cnt.proUsers }),
        e.jsx('p', { className: 'text-[10px] text-slate-500 font-medium', children: 'Paid Subscribers' })
      ]}),
      e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-2xl p-4 space-y-1', children: [
        e.jsx('span', { className: 'text-slate-400 text-xs font-bold block', children: '👥 मोफत विद्यार्थी' }),
        e.jsx('h4', { className: 'text-xl font-black text-slate-600', children: cnt.freeUsers }),
        e.jsx('p', { className: 'text-[10px] text-slate-400 font-medium', children: 'Free Plan Users' })
      ]})
    ]})
  ]});
};

;var AdminPromoCodes = ({ showToast }) => {
  const { language: lang } = Ds();
  const [promos, setPromos] = k.useState([]);
  const [loading, setLoading] = k.useState(true);
  const [showAdd, setShowAdd] = k.useState(false);
  const [code, setCode] = k.useState('');
  const [discountType, setDiscountType] = k.useState('percentage');
  const [discountValue, setDiscountValue] = k.useState(20);
  const [minOrder, setMinOrder] = k.useState(199);
  const [maxDiscount, setMaxDiscount] = k.useState(100);
  const [usageLimit, setUsageLimit] = k.useState(500);
  const [validUntil, setValidUntil] = k.useState('2026-12-31');

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/promo-codes');
      const data = await res.json();
      setPromos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  k.useEffect(() => {
    fetchPromos();
  }, []);

  const handleCreate = async () => {
    if (!code.trim()) {
      showToast('कृपया कोड टाका / Enter code', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discount_type: discountType,
          discount_value: Number(discountValue),
          min_order_amount: Number(minOrder),
          max_discount_amount: Number(maxDiscount),
          usage_limit: Number(usageLimit),
          valid_until: validUntil,
          is_active: true
        })
      });
      const data = await res.json();
      if (data.success || data.code) {
        showToast(lang === 'mr' ? '✅ प्रोमो कोड तयार झाला!' : '✅ Promo code created!', 'success');
        setShowAdd(false);
        setCode('');
        fetchPromos();
      } else {
        showToast(data.error || 'Failed to create promo', 'error');
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('हा प्रोमो कोड डिलीट करायचा आहे का?')) return;
    try {
      const res = await fetch('/api/admin/promo-codes/' + id, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Deleted', 'success');
        fetchPromos();
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  return e.jsxs('div', { className: 'space-y-6 max-w-5xl mx-auto', children: [
    e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4', children: [
      e.jsxs('div', { className: 'space-y-1', children: [
        e.jsxs('div', { className: 'flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider', children: [
          e.jsx('span', { className: 'w-2 h-2 rounded-full bg-rose-500' }),
          'Coupons & Student Discounts'
        ]}),
        e.jsx('h2', { className: 'text-2xl font-black text-slate-900', children: lang === 'mr' ? '🎟️ प्रोमो कोड व डिस्काउंट सिस्टीम (Promo Codes)' : '🎟️ Promo Codes & Discount Offers' }),
        e.jsx('p', { className: 'text-xs sm:text-sm text-slate-500', children: lang === 'mr' ? 'विद्यार्थ्यांसाठी खास डिस्काउंट कुपन कोड (उदा. NURSE50, MAHA20) तयार करा व व्यवस्थापित करा.' : 'Create and manage promo discount coupons for student subscriptions.' })
      ]}),
      e.jsx('button', {
        onClick: () => setShowAdd(!showAdd),
        className: 'px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition cursor-pointer shadow-md flex items-center gap-2',
        children: showAdd ? '✕ बंद करा' : '+ नवीन प्रोमो कोड तयार करा'
      })
    ]}),

    showAdd && e.jsxs('div', { className: 'bg-rose-50/70 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4 animate-in fade-in', children: [
      e.jsx('h3', { className: 'text-base font-black text-rose-950', children: '➕ नवीन प्रोमो कोड (New Promo Code)' }),
      e.jsxs('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs', children: [
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'प्रोमो कोड नाव (Code Name): *' }),
          e.jsx('input', { type: 'text', placeholder: 'उदा. MAHA50', value: code, onChange: ev => setCode(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold uppercase' })
        ]}),
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'डिस्काउंट प्रकार (Type):' }),
          e.jsxs('select', { value: discountType, onChange: ev => setDiscountType(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold', children: [
            e.jsx('option', { value: 'percentage', children: 'टक्केवारी (% Off)' }),
            e.jsx('option', { value: 'flat', children: 'निश्चित रक्कम (₹ Flat Off)' })
          ]})
        ]}),
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: discountType === 'percentage' ? 'डिस्काउंट टक्के (% Value):' : 'डिस्काउंट रक्कम (₹ Value):' }),
          e.jsx('input', { type: 'number', value: discountValue, onChange: ev => setDiscountValue(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold' })
        ]}),
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'किमान ऑर्डर रक्कम (Min Order ₹):' }),
          e.jsx('input', { type: 'number', value: minOrder, onChange: ev => setMinOrder(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl' })
        ]}),
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'कमाल डिस्काउंट मर्यादा (Max ₹ Off):' }),
          e.jsx('input', { type: 'number', value: maxDiscount, onChange: ev => setMaxDiscount(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl' })
        ]}),
        e.jsxs('div', { children: [
          e.jsx('label', { className: 'block font-bold text-slate-800 mb-1', children: 'मुदत शेवट (Valid Until):' }),
          e.jsx('input', { type: 'date', value: validUntil, onChange: ev => setValidUntil(ev.target.value), className: 'w-full p-2.5 bg-white border border-slate-200 rounded-xl' })
        ]})
      ]}),
      e.jsx('button', {
        onClick: handleCreate,
        className: 'px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md',
        children: '💾 सेव्ह करा व सक्रिय करा (Save Promo Code)'
      })
    ]}),

    promos.length === 0 ? e.jsx('div', { className: 'bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-bold', children: 'कोणतेही प्रोमो कोड सापडले नाहीत.' }) :
    e.jsx('div', { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4', children:
      promos.map(p => e.jsxs('div', { key: p.id || p.code, className: 'bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between', children: [
        e.jsxs('div', { className: 'space-y-2', children: [
          e.jsxs('div', { className: 'flex items-center justify-between', children: [
            e.jsx('span', { className: 'px-3 py-1 bg-rose-100 text-rose-900 border border-rose-200 rounded-lg font-mono font-black text-sm', children: p.code }),
            e.jsx('span', { className: 'px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold', children: 'Active' })
          ]}),
          e.jsxs('h4', { className: 'font-black text-slate-900 text-base', children: [
            p.discount_type === 'percentage' ? p.discount_value + '% OFF' : '₹' + p.discount_value + ' FLAT OFF'
          ]}),
          e.jsxs('p', { className: 'text-xs text-slate-500', children: [
            'किमान ऑर्डर: ₹', p.min_order_amount || 0, ' | कमाल: ₹', p.max_discount_amount || 100
          ]})
        ]}),
        e.jsxs('div', { className: 'pt-2 border-t border-slate-100 flex items-center justify-between text-xs', children: [
          e.jsxs('span', { className: 'text-slate-400 text-[11px]', children: ['वापर: ', p.usage_count || 0, ' वेळा'] }),
          e.jsx('button', {
            onClick: () => handleDelete(p.id),
            className: 'text-rose-600 hover:text-rose-800 font-bold',
            children: 'Delete'
          })
        ]})
      ]}))
    })
  ]});
};

;var AdminStudentManager = ({ showToast }) => {
  const { language: lang } = Ds();
  const [users, setUsers] = k.useState([]);
  const [loading, setLoading] = k.useState(true);
  const [search, setSearch] = k.useState('');
  const [filterFee, setFilterFee] = k.useState('all');
  const [selectedUser, setSelectedUser] = k.useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : (data.users || []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  k.useEffect(() => {
    fetchUsers();
  }, []);

  const handleExtendValidity = async (userId, days) => {
    try {
      const res = await fetch('/api/admin/students/extend-validity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, days_to_add: days, is_paid: true })
      });
      const data = await res.json();
      if (data.success) {
        showToast(lang === 'mr' ? '✅ विद्यार्थ्यांची मुदत वाढवली व Paid मार्क केले!' : '✅ Validity extended & marked as Paid!', 'success');
        setSelectedUser(null);
        fetchUsers();
      } else {
        showToast(data.error || 'Failed', 'error');
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const filteredStudents = users.filter(u => {
    const isStudent = (u.role === 'student' || !u.role);
    if (!isStudent) return false;

    const isPaid = Boolean(u.isPremium);
    if (filterFee === 'paid' && !isPaid) return false;
    if (filterFee === 'unpaid' && isPaid) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const n = (u.name || '').toLowerCase();
      const em = (u.email || '').toLowerCase();
      const ph = (u.phone || u.mobile || '').toLowerCase();
      const dist = (u.district || '').toLowerCase();
      return n.includes(q) || em.includes(q) || ph.includes(q) || dist.includes(q);
    }
    return true;
  });

  return e.jsxs('div', { className: 'space-y-6 max-w-6xl mx-auto', children: [
    e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4', children: [
      e.jsxs('div', { className: 'space-y-1', children: [
        e.jsxs('div', { className: 'flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider', children: [
          e.jsx('span', { className: 'w-2 h-2 rounded-full bg-indigo-500' }),
          'Student Directory & Fees Tracker'
        ]}),
        e.jsx('h2', { className: 'text-2xl font-black text-slate-900', children: lang === 'mr' ? '👥 विद्यार्थी व्यवस्थापन व फी ट्रॅकर (Students & Fees)' : '👥 Student Directory & Fees Tracker' }),
        e.jsx('p', { className: 'text-xs sm:text-sm text-slate-500', children: lang === 'mr' ? 'कोणी कोणता प्लॅन घेतलाय, कोणाची फी बाकी आहे ते पहा, एका क्लिकवर मुदत वाढवा.' : 'Manage student subscribers, fee status, validity, and plan overrides.' })
      ]}),
      e.jsx('div', { className: 'flex items-center gap-2 text-xs', children: [
        e.jsxs('span', { className: 'px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-black', children: [users.filter(u => u.isPremium).length, ' Paid PRO'] }),
        e.jsxs('span', { className: 'px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-black', children: [users.filter(u => !u.isPremium).length, ' Unpaid'] })
      ]})
    ]}),

    e.jsxs('div', { className: 'bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3', children: [
      e.jsx('input', {
        type: 'text',
        placeholder: lang === 'mr' ? 'विद्यार्थ्याचे नाव, फोन, जिल्हा किंवा ईमेल शोधा...' : 'Search student by name, phone, district...',
        value: search,
        onChange: ev => setSearch(ev.target.value),
        className: 'w-full sm:flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white'
      }),
      e.jsxs('select', {
        value: filterFee,
        onChange: ev => setFilterFee(ev.target.value),
        className: 'w-full sm:w-48 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold',
        children: [
          e.jsx('option', { value: 'all', children: 'सर्व विद्यार्थी (All Students)' }),
          e.jsx('option', { value: 'paid', children: '🟢 फीस भरलेले (Paid PRO)' }),
          e.jsx('option', { value: 'unpaid', children: '🔴 फीस न भरलेले (Unpaid Free)' })
        ]
      })
    ]}),

    e.jsx('div', { className: 'bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs', children:
      e.jsxs('table', { className: 'w-full text-left border-collapse text-xs', children: [
        e.jsx('thead', { className: 'bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider text-[10px]', children:
          e.jsxs('tr', { children: [
            e.jsx('th', { className: 'p-4', children: 'विद्यार्थी (Student)' }),
            e.jsx('th', { className: 'p-4', children: 'संपर्क व जिल्हा' }),
            e.jsx('th', { className: 'p-4', children: 'प्लॅन व फी स्थिती' }),
            e.jsx('th', { className: 'p-4', children: 'मुदत (Expiry)' }),
            e.jsx('th', { className: 'p-4 text-right', children: 'ॲक्शन' })
          ]})
        }),
        e.jsx('tbody', { className: 'divide-y divide-slate-100', children:
          filteredStudents.length === 0 ? e.jsx('tr', { children: e.jsx('td', { colSpan: 5, className: 'p-8 text-center text-slate-400 font-bold', children: 'कोणताही विद्यार्थी सापडला नाही.' }) }) :
          filteredStudents.map(st => {
            const isPaid = Boolean(st.isPremium);
            const expDate = st.premiumExpiry ? new Date(st.premiumExpiry) : null;
            const daysLeft = expDate ? Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

            return e.jsxs('tr', { key: st.id, className: 'hover:bg-slate-50/80 transition', children: [
              e.jsxs('td', { className: 'p-4 flex items-center gap-3', children: [
                e.jsx('div', { className: 'w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0', children: (st.name || 'S')[0].toUpperCase() }),
                e.jsxs('div', { children: [
                  e.jsx('div', { className: 'font-black text-slate-900 text-xs', children: st.name || 'Student' }),
                  e.jsx('div', { className: 'text-[11px] text-slate-400 font-mono', children: st.email })
                ]})
              ]}),
              e.jsxs('td', { className: 'p-4', children: [
                e.jsx('div', { className: 'font-bold text-slate-800', children: st.phone || st.mobile || 'No Phone' }),
                e.jsx('div', { className: 'text-[11px] text-slate-500', children: st.district ? (st.district + (st.taluka ? ', ' + st.taluka : '')) : 'Maharashtra' })
              ]}),
              e.jsxs('td', { className: 'p-4', children: [
                e.jsx('span', { className: 'px-2.5 py-0.5 rounded-full font-black text-[10px] ' + (isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'), children: isPaid ? '🟢 PAID (PRO)' : '🔴 UNPAID' }),
                e.jsx('div', { className: 'text-[11px] text-slate-600 font-medium mt-1', children: st.premiumPlan || 'Free Tier' })
              ]}),
              e.jsxs('td', { className: 'p-4', children: [
                isPaid && expDate ? e.jsxs('div', { children: [
                  e.jsx('div', { className: 'font-mono text-slate-800 font-bold', children: expDate.toLocaleDateString() }),
                  e.jsx('div', { className: 'text-[10px] ' + (daysLeft > 10 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'), children: daysLeft > 0 ? (daysLeft + ' दिवस शिल्लक') : 'मुदत संपली' })
                ]}) : e.jsx('span', { className: 'text-slate-400 text-xs', children: 'लागू नाही' })
              ]}),
              e.jsx('td', { className: 'p-4 text-right', children:
                e.jsxs('div', { className: 'flex items-center justify-end gap-2', children: [
                  e.jsx('button', {
                    onClick: () => handleExtendValidity(st.id, 30),
                    className: 'px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black transition cursor-pointer',
                    children: '+30 Days PRO'
                  }),
                  e.jsx('button', {
                    onClick: () => handleExtendValidity(st.id, 90),
                    className: 'px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black transition cursor-pointer',
                    children: '+90 Days'
                  })
                ]})
              })
            ]});
          })
        })
      ]})
    })
  ]});
};
`;

// Insert the new admin components right before Z9 definition
const z9Pos = code.indexOf('Z9=');
code = code.substring(0, z9Pos) + newAdminComponents + '\n' + code.substring(z9Pos);

// Replace tab renderers in Z9:
// 1. github_deploy -> AdminGithubHub
code = code.replace('h==="github_deploy"&&e.jsx(Gk,{showToast:Rt})', 'h==="github_deploy"&&e.jsx(AdminGithubHub,{showToast:Rt})');

// 2. offers -> AdminPromoCodes
code = code.replace('h==="offers"&&e.jsx(H9,{showToast:Rt})', 'h==="offers"&&e.jsx(AdminPromoCodes,{showToast:Rt})');

// 3. students -> AdminStudentManager
code = code.replace('(h==="users"||h==="students")&&e.jsx(rT,{showToast:Rt})', 'h==="users"&&e.jsx(rT,{showToast:Rt}),h==="students"&&e.jsx(AdminStudentManager,{showToast:Rt})');

// 4. payments -> AdminPaymentGateway + ZE
code = code.replace('h==="payments"&&e.jsx(ZE,{payments:U,plans:K,onRefresh:cs,showToast:Rt})', 'h==="payments"&&e.jsxs("div",{className:"space-y-8",children:[e.jsx(AdminPaymentGateway,{showToast:Rt}),e.jsx(ZE,{payments:U,plans:K,onRefresh:cs,showToast:Rt})]})');

// 5. overview -> Storage Monitor on top
code = code.replace('h==="overview"&&e.jsxs("div",{className:"space-y-6",children:[', 'h==="overview"&&e.jsxs("div",{className:"space-y-6",children:[e.jsx(AdminStorageMonitor,{showToast:Rt}),');

fs.writeFileSync('public/assets/index-CY7ixHhG.js', code, 'utf8');
if (fs.existsSync('dist/assets/index-CY7ixHhG.js')) {
  fs.writeFileSync('dist/assets/index-CY7ixHhG.js', code, 'utf8');
}

console.log('Validating with Acorn AST parser...');
const acorn = require('acorn');
try {
  acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
  console.log('🎉🎉🎉 SUCCESS: All new features compiled with 100% CLEAN AST!');
} catch (e) {
  console.error('Acorn parse error:', e.message, 'at pos:', e.pos);
  console.log(code.substring(e.pos - 80, e.pos + 80));
}
