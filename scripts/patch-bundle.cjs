const fs = require('fs');

const files = [
  'dist/assets/index-CY7ixHhG.js',
  'public/assets/index-CY7ixHhG.js',
  'android/app/src/main/assets/public/assets/index-CY7ixHhG.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');

  // 1. Ur().toLowerCase() -> (Ur()||'').toLowerCase()
  code = code.replace(/Ur\(\)\.toLowerCase\(\)/g, '(Ur()||"").toLowerCase()');

  // 2. window.navigator.userAgent.toLowerCase() -> (window.navigator.userAgent||"").toLowerCase()
  code = code.replace(/window\.navigator\.userAgent\.toLowerCase\(\)/g, '(window.navigator.userAgent||"").toLowerCase()');

  // 3. (t=t.nodeName)&&t.toLowerCase() -> (t=t.nodeName)&&(t||"").toLowerCase()
  code = code.replace(/\(t=t\.nodeName\)&&t\.toLowerCase\(\)/g, '(t=t.nodeName)&&(t||"").toLowerCase()');

  // 4. wp(n){var s=n.family.replace
  code = code.replace(/wp\(n\)\{var s=n\.family\.replace\(\/\"\|'\/g,\"\"\)\.toLowerCase\(\)/g, 'wp(n){var s=(n&&n.family?n.family:"").replace(/"|\'/g,"").toLowerCase()');

  // 5. r.toLowerCase() in A6
  code = code.replace(/l\?l\.toUpperCase\(\):r\.toLowerCase\(\)/g, 'l?l.toUpperCase():(r||"").toLowerCase()');

  // 6. C6 replace
  code = code.replace(/n\.replace\(\/\(\[a-z0-9\]\)\(\[A-Z\]\)\/g,\"\$1-\$2\"\)\.toLowerCase\(\)/g, '(n||"").replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()');

  // 7. W9 filter safeguarding
  const oldFilter = 'const Z=o.filter($=>{const G=((s==="mr"?$.title_mr:$.title_en)||$.title_mr||$.title_en||$.title||"").toLowerCase().includes((v||"").toLowerCase()),q=((s==="mr"?$.description_mr:$.description_en)||$.description_mr||$.description_en||$.description||"").toLowerCase().includes((v||"").toLowerCase()),T=G||q||($.exam||"").toLowerCase().includes((v||"").toLowerCase()),j=A==="all"||$.subject_id===A,O=S==="all"||$.category===S;return T&&j&&O})';
  
  const newFilter = 'const Z=(o||[]).filter($=>{if(!$)return!1;const title=((s==="mr"?($.title_mr||$.title_en):($.title_en||$.title_mr))||$.title||"")+"",desc=((s==="mr"?($.description_mr||$.description_en):($.description_en||$.description_mr))||$.description||"")+"",exam=($.exam||"")+"",query=(v||"").toLowerCase(),G=title.toLowerCase().includes(query),q=desc.toLowerCase().includes(query),T=G||q||exam.toLowerCase().includes(query),j=A==="all"||$.subject_id===A,O=S==="all"||$.category===S;return T&&j&&O})';

  if (code.includes(oldFilter)) {
    code = code.replace(oldFilter, newFilter);
    console.log('Replaced exact W9 filter in', f);
  }

  // 8. Safeguard html2canvas and other option parsing
  code = code.replace(/\(E\.correct_option\|\|\"A\"\)\.toLowerCase\(\)/g, '((E&&E.correct_option?E.correct_option:"A")+"").toLowerCase()');

  fs.writeFileSync(f, code, 'utf8');
  console.log('Successfully patched', f);
});
