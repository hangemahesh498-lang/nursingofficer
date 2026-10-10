const fs = require('fs');
let code = fs.readFileSync('public/assets/index-CY7ixHhG.js', 'utf8');

// Wrap all option_${...toLowerCase()}_...
code = code.replace(/`option_\$\{([a-zA-Z0-9_$]+)\.toLowerCase\(\)\}_(mr|en)`/g, '`option_${($1||"a").toLowerCase()}_$2`');
code = code.replace(/\[`option_\$\{([a-zA-Z0-9_$]+)\.toLowerCase\(\)\}_(mr|en)`\]/g, '[`option_${($1||"a").toLowerCase()}_$2`]');

// Wrap if(!$.trim())
code = code.replace(/if\(!\$\.trim\(\)\)return l\.slice\(0,50\);const re=\$\.toLowerCase\(\)/g, 'if(!($||"").trim())return l.slice(0,50);const re=($||"").toLowerCase()');

// Wrap d5 and Ry
code = code.replace(/function d5\(n\)\{const s=n\.toLowerCase\(\)/g, 'function d5(n){const s=(n||"").toLowerCase()');
code = code.replace(/function Ry\(n=Ur\(\)\)\{const s=n\.toLowerCase\(\)/g, 'function Ry(n=Ur()){const s=(n||"").toLowerCase()');

// Wrap Yi
code = code.replace(/i\[t\.toLowerCase\(\)\]=a\.toLowerCase\(\)/g, 'i[(t||"").toLowerCase()]=(a||"").toLowerCase()');

fs.writeFileSync('public/assets/index-CY7ixHhG.js', code, 'utf8');
if (fs.existsSync('dist/assets/index-CY7ixHhG.js')) {
  fs.writeFileSync('dist/assets/index-CY7ixHhG.js', code, 'utf8');
}

const acorn = require('acorn');
try {
  acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
  console.log('🎉 ACORN SUCCESS: 100% Valid JavaScript!');
} catch (e) {
  console.error('Acorn parse error:', e.message, 'at pos:', e.pos);
}
