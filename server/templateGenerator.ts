import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

export interface TemplateQuestionRow {
  question_en: string;
  question_mr: string;
  option_a_en: string;
  option_a_mr: string;
  option_b_en: string;
  option_b_mr: string;
  option_c_en: string;
  option_c_mr: string;
  option_d_en: string;
  option_d_mr: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation_en: string;
  explanation_mr: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  exam_name?: string;
  exam_year?: number;
}

export const SAMPLE_TEMPLATE_QUESTIONS: TemplateQuestionRow[] = [
  {
    question_en: "Which of the following is the most reliable site for assessing core body temperature in an unconscious adult patient?",
    question_mr: "बेशुद्ध प्रौढ रुग्णाच्या शरीराचे मुख्य तापमान (Core Body Temperature) मोजण्यासाठी खालीलपैकी कोणते ठिकाण सर्वात विश्वसनीय मानले जाते?",
    option_a_en: "Axillary",
    option_a_mr: "काखेतील (Axillary)",
    option_b_en: "Rectal",
    option_b_mr: "गुदाशयातील (Rectal)",
    option_c_en: "Oral",
    option_c_mr: "तोंडातील (Oral)",
    option_d_en: "Tympanic",
    option_d_mr: "कानातील (Tympanic)",
    correct_option: "B",
    explanation_en: "Rectal temperature provides the closest clinical approximation to core body temperature in unconscious adults. Axillary is least accurate, while oral is strictly contraindicated in unconscious patients due to aspiration and bite risks.",
    explanation_mr: "गुदाशयातील (Rectal) तापमान हे प्रौढ बेशुद्ध रुग्णांमध्ये शरीराचे मूळ तापमान (Core temperature) मोजण्यासाठी सर्वात अचूक व विश्वसनीय पद्धत आहे. बेशुद्ध रुग्णात तोंडावाटे तापमान घेणे धोकादायक (Aspiration risk) ठरते आणि काखेतील तापमान पृष्ठभागाचे असल्याने कमी अचूक असते.",
    subject: "subj-fon",
    topic: "Vital Signs & Temperature Assessment",
    difficulty: "medium",
    exam_name: "DMER / DHS Nursing Officer Exam",
    exam_year: 2024
  },
  {
    question_en: "What is the primary specific antidote administered in magnesium sulfate (MgSO4) toxicity in a pre-eclamptic mother?",
    question_mr: "प्री-एक्लॅम्पसिया असलेल्या मातेमध्ये मॅग्नेशियम सल्फेट (MgSO4) च्या अतिविषारीतेवर (Toxicity) प्राथमिक उतारा (Specific Antidote) म्हणून काय दिले जाते?",
    option_a_en: "Naloxone IV",
    option_a_mr: "नॅलॉक्सोन (Naloxone IV)",
    option_b_en: "Calcium Gluconate 10%",
    option_b_mr: "कॅल्शियम ग्लुकोनेट १०% (Calcium Gluconate 10%)",
    option_c_en: "Protamine Sulfate",
    option_c_mr: "प्रोटामाइन सल्फेट (Protamine Sulfate)",
    option_d_en: "Vitamin K1",
    option_d_mr: "व्हिटॅमिन के१ (Vitamin K1)",
    correct_option: "B",
    explanation_en: "10% Calcium Gluconate (10 mL administered IV slowly over 3-5 minutes) is the specific antidote for Magnesium Sulfate toxicity, which clinically presents with loss of deep tendon reflexes (patellar), respiratory depression (<12 breaths/min), and oliguria (<30 mL/hr).",
    explanation_mr: "१०% कॅल्शियम ग्लुकोनेट (१० मिली हळूहळू शिरेतून/IV ३ ते ५ मिनिटांत) हे मॅग्नेशियम सल्फेट विषबाधेवर विशिष्ट उतारा (Antidote) आहे. मॅग्नेशियम विषबाधेमध्ये पटेला रिफ्लेक्स नाहीसे होणे, श्वसन दर प्रतिमिनिट १२ पेक्षा कमी होणे आणि लघवीचे प्रमाण प्रतितास ३० मिलीपेक्षा कमी होणे ही लक्षणे आढळतात.",
    subject: "subj-obg",
    topic: "High Risk Pregnancy & Eclampsia Management",
    difficulty: "hard",
    exam_name: "AIIMS NORCET / ESIC Nursing Officer",
    exam_year: 2023
  },
  {
    question_en: "In Wallace's Rule of Nines for assessing burns in an adult, what percentage of total body surface area (TBSA) is assigned to the entire anterior trunk?",
    question_mr: "प्रौढ रुग्णातील भाजल्याचे प्रमाण मोजण्याच्या 'रूल ऑफ नाइन्स' (Wallace Rule of Nines) नुसार शरीराच्या समोरील संपूर्ण धडाचा (Anterior Trunk: छाती + पोट) भाग किती टक्के मानला जातो?",
    option_a_en: "9%",
    option_a_mr: "९%",
    option_b_en: "18%",
    option_b_mr: "१८%",
    option_c_en: "36%",
    option_c_mr: "३६%",
    option_d_en: "4.5%",
    option_d_mr: "४.५%",
    correct_option: "B",
    explanation_en: "According to Wallace's Rule of Nines for adults: Anterior trunk (chest + abdomen) = 18%, Posterior trunk = 18%, Each entire lower extremity = 18%, Each entire upper extremity = 9%, Entire head & neck = 9%, and Perineum/genitalia = 1%. Total = 100%.",
    explanation_mr: "वॉलेसच्या रूल ऑफ नाइन्स नुसार प्रौढ व्यक्तीमध्ये: समोरील संपूर्ण धड (छाती + पोट) = १८%, मागील संपूर्ण धड = १८%, प्रत्येक पाय = १८%, प्रत्येक हात = ९%, डोके व मान = ९%, आणि पेरीनिअम = १% मानले जाते. एकूण = १००%.",
    subject: "subj-msn",
    topic: "Burns Assessment & Fluid Resuscitation",
    difficulty: "medium",
    exam_name: "RRB Railway Staff Nurse",
    exam_year: 2024
  },
  {
    question_en: "What is the recommended needle size (gauge) and angle of insertion for administering an intramuscular (IM) injection to an adult at the ventrogluteal site?",
    question_mr: "प्रौढ व्यक्तीमध्ये व्हेंट्रोग्लूटिअल (Ventrogluteal) जागेवर अंतःस्नायु (IM) इंजेक्शन देताना सुईचा योग्य आकार (Gauge) व कोन (Angle) कोणता असावा?",
    option_a_en: "21-23 Gauge at 90 degrees",
    option_a_mr: "२१ ते २३ गेज, ९० अंशाच्या कोनात",
    option_b_en: "25-27 Gauge at 45 degrees",
    option_b_mr: "२५ ते २७ गेज, ४५ अंशाच्या कोनात",
    option_c_en: "18-20 Gauge at 15 degrees",
    option_c_mr: "१८ ते २० गेज, १५ अंशाच्या कोनात",
    option_d_en: "28-30 Gauge at 90 degrees",
    option_d_mr: "२८ ते ३० गेज, ९० अंशाच्या कोनात",
    correct_option: "A",
    explanation_en: "Intramuscular (IM) injections are administered at a 90-degree angle. For adults, a 21-23 gauge, 1 to 1.5 inch needle is standard for the ventrogluteal site, which is the safest site due to absence of major nerves and blood vessels.",
    explanation_mr: "अंतःस्नायु (IM) इंजेक्शन नेहमी ९० अंशाच्या काटकोनात दिले जाते. प्रौढ व्यक्तीसाठी व्हेंट्रोग्लूटिअल जागेवर २१ ते २३ गेजची (१ ते १.५ इंच लांब) सुई वापरली जाते. ही जागा मुख्य रक्तवाहिन्या व नसांपासून लांब असल्याने सर्वात सुरक्षित मानली जाते.",
    subject: "subj-fon",
    topic: "Medication Administration & Injections",
    difficulty: "easy",
    exam_name: "DHS Staff Nurse Recruitment",
    exam_year: 2023
  },
  {
    question_en: "According to the National Immunization Schedule (NIS) in India, at what age is the first dose of the Measles-Rubella (MR) vaccine administered to an infant?",
    question_mr: "भारतातील राष्ट्रीय लसीकरण वेळापत्रकानुसार (NIS), बालकाला गोवर-रुबेला (MR) लसीचा पहिला डोस कोणत्या वयात दिला जातो?",
    option_a_en: "At birth",
    option_a_mr: "जन्मतः (At birth)",
    option_b_en: "6 Weeks",
    option_b_mr: "६ आठवड्यांनी",
    option_c_en: "9-12 Months",
    option_c_mr: "९ ते १२ महिन्यांत",
    option_d_en: "16-24 Months",
    option_d_mr: "१६ ते २४ महिन्यांत",
    correct_option: "C",
    explanation_en: "Under India's Universal Immunization Programme (UIP), the MR 1st dose is given subcutaneously at 9-12 months of age (along with Vitamin A 1st dose). The MR 2nd dose is administered at 16-24 months of age.",
    explanation_mr: "भारतातील राष्ट्रीय सार्वत्रिक लसीकरण कार्यक्रमानुसार (UIP), गोवर-रुबेला (MR) चा पहिला डोस बालकाला ९ ते १२ महिन्यांच्या वयात त्वचेखाली (Subcutaneous) दिला जातो (यासोबतच व्हिटॅमिन 'ए' चा पहिला डोस दिला जातो). दुसरा डोस १६ ते २४ महिन्यांत दिला जातो.",
    subject: "subj-chn",
    topic: "National Immunization Schedule & Child Health",
    difficulty: "easy",
    exam_name: "CHO / NHM Community Health Officer",
    exam_year: 2024
  },
  {
    question_en: "In Adult Basic Life Support (BLS) and CPR guidelines by AHA, what is the standard recommended chest compression-to-ventilation ratio for a single rescuer in an adult in cardiac arrest?",
    question_mr: "अमेरिकन हार्ट असोसिएशन (AHA) च्या प्रौढ सीपीआर (CPR/BLS) नियमावलीनुसार एका बचावकर्त्यासाठी (Single Rescuer) छाती दाबणे (Compressions) आणि कृत्रिम श्वास (Breaths) यांचे प्रमाणित प्रमाण काय आहे?",
    option_a_en: "15:2",
    option_a_mr: "१५:२",
    option_b_en: "30:2",
    option_b_mr: "३०:२",
    option_c_en: "5:1",
    option_c_mr: "५:१",
    option_d_en: "30:1",
    option_d_mr: "३०:१",
    correct_option: "B",
    explanation_en: "For all adult cardiac arrest victims, the recommended compression-to-ventilation ratio for 1 or 2 rescuers is 30:2 at a rate of 100-120 compressions per minute and depth of at least 2 inches (5 cm) allowing complete chest recoil.",
    explanation_mr: "प्रौढ व्यक्तीच्या कार्डियाक अरेस्टमध्ये १ किंवा २ बचावकर्त्यांसाठी छाती दाबणे आणि कृत्रिम श्वास यांचे प्रमाणित गुणोत्तर ३०:२ आहे. छाती दाबण्याचा वेग प्रतिमिनिट १०० ते १२० आणि खोली किमान २ इंच (५ सेमी) असावी.",
    subject: "subj-icu-bls",
    topic: "CPR, BLS & Resuscitation Protocols",
    difficulty: "medium",
    exam_name: "AIIMS NORCET / Central Govt Exams",
    exam_year: 2024
  }
];

