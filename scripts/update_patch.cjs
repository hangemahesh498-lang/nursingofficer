const fs = require("fs");
const patchPath = "scripts/patch_clean_components.cjs";
let patch = fs.readFileSync(patchPath, "utf8");

const startPos = patch.indexOf("const AdminSupabaseSyncHub =");
const targetEnd = patch.indexOf("code = code.replace", startPos);

if (startPos === -1 || targetEnd === -1) {
  console.error("Could not find AdminSupabaseSyncHub boundaries in patch script!");
  process.exit(1);
}

const newComponentCode = `const AdminSupabaseSyncHub = ({ showToast }) => {
  const { language: lang } = Ds();
  const [pinging, setPinging] = k.useState(false);
  const [syncing, setSyncing] = k.useState(false);
  const [uploadingFile, setUploadingFile] = k.useState(false);
  const [savingConfig, setSavingConfig] = k.useState(false);
  const [loadingConfig, setLoadingConfig] = k.useState(true);

  const [supabaseUrl, setSupabaseUrl] = k.useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = k.useState("");
  const [isConfigured, setIsConfigured] = k.useState(false);
  const [pingResult, setPingResult] = k.useState(null);

  // Real-time Chunked Upload State
  const [uploadProgress, setUploadProgress] = k.useState(0);
  const [processedCount, setProcessedCount] = k.useState(0);
  const [totalQuestionsCount, setTotalQuestionsCount] = k.useState(0);
  const [currentBatchNum, setCurrentBatchNum] = k.useState(0);
  const [totalBatchNum, setTotalBatchNum] = k.useState(0);
  const [uploadStatusText, setUploadStatusText] = k.useState("");
  const [uploadFileName, setUploadFileName] = k.useState("");
  const fileInputRef = k.useRef(null);

  k.useEffect(() => {
    let active = true;
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/supabase/config");
        const data = (res.ok && res.headers.get("content-type")?.includes("json")) ? await res.json() : null;
        if (active && data && data.success) {
          if (data.supabaseUrl) setSupabaseUrl(data.supabaseUrl);
          if (data.supabaseAnonKey) setSupabaseAnonKey(data.supabaseAnonKey);
          setIsConfigured(Boolean(data.isConfigured));
        }
      } catch (e) {
        console.warn("Config fetch error:", e);
      } finally {
        if (active) setLoadingConfig(false);
      }
    };
    fetchConfig();
    return () => { active = false; };
  }, []);

  const handleSaveConfig = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch("/api/admin/supabase/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supabaseUrl, supabaseAnonKey })
      });
      const data = (res.ok && res.headers.get("content-type")?.includes("json")) ? await res.json() : null;
      if (data && data.success) {
        setIsConfigured(Boolean(data.isConfigured));
        showToast && showToast(lang === "mr" ? "✅ सुपाबेस कॉन्फिगरेशन जतन झाले!" : "✅ Supabase config saved!", "success");
      } else {
        showToast && showToast((data && data.error) || "Save failed", "error");
      }
    } catch (err) {
      showToast && showToast(err.message || "Error saving config", "error");
    } finally {
      setSavingConfig(false);
    }
  };

  const handlePing = async () => {
    setPinging(true);
    setPingResult(null);
    try {
      const res = await fetch("/api/supabase/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supabaseUrl, supabaseAnonKey })
      });
      const data = (res.ok && res.headers.get("content-type")?.includes("json")) ? await res.json() : { success: false, statusText: "Connection failed" };
      setPingResult(data);
      if (data && data.success) {
        showToast && showToast(lang === "mr" ? "✅ सुपाबेस प्रोजेक्ट सक्रीय आहे!" : "✅ Supabase Project Active!", "success");
      } else {
        showToast && showToast((data && data.statusText) || "Ping failed", "error");
      }
    } catch (err) {
      setPingResult({ success: false, statusText: err.message });
      showToast && showToast(err.message, "error");
    } finally {
      setPinging(false);
    }
  };

  const executeBatchLoop = async (sessionId, totalBatches, totalQuestions) => {
    setSyncing(true);
    setUploadProgress(0);
    setProcessedCount(0);
    setTotalQuestionsCount(totalQuestions);
    setTotalBatchNum(totalBatches);

    let totalPushed = 0;

    for (let b = 0; b < totalBatches; b++) {
      setCurrentBatchNum(b + 1);
      setUploadStatusText(
        lang === "mr"
          ? "⚡ बॅच " + (b + 1) + " / " + totalBatches + " सुपाबेसवर सिंक होत आहे..."
          : "⚡ Syncing batch " + (b + 1) + " / " + totalBatches + " to Supabase..."
      );

      try {
        const res = await fetch("/api/admin/supabase/process-sync-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            batchIndex: b,
            pushToSupabase: true,
            saveToLocal: true,
            customUrl: supabaseUrl,
            customKey: supabaseAnonKey
          })
        });

        const data = (res.ok && res.headers.get("content-type")?.includes("json")) ? await res.json() : null;

        if (data && data.success) {
          setUploadProgress(data.percentage);
          setProcessedCount(data.processedCount);
          if (data.pushedSupabase) totalPushed += data.pushedSupabase;
        } else {
          console.warn("Batch " + b + " failed:", data?.error);
        }
      } catch (err) {
        console.warn("Batch " + b + " network error:", err);
      }

      // NON-BLOCKING YIELD 20ms TO PREVENT BROWSER HANG / FREEZE
      await new Promise(r => setTimeout(r, 20));
    }

    try {
      await fetch("/api/admin/supabase/upload-session/" + sessionId, { method: "DELETE" });
    } catch (e) {}

    setSyncing(false);
    setUploadProgress(100);
    setUploadStatusText(
      lang === "mr"
        ? "🎉 सिंक यशस्वी पूर्ण झाले! (" + totalQuestions.toLocaleString("mr-IN") + " प्रश्न सुपाबेसवर जोडले गेले)"
        : "🎉 Upload Completed! (" + totalQuestions.toLocaleString() + " questions synced)"
    );
    showToast && showToast(
      lang === "mr" ? "✅ सुपाबेस क्लाउड सिंक यशस्वीरित्या पूर्ण झाले!" : "✅ Supabase Cloud Upload Completed!",
      "success"
    );
  };

  const handleStartDirectSync = async () => {
    setSyncing(true);
    setUploadFileName(lang === "mr" ? "स्थानिक प्रश्न डेटाबेस (४०,००० प्रश्न)" : "Local Questions Database");
    setUploadStatusText(lang === "mr" ? "⚡ प्रश्न बॅचेस तयार होत आहेत..." : "⚡ Initializing questions batching...");
    setUploadProgress(5);

    try {
      const res = await fetch("/api/admin/supabase/init-direct-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchSize: 300 })
      });

      const data = (res.ok && res.headers.get("content-type")?.includes("json")) ? await res.json() : null;

      if (data && data.success) {
        setUploadProgress(10);
        await executeBatchLoop(data.sessionId, data.totalBatches, data.totalQuestions);
      } else {
        showToast && showToast((data && data.error) || "Direct sync failed", "error");
        setSyncing(false);
      }
    } catch (err) {
      showToast && showToast(err.message || "Network error", "error");
      setSyncing(false);
    }
  };

  const handleFileSelected = async (evt) => {
    const file = evt.target && evt.target.files && evt.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    setUploadFileName(file.name);
    setUploadStatusText(lang === "mr" ? "📄 फाइल वाचत आहे व प्रश्न विश्लेषित करत आहे..." : "📄 Reading file & parsing questions...");
    setUploadProgress(5);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/supabase/upload-file", {
        method: "POST",
        body: formData
      });

      const data = (res.ok && res.headers.get("content-type")?.includes("json")) ? await res.json() : null;

      if (data && data.success) {
        setUploadProgress(10);
        showToast && showToast(
          lang === "mr" ? "✅ " + data.totalQuestions + " प्रश्न सापडले! सिंक सुरू होत आहे..." : "✅ " + data.totalQuestions + " questions parsed! Syncing...",
          "info"
        );
        await executeBatchLoop(data.sessionId, data.totalBatches, data.totalQuestions);
      } else {
        showToast && showToast((data && data.error) || "File parse failed", "error");
        setSyncing(false);
      }
    } catch (err) {
      showToast && showToast(err.message || "File upload error", "error");
      setSyncing(false);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isBusy = pinging || syncing || uploadingFile || savingConfig || loadingConfig;

  return e.jsxs("div", { className: "space-y-6 max-w-5xl mx-auto", children: [
    // Real-Time Animated Live Upload Progress Bar
    (isBusy || uploadProgress > 0) && e.jsxs("div", { className: "bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-500/30 space-y-4 z-10 sticky top-2 backdrop-blur-md bg-slate-900/95", children: [
      e.jsxs("div", { className: "flex items-center justify-between", children: [
        e.jsxs("div", { className: "flex items-center gap-3", children: [
          e.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 flex items-center justify-center font-black text-white text-sm shadow-md animate-spin", children: "⚡" }),
          e.jsxs("div", { children: [
            e.jsx("h4", { className: "font-black text-sm text-white", children: uploadFileName || (lang === "mr" ? "सुपाबेस थेट क्लाउड सिंक" : "Supabase Live Direct Sync") }),
            e.jsx("p", { className: "text-xs text-slate-300 font-medium", children: uploadStatusText || (lang === "mr" ? "सुपाबेस प्रक्रिया सुरू आहे..." : "Processing Supabase upload...") })
          ]})
        ]}),
        e.jsxs("div", { className: "text-right", children: [
          e.jsxs("span", { className: "text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-mono", children: [uploadProgress, "%"] }),
          e.jsx("div", { className: "text-[10px] text-slate-400 font-mono", children: currentBatchNum > 0 ? ("बॅच " + currentBatchNum + " / " + totalBatchNum) : "सक्रिय" })
        ]})
      ]}),
      // Progress bar line
      e.jsx("div", { className: "w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700 shadow-inner", children: 
        e.jsx("div", { className: "bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-lg relative", style: { width: Math.max(5, uploadProgress) + "%" } })
      }),
      e.jsxs("div", { className: "flex items-center justify-between text-xs font-semibold text-slate-300 font-mono pt-1", children: [
        e.jsxs("span", { children: [lang === "mr" ? "प्रक्रिया पूर्ण प्रश्न: " : "Processed: ", processedCount.toLocaleString("mr-IN"), " / ", totalQuestionsCount.toLocaleString("mr-IN")] }),
        e.jsx("span", { className: "text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50", children: lang === "mr" ? "⚡ १००% हँग-फ्री पार्श्वभूमी प्रक्रिया" : "⚡ 100% Hang-Free Background Sync" })
      ]})
    ]}),

    // Supabase Connection Credentials Form
    e.jsxs("form", { onSubmit: handleSaveConfig, className: "bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5", children: [
      e.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5", children: [
        e.jsxs("div", { className: "flex items-center gap-3", children: [
          e.jsx("div", { className: "w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl shadow-xs", children: "⚡" }),
          e.jsxs("div", { children: [
            e.jsx("h3", { className: "text-base font-black text-slate-900", children: lang === "mr" ? "१. सुपाबेस कनेक्शन आणि क्रेडेन्शियल्स (Credentials)" : "1. Supabase Project Credentials" }),
            e.jsx("p", { className: "text-xs text-slate-500 font-medium", children: lang === "mr" ? "तुमच्या Supabase प्रोजेक्टचा URL आणि API Key प्रविष्ट करा" : "Set your Supabase project URL & Anon/Service Key" })
          ]})
        ]}),
        e.jsx("div", { className: "flex items-center gap-2", children: 
          isConfigured 
            ? e.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200", children: [e.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), lang === "mr" ? "कनेक्टेड (Configured)" : "Configured"] })
            : e.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200", children: [e.jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500" }), lang === "mr" ? "नॉट कनेक्टेड" : "Not Configured"] })
        })
      ]}),
      e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        e.jsxs("div", { className: "space-y-1.5", children: [
          e.jsx("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wider", children: "Supabase Project URL" }),
          e.jsx("input", { type: "text", value: supabaseUrl, onChange: (ev) => setSupabaseUrl(ev.target.value), placeholder: "https://your-project.supabase.co", className: "w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" })
        ]}),
        e.jsxs("div", { className: "space-y-1.5", children: [
          e.jsx("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wider", children: "Supabase Anon / Service Role Key" }),
          e.jsx("input", { type: "password", value: supabaseAnonKey, onChange: (ev) => setSupabaseAnonKey(ev.target.value), placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6...", className: "w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" })
        ]})
      ]}),
      e.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pt-2", children: [
        e.jsx("button", { type: "submit", disabled: savingConfig, className: "px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50", children: [
          savingConfig && e.jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
          lang === "mr" ? "💾 क्रेडेन्शियल्स सेव्ह करा" : "💾 Save Credentials"
        ]}),
        e.jsx("button", { type: "button", onClick: handlePing, disabled: pinging, className: "px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50", children: [
          pinging && e.jsx("div", { className: "w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" }),
          lang === "mr" ? "🔍 कनेक्शन तपासा (Ping Test)" : "🔍 Ping Test Connection"
        ]})
      ]}),
      pingResult && e.jsx("div", { className: "p-3.5 rounded-2xl text-xs font-bold font-mono border " + (pingResult.success ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"), children: pingResult.statusText || JSON.stringify(pingResult) })
    ]}),

    // Card 1: Question File Upload Hub directly from Website / App
    e.jsxs("div", { className: "bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5", children: [
      e.jsxs("div", { className: "flex items-center gap-3 border-b border-slate-100 pb-4", children: [
        e.jsx("div", { className: "w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl shadow-xs", children: "📁" }),
        e.jsxs("div", { children: [
          e.jsx("h3", { className: "text-base font-black text-slate-900", children: lang === "mr" ? "२. वेबसाईट किंवा ॲपवरून प्रश्न फाइल थेट अपलोड करा" : "2. Direct Question File Upload Hub" }),
          e.jsx("p", { className: "text-xs text-slate-500 font-medium", children: lang === "mr" ? "तुमच्या मोबाईल किंवा संगणकावरून SQL, CSV, JSON प्रश्न फाइल निवडा" : "Upload SQL dump, CSV, or JSON question file directly from your device" })
        ]})
      ]}),
      // Hidden File Input
      e.jsx("input", { type: "file", ref: fileInputRef, accept: ".sql,.csv,.json,.txt", onChange: handleFileSelected, className: "hidden" }),
      e.jsxs("div", { className: "border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-3xl p-8 text-center space-y-4 hover:border-indigo-400 transition-all cursor-pointer", onClick: () => fileInputRef.current && fileInputRef.current.click(), children: [
        e.jsx("div", { className: "w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg animate-bounce", children: "📤" }),
        e.jsxs("div", { className: "space-y-1", children: [
          e.jsx("h4", { className: "text-sm font-black text-slate-900", children: lang === "mr" ? "येथे फाइल ड्रॅग करा किंवा क्लिक करा" : "Click or Drag Question File Here" }),
          e.jsx("p", { className: "text-xs text-slate-500 font-medium", children: lang === "mr" ? "SQL Dump (.sql), CSV (.csv), किंवा JSON (.json) फाइल्स सपोर्टेड आहेत" : "Supports SQL Dump (.sql), CSV (.csv), JSON (.json)" })
        ]}),
        e.jsx("button", { type: "button", disabled: syncing || uploadingFile, className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50", children: [
          uploadingFile && e.jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
          lang === "mr" ? "📁 फाइल निवडा व ऑटो-सिंक सुरू करा" : "📁 Select Question File & Auto Sync"
        ]}),
        e.jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-bold text-slate-500 font-mono", children: [
          e.jsx("span", { className: "px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs", children: "✓ SQL (.sql)" }),
          e.jsx("span", { className: "px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs", children: "✓ CSV (.csv)" }),
          e.jsx("span", { className: "px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs", children: "✓ JSON (.json)" }),
          e.jsx("span", { className: "px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs", children: "⚡ १००% ऑटो-पार्शिंग" })
        ]})
      ]})
    ]}),

    // Card 2: 1-Click Direct Cloud Upload (४०,००० प्रश्न)
    e.jsxs("div", { className: "bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-lg space-y-5", children: [
      e.jsxs("div", { className: "flex items-center gap-3 border-b border-indigo-800/50 pb-4", children: [
        e.jsx("div", { className: "w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl shadow-xs border border-emerald-500/30", children: "🚀" }),
        e.jsxs("div", { children: [
          e.jsx("h3", { className: "text-base font-black text-white", children: lang === "mr" ? "३. १-क्लिक डायरेक्ट क्लाउड अपलोड (४०,००० प्रश्न)" : "3. 1-Click Direct Cloud Upload (40,000 Questions)" }),
          e.jsx("p", { className: "text-xs text-indigo-200 font-medium", children: lang === "mr" ? "स्थानिक डेटाबेसचे ४०,००० प्रश्न थेट सुपाबेसवर रिअल-टाईम सिंक करा" : "Push 40,000 local database questions directly to Supabase REST API" })
        ]})
      ]}),
      e.jsx("p", { className: "text-xs text-slate-300 leading-relaxed font-medium bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60", children: lang === "mr" ? "हे बटण क्लिक केल्यास सर्व ४०,००० प्रश्न ३००-३०० च्या सुरक्षित बॅचेसमध्ये सुपाबेसवर पुश होतात. नोटीपॅडची किंवा मॅन्युअल कॉपी-पेस्टची अजिबात गरज नाही." : "Clicking this button pushes all 40,000 questions in non-blocking 300-item batches to Supabase REST API." }),
      e.jsx("button", { type: "button", onClick: handleStartDirectSync, disabled: syncing || uploadingFile, className: "w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 transform hover:scale-[1.01]", children: [
        syncing && e.jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
        lang === "mr" ? "🚀 स्वयंचलित थेट सुपाबेस सिंक सुरू करा (40,000 Questions)" : "🚀 Start Automatic Direct Supabase Cloud Sync"
      ]})
    ]}),

    // Card 3: 4 Split SQL Parts Download
    e.jsxs("div", { className: "bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5", children: [
      e.jsxs("div", { className: "flex items-center gap-3 border-b border-slate-100 pb-4", children: [
        e.jsx("div", { className: "w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl shadow-xs", children: "📄" }),
        e.jsxs("div", { children: [
          e.jsx("h3", { className: "text-base font-black text-slate-900", children: lang === "mr" ? "४. ४ लहान भागांमध्ये SQL फाइल्स डाऊनलोड (ऑप्शनल मॅन्युअल सोल्यूशन)" : "4. Download SQL Dump in 4 Small Parts (~20MB Each)" }),
          e.jsx("p", { className: "text-xs text-slate-500 font-medium", children: lang === "mr" ? "नोटीपॅड हँग होऊ नये म्हणून ९४ MB फाइलचे ४ लहान भाग तयार केले आहेत" : "Split into 4 small parts (~20MB each) so Notepad/browser never hangs" })
        ]})
      ]}),
      e.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3", children: [
        e.jsxs("a", { href: "/api/admin/supabase/download-sql?part=1", download: true, className: "p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl space-y-2 block transition-all group", children: [
          e.jsx("div", { className: "font-black text-xs text-slate-800 group-hover:text-indigo-600 transition-colors", children: "Part 1 (Q 1-10,000)" }),
          e.jsx("div", { className: "text-[10px] text-slate-500 font-mono", children: "Size: 19.5 MB" }),
          e.jsx("div", { className: "text-[11px] font-bold text-emerald-600 flex items-center gap-1", children: [e.jsx("span", { children: "⬇️ Download" })] })
        ]}),
        e.jsxs("a", { href: "/api/admin/supabase/download-sql?part=2", download: true, className: "p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl space-y-2 block transition-all group", children: [
          e.jsx("div", { className: "font-black text-xs text-slate-800 group-hover:text-indigo-600 transition-colors", children: "Part 2 (Q 10,001-20,000)" }),
          e.jsx("div", { className: "text-[10px] text-slate-500 font-mono", children: "Size: 25.1 MB" }),
          e.jsx("div", { className: "text-[11px] font-bold text-emerald-600 flex items-center gap-1", children: [e.jsx("span", { children: "⬇️ Download" })] })
        ]}),
        e.jsxs("a", { href: "/api/admin/supabase/download-sql?part=3", download: true, className: "p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl space-y-2 block transition-all group", children: [
          e.jsx("div", { className: "font-black text-xs text-slate-800 group-hover:text-indigo-600 transition-colors", children: "Part 3 (Q 20,001-30,000)" }),
          e.jsx("div", { className: "text-[10px] text-slate-500 font-mono", children: "Size: 24.2 MB" }),
          e.jsx("div", { className: "text-[11px] font-bold text-emerald-600 flex items-center gap-1", children: [e.jsx("span", { children: "⬇️ Download" })] })
        ]}),
        e.jsxs("a", { href: "/api/admin/supabase/download-sql?part=4", download: true, className: "p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl space-y-2 block transition-all group", children: [
          e.jsx("div", { className: "font-black text-xs text-slate-800 group-hover:text-indigo-600 transition-colors", children: "Part 4 (Q 30,001-40,000)" }),
          e.jsx("div", { className: "text-[10px] text-slate-500 font-mono", children: "Size: 25.2 MB" }),
          e.jsx("div", { className: "text-[11px] font-bold text-emerald-600 flex items-center gap-1", children: [e.jsx("span", { children: "⬇️ Download" })] })
        ]})
      ]})
    ]})
  ]});
};`;

patch = patch.substring(0, startPos) + newComponentCode + patch.substring(targetEnd);
fs.writeFileSync(patchPath, patch, "utf8");
console.log("Successfully replaced AdminSupabaseSyncHub in patch script!");
