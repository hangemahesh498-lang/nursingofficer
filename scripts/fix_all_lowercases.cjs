const fs = require('fs');
let code = fs.readFileSync('public/assets/index-CY7ixHhG.js', 'utf8');

code = code.split('St=>(.question_mr').join('St=>(St.question_mr');
code = code.split('Xe=(.title_mr').join('Xe=(re.title_mr');
code = code.split('Ge=(.message_mr').join('Ge=(re.message_mr');
code = code.split('dt=(.target_user_name').join('dt=(re.target_user_name');
code = code.split('(.source_context').join('(se.source_context');
code = code.split('(.alt_text').join('(se.alt_text');
code = code.split('(.district').join('(ae.district');
code = code.split('(.taluka').join('(ae.taluka');
code = code.split('(.referralCode').join('(ae.referralCode');
code = code.split('(.uploadedByName').join('(M.uploadedByName');
code = code.split('(.detectedSubjectName').join('(j.detectedSubjectName');
code = code.split('(.sourceFile').join('(j.sourceFile');

fs.writeFileSync('public/assets/index-CY7ixHhG.js', code, 'utf8');
if (fs.existsSync('dist/assets/index-CY7ixHhG.js')) {
  fs.writeFileSync('dist/assets/index-CY7ixHhG.js', code, 'utf8');
}

const acorn = require('acorn');
try {
  acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
  console.log('🎉🎉🎉 ACORN SUCCESS: 100% VALID BUNDLE AST!');
} catch (e) {
  console.error('Acorn parse error:', e.message, 'at pos:', e.pos);
  console.log(code.substring(e.pos - 80, e.pos + 80));
}