export const TEMPLATE_COLUMNS_INFO = [
  { column: "question_en", marathi_name: "इंग्रजी प्रश्न", required: "होय (Required)", description: "मुख्य प्रश्न इंग्रजीत. (उदा. Which of the following...)" },
  { column: "question_mr", marathi_name: "मराठी प्रश्न", required: "ऐच्छिक / शिफारस (Recommended)", description: "प्रश्नाचा मराठी अनुवाद. नसेल तर AI आपोआप तयार करू शकते." },
  { column: "option_a_en", marathi_name: "पर्याय A इंग्रजी", required: "होय (Required)", description: "पहिला पर्याय इंग्रजीत" },
  { column: "option_a_mr", marathi_name: "पर्याय A मराठी", required: "ऐच्छिक (Optional)", description: "पहिला पर्याय मराठीत" },
  { column: "option_b_en", marathi_name: "पर्याय B इंग्रजी", required: "होय (Required)", description: "दुसरा पर्याय इंग्रजीत" },
  { column: "option_b_mr", marathi_name: "पर्याय B मराठी", required: "ऐच्छिक (Optional)", description: "दुसरा पर्याय मराठीत" },
  { column: "option_c_en", marathi_name: "पर्याय C इंग्रजी", required: "होय (Required)", description: "तिसरा पर्याय इंग्रजीत" },
  { column: "option_c_mr", marathi_name: "पर्याय C मराठी", required: "ऐच्छिक (Optional)", description: "तिसरा पर्याय मराठीत" },
  { column: "option_d_en", marathi_name: "पर्याय D इंग्रजी", required: "होय (Required)", description: "चौथा पर्याय इंग्रजीत" },
  { column: "option_d_mr", marathi_name: "पर्याय D मराठी", required: "ऐच्छिक (Optional)", description: "चौथा पर्याय मराठीत" },
  { column: "correct_option", marathi_name: "अचूक उत्तर पर्याय", required: "होय (Required)", description: "फक्त A, B, C, किंवा D टाका (उदा. B)" },
  { column: "explanation_en", marathi_name: "स्पष्टीकरण इंग्रजी", required: "शिफारस (Highly Recommended)", description: "सविस्तर क्लिनिकल स्पष्टीकरण इंग्रजीत. विद्यार्थी सराव करताना हे वाचू शकतात." },
  { column: "explanation_mr", marathi_name: "स्पष्टीकरण मराठी", required: "शिफारस (Highly Recommended)", description: "सविस्तर क्लिनिकल स्पष्टीकरण मराठीत. मराठी माध्यमाच्या विद्यार्थ्यांसाठी अत्यंत महत्त्वाचे." },
  { column: "subject", marathi_name: "विषय (Subject ID)", required: "शिफारस (Recommended)", description: "विषयाचा ID टाका (उदा. subj-fon, subj-msn, subj-obg, subj-icu-bls) किंवा विषयाचे नाव." },
  { column: "topic", marathi_name: "प्रकरण / उपविषय", required: "ऐच्छिक (Optional)", description: "प्रकरणाचे नाव (उदा. Vital Signs, High Risk Pregnancy, Burns, CPR)" },
  { column: "difficulty", marathi_name: "काठिण्य पातळी", required: "ऐच्छिक (Optional)", description: "easy (सोपे), medium (मध्यम), किंवा hard (कठीण). डीफॉल्ट: medium" },
  { column: "exam_name", marathi_name: "परीक्षेचे नाव", required: "ऐच्छिक (Optional)", description: "उदा. AIIMS NORCET, RRB, ESIC, DSSSB, CHO, DMER, DHS" },
  { column: "exam_year", marathi_name: "परीक्षेचे वर्ष", required: "ऐच्छिक (Optional)", description: "उदा. 2024, 2023, 2022" }
];

