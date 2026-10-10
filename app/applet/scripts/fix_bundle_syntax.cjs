const fs = require('fs');
const vm = require('vm');

['public/assets/index-v3-fixed.js', 'public/assets/index-CY7ixHhG.js', 'dist/assets/index-v3-fixed.js', 'dist/assets/index-CY7ixHhG.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace('"🔒 सुरक्षा पडताळणी:\nनिवडलेले', '"🔒 सुरक्षा पडताळणी: निवडलेले');
  content = content.replace('"🌐 या परीक्षेचे सर्व विषय एकत्रित (" + filteredSubjects.length + " विषय)', '"🌐 All Subjects Combined"');
  
  try {
    new vm.Script(content);
    console.log(file, 'is VALID!');
  } catch (e) {
    console.log(file, 'Error:', e.message);
    const match = e.stack.match(/<anonymous>:(\d+)/);
    if (match) {
      const lineNum = parseInt(match[1], 10);
      const lines = content.split('\n');
      console.log('At line', lineNum, ':', lines[lineNum - 1]);
    }
  }

  fs.writeFileSync(file, content, 'utf8');
  fs.writeFileSync(file.replace('public/', 'dist/'), content, 'utf8');
});
