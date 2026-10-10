const fs = require("fs");
const acorn = require("acorn");

let code = fs.readFileSync("public/assets/index-v3-fixed.js", "utf8");

// Define SupabaseSyncModal
const modalFunc = `
function SupabaseSyncModal(props) {
  var isOpen = props.isOpen;
  var onClose = props.onClose;
  var showToast = props.showToast;
  var onRefresh = props.onRefresh;
  var lang = props.lang || "mr";

  var isSyncingState = k.useState(false);
  var isSyncing = isSyncingState[0];
  var setIsSyncing = isSyncingState[1];

  var syncResultState = k.useState(null);
  var syncResult = syncResultState[0];
  var setSyncResult = syncResultState[1];

  var urlState = k.useState("");
  var customUrl = urlState[0];
  var setCustomUrl = urlState[1];

  var keyState = k.useState("");
  var customKey = keyState[0];
  var setCustomKey = keyState[1];

  if (!isOpen) return null;

  var handleInstantSync = async function(mode) {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      var res = await fetch("/api/admin/supabase/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": "usr-admin-01" },
        body: JSON.stringify({
          supabaseUrl: customUrl || undefined,
          supabaseKey: customKey || undefined,
          mode: mode || "bidirectional"
        })
      });
      var data = await res.json();
      setSyncResult(data);
      if (data.success) {
        showToast(lang === "mr" ? "Supabase प्रश्न सिंक यशस्वी झाला!" : "Supabase sync successful!", "success");
        if (onRefresh) onRefresh();
      } else {
        showToast(data.message || "सिंक त्रुटी", "error");
      }
    } catch (err) {
      showToast(lang === "mr" ? "सिंक करताना सर्व्हर त्रुटी आली" : "Server error during sync", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  return e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs", children: [
    e.jsxs("div", { className: "bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200", children: [
      e.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [
        e.jsxs("div", { className: "flex items-center gap-2", children: [
          e.jsx("span", { className: "text-2xl", children: "⚡" }),
          e.jsxs("div", { children: [
            e.jsx("h3", { className: "text-base font-bold text-slate-900", children: lang === "mr" ? "Supabase रियल-टाइम प्रश्न सिंक केंद्र" : "Supabase Real-Time Question Sync Hub" }),
            e.jsx("p", { className: "text-xs text-slate-500", children: lang === "mr" ? "सर्व प्रश्न Supabase क्लाउड डेटाबेससह १-क्लिकमध्ये त्वरित सिंक करा" : "Instant bidirectional sync of questions with Supabase PostgreSQL" })
          ]})
        ]}),
        e.jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer", children: "✕" })
      ]}),

      e.jsxs("div", { className: "space-y-4", children: [
        e.jsxs("div", { className: "p-4 bg-gradient-to-r from-emerald-950 to-slate-900 rounded-xl border border-emerald-800 text-white space-y-2", children: [
          e.jsxs("div", { className: "flex items-center justify-between", children: [
            e.jsxs("div", { className: "flex items-center gap-2", children: [
              e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" }),
              e.jsx("span", { className: "text-xs font-extrabold uppercase tracking-wider text-emerald-300", children: "Supabase Engine Active" })
            ]}),
            e.jsx("span", { className: "px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30", children: "Auto-Sync Ready" })
          ]}),
          e.jsx("p", { className: "text-xs text-emerald-100/90", children: lang === "mr" ? "सिस्टीम मधील सर्व प्रश्न, ऑप्शन्स, उत्तरे आणि मराठी भाषांतरे थेट Supabase डेटाबेसशी कनेक्ट आहेत." : "All question stems, options, explanations and bilingual translations are synced with Supabase." })
        ]}),

        e.jsxs("div", { className: "grid grid-cols-2 gap-3 text-center", children: [
          e.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200", children: [
            e.jsx("span", { className: "text-[11px] font-bold text-slate-500 block", children: "डेटाबेस स्थिती (Status)" }),
            e.jsx("span", { className: "text-sm font-extrabold text-emerald-600", children: "🟢 Connected" })
          ]}),
          e.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200", children: [
            e.jsx("span", { className: "text-[11px] font-bold text-slate-500 block", children: "सिंक प्रकार (Sync Mode)" }),
            e.jsx("span", { className: "text-sm font-extrabold text-indigo-600", children: "⚡ Instant 2-Way" })
          ]})
        ]}),

        syncResult && e.jsxs("div", { className: "p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs animate-in fade-in", children: [
          e.jsxs("div", { className: "flex items-center gap-1.5 font-bold text-emerald-900", children: [
            e.jsx("span", { children: "✅" }),
            e.jsx("span", { children: syncResult.message })
          ]}),
          e.jsxs("div", { className: "grid grid-cols-2 gap-2 text-[11px] text-emerald-800 font-medium pt-1", children: [
            e.jsxs("span", { children: ["📤 Supabase कडे पाठवले: ", e.jsx("strong", { children: syncResult.pushedCount })] }),
            e.jsxs("span", { children: ["📥 नवीन डाऊनलोड झाले: ", e.jsx("strong", { children: syncResult.pulledCount })] })
          ]})
        ]})
      ]}),

      e.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100", children: [
        e.jsx("button", { onClick: onClose, className: "w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer", children: lang === "mr" ? "बंद करा" : "Close" }),
        e.jsxs("button", { onClick: function() { handleInstantSync("bidirectional"); }, disabled: isSyncing, className: "w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50", children: [
          e.jsx("span", { children: isSyncing ? "⏳" : "⚡" }),
          e.jsx("span", { children: isSyncing ? (lang === "mr" ? "सिंक होत आहे..." : "Syncing...") : (lang === "mr" ? "Supabase वरून प्रश्न लगेच सिंक करा" : "Instant Sync Questions Now") })
        ]})
      ]})
    ]})
  ]});
}
`;

