const fs = require('fs');
const content = fs.readFileSync('public/assets/index-v3-fixed.js', 'utf8');
const idx = content.indexOf('⚡ Supabase स्लीप प्रिव्हेंशन');
console.log(content.substring(idx + 2500, idx + 4500));
