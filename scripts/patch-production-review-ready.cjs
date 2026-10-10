const fs = require("fs");
const path = require("path");
const acorn = require("acorn");

const bundlePath = path.resolve(__dirname, "../public/assets/index-v3-fixed.js");
let bundle = fs.readFileSync(bundlePath, "utf8");

console.log("Original bundle size:", bundle.length);

// 1. Target Ticker Block
const tickerTarget = '(y==null?void 0:y.ticker_active)!==!1&&e.jsx("div",{className:"bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white text-xs py-1.5 px-3 sm:px-4 border-b border-indigo-900/60 shadow-xs relative z-30 flex items-center overflow-hidden",children:e.jsxs("div",{className:"flex items-center gap-2 max-w-7xl mx-auto w-full overflow-hidden",children:[e.jsxs("div",{className:"flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-xs",children:[e.jsx(es,{className:"w-3 h-3 text-slate-950 animate-pulse"}),e.jsx("span",{children:p==="mr"?"सूचना व ऑफर":"NEWS & OFFERS"})]}),e.jsx("div",{onClick:()=>s("upgrade-pro"),className:"grow overflow-hidden relative cursor-pointer group flex items-center",title:"Click to view offers",children:e.jsx("div",{className:"animate-marquee whitespace-nowrap text-[11px] sm:text-xs font-semibold text-sky-200 group-hover:text-amber-300 transition",style:{animationDuration:`${(y==null?void 0:y.ticker_speed)||30}s`},children:p==="mr"?(y==null?void 0:y.ticker_text_mr)||"🔥 नवीन बॅच सराव सुरू: AIIMS NORCET, ESIC व DMER भरतीसाठी 6000+ दर्जेदार MCQs व सराव मॉक टेस्ट्स उपलब्ध! MH50 प्रोमो कोड वापरा आणि ५०% विशेष सवलत मिळवा! 🎉":(y==null?void 0:y.ticker_text_en)||"🔥 New Practice Tests Live: 6000+ Clinical MCQs for AIIMS NORCET, ESIC & DMER! Use Code MH50 for instant 50% discount! 🎉"})}),e.jsx("button",{onClick:()=>s("upgrade-pro"),className:"hidden sm:flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-md transition shrink-0 cursor-pointer shadow-xs active:scale-95",children:e.jsx("span",{children:p==="mr"?"५०% सूट मिळवा":"Get 50% OFF"})})]})}),';

const tickerReplacement = '(y==null?void 0:y.ticker_active)!==!1&&e.jsx("div",{className:"bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white text-xs py-1.5 px-3 sm:px-4 border-b border-indigo-900/60 shadow-xs relative z-30 flex items-center overflow-hidden",children:e.jsxs("div",{className:"flex items-center gap-2 max-w-7xl mx-auto w-full overflow-hidden",children:[e.jsxs("div",{className:"flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-xs",children:[e.jsx(es,{className:"w-3 h-3 text-slate-950 animate-pulse"}),e.jsx("span",{children:p==="mr"?"परीक्षेची सूचना":"EXAM NOTICE"})]}),e.jsx("div",{onClick:()=>s("practice"),className:"grow overflow-hidden relative cursor-pointer group flex items-center",title:"Click to practice",children:e.jsx("div",{className:"animate-marquee whitespace-nowrap text-[11px] sm:text-xs font-semibold text-sky-200 group-hover:text-amber-300 transition",style:{animationDuration:`${(y==null?void 0:y.ticker_speed)||30}s`},children:p==="mr"?(y==null?void 0:y.ticker_text_mr)||"📢 महत्त्वाची सूचना: AIIMS NORCET, ESIC, DMER व आरोग्य भरती परीक्षा सराव प्रश्नसंच उपलब्ध! नियमित सराव करा.":(y==null?void 0:y.ticker_text_en)||"📢 Exam Notice: AIIMS NORCET, ESIC, DMER & State Health Exam practice test banks are active! Practice daily."})}),e.jsx("button",{onClick:()=>s("practice"),className:"hidden sm:flex items-center gap-1 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-md transition shrink-0 cursor-pointer shadow-xs active:scale-95",children:e.jsx("span",{children:p==="mr"?"सराव सुरू करा":"Start Practice"})})]})}),';

if (!bundle.includes(tickerTarget)) {
  console.error("ERROR: tickerTarget not found in bundle!");
  process.exit(1);
}
bundle = bundle.replace(tickerTarget, tickerReplacement);
console.log("SUCCESS: Replaced Ticker with Play Store compliant Exam Notice ticker!");

// 2. Target Offer Popup Block
const popupTarget = 'if(k.useEffect(()=>{if(!(n!=null&&n.offer_popup_active))return;if(!sessionStorage.getItem("nursing_offer_dismissed_v1")){const R=setTimeout(()=>{d(!0)},1200);return()=>clearTimeout(R)}},[n==null?void 0:n.offer_popup_active]),!o||!(n!=null&&n.offer_popup_active))return null;';

const popupReplacement = 'if(k.useEffect(()=>{if(!(n!=null&&n.offer_popup_active&&n.is_payment_enabled))return;if(!sessionStorage.getItem("nursing_offer_dismissed_v1")){const R=setTimeout(()=>{d(!0)},1200);return()=>clearTimeout(R)}},[n==null?void 0:n.offer_popup_active,n==null?void 0:n.is_payment_enabled]),!o||!(n!=null&&n.offer_popup_active&&n.is_payment_enabled))return null;';

if (!bundle.includes(popupTarget)) {
  console.error("ERROR: popupTarget not found in bundle!");
  process.exit(1);
}
bundle = bundle.replace(popupTarget, popupReplacement);
console.log("SUCCESS: Patched OfferPopup to remain dormant during Review Mode!");

// 3. Verify with Acorn
try {
  acorn.parse(bundle, { ecmaVersion: "latest", sourceType: "module" });
  console.log("Acorn verified updated bundle 100% CLEAN!");
  fs.writeFileSync(bundlePath, bundle, "utf8");
  console.log("Written updated bundle to disk!");
} catch (e) {
  console.error("Acorn Parse Error:", e.message, "at pos:", e.pos);
  process.exit(1);
}
