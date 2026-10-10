const fs = require('fs');
const file = './android/app/src/main/assets/public/assets/index-v3-fixed.js';
const content = fs.readFileSync(file, 'utf8');
const regex = /h===["']([a-zA-Z0-9_-]+)["']/g;
let m;
const tabs = new Set();
while ((m = regex.exec(content)) !== null) {
  tabs.add(m[1]);
}
console.log('Admin tabs:', Array.from(tabs));
