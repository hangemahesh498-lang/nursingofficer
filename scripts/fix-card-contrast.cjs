const fs = require("fs");
const acorn = require("acorn");

const files = [
  "public/assets/index-v3-fixed.js",
  "dist/assets/index-v3-fixed.js",
  "public/assets/index-CY7ixHhG.js",
  "dist/assets/index-CY7ixHhG.js"
];

const oldTarget = `e.jsxs("div",{className:"bg-gradient-to-br from-[#071328] via-[#0d1e3d] to-[#161f4c] text-white rounded-3xl p-5 sm:p-7 shadow-md border border-indigo-500/20 relative overflow-hidden"`;

const newReplacement = `e.jsxs("div",{className:"bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/90 relative overflow-hidden space-y-4",children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center gap-2 text-indigo-700 text-xs font-black uppercase tracking-wider",children:[e.jsx(nn,{className:"w-4 h-4 text-indigo-600"}),e.jsx("span",{children:o==="mr"?"विषयनिहाय एमसीक्यू सराव व प्रश्नपेढी (३६ विषय)":"CHAPTER-WISE MCQ QUESTION BANK (36 SUBJECTS)"})]}),e.jsx("h2",{className:"text-lg sm:text-2xl font-black text-slate-900 tracking-tight",children:o==="mr"?"सर्व विषयांच्या एमसीक्यू (MCQs) चा सराव सुरू करा":"Practice MCQs Across All Nursing Subjects"}),e.jsx("p",{className:"text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed",children:o==="mr"?"AIIMS NORCET, RRB, ESIC, DSSSB, CHO, MNS व DMER आरोग्य भरतीनुसार सर्व ३६ विषय, मागील प्रश्न आणि सविस्तर स्पष्टीकरणांसह सराव करा.":"Practice 36+ Nursing core & competitive exam subjects with authentic negative marking, instant explanations, and bookmarks."})]}),e.jsx("div",{className:"flex items-center gap-2 shrink-0",children:e.jsxs("button",{onClick:E,className:"px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition cursor-pointer flex items-center gap-2 active:scale-98",children:[e.jsx(Er,{className:"w-4 h-4 text-yellow-300"}),e.jsx("span",{children:o==="mr"?"एमसीक्यू सराव सुरू करा":"Start MCQ Practice"}),e.jsx(Kn,{className:"w-4 h-4"})]})})]}),p.length>0&&e.jsx("div",{className:"pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2",children:(p||[]).filter(T=>!!(T&&T.id)).slice(0,6).map(T=>e.jsxs("button",{key:T.id,onClick:()=>n("practice",{subject_id:T.id}),className:"px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/80 text-slate-800 hover:text-indigo-900 text-xs font-bold border border-slate-200/90 hover:border-indigo-300 transition cursor-pointer text-left truncate flex items-center justify-between group shadow-2xs",children:[e.jsx("span",{className:"truncate font-bold text-slate-800 group-hover:text-indigo-700 text-xs",children:o==="mr"?T.name_mr:T.name_en}),e.jsx(Kn,{className:"w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0 ml-1.5"})]}))]})]})`;

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");

  const startIndex = code.indexOf(oldTarget);
  if (startIndex === -1) {
    console.warn(`Target not found in ${filePath}`);
    return;
  }

  // Find the closing of this card:
  // Notice the card ends right before `e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-base sm:text-lg font-black text-slate-900",children:o==="mr"?"🎯 तुमची लक्ष्य परीक्षा निवडा`
  const endMarker = 'e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-base sm:text-lg font-black text-slate-900",children:o==="mr"?"🎯 तुमची लक्ष्य परीक्षा निवडा';
  const endIndex = code.indexOf(endMarker, startIndex);

  if (endIndex === -1) {
    console.error(`Could not find end marker in ${filePath}`);
    return;
  }

  // Slice and replace:
  code = code.substring(0, startIndex) + newReplacement + "," + code.substring(endIndex);

  try {
    const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" });
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`Successfully fixed contrast in ${filePath}!`);
  } catch (err) {
    console.error(`Error validating ${filePath}:`, err.message);
  }
});
