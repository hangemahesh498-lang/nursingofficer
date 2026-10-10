const fs = require('fs');
const acorn = require('acorn');

const patchedContent = fs.readFileSync('test_patched_bundle.js', 'utf8');

// Verify AST
acorn.parse(patchedContent, { ecmaVersion: 2022, sourceType: 'module' });
console.log('Verified test_patched_bundle.js AST!');

const targetFiles = [
  'public/assets/index-v3-fixed.js',
  'public/assets/index-CY7ixHhG.js',
  'dist/assets/index-v3-fixed.js',
  'dist/assets/index-CY7ixHhG.js'
];

targetFiles.forEach(file => {
  fs.writeFileSync(file, patchedContent, 'utf8');
  const check = fs.readFileSync(file, 'utf8');
  acorn.parse(check, { ecmaVersion: 2022, sourceType: 'module' });
  console.log('Successfully written and validated AST for:', file);
});

// Remove test file
if (fs.existsSync('test_patched_bundle.js')) {
  fs.unlinkSync('test_patched_bundle.js');
}

console.log('ALL BUNDLES SUCCESSFULLY UPDATED & 100% VALID!');
