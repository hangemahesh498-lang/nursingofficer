const fs = require("fs");
const acorn = require("acorn");

const files = [
  "public/assets/index-v3-fixed.js",
  "dist/assets/index-v3-fixed.js",
  "public/assets/index-CY7ixHhG.js",
  "dist/assets/index-CY7ixHhG.js"
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");

  const startTarget = 'var antiDupState = k.useState(true);  var antiDuplicate = antiDupState[0];  var setAntiDuplicate = antiDupState[1];';

  const alternativeTarget = 'var antiDupState = k.useState(true);';

  let startIndex = code.indexOf(startTarget);
  let targetToUse = startTarget;

  if (startIndex === -1) {
    startIndex = code.indexOf(alternativeTarget);
    targetToUse = alternativeTarget;
  }

  if (startIndex === -1) {
    console.warn(`Target state not found in ${filePath}`);
    return;
  }

  const newState = targetToUse + '  var formatState = k.useState("excel");  var outputFormat = formatState[0];  var setOutputFormat = formatState[1];';

  code = code.replace(targetToUse, newState);

  // Locate generatedPromptText definition
  const oldPromptGen = 'var generatedPromptText = "You are a Senior Certified Nursing Officer Examination Board Specialist.\\n" +';
  const pOldPrompt = code.indexOf(oldPromptGen);

  if (pOldPrompt === -1) {
    console.warn(`oldPromptGen not found in ${filePath}`);
    return;
  }

  // Find end of generatedPromptText definition before var handleCopyPrompt
  const endPromptGen = 'var handleCopyPrompt = function() {';
  const pEndPrompt = code.indexOf(endPromptGen, pOldPrompt);

  if (pEndPrompt === -1) {
    console.warn(`endPromptGen not found in ${filePath}`);
    return;
  }

  const newPromptGenCode = `var excelPromptText = "You are a Senior Certified Nursing Officer Examination Board Specialist.\\n" +
    "Target Exam: \\"" + selectedExam + "\\\" (" + currentSyllabus.name_en + ")\\n" +
    "Subject / Domain: \\"" + subjectLabel + "\\\"\\n" +
    "Difficulty Level: \\"" + difficulty + "\\\"\\n" +
    "Question Count: " + count + " Certified Bilingual MCQs\\n\\n" +
    "CRITICAL EXAM SYLLABUS CONSTRAINT:\\n" +
    "- This request is specifically for " + selectedExam + ".\\n" +
    "- " + currentSyllabus.note_mr + "\\n\\n" +
    (customTopic ? "Focus Concept / Topic: \\"" + customTopic + "\\\"\\n" : "") +
    "FORMAT REQUIREMENTS (STRICT EXCEL / CSV TABULAR FORMAT):\\n" +
    "Generate the output strictly as a CSV table with double quotes around text fields containing commas.\\n" +
    "Include these EXACT 15 CSV Column Headers in Row 1:\\n" +
    "subject_id,question_en,question_mr,option_a_en,option_a_mr,option_b_en,option_b_mr,option_c_en,option_c_mr,option_d_en,option_d_mr,correct_option,explanation_en,explanation_mr,difficulty\\n\\n" +
    "EXAMPLE CSV ROW:\\n" +
    "\\"" + (selectedSubject === "all" ? "subj-fon" : selectedSubject) + "\\\",\\\"Which position is recommended for a client after lumbar puncture?\\\",\\\"लंबर पंक्चरनंतर रुग्णाला कोणती पोझिशन द्यावी?\\\",\\\"Flat supine position\\\",\\\"सुपाईन पोझिशन\\\",\\\"Fowler's position\\\",\\\"फाउलर्स पोझिशन\\\",\\\"Trendelenburg position\\\",\\\"ट्रेंडेलनबर्ग पोझिशन\\\",\\\"Prone position\\\",\\\"प्रोन पोझिशन\\\",\\\"A\\\",\\\"Flat supine position for 4 to 12 hours prevents CSF leakage and post-dural puncture headache.\\\",\\\"लंबर पंक्चरनंतर CSF गळती आणि डोकेदुखी टाळण्यासाठी रुग्णाला ४ ते १२ तास पाठीवर सपाट (Flat Supine) झोपवावे.\\\",\\\"medium\\\"\\n\\n" +
    "Output ONLY the raw CSV table block so it can be saved directly as a .csv file or copy-pasted into Microsoft Excel and Google Sheets.\\n";

  var jsonPromptText = "You are a Senior Certified Nursing Officer Examination Board Specialist.\\n" +
    "Target Exam: \\"" + selectedExam + "\\\" (" + currentSyllabus.name_en + ")\\n" +
    "Subject / Domain: \\"" + subjectLabel + "\\\"\\n" +
    "Difficulty Level: \\"" + difficulty + "\\\"\\n" +
    "Question Count: " + count + " Certified Bilingual MCQs\\n\\n" +
    "CRITICAL EXAM SYLLABUS CONSTRAINT:\\n" +
    "- This request is specifically for " + selectedExam + ".\\n" +
    "- " + currentSyllabus.note_mr + "\\n\\n" +
    (customTopic ? "Focus Concept / Topic: \\"" + customTopic + "\\\"\\n" : "") +
    "FORMAT REQUIREMENTS:\\n" +
    "Return a valid JSON array of objects with bilingual English & Marathi questions, 4 options (A, B, C, D), correct_option, and clinical rationale in both languages:\\n" +
    "[\\n  {\\n    \\"question_en\\": \\"Question in English...\\",\\n    \\"question_mr\\": \\"मराठी प्रश्नविधान...\\",\\n    \\"option_a_en\\": \\"Option A in English\\",\\n    \\"option_a_mr\\": \\"पर्याय A मराठीत\\",\\n    \\"option_b_en\\": \\"Option B in English\\",\\n    \\"option_b_mr\\": \\"पर्याय B मराठीत\\",\\n    \\"option_c_en\\": \\"Option C in English\\",\\n    \\"option_c_mr\\": \\"पर्याय C मराठीत\\",\\n    \\"option_d_en\\": \\"Option D in English\\",\\n    \\"option_d_mr\\": \\"पर्याय D मराठीत\\",\\n    \\"correct_option\\": \\"A\\",\\n    \\"explanation_en\\": \\"Clinical rationale in English...\\",\\n    \\"explanation_mr\\": \\"सविस्तर क्लिनिकल स्पष्टीकरण मराठीत...\\",\\n    \\"subject\\": \\"" + (selectedSubject === "all" ? "subj-fon" : selectedSubject) + "\\\",\\n    \\"topic\\": \\"" + (customTopic || "Exam Preparation") + "\\\",\\n    \\"difficulty\\": \\"" + difficulty + "\\\",\\n    \\"exam_name\\": \\"" + selectedExam + "\\"\\n  }\\n]";

  var generatedPromptText = outputFormat === "excel" ? excelPromptText : jsonPromptText;

  var handleDownloadSampleCsv = function() {
    var csvContent = "subject_id,question_en,question_mr,option_a_en,option_a_mr,option_b_en,option_b_mr,option_c_en,option_c_mr,option_d_en,option_d_mr,correct_option,explanation_en,explanation_mr,difficulty\\n" +
      "\\"" + (selectedSubject === "all" ? "subj-fon" : selectedSubject) + "\\\",\\\"Which position is recommended for a client after lumbar puncture?\\\",\\\"लंबर पंक्चरनंतर रुग्णाला कोणती पोझिशन द्यावी?\\\",\\\"Flat supine position\\\",\\\"सुपाईन पोझिशन\\\",\\\"Fowler's position\\\",\\\"फाउलर्स पोझिशन\\\",\\\"Trendelenburg position\\\",\\\"ट्रेंडेलनबर्ग पोझिशन\\\",\\\"Prone position\\\",\\\"प्रोन पोझिशन\\\",\\\"A\\\",\\\"Flat supine position for 4 to 12 hours prevents CSF leakage and post-dural puncture headache.\\\",\\\"लंबर पंक्चरनंतर CSF गळती आणि डोकेदुखी टाळण्यासाठी रुग्णाला ४ ते १२ तास पाठीवर सपाट (Flat Supine) झोपवावे.\\\",\\\"medium\\\"\\n" +
      "\\"" + (selectedSubject === "all" ? "subj-fon" : selectedSubject) + "\\\",\\\"What is the normal range of Central Venous Pressure (CVP)?\\\",\\\"सेंट्रल व्हीनस प्रेशर (CVP) चे सामान्य प्रमाण किती असते?\\\",\\\"2 to 8 cm H2O\\\",\\\"२ ते ८ सेंमी H2O\\\",\\\"10 to 15 cm H2O\\\",\\\"१० ते १५ सेंमी H2O\\\",\\\"15 to 20 cm H2O\\\",\\\"१५ ते २० सेंमी H2O\\\",\\\"20 to 25 cm H2O\\\",\\\"२० ते २५ सेंमी H2O\\\",\\\"A\\\",\\\"Normal CVP is 2 to 8 cm H2O (or 2 to 6 mmHg), reflecting right atrial pressure and intravascular volume status.\\\",\\\"सामान्य CVP हे २ ते ८ सेंमी H2O असते, जे उजव्या कर्णिकेतील दाब आणि शरीरातील द्रव प्रमाण दर्शवते.\\\",\\\"medium\\\"";

    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "nursing_questions_excel_sample.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(lang === "mr" ? "✅ Excel/CSV नमुना फाईल (.csv) डाउनलोड झाली!" : "✅ Excel/CSV Sample Template Downloaded!", "success");
  };\n\n  `;

  code = code.substring(0, pOldPrompt) + newPromptGenCode + code.substring(pEndPrompt);

  try {
    const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" });
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`Successfully updated Excel AI Prompt logic in ${filePath}!`);
  } catch (err) {
    console.error(`Error validating ${filePath}:`, err.message);
  }
});
