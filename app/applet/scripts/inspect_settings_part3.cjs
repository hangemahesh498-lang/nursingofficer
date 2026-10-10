const fs = require('fs');
const file = './android/app/src/main/assets/public/assets/index-v3-fixed.js';
const content = fs.readFileSync(file, 'utf8');
const idx = content.indexOf('h==="settings"');
console.log(content.substring(idx + 10000, idx + 18000));