export const ALL_INDIA_EXAM_TRACKS = [
  { exam: "AIIMS NORCET (Central AIIMS)", coverage: "Core Nursing, ICU/BLS, Advanced Clinicals, Aptitude, General English", target_students: "All India Nursing Graduates (B.Sc / Post Basic / GNM)" },
  { exam: "RRB Railway Staff Nurse (CBT)", coverage: "Technical Nursing, General Science (Phy/Chem/Bio), Arithmetic & Reasoning, General Hindi/English", target_students: "Pan-India Railway Paramedical Aspirants" },
  { exam: "ESIC Nursing Officer", coverage: "Core Nursing, Pharmacology & Calculations, Microbiology, Aptitude, General Awareness", target_students: "All India ESIC Hospital Aspirants" },
  { exam: "DSSSB Staff Nurse (Delhi)", coverage: "Technical Nursing (100 Marks) + General Hindi, English, Reasoning, Arithmetical Ability, GK (100 Marks)", target_students: "Delhi Govt Hospital Aspirants" },
  { exam: "CHO / NHM (Community Health)", coverage: "Community Health Nursing, National Health Programs, Maternal & Child Health, Communicable Diseases", target_students: "State Health & Wellness Centers" },
  { exam: "Military Nursing Service (MNS)", coverage: "General English, General Biology & Science, General Intelligence, Nursing Concepts", target_students: "Armed Forces Medical Services (AFMS)" },
  { exam: "Maharashtra DMER / DHS / ZP", coverage: "Technical Nursing (80 Marks) + Marathi Grammar, English, Reasoning & Maharashtra GK (20 Marks)", target_students: "Maharashtra Health Department Aspirants" }
];

