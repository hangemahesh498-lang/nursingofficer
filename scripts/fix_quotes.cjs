const fs = require("fs");
let content = fs.readFileSync("scripts/patch_clean_components.cjs", "utf8");
const lines = content.split("\n");

lines[2034] = "  'children:we?' + String.fromCharCode(96) + '₹' + '$' + '{' + '$e' + String.fromCharCode(96) + ':\"₹0\"',";

const b = "String.fromCharCode(96)";
lines[2038] = "  'children:[e.jsx(\"span\",{children:we?h===\"mr\"?\"प्लॅन नूतनीकरण करा / नवीन प्लॅन जोडा\":\"Renew / Extend Membership\":h===\"mr\"?' + " + b + " + 'आता प्लॅन निवडा व अपग्रेड करा (₹' + '$' + '{ht} पासून)' + " + b + " + ':' + " + b + " + 'Upgrade to PRO (From ₹' + '$' + '{ht})' + " + b + " + '}),e.jsx(vd,{className:\"w-4 h-4\"})]',";

content = lines.join("\n");
fs.writeFileSync("scripts/patch_clean_components.cjs", content, "utf8");
console.log("Successfully fixed line 2039 in patch script!");
