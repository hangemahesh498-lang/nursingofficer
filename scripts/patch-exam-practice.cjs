const fs = require('fs');

const examConstants = `const EXAM_SUBJ_MAP={dmer_dhs:["subj-fon","subj-msn","subj-obg","subj-peds","subj-chn","subj-mhn","subj-pharm","subj-micro","subj-path","subj-anat","subj-physio","subj-icu-bls","subj-infection","subj-admin-mgmt","subj-nutr","subj-track-mh-health","subj-gk-mr","subj-eng","subj-gk-mh","subj-math-reas"],norcet:["subj-fon","subj-msn","subj-obg","subj-peds","subj-chn","subj-mhn","subj-pharm","subj-micro","subj-path","subj-anat","subj-physio","subj-icu-bls","subj-infection","subj-admin-mgmt","subj-ethics-legal","subj-biochem","subj-genetics","subj-research","subj-forensic-nursing","subj-track-aiims","subj-apt-norcet","subj-current-affairs","subj-science","subj-eng"],esic:["subj-fon","subj-msn","subj-obg","subj-peds","subj-chn","subj-mhn","subj-pharm","subj-micro","subj-anat","subj-physio","subj-icu-bls","subj-infection","subj-nutr","subj-track-esic","subj-gen-hindi","subj-apt-norcet","subj-gk-mh","subj-current-affairs","subj-math-reas","subj-eng"],rrb:["subj-fon","subj-msn","subj-obg","subj-peds","subj-chn","subj-pharm","subj-micro","subj-anat","subj-icu-bls","subj-track-railway","subj-science","subj-math-reas","subj-current-affairs","subj-gen-hindi","subj-eng"],mns:["subj-fon","subj-msn","subj-obg","subj-peds","subj-anat","subj-physio","subj-biochem","subj-micro","subj-icu-bls","subj-track-mns","subj-science","subj-eng","subj-current-affairs","subj-math-reas"]};const EXAM_TABS=[{id:"all",label_mr:"🌟 सर्व परीक्षा",label_en:"🌟 All Exams",sub_mr:"३६ विषय"},{id:"dmer_dhs",label_mr:"🏥 DMER/DHS महाराष्ट्र",label_en:"🏥 DMER/DHS",sub_mr:"२० विषय"},{id:"norcet",label_mr:"🎯 AIIMS NORCET",label_en:"🎯 NORCET",sub_mr:"२४ विषय"},{id:"esic",label_mr:"🛡️ ESIC भरती",label_en:"🛡️ ESIC",sub_mr:"२० विषय"},{id:"rrb",label_mr:"🚆 RRB रेल्वे",label_en:"🚆 RRB",sub_mr:"१५ विषय"},{id:"mns",label_mr:"🎖️ MNS सैन्य",label_en:"🎖️ MNS",sub_mr:"१४ विषय"}];`;