export const SUBJECT_REFERENCE_LIST = [
  { id: "subj-fon", name_en: "Fundamentals of Nursing & First Aid", name_mr: "नर्सिंगची मूलभूत तत्त्वे व प्रथमोपचार" },
  { id: "subj-msn", name_en: "Medical-Surgical Nursing", name_mr: "वैद्यकीय-शस्त्रक्रिया नर्सिंग" },
  { id: "subj-obg", name_en: "Obstetric & Midwifery Nursing", name_mr: "प्रसूतिशास्त्र आणि स्त्रीरोग नर्सिंग" },
  { id: "subj-peds", name_en: "Child Health / Pediatric Nursing", name_mr: "बालरोग नर्सिंग" },
  { id: "subj-chn", name_en: "Community Health Nursing", name_mr: "समुदाय आरोग्य नर्सिंग" },
  { id: "subj-mhn", name_en: "Mental Health & Psychiatric Nursing", name_mr: "मानसोपचार नर्सिंग" },
  { id: "subj-pharm", name_en: "Pharmacology & Drug Calculations", name_mr: "औषधशास्त्र आणि मात्रा गणना" },
  { id: "subj-micro", name_en: "Microbiology & Sterilization", name_mr: "सूक्ष्मजीवशास्त्र व निर्जंतुकीकरण" },
  { id: "subj-path", name_en: "Pathology & Laboratory Interpretation", name_mr: "पॅथॉलॉजी आणि प्रयोगशाळा तपासण्या" },
  { id: "subj-anat", name_en: "Anatomy & Physiology (Nursing Oriented)", name_mr: "शरीररचना आणि शरीरक्रियाशास्त्र" },
  { id: "subj-icu-bls", name_en: "Critical Care, ICU & Emergency Nursing", name_mr: "आयसीयू आणि आपत्कालीन नर्सिंग" },
  { id: "subj-infection", name_en: "Infection Control & Biomedical Waste (BMW)", name_mr: "संसर्ग नियंत्रण आणि बायोमेडिकल कचरा" },
  { id: "subj-admin-mgmt", name_en: "Hospital Nursing Administration, Leadership & NABH", name_mr: "रुग्णालय नर्सिंग प्रशासन व व्यवस्थापन" },
  { id: "subj-ethics-legal", name_en: "Nursing Ethics, Jurisprudence & Legal Aspects", name_mr: "नर्सिंग नैतिकता, कायदेविषयक बाबी आणि अधिकार" },
  { id: "subj-genetics", name_en: "Genetics & Genomics in Nursing", name_mr: "जनुकशास्त्र आणि आनुवंशिकता" },
  { id: "subj-forensic-nursing", name_en: "Forensic Nursing & Indian Health Legislation", name_mr: "फॉरेन्सिक नर्सिंग व भारतीय आरोग्य कायदे" },
  { id: "subj-physio", name_en: "Human Physiology", name_mr: "मानवी शरीरक्रियाशास्त्र" },
  { id: "subj-biochem", name_en: "Biochemistry for Nurses", name_mr: "बायोकेमिस्ट्री (जैव रसायनशास्त्र)" },
  { id: "subj-psych", name_en: "Psychology", name_mr: "मानसशास्त्र" },
  { id: "subj-socio", name_en: "Sociology & Healthcare Dynamics", name_mr: "समाजशास्त्र" },
  { id: "subj-nutr", name_en: "Nutrition & Therapeutic Diets", name_mr: "आहारशास्त्र आणि पोषण" },
  { id: "subj-research", name_en: "Nursing Research & Statistics", name_mr: "नर्सिंग संशोधन आणि सांख्यिकी" },
  { id: "subj-computer", name_en: "Computer Knowledge & Hospital IT (EHR/EMR)", name_mr: "संगणक ज्ञान व हॉस्पिटल माहिती तंत्रज्ञान" },
  { id: "subj-apt-norcet", name_en: "Aptitude & General Intelligence (सर्व नर्सिंग परीक्षा)", name_mr: "अभियोग्यता आणि सामान्य बुद्धिमत्ता चाचणी" },
  { id: "subj-math-reas", name_en: "Reasoning & Numerical Ability (Mathematics)", name_mr: "अंकगणित आणि बुद्धिमत्ता चाचणी" },
  { id: "subj-eng", name_en: "English Grammar & Comprehension", name_mr: "इंग्रजी व्याकरण आणि आकलन" },
  { id: "subj-gen-hindi", name_en: "General Hindi (हिंदी व्याकरण - RRB/ESIC/DSSSB/CHO)", name_mr: "सामान्य हिंदी व्याकरण (सर्व केंद्रीय परीक्षा)" },
  { id: "subj-gk-mr", name_en: "Marathi Grammar & Language (मराठी व्याकरण)", name_mr: "मराठी व्याकरण आणि भाषा ज्ञान" },
  { id: "subj-gk-mh", name_en: "General Knowledge & National Health Programs", name_mr: "सामान्य ज्ञान आणि राष्ट्रीय आरोग्य योजना" },
  { id: "subj-science", name_en: "General Science (Physics, Chem, Bio)", name_mr: "सामान्य विज्ञान" },
  { id: "subj-current-affairs", name_en: "Current Affairs & National Health News", name_mr: "चालू घडामोडी आणि आरोग्य घडामोडी" },
  { id: "subj-track-aiims", name_en: "AIIMS NORCET Special Exam Module", name_mr: "एम्स नर्सिंग ऑफिसर (NORCET परीक्षा विशेष)" },
  { id: "subj-track-esic", name_en: "ESIC Nursing Officer Recruitment Module", name_mr: "ईएसआयसी (ESIC) नर्सिंग ऑफिसर परीक्षा" },
  { id: "subj-track-railway", name_en: "Railway Nursing Exams (RRB Paramedical CBT)", name_mr: "रेल्वे भरती मंडळ नर्सिंग परीक्षा (RRB)" },
  { id: "subj-track-mns", name_en: "Military Nursing Service (MNS Exams)", name_mr: "लष्करी परिचारिका सेवा (MNS परीक्षा)" },
  { id: "subj-track-mh-health", name_en: "Maharashtra Health Dept Exams (DMER/DHS/ZP)", name_mr: "महाराष्ट्र आरोग्य विभाग परीक्षा विशेष (DMER • DHS • ZP)" }
];