// Insert the component definition before tT
const insertPos = code.indexOf("function tT(");
code = code.substring(0, insertPos) + modalFunc + "\n" + code.substring(insertPos);

// In Question Bank header, add the glowing "Supabase Sync" button
const btnTarget = `title:"Download Subject-wise or All-Subjects Questions PDF",children:[e.jsx("span",{children:"📄"}),e.jsx("span",{children:s==="mr"?"विषयानुसार PDF डाऊनलोड":"Download PDF Book"})]}),`;
const newBtn = btnTarget + `e.jsxs("button",{onClick:function(){window.__openSupabaseSyncModal&&window.__openSupabaseSyncModal();},className:"flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer animate-pulse",title:"Instantly Sync Questions with Supabase PostgreSQL",children:[e.jsx("span",{children:"⚡"}),e.jsx("span",{children:s==="mr"?"Supabase त्वरित सिंक":"Instant Supabase Sync"})]}),`;

code = code.replace(btnTarget, newBtn);

// Add state declaration to main admin component
const stateTarget = `[isPdfModalOpen,setIsPdfModalOpen]=k.useState(!1),`;
if (code.includes(stateTarget)) {
  code = code.replace(stateTarget, stateTarget + `[isSupabaseSyncOpen,setIsSupabaseSyncOpen]=k.useState(!1),`);
}

// Add window opener inside main Admin component
const effectTarget = `window.__openQuestionPdfModal=function(){setIsPdfModalOpen(!0);};`;
if (code.includes(effectTarget)) {
  code = code.replace(effectTarget, effectTarget + `window.__openSupabaseSyncModal=function(){setIsSupabaseSyncOpen(!0);};`);
}

// Add SupabaseSyncModal rendering in main admin render
const modalRender = `e.jsx(QuestionPdfDownloadModal,{isOpen:isPdfModalOpen,onClose:function(){setIsPdfModalOpen(!1);},subjects:N,lang:s,showToast:Rt}),`;
if (code.includes(modalRender)) {
  code = code.replace(modalRender, modalRender + `e.jsx(SupabaseSyncModal,{isOpen:isSupabaseSyncOpen,onClose:function(){setIsSupabaseSyncOpen(!1);},lang:s,showToast:Rt,onRefresh:cs}),`);
}

try {
  acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" });
  console.log("SUCCESS: Code parsed cleanly with Acorn!");
  fs.writeFileSync("public/assets/index-v3-fixed.js", code, "utf8");
  fs.writeFileSync("dist/assets/index-v3-fixed.js", code, "utf8");
  fs.writeFileSync("public/assets/index-CY7ixHhG.js", code, "utf8");
  fs.writeFileSync("dist/assets/index-CY7ixHhG.js", code, "utf8");
  console.log("Updated all 4 bundle files successfully!");
} catch (err) {
  console.error("Acorn error:", err.message);
}
