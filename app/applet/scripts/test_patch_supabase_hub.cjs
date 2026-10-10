const fs = require('fs');
const acorn = require('acorn');

const sourceFile = 'android/app/src/main/assets/public/assets/index-v3-fixed.js';
let content = fs.readFileSync(sourceFile, 'utf8');

// Define AdminSupabaseSyncHub component
const syncHubCode = `
function AdminSupabaseSyncHub(props) {
  var lang = props.lang || 'mr';
  var showToast = props.showToast || function(msg, type) { console.log(type, msg); };
  
  var urlState = k.useState('');
  var supabaseUrl = urlState[0];
  var setSupabaseUrl = urlState[1];

  var keyState = k.useState('');
  var supabaseAnonKey = keyState[0];
  var setSupabaseAnonKey = keyState[1];

  var pingingState = k.useState(false);
  var pinging = pingingState[0];
  var setPinging = pingingState[1];

  var pingResultState = k.useState(null);
  var pingResult = pingResultState[0];
  var setPingResult = pingResultState[1];

  var syncingState = k.useState(false);
  var syncing = syncingState[0];
  var setSyncing = syncingState[1];

  var syncResultState = k.useState(null);
  var syncResult = syncResultState[0];
  var setSyncResult = syncResultState[1];

  // Upload progress states
  var uploadingState = k.useState(false);
  var uploading = uploadingState[0];
  var setUploading = uploadingState[1];

  var progressPercentState = k.useState(0);
  var progressPercent = progressPercentState[0];
  var setProgressPercent = progressPercentState[1];

  var processedCountState = k.useState(0);
  var processedCount = processedCountState[0];
  var setProcessedCount = processedCountState[1];

  var totalQuestionsState = k.useState(0);
  var totalQuestions = totalQuestionsState[0];
  var setTotalQuestions = totalQuestionsState[1];

  var currentBatchState = k.useState(0);
  var currentBatch = currentBatchState[0];
  var setCurrentBatch = currentBatchState[1];

  var totalBatchesState = k.useState(0);
  var totalBatches = totalBatchesState[0];
  var setTotalBatches = totalBatchesState[1];

  var uploadStatusState = k.useState('');
  var uploadStatus = uploadStatusState[0];
  var setUploadStatus = uploadStatusState[1];

  var cancelRef = k.useRef(false);

  k.useEffect(function() {
    fetch('/api/admin/supabase/config')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.success && data.config) {
          if (data.config.supabaseUrl) setSupabaseUrl(data.config.supabaseUrl);
          if (data.config.supabaseAnonKey) setSupabaseAnonKey(data.config.supabaseAnonKey);
        }
      })
      .catch(function(e) { console.warn('Failed to load Supabase config:', e); });
  }, []);

  var handleSaveConfig = async function() {
    try {
      var res = await fetch('/api/admin/supabase/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl: supabaseUrl.trim(),
          supabaseAnonKey: supabaseAnonKey.trim()
        })
      });
      var data = await res.json();
      if (data && data.success) {
        showToast(lang === 'mr' ? '✅ Supabase क्रेडेंशियल्स सुरक्षितपणे सेव्ह झाले!' : '✅ Supabase credentials saved successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to save config', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving config', 'error');
    }
  };

  var handleTestPing = async function() {
    setPinging(true);
    setPingResult(null);
    try {
      var res = await fetch('/api/supabase/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl: supabaseUrl.trim() || undefined,
          supabaseAnonKey: supabaseAnonKey.trim() || undefined
        })
      });
      var data = await res.json();
      setPingResult(data);
      if (data.success) {
        showToast(lang === 'mr' ? '✅ Supabase कनेक्शन सक्रिय आणि जागे झाले आहे!' : '✅ Supabase connected and active!', 'success');
      } else {
        showToast(data.error || 'Ping failed', 'error');
      }
    } catch (err) {
      setPingResult({ success: false, error: err.message });
      showToast(err.message, 'error');
    } finally {
      setPinging(false);
    }
  };

  var handleRealtimeSync = async function(mode) {
    if (syncing) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      var res = await fetch('/api/admin/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl: supabaseUrl.trim() || undefined,
          supabaseKey: supabaseAnonKey.trim() || undefined,
          mode: mode || 'bidirectional'
        })
      });
      var data = await res.json();
      setSyncResult(data);
      if (data.success) {
        showToast(lang === 'mr' ? ('✅ ' + data.message) : ('✅ ' + data.message), 'success');
      } else {
        showToast(data.message || data.error || 'Sync failed', 'error');
      }
    } catch (err) {
      setSyncResult({ success: false, message: err.message });
      showToast(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  var handleStartDirectUpload = async function() {
    if (uploading) return;
    setUploading(true);
    cancelRef.current = false;
    setProgressPercent(0);
    setProcessedCount(0);
    setUploadStatus(lang === 'mr' ? '४०,००० प्रश्नांचे सेशन्स तयार होत आहे...' : 'Initializing 40,000 questions session...');

    try {
      var initRes = await fetch('/api/admin/supabase/init-direct-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customUrl: supabaseUrl.trim() || undefined,
          customKey: supabaseAnonKey.trim() || undefined
        })
      });
      var initData = await initRes.json();
      if (!initData.success) {
        throw new Error(initData.error || 'Initialization failed');
      }

      var sessionId = initData.sessionId;
      var totalB = initData.totalBatches;
      var totalQ = initData.totalQuestions;

      setTotalBatches(totalB);
      setTotalQuestions(totalQ);

      for (var bIdx = 0; bIdx < totalB; bIdx++) {
        if (cancelRef.current) {
          setUploadStatus(lang === 'mr' ? '⚠️ अपलोड प्रक्रिया थांबवली (Paused/Cancelled)' : '⚠️ Upload paused/cancelled');
          showToast(lang === 'mr' ? 'अपलोड थांबवण्यात आले' : 'Upload cancelled', 'warning');
          break;
        }

        setCurrentBatch(bIdx + 1);
        setUploadStatus(lang === 'mr' ? ('बॅच ' + (bIdx + 1) + ' / ' + totalB + ' अपलोड होत आहे...') : ('Uploading batch ' + (bIdx + 1) + ' / ' + totalB + '...'));

        var batchRes = await fetch('/api/admin/supabase/process-sync-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId,
            batchIndex: bIdx,
            pushToSupabase: true,
            customUrl: supabaseUrl.trim() || undefined,
            customKey: supabaseAnonKey.trim() || undefined
          })
        });

        var batchData = await batchRes.json();
        if (batchData.success) {
          setProgressPercent(batchData.percentage || Math.round(((bIdx + 1) / totalB) * 100));
          setProcessedCount(batchData.processedCount || ((bIdx + 1) * 300));
        }

        // Small non-blocking delay so browser UI updates smoothly without freezing
        await new Promise(function(resolve) { setTimeout(resolve, 20); });
      }

      if (!cancelRef.current) {
        setProgressPercent(100);
        setProcessedCount(totalQ);
        setUploadStatus(lang === 'mr' ? '🎉 सर्व ४०,००० प्रश्न सुपाबेसवर यशस्वीपणे अपलोड झाले!' : '🎉 All 40,000 questions successfully uploaded to Supabase!');
        showToast(lang === 'mr' ? '🎉 ४०,००० प्रश्न अपलोड यशस्वी!' : '🎉 40,000 questions uploaded successfully!', 'success');
      }
    } catch (err) {
      setUploadStatus(lang === 'mr' ? ('❌ त्रुटी: ' + err.message) : ('❌ Error: ' + err.message));
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  var handleCancelUpload = function() {
    cancelRef.current = true;
  };

  return e.jsxs('div', {
    className: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50 p-6 rounded-2xl border border-emerald-200 shadow-md space-y-6',
    children: [
      e.jsxs('div', {
        className: 'flex items-center justify-between border-b border-emerald-200/70 pb-4',
        children: [
          e.jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              e.jsx('div', {
                className: 'w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-lg font-black text-xl shrink-0',
                children: '⚡'
              }),
              e.jsxs('div', {
                children: [
                  e.jsx('h3', {
                    className: 'font-extrabold text-slate-900 text-base',
                    children: lang === 'mr' ? '⚡ Supabase रिअल-टाईम सिंक व ४०,००० क्लाउड अपलोड हब' : '⚡ Supabase Real-time Sync & 40,000 Cloud Upload Hub'
                  }),
                  e.jsx('p', {
                    className: 'text-xs text-slate-600 font-medium',
                    children: lang === 'mr' ? 'लाइव्ह डेटाबेस सिंक, अचूक बॅच अपलोड व प्रोग्रेस ट्रॅकर (Zero UI Hang Guaranteed).' : 'Live DB two-way sync, non-blocking batch upload & real-time progress monitor.'
                  })
                ]
              })
            ]
          }),
          e.jsx('span', {
            className: 'px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs',
            children: lang === 'mr' ? '🟢 रिअल-टाईम कनेक्टेड' : '🟢 Realtime Active'
          })
        ]
      }),

      e.jsxs('div', {
        className: 'bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-4',
        children: [
          e.jsx('h4', {
            className: 'font-bold text-xs text-slate-800 flex items-center gap-1.5',
            children: lang === 'mr' ? '१. Supabase प्रोजेक्ट तपशील (Credentials & Ping):' : '1. Supabase Project Credentials & Ping:'
          }),
          e.jsxs('div', {
            className: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
            children: [
              e.jsxs('div', {
                children: [
                  e.jsx('label', {
                    className: 'block text-[11px] font-bold text-slate-700 mb-1',
                    children: 'Supabase Project URL:'
                  }),
                  e.jsx('input', {
                    type: 'text',
                    value: supabaseUrl,
                    onChange: function(v) { setSupabaseUrl(v.target.value); },
                    placeholder: 'https://xyzabcdefghijklm.supabase.co',
                    className: 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500'
                  })
                ]
              }),
              e.jsxs('div', {
                children: [
                  e.jsx('label', {
                    className: 'block text-[11px] font-bold text-slate-700 mb-1',
                    children: 'Supabase Anon Public Key:'
                  }),
                  e.jsx('input', {
                    type: 'password',
                    value: supabaseAnonKey,
                    onChange: function(v) { setSupabaseAnonKey(v.target.value); },
                    placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    className: 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500'
                  })
                ]
              })
            ]
          }),
          e.jsxs('div', {
            className: 'flex flex-wrap items-center gap-2.5 pt-1',
            children: [
              e.jsx('button', {
                type: 'button',
                onClick: handleSaveConfig,
                className: 'px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs',
                children: lang === 'mr' ? '💾 क्रेडेंशियल्स सेव्ह करा (Save Config)' : '💾 Save Credentials'
              }),
              e.jsx('button', {
                type: 'button',
                onClick: handleTestPing,
                disabled: pinging,
                className: 'px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50',
                children: pinging ? (lang === 'mr' ? 'तपासत आहे...' : 'Testing...') : (lang === 'mr' ? '⚡ टेस्ट पिंग पाठवा (Test Ping)' : '⚡ Test Connection Ping')
              })
            ]
          }),
          pingResult && e.jsxs('div', {
            className: 'p-3 rounded-xl border text-xs ' + (pingResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'),
            children: [
              e.jsx('span', { className: 'font-bold block', children: pingResult.success ? (lang === 'mr' ? '✅ प्रोजेक्ट सक्रिय आहे (Connected & Active)' : '✅ Project is Awake & Active') : (lang === 'mr' ? '❌ पिंग अयशस्वी (Connection Failed)' : '❌ Ping Failed') }),
              e.jsx('p', { className: 'text-[11px] mt-0.5', children: pingResult.message || pingResult.error })
            ]
          })
        ]
      }),

      e.jsxs('div', {
        className: 'bg-white p-5 rounded-2xl border border-indigo-100 shadow-xs space-y-4',
        children: [
          e.jsx('h4', {
            className: 'font-bold text-xs text-slate-800 flex items-center gap-1.5',
            children: lang === 'mr' ? '२. रिअल-टाईम टू-वे सिंक (Real-time Live Sync):' : '2. Real-time Live Sync (Questions Push & Pull):'
          }),
          e.jsx('p', {
            className: 'text-xs text-slate-600',
            children: lang === 'mr' ? 'स्थानिक डेटाबेस आणि सुपाबेस क्लाउडमधील सर्व प्रश्न परस्पर सिंक करा. नवीन प्रश्न आपोआप जोडले जातात.' : 'Sync local database with Supabase REST API bi-directionally without blocking the user interface.'
          }),
          e.jsxs('div', {
            className: 'flex flex-wrap items-center gap-3',
            children: [
              e.jsx('button', {
                type: 'button',
                onClick: function() { handleRealtimeSync('bidirectional'); },
                disabled: syncing,
                className: 'px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50',
                children: syncing ? (lang === 'mr' ? '🔄 सिंक सुरू आहे...' : '🔄 Syncing...') : (lang === 'mr' ? '🔄 थेट सुपाबेस रिअल-टाईम सिंक (Two-Way Sync)' : '🔄 Supabase Real-time Sync')
              }),
              e.jsx('button', {
                type: 'button',
                onClick: function() { handleRealtimeSync('pull_only'); },
                disabled: syncing,
                className: 'px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50',
                children: lang === 'mr' ? '⬇️ फक्त क्लाउडवरून डाऊनलोड करा (Pull Only)' : '⬇️ Pull From Cloud'
              })
            ]
          }),
          syncResult && e.jsxs('div', {
            className: 'p-3 rounded-xl border text-xs ' + (syncResult.success ? 'bg-indigo-50 border-indigo-200 text-indigo-950' : 'bg-rose-50 border-rose-300 text-rose-950'),
            children: [
              e.jsx('span', { className: 'font-bold block', children: syncResult.success ? '✅ सिंक यशस्वी!' : '❌ सिंक अयशस्वी' }),
              e.jsx('p', { className: 'text-[11px] mt-0.5', children: syncResult.message || syncResult.error })
            ]
          })
        ]
      }),

      e.jsxs('div', {
        className: 'bg-white p-5 rounded-2xl border border-teal-100 shadow-xs space-y-4',
        children: [
          e.jsx('h4', {
            className: 'font-bold text-xs text-slate-800 flex items-center gap-1.5',
            children: lang === 'mr' ? '३. ४०,००० प्रश्न १-क्लिक डायरेक्ट क्लाउड अपलोड (Real-time Progress Tracker):' : '3. 40,000 Questions 1-Click Direct Cloud Upload:'
          }),
          e.jsx('p', {
            className: 'text-xs text-slate-600',
            children: lang === 'mr' ? 'सर्व ४०,००० प्रश्न ३००-३०० च्या सुरक्षित बॅचेसमध्ये सुपाबेसवर पुश होतात. प्रोग्रेस बार रिअल-टाईममध्ये टक्केवारी आणि अपलोड झालेले प्रश्न अचूक दाखवतो.' : 'Uploads 40,000 questions in safe 300-item chunks to Supabase REST API with non-blocking progress updates.'
          }),
          e.jsxs('div', {
            className: 'flex flex-wrap items-center gap-3',
            children: [
              e.jsx('button', {
                type: 'button',
                onClick: handleStartDirectUpload,
                disabled: uploading,
                className: 'px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-2',
                children: uploading ? (lang === 'mr' ? '🚀 अपलोड चालू आहे...' : '🚀 Uploading...') : (lang === 'mr' ? '🚀 ४०,००० प्रश्न क्लाउडवर अपलोड करा (Start Upload)' : '🚀 Start 40,000 Questions Upload')
              }),
              uploading && e.jsx('button', {
                type: 'button',
                onClick: handleCancelUpload,
                className: 'px-4 py-3 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold transition cursor-pointer',
                children: lang === 'mr' ? '⏹️ थांबवा (Cancel)' : '⏹️ Cancel'
              })
            ]
          }),

          (uploading || progressPercent > 0) && e.jsxs('div', {
            className: 'p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3',
            children: [
              e.jsxs('div', {
                className: 'flex items-center justify-between text-xs font-bold text-slate-800',
                children: [
                  e.jsx('span', { children: uploadStatus }),
                  e.jsx('span', { className: 'text-emerald-700 font-mono text-sm', children: progressPercent + '%' })
                ]
              }),
              e.jsx('div', {
                className: 'w-full bg-slate-200 rounded-full h-3.5 overflow-hidden shadow-inner',
                children: e.jsx('div', {
                  className: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 h-full transition-all duration-300 rounded-full',
                  style: { width: progressPercent + '%' }
                })
              }),
              e.jsxs('div', {
                className: 'flex items-center justify-between text-[11px] text-slate-500 font-semibold',
                children: [
                  e.jsx('span', {
                    children: lang === 'mr' ? ('प्रक्रिया झालेले: ' + processedCount.toLocaleString() + ' / ' + (totalQuestions || 40000).toLocaleString() + ' प्रश्न') : ('Processed: ' + processedCount.toLocaleString() + ' / ' + (totalQuestions || 40000).toLocaleString() + ' Questions')
                  }),
                  totalBatches > 0 && e.jsx('span', {
                    children: lang === 'mr' ? ('बॅच: ' + currentBatch + ' / ' + totalBatches) : ('Batch: ' + currentBatch + ' / ' + totalBatches)
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}
`;