['public/assets/index-v3-fixed.js', 'dist/assets/index-v3-fixed.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // 1. Inject EXAM_SUBJ_MAP and state in GA component
  const gaTarget = 'GA=({onSelectSubject:n})=>{const{language:s}=Ds(),[r,l]=k.useState([]),[o,d]=k.useState("all"),[u,h]=k.useState(""),[p,b]=k.useState(!0),[v,N]=k.useState(null);';
  const gaReplacement = `${examConstants}GA=({onSelectSubject:n})=>{const{language:s}=Ds(),[r,l]=k.useState([]),[o,d]=k.useState("all"),[activeExam,setActiveExam]=k.useState(()=>{try{return localStorage.getItem("active_exam_track")||"all"}catch(e){return"all"}}),[u,h]=k.useState(""),[p,b]=k.useState(!0),[v,N]=k.useState(null);`;

  if (code.includes(gaTarget)) {
    code = code.replace(gaTarget, gaReplacement);
    console.log("Injected GA state in", file);
  } else {
    console.warn("gaTarget not found in", file);
  }

  // 2. Filter R in GA by activeExam
  const rFilterTarget = 'R=(r||[]).filter(B=>{if(!B||!B.id)return!1;const X=o==="all"||B.category===o,Z=!u.trim()||B.name_en&&B.name_en.toLowerCase().includes(u.toLowerCase())||B.name_mr&&B.name_mr.toLowerCase().includes(u.toLowerCase())||B.description_mr&&B.description_mr.toLowerCase().includes(u.toLowerCase());return X&&Z})';
  const rFilterReplacement = 'R=(r||[]).filter(B=>{if(!B||!B.id)return!1;const exList=EXAM_SUBJ_MAP[activeExam];if(activeExam!=="all"&&exList&&!exList.includes(B.id))return!1;const X=o==="all"||B.category===o,Z=!u.trim()||B.name_en&&B.name_en.toLowerCase().includes(u.toLowerCase())||B.name_mr&&B.name_mr.toLowerCase().includes(u.toLowerCase())||B.description_mr&&B.description_mr.toLowerCase().includes(u.toLowerCase());return X&&Z}),S=(R||[]).reduce((B,X)=>B+((X==null?void 0:X.totalQuestions)||0),0)';

  if (code.includes(rFilterTarget)) {
    code = code.replace(rFilterTarget, rFilterReplacement);
    console.log("Injected R exam filter in", file);
  } else {
    console.warn("rFilterTarget not found in", file);
  }

  // 3. Render Exam Selector Buttons in GA above the search box
  const searchBoxTarget = 'e.jsxs("div",{className:"space-y-2.5",children:[e.jsxs("div",{className:"flex items-center justify-between px-0.5",children:[e.jsxs("h3",{className:"text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5",children:[e.jsx(nn,{className:"w-4 h-4 text-blue-600"}),e.jsx("span",{children:"प्रकरणे निवडा (Chapters List)"})]}),e.jsxs("span",{className:"text-xs font-semibold text-slate-500",children:[R.length," प्रकरणे"]})]}),';
  
  const searchBoxReplacement = 'e.jsxs("div",{className:"space-y-2.5",children:[e.jsxs("div",{className:"p-2.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 rounded-2xl border border-blue-200/80 space-y-2 shadow-2xs mb-2",children:[e.jsxs("div",{className:"flex items-center justify-between px-1",children:[e.jsxs("span",{className:"text-[11px] font-black text-blue-900 flex items-center gap-1",children:[e.jsx("span",{children:"🎯"}),e.jsx("span",{children:s==="mr"?"लक्ष्य परीक्षा निवडा (Select Target Exam):":"Select Target Exam:"})]}),e.jsxs("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white",children:[R.length,s==="mr"?" विषय समाविष्ट":" Subjects"]})]}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:EXAM_TABS.map(ex=>e.jsxs("button",{key:ex.id,onClick:()=>{setActiveExam(ex.id);try{localStorage.setItem("active_exam_track",ex.id)}catch(e){}},className:`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1 ${activeExam===ex.id?"bg-blue-600 text-white shadow-xs scale-102":"bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"}`,children:[e.jsx("span",{children:s==="mr"?ex.label_mr:ex.label_en}),e.jsx("span",{className:`text-[9px] px-1 py-0.2 rounded-md ${activeExam===ex.id?"bg-white/20 text-white":"bg-slate-100 text-slate-500"}`,children:ex.sub_mr})]}))})]}),e.jsxs("div",{className:"flex items-center justify-between px-0.5",children:[e.jsxs("h3",{className:"text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5",children:[e.jsx(nn,{className:"w-4 h-4 text-blue-600"}),e.jsx("span",{children:"प्रकरणे निवडा (Chapters List)"})]}),e.jsxs("span",{className:"text-xs font-semibold text-slate-500",children:[R.length," प्रकरणे"]})]}),';

  if (code.includes(searchBoxTarget)) {
    code = code.replace(searchBoxTarget, searchBoxReplacement);
    console.log("Injected Exam selector UI in", file);
  } else {
    console.warn("searchBoxTarget not found in", file);
  }

  // 4. Update QA component question loader ft to pass exam
  const ftTarget = 'const nt=await Pe.getQuestions({subject_id:N!=="all"?N:void 0,topic_id:y!=="all"?y:void 0,difficulty:M!=="all"?M:void 0,is_verified_pyq:E?!0:void 0,is_free:X?!0:void 0,status:"published"});';
  const ftReplacement = 'const activeEx=(()=>{try{const x=localStorage.getItem("active_exam_track");return x&&x!=="all"?x:void 0}catch(e){return void 0}})();const nt=await Pe.getQuestions({subject_id:N!=="all"?N:void 0,topic_id:y!=="all"?y:void 0,difficulty:M!=="all"?M:void 0,is_verified_pyq:E?!0:void 0,is_free:X?!0:void 0,status:"published",exam:activeEx});';

  if (code.includes(ftTarget)) {
    code = code.replace(ftTarget, ftReplacement);
    console.log("Injected exam param in QA getQuestions in", file);
  } else {
    console.warn("ftTarget not found in", file);
  }

  // 5. Update Ve in QA to fetch subjects filtered by active exam
  const veTarget = 'const[nt,Yt]=await Promise.all([Pe.getSubjects(),Pe.getBookmarks()]);';
  const veReplacement = 'const activeEx=(()=>{try{const x=localStorage.getItem("active_exam_track");return x&&x!=="all"?x:void 0}catch(e){return void 0}})();const[nt,Yt]=await Promise.all([Pe.getSubjects(activeEx?{exam:activeEx}:void 0),Pe.getBookmarks()]);';

  if (code.includes(veTarget)) {
    code = code.replace(veTarget, veReplacement);
    console.log("Injected exam param in QA getSubjects in", file);
  } else {
    console.warn("veTarget not found in", file);
  }

  fs.writeFileSync(file, code, 'utf8');
  console.log("Successfully patched", file);
});
