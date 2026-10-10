const fs = require("fs");
const acorn = require("acorn");

const files = [
  "public/assets/index-v3-fixed.js",
  "dist/assets/index-v3-fixed.js",
  "public/assets/index-CY7ixHhG.js",
  "dist/assets/index-CY7ixHhG.js"
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");

  // 1. ENHANCE GA (Subject Selection per Exam)
  const oldGAtarget = `const A=async()=>{try{b(!0);const B=await Pe.getSubjects();l(B)}catch(B){console.error("Failed to load subjects",B)}finally{b(!1)}}`;

  const newGACode = `const[exTrack,setExTrack]=k.useState("all");const A=async()=>{try{b(!0);const B=await Pe.getSubjects();l(B)}catch(B){console.error("Failed to load subjects",B)}finally{b(!1)}};const EXAM_SYLLABUS_KEYS={"dmer":["subj-fon","subj-msn","subj-chn","subj-obg","subj-chn-ped","subj-pharm","subj-mhn","subj-anat-physio","subj-marathi","subj-gk-current","subj-aptitude-maths","subj-first-aid"],"cho":["subj-chn","subj-obg","subj-chn-ped","subj-fon","subj-pharm","subj-nutrition","subj-first-aid","subj-epidemiology"],"norcet":["subj-msn","subj-fon","subj-obg","subj-chn-ped","subj-pharm","subj-mhn","subj-anat-physio","subj-micro-patho","subj-nutrition","subj-mgmt-res","subj-aptitude-gk","subj-critical-care","subj-ecg-cardio"],"rrb":["subj-fon","subj-msn","subj-obg","subj-chn","subj-chn-ped","subj-anat-physio","subj-pharm","subj-aptitude-maths","subj-reasoning","subj-general-science","subj-gk-current"],"esic":["subj-fon","subj-msn","subj-obg","subj-chn","subj-chn-ped","subj-pharm","subj-mhn","subj-anat-physio","subj-aptitude-gk"]};`;

  if (code.includes(oldGAtarget)) {
    code = code.replace(oldGAtarget, newGACode);
  }

  // Update R filter in GA to also filter by exTrack
  const oldRFilter = `const X=o==="all"||B.category===o,Z=!u.trim()||B.name_en&&B.name_en.toLowerCase().includes(u.toLowerCase())||B.name_mr&&B.name_mr.toLowerCase().includes(u.toLowerCase())||B.description_mr&&B.description_mr.toLowerCase().includes(u.toLowerCase());return X&&Z`;

  const newRFilter = `const X=o==="all"||B.category===o,Z=!u.trim()||B.name_en&&B.name_en.toLowerCase().includes(u.toLowerCase())||B.name_mr&&B.name_mr.toLowerCase().includes(u.toLowerCase())||B.description_mr&&B.description_mr.toLowerCase().includes(u.toLowerCase()),EX=(exTrack==="all"||!EXAM_SYLLABUS_KEYS[exTrack]||EXAM_SYLLABUS_KEYS[exTrack].indexOf(B.id)!==-1);return X&&Z&&EX`;

  if (code.includes(oldRFilter)) {
    code = code.replace(oldRFilter, newRFilter);
  }

  // 2. ENHANCE ZE (Razorpay Key ID & Key Secret in Admin Settings)
  const oldZESettingsLoad = `k.useEffect(()=>{Pe.getSettings().then(U=>{U&&(N(U),y(!!U.razorpay_enabled),M(U.manual_qr_enabled!==void 0?U.manual_qr_enabled:!0),E(U.upi_id||""),X(U.receiver_name||""),te(U.custom_qr_image_url||""))}).catch(U=>console.warn("Failed to load settings:",U))},[]);const xe=async()=>{try{$(!0);const U=await Pe.updateSettings({razorpay_enabled:A,manual_qr_enabled:S,upi_id:R,receiver_name:B,custom_qr_image_url:Z});`;

  const newZESettingsLoad = `const[rzpKeyId,setRzpKeyId]=k.useState(""),[rzpKeySecret,setRzpKeySecret]=k.useState("");k.useEffect(()=>{Pe.getSettings().then(U=>{U&&(N(U),y(!!U.razorpay_enabled),M(U.manual_qr_enabled!==void 0?U.manual_qr_enabled:!0),E(U.upi_id||""),X(U.receiver_name||""),te(U.custom_qr_image_url||""),setRzpKeyId(U.razorpay_key_id||""),setRzpKeySecret(U.razorpay_key_secret||""))}).catch(U=>console.warn("Failed to load settings:",U))},[]);const xe=async()=>{try{$(!0);const U=await Pe.updateSettings({razorpay_enabled:A,razorpay_key_id:rzpKeyId.trim(),razorpay_key_secret:rzpKeySecret.trim(),manual_qr_enabled:S,upi_id:R,receiver_name:B,custom_qr_image_url:Z});`;

  if (code.includes(oldZESettingsLoad)) {
    code = code.replace(oldZESettingsLoad, newZESettingsLoad);
  }

  // Insert Razorpay Key ID and Secret inputs in ZE JSX right under Razorpay Gateway box
  const oldRazorpayBoxJSX = `e.jsx("div",{className:"w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"})})]}),A?e.jsxs("div",{className:"p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald`;

  const newRazorpayBoxJSX = `e.jsx("div",{className:"w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"})})]}),e.jsxs("div",{className:"space-y-2.5 pt-2 border-t border-slate-200",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-[11px] font-bold text-slate-800 mb-1",children:"Razorpay Key ID (उदा. rzp_live_xxxxxxxx किंवा rzp_test_xxxxxxxx):"}),e.jsx("input",{type:"text",value:rzpKeyId,onChange:U=>setRzpKeyId(U.target.value),placeholder:"rzp_live_xxxxxxxxxxxx",className:"w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-[11px] font-bold text-slate-800 mb-1",children:"Razorpay Key Secret (गुप्त पासवर्ड कळा):"}),e.jsx("input",{type:"password",value:rzpKeySecret,onChange:U=>setRzpKeySecret(U.target.value),placeholder:"********************",className:"w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"})]})]}),A?e.jsxs("div",{className:"p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald`;

  if (code.includes(oldRazorpayBoxJSX)) {
    code = code.replace(oldRazorpayBoxJSX, newRazorpayBoxJSX);
  }

  // 3. ENHANCE rT PDF Export (Compact A4 Landscape PDF export on FEWER PAGES for Ct)
  const oldYtPDF = `yt=()=>{const ae=window.open("","_blank");if(!ae)return;const Se=\`      <html>        <head>          <title>Nursing Officer App - Registered Students Directory</title>          <style>            body { font-family: sans-serif; padding: 20px; color: #1e293b; }            h1 { font-size: 18px; margin-bottom: 4px; color: #0f172a; }            p { font-size: 11px; color: #64748b; margin-bottom: 16px; }            table { width: 100%; border-collapse: collapse; font-size: 10px; }            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }            th { background: #f8fafc; font-weight: bold; }            .badge-pro { color: #047857; font-weight: bold; background: #d1fae5; padding: 2px 6px; border-radius: 4px; }            .badge-free { color: #64748b; }          </style>        </head>        <body>          <h1>Nursing Officer App - Registered Students Master Directory</h1>          <p>Generated: \${new Date().toLocaleString()} | Total Active Records: \${d.users.length}</p>          <table>            <thead>              <tr>                <th>#</th>                <th>Name</th>                <th>Mobile</th>                <th>Email</th>                <th>District</th>                <th>Taluka</th>                <th>Village/City</th>                <th>PIN</th>                <th>Address</th>                <th>Reg Date</th>                <th>Plan Status</th>                <th>Expiry</th>                <th>Referral Code</th>              </tr>            </thead>            <tbody>              \${d.users.map((Ve,xt)=>\`                <tr>                  <td>\${xt+1}</td>                  <td><b>\${Ve.name}</b></td>                  <td>\${Ve.mobile||Ve.phone||"-"}</td>                  <td>\${Ve.email}</td>                  <td>\${Ve.district||"-"}</td>                  <td>\${Ve.taluka||"-"}</td>                  <td>\${Ve.village_city||"-"}</td>                  <td>\${Ve.pincode||"-"}</td>                  <td>\${Ve.fullAddress||Ve.address||"-"}</td>                  <td>\${Ve.createdAt?new Date(Ve.createdAt).toLocaleDateString("en-GB"):"-"}</td>                  <td>\${Ve.isPremium?'<span class="badge-pro">PRO ACTIVE</span>':'<span class="badge-free">FREE</span>'}</td>                  <td>\${Ve.planEndDate?new Date(Ve.planEndDate).toLocaleDateString("en-GB"):"-"}</td>                  <td>\${Ve.referralCode||"-"}</td>                </tr>              \`).join("")}            </tbody>          </table>          <script>window.onload = function() { window.print(); };<\\/script>        </body>      </html>    \`;ae.document.write(Se),ae.document.close()}`;

  const newYtPDF = `yt=()=>{const ae=window.open("","_blank");if(!ae)return;const exportList=Ct||(d.users||[]);const activeTabTitle=b==="pro"?"Paid Pro Members Directory (पेड विद्यार्थी यादी)":b==="free"?"Free Registered Students Directory (मोफत नोंदणीकृत विद्यार्थी)":b==="expired"?"Expired Pro Members Directory (मुदत संपलेले विद्यार्थी)":"All Registered Students Directory (सर्व नोंदणीकृत विद्यार्थी)";const Se=\`<!DOCTYPE html><html><head><title>Nursing Officer App - \${activeTabTitle}</title><style>@page{size:A4 landscape;margin:6mm;}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;padding:8px;color:#0f172a;background:#fff;font-size:8.5pt;}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:1.5pt solid #1e3a8a;padding-bottom:5px;margin-bottom:8px;}.title{font-size:12pt;font-weight:800;color:#1e3a8a;margin:0;}.meta{font-size:8pt;color:#475569;margin-top:2px;}.stats{font-size:8pt;font-weight:bold;background:#eff6ff;color:#1e40af;padding:4px 8px;border-radius:4px;border:0.5pt solid #bfdbfe;}table{width:100%;border-collapse:collapse;font-size:8pt;page-break-inside:auto;}tr{page-break-inside:avoid;}th{background:#1e3a8a;color:#ffffff;font-weight:800;text-align:left;padding:3.5px 5px;border:0.5pt solid #1e3a8a;text-transform:uppercase;font-size:7.5pt;}td{padding:3px 5px;border:0.5pt solid #cbd5e1;text-align:left;vertical-align:middle;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:180px;}tr:nth-child(even){background-color:#f8fafc;}.badge-pro{color:#065f46;font-weight:800;background:#d1fae5;padding:1px 5px;border-radius:3px;font-size:7pt;border:0.5pt solid #a7f3d0;}.badge-free{color:#475569;background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:7pt;}.footer{margin-top:8px;text-align:right;font-size:7pt;color:#94a3b8;border-top:0.5pt solid #e2e8f0;padding-top:3px;}</style></head><body><div class="header"><div><h1 class="title">🏥 Nursing Officer Portal - \${activeTabTitle}</h1><div class="meta">Exported On: \${new Date().toLocaleString()} | Total Filtered Records: <b>\${exportList.length}</b></div></div><div class="stats">Total Reg: \${d.totalUsers||0} | Paid Pro: \${d.proUsers||0} | Free: \${d.freeUsers||0}</div></div><table><thead><tr><th style="width:25px;">#</th><th>Student Name (विद्यार्थ्याचे नाव)</th><th>Mobile / Phone</th><th>Email Address</th><th>District / Location</th><th>Target Exam Track</th><th>Reg Date</th><th>Plan Status</th><th>Plan End Date</th><th>Ref Code</th></tr></thead><tbody>\${exportList.map((Ve,xt)=>\`<tr><td>\${xt+1}</td><td><b>\${Ve.name||"Student"}</b></td><td>\${Ve.mobile||Ve.phone||"-"}</td><td>\${Ve.email||"-"}</td><td>\${Ve.district||Ve.village_city||"-"}</td><td>\${Ve.targetExam||"AIIMS NORCET / Maha Staff Nurse"}</td><td>\${Ve.createdAt?new Date(Ve.createdAt).toLocaleDateString("en-GB"):"-"}</td><td>\${Ve.isPremium?'<span class="badge-pro">👑 PAID PRO</span>':'<span class="badge-free">FREE MEMBER</span>'}</td><td>\${Ve.planEndDate?new Date(Ve.planEndDate).toLocaleDateString("en-GB"):"Free / Unlimited"}</td><td>\${Ve.referralCode||"-"}</td></tr>\`).join("")}</tbody></table><div class="footer">Official Nursing Officer Master Student Directory • Optimized Compact Print</div><script>window.onload=function(){setTimeout(function(){window.print();},300);};<\\/script></body></html>\`;ae.document.write(Se),ae.document.close()}`;

  if (code.includes(oldYtPDF)) {
    code = code.replace(oldYtPDF, newYtPDF);
  }

  try {
    acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" });
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`Successfully updated ${filePath}!`);
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err.message);
  }
});