// Insert AdminSupabaseSyncHub definition right at the beginning of content
content = syncHubCode + '\n' + content;

// Now find where the old Supabase Keep-alive card is in settings tab, and also render e.jsx(AdminSupabaseSyncHub, { lang: s, showToast: Rt })
const targetStr = 'e.jsxs("div",{className:"bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-4",children:[e.jsx("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-3",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0",children:e.jsx(Er,{className:"w-5 h-5 text-emerald-100"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h3",{className:"font-extrabold text-slate-900 text-sm",children:s==="mr"?"⚡ Supabase स्लीप प्रिव्हेंशन (Keep-Alive Manager)":"⚡ Supabase 7-Day Keep-Alive Manager"}),e.jsx("span",{className:"px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300",children:s==="mr"?"स्वयंचलित सक्रिय":"Active Automation"})]}),e.jsx("p",{className:"text-xs text-slate-600",children:s==="mr"?"Supabase Free Tier प्रोजेक्ट ७ दिवसांत स्लीप (Pause) होण्यापासून वाचवण्यासाठी स्वयंचलित क्रॉन व पिंग सिस्टीम.":"Prevents Supabase Free Tier projects from going to sleep after 7 days of inactivity via automated pings."})]})]})})';

if (!content.includes(targetStr)) {
  console.error("Target string not found in content!");
  process.exit(1);
}

// Replace targetStr to render AdminSupabaseSyncHub cleanly in settings
content = content.replace(targetStr, 'e.jsx(AdminSupabaseSyncHub,{lang:s,showToast:Rt}),' + targetStr);

// Verify with acorn.parse!
try {
  acorn.parse(content, { ecmaVersion: 2022, sourceType: 'module' });
  console.log("SUCCESS! AST IS 100% VALID!");
  // Write to test file
  fs.writeFileSync('test_patched_bundle.js', content, 'utf8');
} catch (err) {
  console.error("ACORN ERROR:", err.message, "at line", err.loc ? err.loc.line : "?", "col", err.loc ? err.loc.column : "?");
  process.exit(1);
}