export async function generateQuestionTemplateExcel(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nursing Officer Exam System (All India Bilingual)";
  workbook.lastModifiedBy = "Admin";
  workbook.created = new Date();
  workbook.modified = new Date();

  // -------------------------------------------------------------
  // Sheet 1: Bilingual_Questions_Template
  // -------------------------------------------------------------
  const ws1 = workbook.addWorksheet('Bilingual_Questions_Template', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  ws1.columns = [
    { header: 'question_en (इंग्रजी प्रश्न)', key: 'question_en', width: 45 },
    { header: 'question_mr (मराठी प्रश्न)', key: 'question_mr', width: 45 },
    { header: 'option_a_en (पर्याय A इंग्रजी)', key: 'option_a_en', width: 25 },
    { header: 'option_a_mr (पर्याय A मराठी)', key: 'option_a_mr', width: 25 },
    { header: 'option_b_en (पर्याय B इंग्रजी)', key: 'option_b_en', width: 25 },
    { header: 'option_b_mr (पर्याय B मराठी)', key: 'option_b_mr', width: 25 },
    { header: 'option_c_en (पर्याय C इंग्रजी)', key: 'option_c_en', width: 25 },
    { header: 'option_c_mr (पर्याय C मराठी)', key: 'option_c_mr', width: 25 },
    { header: 'option_d_en (पर्याय D इंग्रजी)', key: 'option_d_en', width: 25 },
    { header: 'option_d_mr (पर्याय D मराठी)', key: 'option_d_mr', width: 25 },
    { header: 'correct_option (A/B/C/D)', key: 'correct_option', width: 16 },
    { header: 'explanation_en (स्पष्टीकरण इंग्रजी)', key: 'explanation_en', width: 50 },
    { header: 'explanation_mr (स्पष्टीकरण मराठी)', key: 'explanation_mr', width: 50 },
    { header: 'subject (Subject ID)', key: 'subject', width: 18 },
    { header: 'topic (प्रकरण / उपविषय)', key: 'topic', width: 30 },
    { header: 'difficulty (easy/med/hard)', key: 'difficulty', width: 16 },
    { header: 'exam_name (परीक्षेचे नाव)', key: 'exam_name', width: 25 },
    { header: 'exam_year (वर्ष)', key: 'exam_year', width: 14 }
  ];

  // Style header row
  const headerRow1 = ws1.getRow(1);
  headerRow1.height = 32;
  headerRow1.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow1.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E3A8A' } // Dark Royal Blue
  };
  headerRow1.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

  SAMPLE_TEMPLATE_QUESTIONS.forEach(q => {
    const row = ws1.addRow({
      question_en: q.question_en,
      question_mr: q.question_mr,
      option_a_en: q.option_a_en,
      option_a_mr: q.option_a_mr,
      option_b_en: q.option_b_en,
      option_b_mr: q.option_b_mr,
      option_c_en: q.option_c_en,
      option_c_mr: q.option_c_mr,
      option_d_en: q.option_d_en,
      option_d_mr: q.option_d_mr,
      correct_option: q.correct_option,
      explanation_en: q.explanation_en,
      explanation_mr: q.explanation_mr,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      exam_name: q.exam_name,
      exam_year: q.exam_year
    });
    row.alignment = { vertical: 'top', wrapText: true };
  });

  // -------------------------------------------------------------
  // Sheet 2: All_India_Exam_Syllabus
  // -------------------------------------------------------------
  const ws2 = workbook.addWorksheet('All_India_Exam_Syllabus', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  ws2.columns = [
    { header: 'Exam Track (परीक्षा)', key: 'exam', width: 32 },
    { header: 'Subjects & Syllabus Covered (अभ्यासक्रम)', key: 'coverage', width: 55 },
    { header: 'Target Candidates (लक्ष्य विद्यार्थी)', key: 'target_students', width: 45 }
  ];

  const headerRow2 = ws2.getRow(1);
  headerRow2.height = 28;
  headerRow2.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow2.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF065F46' } // Deep Forest Emerald
  };
  headerRow2.alignment = { vertical: 'middle', horizontal: 'center' };

  ALL_INDIA_EXAM_TRACKS.forEach(t => {
    const r = ws2.addRow(t);
    r.alignment = { vertical: 'top', wrapText: true };
  });

  // -------------------------------------------------------------
  // Sheet 3: Subject_IDs_Reference
  // -------------------------------------------------------------
  const ws3 = workbook.addWorksheet('Subject_IDs_Reference', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  ws3.columns = [
    { header: 'Subject ID (अधिकृत विषय कोड)', key: 'id', width: 22 },
    { header: 'Subject Name English (इंग्रजी नाव)', key: 'name_en', width: 45 },
    { header: 'Subject Name Marathi (मराठी नाव)', key: 'name_mr', width: 45 }
  ];

  const headerRow3 = ws3.getRow(1);
  headerRow3.height = 28;
  headerRow3.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow3.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4C1D95' } // Deep Indigo
  };
  headerRow3.alignment = { vertical: 'middle', horizontal: 'center' };

  SUBJECT_REFERENCE_LIST.forEach(s => {
    const r = ws3.addRow(s);
    r.alignment = { vertical: 'middle', wrapText: true };
  });

  // -------------------------------------------------------------
  // Sheet 4: Columns_Guide
  // -------------------------------------------------------------
  const ws4 = workbook.addWorksheet('Columns_Guide', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  ws4.columns = [
    { header: 'Column Key (कॉलम नाव)', key: 'column', width: 22 },
    { header: 'Marathi Field (मराठी नाव)', key: 'marathi_name', width: 25 },
    { header: 'Mandatory / Optional (आवश्यकता)', key: 'required', width: 30 },
    { header: 'Guidelines & Examples (नियम व उदाहरणे)', key: 'description', width: 60 }
  ];

  const headerRow4 = ws4.getRow(1);
  headerRow4.height = 28;
  headerRow4.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow4.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF92400E' } // Deep Amber
  };
  headerRow4.alignment = { vertical: 'middle', horizontal: 'center' };

  TEMPLATE_COLUMNS_INFO.forEach(info => {
    const r = ws4.addRow(info);
    r.alignment = { vertical: 'top', wrapText: true };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function generateQuestionTemplateCsv(): string {
  const escapeCsv = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = [
    'question_en',
    'question_mr',
    'option_a_en',
    'option_a_mr',
    'option_b_en',
    'option_b_mr',
    'option_c_en',
    'option_c_mr',
    'option_d_en',
    'option_d_mr',
    'correct_option',
    'explanation_en',
    'explanation_mr',
    'subject',
    'topic',
    'difficulty',
    'exam_name',
    'exam_year'
  ];

  const rows = [headers.join(',')];

  SAMPLE_TEMPLATE_QUESTIONS.forEach(q => {
    const row = [
      escapeCsv(q.question_en),
      escapeCsv(q.question_mr),
      escapeCsv(q.option_a_en),
      escapeCsv(q.option_a_mr),
      escapeCsv(q.option_b_en),
      escapeCsv(q.option_b_mr),
      escapeCsv(q.option_c_en),
      escapeCsv(q.option_c_mr),
      escapeCsv(q.option_d_en),
      escapeCsv(q.option_d_mr),
      escapeCsv(q.correct_option),
      escapeCsv(q.explanation_en),
      escapeCsv(q.explanation_mr),
      escapeCsv(q.subject),
      escapeCsv(q.topic),
      escapeCsv(q.difficulty),
      escapeCsv(q.exam_name),
      escapeCsv(q.exam_year)
    ];
    rows.push(row.join(','));
  });

  // Prepend UTF-8 BOM so Excel opens Marathi Devanagari text correctly
  return '\uFEFF' + rows.join('\r\n');
}

export function generateQuestionTemplateJson(): string {
  return JSON.stringify(
    {
      title: "All-India Bilingual Nursing Officer MCQ Import Template (English & मराठी)",
      description: "अखिल भारतीय नर्सिंग ऑफिसर परीक्षेचे बहुपर्यायी प्रश्न इंग्रजी व मराठी स्पष्टीकरणासहित आयात करण्यासाठी अधिकृत नमुना फॉरमॅट",
      version: "3.0",
      supported_formats: ["xlsx", "csv", "json"],
      national_exam_tracks: ALL_INDIA_EXAM_TRACKS,
      subject_id_reference: SUBJECT_REFERENCE_LIST,
      sample_bilingual_questions: SAMPLE_TEMPLATE_QUESTIONS
    },
    null,
    2
  );
}

export async function exportAllQuestionsExcel(questions: any[], subjects: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nursing Officer Exam System";
  workbook.lastModifiedBy = "Admin";
  workbook.created = new Date();

  const subjectMap = new Map<string, any>(subjects.map(s => [s.id, s]));

  // Sheet 1: All Questions Database
  const ws = workbook.addWorksheet('All_Questions_डेटाबेस', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  ws.columns = [
    { header: 'ID (प्रश्न क्रमांक)', key: 'id', width: 16 },
    { header: 'question_en (इंग्रजी प्रश्न)', key: 'question_en', width: 45 },
    { header: 'question_mr (मराठी प्रश्न)', key: 'question_mr', width: 45 },
    { header: 'option_a_en (पर्याय A इंग्रजी)', key: 'option_a_en', width: 22 },
    { header: 'option_a_mr (पर्याय A मराठी)', key: 'option_a_mr', width: 22 },
    { header: 'option_b_en (पर्याय B इंग्रजी)', key: 'option_b_en', width: 22 },
    { header: 'option_b_mr (पर्याय B मराठी)', key: 'option_b_mr', width: 22 },
    { header: 'option_c_en (पर्याय C इंग्रजी)', key: 'option_c_en', width: 22 },
    { header: 'option_c_mr (पर्याय C मराठी)', key: 'option_c_mr', width: 22 },
    { header: 'option_d_en (पर्याय D इंग्रजी)', key: 'option_d_en', width: 22 },
    { header: 'option_d_mr (पर्याय D मराठी)', key: 'option_d_mr', width: 22 },
    { header: 'correct_option (उत्तर)', key: 'correct_option', width: 14 },
    { header: 'explanation_en (स्पष्टीकरण इंग्रजी)', key: 'explanation_en', width: 50 },
    { header: 'explanation_mr (स्पष्टीकरण मराठी)', key: 'explanation_mr', width: 50 },
    { header: 'subject_id (विषय कोड)', key: 'subject_id', width: 18 },
    { header: 'subject_name (विषयाचे नाव)', key: 'subject_name', width: 30 },
    { header: 'chapter_id', key: 'chapter_id', width: 20 },
    { header: 'topic_id', key: 'topic_id', width: 20 },
    { header: 'difficulty (काठिण्य)', key: 'difficulty', width: 14 },
    { header: 'exam_name (परीक्षा)', key: 'exam_name', width: 22 },
    { header: 'exam_year (वर्ष)', key: 'exam_year', width: 12 },
    { header: 'status (स्थिती)', key: 'status', width: 14 },
    { header: 'is_verified_pyq', key: 'is_verified_pyq', width: 14 }
  ];

  const headerRow = ws.getRow(1);
  headerRow.height = 30;
  headerRow.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' } // Slate 900
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

  questions.forEach(q => {
    const sub = subjectMap.get(q.subject_id);
    const subName = sub ? `${sub.name_en} (${sub.name_mr})` : (q.subject_id || '');
    const row = ws.addRow({
      id: q.id,
      question_en: q.question_en || '',
      question_mr: q.question_mr || '',
      option_a_en: q.option_a_en || '',
      option_a_mr: q.option_a_mr || '',
      option_b_en: q.option_b_en || '',
      option_b_mr: q.option_b_mr || '',
      option_c_en: q.option_c_en || '',
      option_c_mr: q.option_c_mr || '',
      option_d_en: q.option_d_en || '',
      option_d_mr: q.option_d_mr || '',
      correct_option: q.correct_option || 'A',
      explanation_en: q.explanation_en || '',
      explanation_mr: q.explanation_mr || '',
      subject_id: q.subject_id || '',
      subject_name: subName,
      chapter_id: q.chapter_id || '',
      topic_id: q.topic_id || '',
      difficulty: q.difficulty || 'medium',
      exam_name: q.exam_name || 'AIIMS NORCET',
      exam_year: q.exam_year || 2024,
      status: q.status || 'published',
      is_verified_pyq: q.is_verified_pyq ? 'Yes' : 'No'
    });
    row.alignment = { vertical: 'top', wrapText: true };
  });

  // Sheet 2: Subject Wise Summary
  const wsSummary = workbook.addWorksheet('Subject_Summary_सारांश', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  wsSummary.columns = [
    { header: 'Subject ID', key: 'id', width: 18 },
    { header: 'Subject Name (English)', key: 'name_en', width: 40 },
    { header: 'विषयाचे नाव (मराठी)', key: 'name_mr', width: 40 },
    { header: 'Total Questions (एकूण प्रश्न)', key: 'count', width: 22 }
  ];

  const sumHeader = wsSummary.getRow(1);
  sumHeader.height = 28;
  sumHeader.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  sumHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E40AF' }
  };
  sumHeader.alignment = { vertical: 'middle', horizontal: 'center' };

  subjects.forEach(s => {
    const count = questions.filter(q => q.subject_id === s.id).length;
    wsSummary.addRow({
      id: s.id,
      name_en: s.name_en,
      name_mr: s.name_mr,
      count
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function exportAllQuestionsCsv(questions: any[], subjects: any[]): string {
  const escapeCsv = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const subjectMap = new Map<string, any>(subjects.map(s => [s.id, s]));

  const headers = [
    'id',
    'question_en',
    'question_mr',
    'option_a_en',
    'option_a_mr',
    'option_b_en',
    'option_b_mr',
    'option_c_en',
    'option_c_mr',
    'option_d_en',
    'option_d_mr',
    'correct_option',
    'explanation_en',
    'explanation_mr',
    'subject_id',
    'subject_name',
    'chapter_id',
    'topic_id',
    'difficulty',
    'exam_name',
    'exam_year',
    'status'
  ];

  const rows = [headers.join(',')];

  questions.forEach(q => {
    const sub = subjectMap.get(q.subject_id);
    const subName = sub ? `${sub.name_en} (${sub.name_mr})` : (q.subject_id || '');
    const row = [
      escapeCsv(q.id),
      escapeCsv(q.question_en),
      escapeCsv(q.question_mr),
      escapeCsv(q.option_a_en),
      escapeCsv(q.option_a_mr),
      escapeCsv(q.option_b_en),
      escapeCsv(q.option_b_mr),
      escapeCsv(q.option_c_en),
      escapeCsv(q.option_c_mr),
      escapeCsv(q.option_d_en),
      escapeCsv(q.option_d_mr),
      escapeCsv(q.correct_option),
      escapeCsv(q.explanation_en),
      escapeCsv(q.explanation_mr),
      escapeCsv(q.subject_id),
      escapeCsv(subName),
      escapeCsv(q.chapter_id),
      escapeCsv(q.topic_id),
      escapeCsv(q.difficulty),
      escapeCsv(q.exam_name),
      escapeCsv(q.exam_year),
      escapeCsv(q.status)
    ];
    rows.push(row.join(','));
  });

  return '\uFEFF' + rows.join('\r\n');
}

export function exportAllQuestionsJson(questions: any[], subjects: any[]): string {
  return JSON.stringify({
    exported_at: new Date().toISOString(),
    total_questions: questions.length,
    total_subjects: subjects.length,
    subjects,
    questions
  }, null, 2);
}

export async function saveTemplatesToDisk(): Promise<void> {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const distDir = path.join(process.cwd(), 'dist');
    const publicTemplatesDir = path.join(process.cwd(), 'public', 'templates');
    const distTemplatesDir = path.join(process.cwd(), 'dist', 'templates');

    [publicDir, distDir, publicTemplatesDir, distTemplatesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const xlsxBuf = await generateQuestionTemplateExcel();
    const csvStr = generateQuestionTemplateCsv();
    const jsonStr = generateQuestionTemplateJson();

    [publicDir, distDir, publicTemplatesDir, distTemplatesDir].forEach(dir => {
      fs.writeFileSync(path.join(dir, 'Nursing_MCQs_Import_Template_With_Explanations.xlsx'), xlsxBuf);
      fs.writeFileSync(path.join(dir, 'Nursing_MCQs_Import_Template_With_Explanations.csv'), csvStr, 'utf8');
      fs.writeFileSync(path.join(dir, 'Nursing_MCQs_Import_Template_With_Explanations.json'), jsonStr, 'utf8');
    });

    console.log('[TemplateGenerator] Successfully saved All-India Bilingual sample templates to disk with ExcelJS!');
  } catch (err) {
    console.error('[TemplateGenerator] Error saving templates:', err);
  }
}
