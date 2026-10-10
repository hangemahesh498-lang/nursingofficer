const fs = require("fs");
const path = require("path");
const acorn = require("acorn");

const bundlePath = path.resolve(__dirname, "../public/assets/index-v3-fixed.js");
let bundle = fs.readFileSync(bundlePath, "utf8");

console.log("Original bundle length:", bundle.length);

const exactTarget = 'ge||"Payment submission failed")}finally{Z(!1)}}};return e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8",children:[';

const reviewModeView = 'if(d&&d.is_payment_enabled===!1){return e.jsxs("div",{className:"max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in",children:[e.jsxs("div",{className:"bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-4 text-center relative overflow-hidden",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider mx-auto",children:[e.jsx(Pn,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{children:"🎉 Play Store Review Access Mode"})]}),e.jsx("h2",{className:"text-2xl sm:text-3xl font-black text-white leading-tight",children:n==="mr"?"सर्व सराव चाचण्या आणि विषय मोफत उपलब्ध!":"All Practice Question Banks & Mock Tests Unlocked Free!"}),e.jsx("p",{className:"text-xs sm:text-sm text-teal-100/90 max-w-xl mx-auto font-medium",children:n==="mr"?"महाराष्ट्र आरोग्य भरती (DMER/DHS/ZP) आणि ऑल-इंडिया (AIIMS NORCET, RRB, ESIC, CHO) परीक्षांचे सर्व ३६ विषय आणि ५०+ ग्रँड मॉक टेस्ट्स सरावासाठी मोफत उपलब्ध आहेत.":"Access all 36 Nursing MCQ subjects, clinical case scenarios, and 50+ grand mock test series with zero paywall barriers."}),e.jsxs("div",{className:"pt-2 flex flex-wrap items-center justify-center gap-3",children:[e.jsxs("a",{href:"https://nursingofficer.web.app/",target:"_blank",rel:"noreferrer",className:"px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition cursor-pointer flex items-center gap-2",children:[e.jsx(si,{className:"w-4 h-4 text-teal-300"}),e.jsx("span",{children:"🌐 Official Web Portal"})]})]})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4",children:[e.jsx("h3",{className:"text-base font-extrabold text-slate-900 flex items-center gap-2",children:[e.jsx(ts,{className:"w-5 h-5 text-teal-600"}),e.jsx("span",{children:n==="mr"?"सराव चाचण्या आणि अभ्यास वैशिष्ट्ये":"Available Exam Modules & Practice Engine"})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700",children:["📚 सर्व ३६ विषयांचे ३९,०००+ सराव प्रश्न","📝 ५०+ ऑल-इंडिया ग्रँड मॉक टेस्ट्स (१/३ निगेटिव्ह मार्किंग)","📑 मागील वर्षांच्या (PYQ) प्रमाणित प्रश्नपत्रिका","🩺 क्लिनिकल केसेस, ECG व आकृत्या प्रश्नसंच","🤖 एआय क्लिनिकल स्टडी कोच व चूक वही","📊 लाईव्ह ऑल-इंडिया रँक लीडरबोर्ड"].map((item,idx)=>e.jsxs("div",{key:idx,className:"p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 font-bold text-slate-800",children:[e.jsx("span",{className:"text-teal-600 text-sm",children:"✓"}),e.jsx("span",{children:item})]}))        )]})]})]});}';

const replacement = 'ge||"Payment submission failed")}finally{Z(!1)}}};' + reviewModeView + 'return e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8",children:[';

if (bundle.includes(exactTarget)) {
  bundle = bundle.replace(exactTarget, replacement);
  console.log("Injected exact Review Mode view into K9!");
} else {
  console.error("exactTarget not found!");
  process.exit(1);
}

// Verify with Acorn
try {
  acorn.parse(bundle, { ecmaVersion: "latest", sourceType: "module" });
  console.log("Acorn verified updated bundle 100% CLEAN!");
  fs.writeFileSync(bundlePath, bundle, "utf8");
  console.log("Updated bundle written to disk!");
} catch (e) {
  console.error("Acorn Parse Error:", e.message, "at pos:", e.pos);
  process.exit(1);
}
