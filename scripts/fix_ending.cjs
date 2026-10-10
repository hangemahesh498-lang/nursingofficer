const fs = require('fs');
let code = fs.readFileSync('public/assets/index-CY7ixHhG.js', 'utf8');

const pos = code.indexOf('},W9=({onUpgradePro');
console.log('pos of },W9=:', pos);
if (pos !== -1) {
  // Let's see what is before pos
  console.log('Snippet before pos:', code.substring(pos - 40, pos + 40));
}

// In JavaScript, inside `var A = ..., B = ...`, each function is `name = (props) => { return expr; }`
// So it must be `name = (props) => { return expr; }, nextName = (props) => ...`
code = code.replace(/\n\s*\}\)\s*\}\s*,\s*W9\s*=\s*\(/g, '\n  })\n},W9=(');

fs.writeFileSync('public/assets/index-CY7ixHhG.js', code, 'utf8');
if (fs.existsSync('dist/assets/index-CY7ixHhG.js')) {
  fs.writeFileSync('dist/assets/index-CY7ixHhG.js', code, 'utf8');
}

const acorn = require('acorn');
try {
  acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
  console.log('🎉🎉🎉 ACORN SUCCESS: 100% PERFECT AST! ZERO ERRORS!');
} catch (e) {
  console.error('Acorn parse error:', e.message, 'at pos:', e.pos);
  console.log(code.substring(e.pos - 80, e.pos + 80));
}
