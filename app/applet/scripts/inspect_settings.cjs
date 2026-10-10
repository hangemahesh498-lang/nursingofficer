const fs = require('fs');
const file = './android/app/src/main/assets/public/assets/index-v3-fixed.js';
const content = fs.readFileSync(file, 'utf8');
const idx = content.indexOf('h==="settings"');
console.log('h==="settings" length:', content.length);
if (idx !== -1) {
  console.log(content.substring(idx, idx + 4000));
} else {
  console.log('Not found');
}
