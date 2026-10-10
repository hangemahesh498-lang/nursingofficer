const fs = require('fs');
const { execSync } = require('child_process');

['public/assets/index-v3-fixed.js', 'dist/assets/index-v3-fixed.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Fix const declaration chain
  code = code.replace(";},const EXAM_SUBJ_MAP=", ";},EXAM_SUBJ_MAP=");
  code = code.replace(";const EXAM_TABS=", ",EXAM_TABS=");
  code = code.replace(";GA=", ",GA=");

  // Remove duplicate S declaration
  code = code.replace(",S=(R||[]).reduce((B,X)=>B+((X==null?void 0:X.totalQuestions)||0),0)", "");

  // Update original S to dynamically count questions for activeExam
  const originalSTarget = 'S=(r||[]).reduce((B,X)=>B+((X==null?void 0:X.totalQuestions)||0),0)';
  const dynamicSRep = 'S=(r||[]).filter(B=>{const exList=EXAM_SUBJ_MAP[activeExam];return activeExam==="all"||!exList||exList.includes(B.id)}).reduce((B,X)=>B+((X==null?void 0:X.totalQuestions)||0),0)';
  if (code.includes(originalSTarget)) {
    code = code.replace(originalSTarget, dynamicSRep);
    console.log("Updated dynamic S in", file);
  }

  fs.writeFileSync(file, code, 'utf8');
  console.log("Written fixed bundle to", file);

  // Validate syntax
  fs.writeFileSync("temp-verify.mjs", code, "utf8");
  try {
    execSync("node --check temp-verify.mjs");
    console.log("Syntax validation PASSED for", file);
  } catch (err) {
    console.error("Syntax validation FAILED for", file, err.message);
  } finally {
    if (fs.existsSync("temp-verify.mjs")) fs.unlinkSync("temp-verify.mjs");
  }
});

console.log("All bundles syntax fixed and verified!");
