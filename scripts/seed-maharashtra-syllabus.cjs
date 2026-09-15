const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../data/store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

// 1. All Subjects for Maharashtra Staff Nurse / Nursing Officer Examination
const MAHARASHTRA_SUBJECTS = [
  {
    id: 'subj-fon',
    name_en: 'Fundamentals of Nursing & First Aid',
    name_mr: 'नर्सिंगची मूलभूत तत्त्वे व प्रथमोपचार',
    description_en: 'Vital signs, CPR/BLS, catheterization, 10 rights of medication, wound care, oxygen therapy, and emergency triage.',
    description_mr: 'महत्त्वाची चिन्हे, सीपीआर, कॅथेटेरायझेशन, औषधोपचार नियम, ऑक्सिजन थेरपी आणि आणीबाणी ट्रायज.',
    icon: 'HeartPulse',
    category: 'core_nursing',
    exam_track: 'both'
  },
  {
    id: 'subj-msn',
    name_en: 'Medical-Surgical Nursing',
    name_mr: 'वैद्यकीय-शस्त्रक्रिया नर्सिंग',
    description_en: 'Cardiovascular, respiratory, gastrointestinal, neurological, endocrine, renal, and burns nursing care.',
    description_mr: 'हृदय, श्वसन, पचनसंस्था, मज्जासंस्था, अंतःस्रावी, मूत्रपिंड आणि भाजलेल्या रुग्णांची काळजी.',
    icon: 'Stethoscope',
    category: 'core_nursing',
    exam_track: 'both'
  },
  {
    id: 'subj-obg',
    name_en: 'Obstetric & Midwifery Nursing',
    name_mr: 'प्रसूतिशास्त्र आणि स्त्रीरोग नर्सिंग',
    description_en: 'Antenatal care, stages of labour, partograph, high-risk pregnancy, eclampsia, and PPH management.',
    description_mr: 'प्रसूतीपूर्व तपासणी, प्रसूतीचे टप्पे, पार्टोग्राफ, प्री-एक्लॅम्पसिया आणि पीपीएच व्यवस्थापन.',
    icon: 'Baby',
    category: 'core_nursing',
    exam_track: 'both'
  },
  {
    id: 'subj-peds',
    name_en: 'Child Health / Pediatric Nursing',
    name_mr: 'बालरोग नर्सिंग',
    description_en: 'Newborn assessment, APGAR, immunization schedule, cold chain, IMNCI, and pediatric emergencies.',
    description_mr: 'नवजात तपासणी, ॲपगार स्कोअर, राष्ट्रीय लसीकरण, कोल्ड चेन, आयएमएनसीआय आणि बालरोग आणीबाणी.',
    icon: 'Smile',
    category: 'core_nursing',
    exam_track: 'both'
  },
  {
    id: 'subj-chn',
    name_en: 'Community Health Nursing',
    name_mr: 'समुदाय आरोग्य नर्सिंग',
    description_en: 'PHC/CHC/Subcenter setup, epidemiology, communicable diseases, national health programmes, and MCH.',
    description_mr: 'प्राथमिक आरोग्य केंद्र, रोगराईशास्त्र, संसर्गजन्य आजार, राष्ट्रीय आरोग्य कार्यक्रम आणि माता-बाल आरोग्य.',
    icon: 'Users',
    category: 'core_nursing',
    exam_track: 'both'
  },
  {
    id: 'subj-pharm',
    name_en: 'Pharmacology & Dosage Calculations',
    name_mr: 'औषधशास्त्र आणि मात्रा गणना',
    description_en: 'Emergency drugs, adrenaline, atropine, antidotes, IV flow rate calculation, and antibiotic therapy.',
    description_mr: 'आणीबाणीची औषधे, ॲड्रेनालिन, ॲट्रोपिन, प्रतिविष (अँटीडोट्स), आयव्ही फ्लो रेट गणना आणि प्रतिजैविके.',
    icon: 'Pill',
    category: 'core_nursing',
    exam_track: 'both'
  },
  {
    id: 'subj-anat',
    name_en: 'Anatomy & Physiology',
    name_mr: 'शरीररचना आणि शरीरक्रियाशास्त्र',
    description_en: 'Human body systems, heart chambers, respiratory tract, nephron, brain lobes, and endocrine glands.',
    description_mr: 'मानवी शरीरसंस्था, हृदय रचना, श्वसनमार्ग, नेफ्रॉन, मेंदूचे भाग आणि अंतःस्रावी ग्रंथी.',
    icon: 'Layers',
    category: 'allied_health',
    exam_track: 'both'
  },
  {
    id: 'subj-infection',
    name_en: 'Infection Control & Biomedical Waste',
    name_mr: 'संसर्ग नियंत्रण आणि बायोमेडिकल कचरा',
    description_en: 'BMW color coding, PPE donning/doffing, needle-stick injury protocol, and hospital acquired infections.',
    description_mr: 'बायोमेडिकल कचरा रंग कोड, पीपीई किट, सुई टोचणे प्रतिबंध आणि रुग्णालय संसर्ग नियंत्रण.',
    icon: 'ShieldAlert',
    category: 'allied_health',
    exam_track: 'both'
  },
  {
    id: 'subj-psych',
    name_en: 'Mental Health & Psychiatric Nursing',
    name_mr: 'मानसोपचार नर्सिंग',
    description_en: 'Mental status exam, schizophrenia, mood disorders, lithium toxicity, ECT, and Mental Healthcare Act.',
    description_mr: 'मानसिक तपासणी, स्किझोफ्रेनिया, मनःस्थिती विकार, लिथियम, ईसीटी आणि मानसिक आरोग्य कायदा.',
    icon: 'Brain',
    category: 'core_nursing',
    exam_track: 'both'
  },
  {
    id: 'subj-icu-bls',
    name_en: 'Critical Care & Emergency Nursing',
    name_mr: 'आयसीयू आणि आपत्कालीन नर्सिंग',
    description_en: 'Shock management, ventilator graphics, defibrillation, arterial blood gas (ABG), and airway.',
    description_mr: 'शॉक व्यवस्थापन, व्हेंटिलेटर मॉनिटरिंग, डिफिब्रिलेशन, एबीजी आणि अतिदक्षता उपचार.',
    icon: 'Activity',
    category: 'core_nursing',
    exam_track: 'both'
  },
  {
    id: 'subj-micro',
    name_en: 'Microbiology & Sterilization',
    name_mr: 'सूक्ष्मजीवशास्त्र व निर्जंतुकीकरण',
    description_en: 'Autoclave parameters, culture tests, bacteria, viruses, fungi, and chemical disinfectants.',
    description_mr: 'ऑटोक्लेव्ह, कल्चर चाचण्या, जीवाणू, विषाणू आणि रासायनिक निर्जंतुकीकरण.',
    icon: 'Microscope',
    category: 'allied_health',
    exam_track: 'both'
  },
  {
    id: 'subj-path',
    name_en: 'Pathology & Laboratory Interpretation',
    name_mr: 'पॅथॉलॉजी आणि प्रयोगशाळा तपासण्या',
    description_en: 'CBC, RFT, LFT, electrolytes, urine routine, normal ranges, and panic critical laboratory values.',
    description_mr: 'रक्त चाचण्या, सीबीसी, आरएफटी, एलएफटी, इलेक्ट्रोलाइट्स आणि गंभीर पॅनिक व्हॅल्यूज.',
    icon: 'TestTubes',
    category: 'allied_health',
    exam_track: 'both'
  },
  {
    id: 'subj-admin-mgmt',
    name_en: 'Hospital Administration & NABH',
    name_mr: 'रुग्णालय प्रशासन व व्यवस्थापन',
    description_en: 'Nursing management, staffing norms, NABH safety guidelines, incident reporting, and triage policies.',
    description_mr: 'नर्सिंग व्यवस्थापन, कर्मचारी प्रमाण, एनएबीएच सुरक्षा नियम, इन्सिडेंट रिपोर्टिंग आणि धोरणे.',
    icon: 'Building2',
    category: 'core_nursing',
    exam_track: 'both'
  },
  // NON-TECHNICAL / GENERAL SUBJECTS (अतांत्रिक विषय - महाराष्ट्र शासन पॅटर्न)
  {
    id: 'subj-gk-mr',
    name_en: 'Marathi Grammar & Language (मराठी व्याकरण)',
    name_mr: 'मराठी व्याकरण आणि भाषा ज्ञान',
    description_en: 'वर्णमाला, संधी, नाम, सर्वनाम, विशेषण, क्रियापद, समास, प्रयोग, समानार्थी/विरुद्धार्थी शब्द, म्हणी व वाक्प्रचार.',
    description_mr: 'वर्णमाला, संधी, नाम, सर्वनाम, काळ, प्रयोग, समास, म्हणी, वाक्प्रचार, समानार्थी व विरुद्धार्थी शब्द.',
    icon: 'BookOpen',
    category: 'aptitude_gk',
    exam_track: 'both'
  },
  {
    id: 'subj-math-reas',
    name_en: 'Reasoning & Numerical Ability (अंकगणित व बुद्धिमत्ता)',
    name_mr: 'अंकगणित आणि बुद्धिमत्ता चाचणी',
    description_en: 'Percentage, profit & loss, average, ratio, time & work, number series, coding-decoding, blood relations, directions.',
    description_mr: 'शेकडेवारी, नफा-तोटा, सरासरी, गुणोत्तर, काळ-काम-वेग, संख्या मालिका, कोडिंग-डिकोडिंग, नातेसंबंध आणि दिशा.',
    icon: 'Calculator',
    category: 'aptitude_gk',
    exam_track: 'both'
  },
  {
    id: 'subj-eng',
    name_en: 'English Grammar & Vocabulary',
    name_mr: 'इंग्रजी व्याकरण आणि शब्दसंग्रह',
    description_en: 'Parts of speech, tenses, active/passive voice, direct/indirect, synonyms, antonyms, idioms, spotting errors.',
    description_mr: 'टेन्सेस, व्हॉइस, नरेशन, समानार्थी, विरुद्धार्थी शब्द, वाक्प्रचार आणि एरर डिटेक्शन.',
    icon: 'Languages',
    category: 'aptitude_gk',
    exam_track: 'both'
  },
  {
    id: 'subj-gk-mh',
    name_en: 'General Knowledge & Maharashtra Health Affairs',
    name_mr: 'सामान्य ज्ञान आणि महाराष्ट्र आरोग्य घडामोडी',
    description_en: 'Maharashtra geography, history, Indian Constitution, MJPJAY, Ayushman Bharat, NHM, and current health schemes.',
    description_mr: 'महाराष्ट्राचा भूगोल, इतिहास, राज्यघटना, महात्मा जोतिराव फुले जन आरोग्य योजना, आयुष्यमान भारत व चालू घडामोडी.',
    icon: 'Globe',
    category: 'aptitude_gk',
    exam_track: 'both'
  }
];

// 2. Chapters for all subjects
const MAHARASHTRA_CHAPTERS = [
  // Fundamentals
  { id: 'ch-fon-vitals', subject_id: 'subj-fon', name_en: 'Vital Signs & Temperature Regulation', name_mr: 'महत्त्वाची चिन्हे आणि तापमान नियमन', order_index: 1 },
  { id: 'ch-fon-med', subject_id: 'subj-fon', name_en: 'Medication Administration & 10 Rights', name_mr: 'औषध देण्याची पद्धत आणि १० नियम', order_index: 2 },
  { id: 'ch-fon-procedures', subject_id: 'subj-fon', name_en: 'Catheterization, Enema & Ryle Tube', name_mr: 'कॅथेटर, ॲनिमा आणि राइल्स ट्यूब', order_index: 3 },
  { id: 'ch-fon-firstaid', subject_id: 'subj-fon', name_en: 'First Aid, BLS & Triage Assessment', name_mr: 'प्रथमोपचार, बीएलएस आणि ट्रायज', order_index: 4 },
  { id: 'ch-fon-wound', subject_id: 'subj-fon', name_en: 'Wound Care, Dressing & Pressure Sores', name_mr: 'जखमांची काळजी, ड्रेसिंग आणि बेडसोअर प्रतिबंध', order_index: 5 },

  // Med-Surg
  { id: 'ch-msn-cvs', subject_id: 'subj-msn', name_en: 'Cardiovascular System & MI/Heart Failure', name_mr: 'हृदय व रक्तवाहिन्या विकार (MI व हार्ट फेल्युअर)', order_index: 1 },
  { id: 'ch-msn-resp', subject_id: 'subj-msn', name_en: 'Respiratory Disorders (COPD, Asthma, TB)', name_mr: 'श्वसनसंस्था विकार (दम, टीबी व न्यूमोनिया)', order_index: 2 },
  { id: 'ch-msn-gi', subject_id: 'subj-msn', name_en: 'Gastrointestinal & Liver Disorders', name_mr: 'पचनसंस्था व यकृत विकार', order_index: 3 },
  { id: 'ch-msn-cns', subject_id: 'subj-msn', name_en: 'Neurological Disorders & Stroke/GCS', name_mr: 'मज्जासंस्था विकार आणि स्ट्रोक/GCS', order_index: 4 },
  { id: 'ch-msn-endocrine', subject_id: 'subj-msn', name_en: 'Endocrine Disorders (Diabetes, Thyroid)', name_mr: 'मधुमेह आणि थायरॉईड विकार', order_index: 5 },
  { id: 'ch-msn-renal', subject_id: 'subj-msn', name_en: 'Renal Disorders, AKI, CKD & Dialysis', name_mr: 'मूत्रपिंड विकार आणि डायलिसिस', order_index: 6 },
  { id: 'ch-msn-burns', subject_id: 'subj-msn', name_en: 'Burns Management & Parkland Formula', name_mr: 'भाजलेल्या रुग्णांचे व्यवस्थापन व पार्क Vital फॉर्म्युला', order_index: 7 },

  // OBG
  { id: 'ch-obg-antenatal', subject_id: 'subj-obg', name_en: 'Antenatal Care & Physiological Changes', name_mr: 'प्रसूतीपूर्व तपासणी आणि गर्भावस्थेतील बदल', order_index: 1 },
  { id: 'ch-obg-labour', subject_id: 'subj-obg', name_en: 'Stages of Labour & Partograph', name_mr: 'प्रसूतीचे टप्पे आणि पार्टोग्राफ वापर', order_index: 2 },
  { id: 'ch-obg-highrisk', subject_id: 'subj-obg', name_en: 'Pre-eclampsia, Eclampsia & PPH', name_mr: 'प्री-एक्लॅम्पसिया आणि पीपीएच व्यवस्थापन', order_index: 3 },
  { id: 'ch-obg-postnatal', subject_id: 'subj-obg', name_en: 'Postnatal Care & Family Planning', name_mr: 'प्रसूतीनंतरची काळजी आणि कुटुंबनियोजन', order_index: 4 },

  // Pediatrics
  { id: 'ch-peds-neonatology', subject_id: 'subj-peds', name_en: 'Newborn Care, APGAR & Reflexes', name_mr: 'नवजात बालकाची काळजी आणि ॲपगार स्कोअर', order_index: 1 },
  { id: 'ch-peds-growth', subject_id: 'subj-peds', name_en: 'Growth, Milestones & Immunization Schedule', name_mr: 'वाढ, विकास टप्पे आणि राष्ट्रीय लसीकरण', order_index: 2 },
  { id: 'ch-peds-illness', subject_id: 'subj-peds', name_en: 'IMNCI, Diarrhea, Dehydration & Malnutrition', name_mr: 'आयएमएनसीआय, अतिसार, डिहायड्रेशन व कुपोषण', order_index: 3 },

  // CHN
  { id: 'ch-chn-org', subject_id: 'subj-chn', name_en: 'Health Care Delivery (PHC, CHC, Sub-center)', name_mr: 'आरोग्य यंत्रणा (प्राथमिक आरोग्य केंद्र, उपकेंद्र)', order_index: 1 },
  { id: 'ch-chn-epi', subject_id: 'subj-chn', name_en: 'Epidemiology & Communicable Diseases', name_mr: 'रोगराईशास्त्र व संसर्गजन्य आजार नियंत्रण', order_index: 2 },
  { id: 'ch-chn-prog', subject_id: 'subj-chn', name_en: 'National Health Programs & MCH Services', name_mr: 'राष्ट्रीय आरोग्य कार्यक्रम आणि माता-बाल संगोपन', order_index: 3 },

  // Pharmacology
  { id: 'ch-pharm-emergency', subject_id: 'subj-pharm', name_en: 'Emergency Cardiac & Resuscitation Drugs', name_mr: 'आणीबाणीची हृदय व पुनरुत्थान औषधे', order_index: 1 },
  { id: 'ch-pharm-calculations', subject_id: 'subj-pharm', name_en: 'Dosage Calculations, Drops & Infusion Rates', name_mr: 'मात्रा गणना, ड्रॉप रेट आणि इन्फ्युजन वेग', order_index: 2 },
  { id: 'ch-pharm-antidotes', subject_id: 'subj-pharm', name_en: 'Specific Antidotes & Adverse Drug Reactions', name_mr: 'महत्त्वाचे प्रतिविष (Antidotes) व दुष्परिणाम', order_index: 3 },

  // Anatomy
  { id: 'ch-anat-cardio-resp', subject_id: 'subj-anat', name_en: 'Cardiovascular & Respiratory Anatomy', name_mr: 'हृदय आणि श्वसनसंस्था रचना', order_index: 1 },
  { id: 'ch-anat-cns-renal', subject_id: 'subj-anat', name_en: 'Nervous, Renal & Endocrine Anatomy', name_mr: 'मज्जासंस्था, मूत्रपिंड व अंतःस्रावी रचना', order_index: 2 },

  // Infection Control
  { id: 'ch-bmw-rules', subject_id: 'subj-infection', name_en: 'Biomedical Waste Segregation & Color Codes', name_mr: 'बायोमेडिकल कचरा रंग कोड व नियम', order_index: 1 },
  { id: 'ch-bmw-safety', subject_id: 'subj-infection', name_en: 'Needle Stick Injury & Standard Precautions', name_mr: 'सुई टोचणे प्रतिबंध आणि पीपीई वापर', order_index: 2 },

  // Psychiatric
  { id: 'ch-psych-disorders', subject_id: 'subj-psych', name_en: 'Psychiatric Disorders & Psychopharmacology', name_mr: 'मनोविकार आणि मानसोपचार औषधे', order_index: 1 },

  // ICU / Critical Care
  { id: 'ch-icu-critical', subject_id: 'subj-icu-bls', name_en: 'Shock, Defibrillation & ABG Interpretation', name_mr: 'शॉक, डिफिब्रिलेशन आणि एबीजी विश्लेषण', order_index: 1 },

  // Microbiology
  { id: 'ch-micro-steril', subject_id: 'subj-micro', name_en: 'Sterilization & Autoclave Techniques', name_mr: 'ऑटोक्लेव्ह आणि निर्जंतुकीकरण तंत्रे', order_index: 1 },

  // Pathology
  { id: 'ch-path-labs', subject_id: 'subj-path', name_en: 'Routine & Critical Panic Laboratory Values', name_mr: 'प्रयोगशाळा तपासण्या आणि पॅनिक मूल्ये', order_index: 1 },

  // Admin & Management
  { id: 'ch-admin-mgmt', subject_id: 'subj-admin-mgmt', name_en: 'Staffing, Delegation & NABH Standards', name_mr: 'कर्मचारी वाटप आणि एनएबीएच सुरक्षा नियम', order_index: 1 },

  // MARATHI GRAMMAR CHAPTERS
  { id: 'ch-mr-varnamala', subject_id: 'subj-gk-mr', name_en: 'वर्णमाला, उच्चार व संधी', name_mr: 'वर्णमाला, उच्चार स्थाने व संधी', order_index: 1 },
  { id: 'ch-mr-shabdanchyajatee', subject_id: 'subj-gk-mr', name_en: 'शब्दांच्या जाती (नाम, सर्वनाम, विशेषण, क्रियापद)', name_mr: 'शब्दांच्या जाती व अव्यये', order_index: 2 },
  { id: 'ch-mr-ling-vachan-vibhakti', subject_id: 'subj-gk-mr', name_en: 'लिंग, वचन, विभक्ती व सामान्यरूप', name_mr: 'लिंग, वचन, विभक्ती व सामान्यरूप', order_index: 3 },
  { id: 'ch-mr-kaal-prayog-samas', subject_id: 'subj-gk-mr', name_en: 'काळ, प्रयोग व समास', name_mr: 'काळ, प्रयोग व समास विचार', order_index: 4 },
  { id: 'ch-mr-shabdasangrah', subject_id: 'subj-gk-mr', name_en: 'म्हणी, वाक्प्रचार, समानार्थी व विरुद्धार्थी शब्द', name_mr: 'म्हणी, वाक्प्रचार व शब्दसंग्रह', order_index: 5 },
  { id: 'ch-mr-shuddhlekhan', subject_id: 'subj-gk-mr', name_en: 'शुद्धलेखन, वाक्य पृथक्करण व उतारा आकलन', name_mr: 'शुद्धलेखन व वाक्य पृथक्करण', order_index: 6 },

  // MATHEMATICS & REASONING CHAPTERS
  { id: 'ch-math-basic', subject_id: 'subj-math-reas', name_en: 'मूलभूत अंकगणित (लसावि, मसावि, दशांश, वर्गमूळ)', name_mr: 'संख्या ज्ञान, लसावि व मसावि', order_index: 1 },
  { id: 'ch-math-commercial', subject_id: 'subj-math-reas', name_en: 'शेकडेवारी, नफा-तोटा, सरासरी व गुणोत्तर', name_mr: 'शेकडेवारी, नफा-तोटा व सरासरी', order_index: 2 },
  { id: 'ch-math-timework', subject_id: 'subj-math-reas', name_en: 'काळ-काम-वेग, रेल्वे व पाण्याची टाकी', name_mr: 'काळ, काम, वेग व आगगाडीची गणिते', order_index: 3 },
  { id: 'ch-math-interest-age', subject_id: 'subj-math-reas', name_en: 'सरळव्याज, चक्रवाढ व्याज व वयावर आधारित गणिते', name_mr: 'सरळव्याज व वयावर आधारित गणिते', order_index: 4 },
  { id: 'ch-reas-series-coding', subject_id: 'subj-math-reas', name_en: 'संख्या व अक्षर मालिका, कोडिंग-डिकोडिंग', name_mr: 'मालिका व कोडिंग-डिकोडिंग', order_index: 5 },
  { id: 'ch-reas-relations-dir', subject_id: 'subj-math-reas', name_en: 'नातेसंबंध, दिशा ज्ञान, घड्याळ व कॅलेंडर', name_mr: 'नातेसंबंध, दिशा ज्ञान व घड्याळ-कॅलेंडर', order_index: 6 },

  // ENGLISH CHAPTERS
  { id: 'ch-eng-grammar', subject_id: 'subj-eng', name_en: 'English Grammar, Tenses, Articles & Prepositions', name_mr: 'इंग्रजी व्याकरण, आर्टिकल्स व प्रेपोझिशन्स', order_index: 1 },
  { id: 'ch-eng-voice-speech', subject_id: 'subj-eng', name_en: 'Active-Passive Voice & Direct-Indirect Speech', name_mr: 'व्हॉइस आणि डायरेक्ट-इनडायरेक्ट स्पीच', order_index: 2 },
  { id: 'ch-eng-vocab', subject_id: 'subj-eng', name_en: 'Synonyms, Antonyms, Idioms & One-word Substitution', name_mr: 'समानार्थी, विरुद्धार्थी शब्द व वाक्प्रचार', order_index: 3 },
  { id: 'ch-eng-errors', subject_id: 'subj-eng', name_en: 'Spotting Errors & Sentence Correction', name_mr: 'स्पॉटिंग एरर्स व सेन्टेन्स करेक्शन', order_index: 4 },

  // GENERAL KNOWLEDGE & MAHARASHTRA HEALTH AFFAIRS CHAPTERS
  { id: 'ch-gk-mh-geog-hist', subject_id: 'subj-gk-mh', name_en: 'Geography & History of Maharashtra, Social Reformers', name_mr: 'महाराष्ट्राचा भूगोल, इतिहास व समाजसुधारक', order_index: 1 },
  { id: 'ch-gk-mh-polity', subject_id: 'subj-gk-mh', name_en: 'Indian Constitution, Fundamental Rights & Panchayati Raj', name_mr: 'भारतीय राज्यघटना व पंचायत राज', order_index: 2 },
  { id: 'ch-gk-mh-health-schemes', subject_id: 'subj-gk-mh', name_en: 'Maharashtra Health Schemes, MJPJAY & Ayushman Bharat', name_mr: 'महाराष्ट्र आरोग्य योजना, MJPJAY व आयुष्यमान भारत', order_index: 3 },
  { id: 'ch-gk-mh-current', subject_id: 'subj-gk-mh', name_en: 'Current Affairs, Health Days & Science', name_mr: 'चालू घडामोडी, आरोग्य दिनविशेष व सामान्य विज्ञान', order_index: 4 }
];

// 3. Topics for all chapters
const MAHARASHTRA_TOPICS = [
  // Fundamentals
  { id: 'top-vitals-temp', chapter_id: 'ch-fon-vitals', subject_id: 'subj-fon', name_en: 'Body Temperature Regulation & Fever Types', name_mr: 'तापमान नियमन आणि तापाचे प्रकार' },
  { id: 'top-vitals-pulse-bp', chapter_id: 'ch-fon-vitals', subject_id: 'subj-fon', name_en: 'Pulse Assessment & Blood Pressure Measurement', name_mr: 'नाडी तपासणी आणि रक्तदाब मापन' },
  { id: 'top-med-routes-rights', chapter_id: 'ch-fon-med', subject_id: 'subj-fon', name_en: 'Routes of Medication & 10 Rights of Administration', name_mr: 'औषध देण्याचे मार्ग आणि प्रशासनाचे १० नियम' },
  { id: 'top-cannula-gauges', chapter_id: 'ch-fon-med', subject_id: 'subj-fon', name_en: 'IV Cannula Color Codes, Gauges & Flow Rates', name_mr: 'आयव्ही कॅन्युला रंग कोड आणि गेज' },
  { id: 'top-catheter-enema', chapter_id: 'ch-fon-procedures', subject_id: 'subj-fon', name_en: 'Foley Catheterization, Enema & Ryle Tube Feeding', name_mr: 'फॉलीज कॅथेटर, ॲनिमा आणि राइल्स ट्यूब आहार' },
  { id: 'top-oxygen-therapy', subject_id: 'subj-fon', chapter_id: 'ch-fon-procedures', name_en: 'Oxygen Delivery Devices (Nasal Cannula, Venturi)', name_mr: 'ऑक्सिजन थेरपी उपकरणे (कॅन्युला व व्हेंचुरी मास्क)' },
  { id: 'top-bls-cpr', chapter_id: 'ch-fon-firstaid', subject_id: 'subj-fon', name_en: 'Basic Life Support (BLS), CPR Ratio & AED Use', name_mr: 'सीपीआर पद्धत, चेस्ट कम्प्रेशन आणि एईडी' },
  { id: 'top-wound-bedsores', chapter_id: 'ch-fon-wound', subject_id: 'subj-fon', name_en: 'Pressure Injury Staging, Braden Scale & Dressing', name_mr: 'बेडसोअर टप्पे, ब्रॅडेन स्केल आणि जखमांचे ड्रेसिंग' },

  // Med-Surg
  { id: 'top-cvs-mi', chapter_id: 'ch-msn-cvs', subject_id: 'subj-msn', name_en: 'Myocardial Infarction, STEMI & ECG Changes', name_mr: 'मायोकार्डियल इन्फार्कशन (हार्ट अटॅक) व ईसीजी' },
  { id: 'top-cvs-failure', chapter_id: 'ch-msn-cvs', subject_id: 'subj-msn', name_en: 'Congestive Heart Failure, Digoxin & Pulmonary Edema', name_mr: 'हार्ट फेल्युअर आणि डिगॉक्सिन व्यवस्थापन' },
  { id: 'top-resp-tb-asthma', chapter_id: 'ch-msn-resp', subject_id: 'subj-msn', name_en: 'Tuberculosis (DOTS), Asthma & COPD Nursing Care', name_mr: 'क्षयरोग (DOTS), दमा आणि सीओपीडी नर्सिंग' },
  { id: 'top-cns-stroke-gcs', chapter_id: 'ch-msn-cns', subject_id: 'subj-msn', name_en: 'Ischemic/Hemorrhagic Stroke, GCS Scoring & Epilepsy', name_mr: 'स्ट्रोक, ग्लासगो कोमा स्केल (GCS) व झटके' },
  { id: 'top-endocrine-diabetes', chapter_id: 'ch-msn-endocrine', subject_id: 'subj-msn', name_en: 'Diabetes Mellitus, Insulin Types, DKA & Hypoglycemia', name_mr: 'मधुमेह, इन्सुलिनचे प्रकार, DKA व हायपोग्लायसेमिया' },
  { id: 'top-renal-dialysis', chapter_id: 'ch-msn-renal', subject_id: 'subj-msn', name_en: 'Acute Kidney Injury (AKI), CKD & Hemodialysis Care', name_mr: 'मूत्रपिंड निकामी होणे व हेमोडायलिसिस काळजी' },
  { id: 'top-burns-parkland', chapter_id: 'ch-msn-burns', subject_id: 'subj-msn', name_en: 'Rule of Nines & Parkland Formula for Burns', name_mr: 'भाजलेल्या रुग्णांसाठी रूल ऑफ नाईन्स व फ्लुइड फॉर्म्युला' },

  // OBG
  { id: 'top-obg-anc', chapter_id: 'ch-obg-antenatal', subject_id: 'subj-obg', name_en: 'Antenatal Checkups, EDD Calculation & Nutrition', name_mr: 'प्रसूतीपूर्व तपासणी, ईडीडी तारीख गणना व पोषण' },
  { id: 'top-obg-labour-stages', chapter_id: 'ch-obg-labour', subject_id: 'subj-obg', name_en: 'First & Second Stage of Labour Interventions', name_mr: 'प्रसूतीचे पहिले व दुसरे टप्पे व्यवस्थापन' },
  { id: 'top-obg-partograph', chapter_id: 'ch-obg-labour', subject_id: 'subj-obg', name_en: 'WHO Partograph, Alert Line & Action Line', name_mr: 'पार्टोग्राफ, अलर्ट लाईन आणि ॲक्शन लाईन' },
  { id: 'top-obg-preeclamp', chapter_id: 'ch-obg-highrisk', subject_id: 'subj-obg', name_en: 'Pre-eclampsia, Eclampsia & MgSO4 Administration', name_mr: 'प्री-एक्लॅम्पसिया आणि मॅग्नेशियम सल्फेट (MgSO4)' },
  { id: 'top-obg-pph', chapter_id: 'ch-obg-highrisk', subject_id: 'subj-obg', name_en: 'Postpartum Hemorrhage (PPH) Causes & Oxytocin', name_mr: 'प्रसूतीनंतरचा रक्तस्राव (PPH) व ऑक्सिटोसिन' },
  { id: 'top-obg-contraception', chapter_id: 'ch-obg-postnatal', subject_id: 'subj-obg', name_en: 'Temporary & Permanent Contraceptive Methods (IUCD)', name_mr: 'गर्भनिरोधक पद्धती, कॉपर-टी (IUCD) व बंध्यीकरण' },

  // Pediatrics
  { id: 'top-peds-apgar', chapter_id: 'ch-peds-neonatology', subject_id: 'subj-peds', name_en: 'APGAR Scoring & Normal Newborn Assessment', name_mr: 'नवजात ॲपगार स्कोअर आणि प्राथमिक तपासणी' },
  { id: 'top-peds-jaundice', chapter_id: 'ch-peds-neonatology', subject_id: 'subj-peds', name_en: 'Neonatal Jaundice & Phototherapy Nursing Care', name_mr: 'नवजात कावीळ आणि फोटोथेरपी दरम्यान काळजी' },
  { id: 'top-peds-immunization', chapter_id: 'ch-peds-growth', subject_id: 'subj-peds', name_en: 'National Immunization Schedule (NIS) & Vaccines', name_mr: 'राष्ट्रीय लसीकरण वेळापत्रक (BCG, OPV, Pentavalent)' },
  { id: 'top-peds-coldchain', chapter_id: 'ch-peds-growth', subject_id: 'subj-peds', name_en: 'Cold Chain Equipment (ILR, Deep Freezer) & VVM', name_mr: 'कोल्ड चेन उपकरणे (ILR, डीप फ्रीझर) आणि VVM' },
  { id: 'top-peds-imnci-ors', chapter_id: 'ch-peds-illness', subject_id: 'subj-peds', name_en: 'IMNCI Protocol, ORS Preparation & Zinc Therapy', name_mr: 'अतिसारामध्ये ओआरएस (ORS) द्रावण व झिंक उपचार' },

  // CHN
  { id: 'top-chn-phc-setup', chapter_id: 'ch-chn-org', subject_id: 'subj-chn', name_en: 'Population Norms & Staffing of Sub-center, PHC & CHC', name_mr: 'उपकेंद्र, प्राथमिक आरोग्य केंद्र लोकसंख्या निकष' },
  { id: 'top-chn-epidemiology', chapter_id: 'ch-chn-epi', subject_id: 'subj-chn', name_en: 'Epidemiological Triad & Disease Surveillance', name_mr: 'रोगराईशास्त्र त्रिकूट आणि रोग नियंत्रण' },
  { id: 'top-chn-water-purification', chapter_id: 'ch-chn-epi', subject_id: 'subj-chn', name_en: 'Water Purification & Horrock’s Apparatus Chlorination', name_mr: 'पाणी शुद्धीकरण आणि क्लोरीनेशन (Horrock चाचणी)' },
  { id: 'top-chn-rch-jsy', chapter_id: 'ch-chn-prog', subject_id: 'subj-chn', name_en: 'Janani Suraksha Yojana (JSY) & RMNCH+A Program', name_mr: 'जननी सुरक्षा योजना (JSY) आणि सुरक्षित मातृत्व' },

  // Pharmacology
  { id: 'top-pharm-adrenaline-atropine', chapter_id: 'ch-pharm-emergency', subject_id: 'subj-pharm', name_en: 'Adrenaline, Atropine, Amiodarone & Dopamine Dosing', name_mr: 'ॲड्रेनालिन, ॲट्रोपिन, अमियोडॅरोन आणि डोपामाइन' },
  { id: 'top-pharm-antidotes-list', chapter_id: 'ch-pharm-antidotes', subject_id: 'subj-pharm', name_en: 'Heparin, Paracetamol, Morphine & Digoxin Antidotes', name_mr: 'हेपॅरिन, पॅरासिटामॉल, मॉर्फिन प्रतिविष (Antidotes)' },
  { id: 'top-pharm-drop-calculation', chapter_id: 'ch-pharm-calculations', subject_id: 'subj-pharm', name_en: 'Macro/Micro Drip Rate & IV Fluid Math', name_mr: 'मॅक्रो आणि मायक्रो ड्रॉप रेट IV गणित' },

  // Infection Control
  { id: 'top-bmw-segregation', chapter_id: 'ch-bmw-rules', subject_id: 'subj-infection', name_en: 'Yellow, Red, Blue, White Container BMW Guidelines', name_mr: 'बायोमेडिकल कचरा वर्गीकरण रंग (पिवळी, लाल, निळी, पांढरी पिशवी)' },
  { id: 'top-bmw-ppe-handhygiene', chapter_id: 'ch-bmw-safety', subject_id: 'subj-infection', name_en: 'WHO 5 Moments of Hand Hygiene & PPE Sequence', name_mr: 'हस्तस्वच्छतेचे ५ क्षण आणि पीपीई किट घालणे/काढणे' },
  { id: 'top-needle-stick-injury', chapter_id: 'ch-bmw-safety', subject_id: 'subj-infection', name_en: 'Needle Stick Protocol & Post-Exposure Prophylaxis (PEP)', name_mr: 'सुई टोचल्यास तात्काळ करावयाचे उपचार (PEP)' },

  // MARATHI GRAMMAR TOPICS (मराठी व्याकरण घटक)
  { id: 'top-mr-alphabets', chapter_id: 'ch-mr-varnamala', subject_id: 'subj-gk-mr', name_en: 'स्वर, स्वरादी, व्यंजने व उच्चार स्थाने', name_mr: 'स्वर, स्वरादी, व्यंजने व उच्चार स्थाने' },
  { id: 'top-mr-sandhi', chapter_id: 'ch-mr-varnamala', subject_id: 'subj-gk-mr', name_en: 'स्वरसंधी, व्यंजनसंधी व विसर्गसंधी', name_mr: 'संधी व संधीचे प्रकार' },
  { id: 'top-mr-nam-sarvanam', chapter_id: 'ch-mr-shabdanchyajatee', subject_id: 'subj-gk-mr', name_en: 'नाम व सर्वनाम आणि त्यांचे प्रकार', name_mr: 'नाम व सर्वनामांचे प्रकार' },
  { id: 'top-mr-visheshan-kriyapad', chapter_id: 'ch-mr-shabdanchyajatee', subject_id: 'subj-gk-mr', name_en: 'विशेषण, क्रियापद व धातूसाधिते', name_mr: 'विशेषण, क्रियापद व उपप्रकार' },
  { id: 'top-mr-avyaye', chapter_id: 'ch-mr-shabdanchyajatee', subject_id: 'subj-gk-mr', name_en: 'क्रियाविशेषण, शब्दयोगी, उभयान्वयी अव्यये', name_mr: 'अव्यये व त्यांचे प्रकार' },
  { id: 'top-mr-ling-vachan', chapter_id: 'ch-mr-ling-vachan-vibhakti', subject_id: 'subj-gk-mr', name_en: 'लिंग विचार, वचन विचार व अपवाद', name_mr: 'लिंग व वचन विचार' },
  { id: 'top-mr-vibhakti', chapter_id: 'ch-mr-ling-vachan-vibhakti', subject_id: 'subj-gk-mr', name_en: 'विभक्ती प्रत्यय व कारकार्थ', name_mr: 'विभक्ती प्रत्यय व कारकार्थ' },
  { id: 'top-mr-tenses', chapter_id: 'ch-mr-kaal-prayog-samas', subject_id: 'subj-gk-mr', name_en: 'काळ व काळांचे उपप्रकार (साधा, अपूर्ण, पूर्ण, रीती)', name_mr: 'काळ व काळांचे प्रकार' },
  { id: 'top-mr-prayog', chapter_id: 'ch-mr-kaal-prayog-samas', subject_id: 'subj-gk-mr', name_en: 'कर्तरी, कर्मणी व भावे प्रयोग', name_mr: 'प्रयोग विचार (कर्तरी, कर्मणी, भावे)' },
  { id: 'top-mr-samas', chapter_id: 'ch-mr-kaal-prayog-samas', subject_id: 'subj-gk-mr', name_en: 'अव्ययीभाव, तत्पुरुष, द्वंद्व व बहुव्रीही समास', name_mr: 'समास व समासांचे प्रकार' },
  { id: 'top-mr-mhane', chapter_id: 'ch-mr-shabdasangrah', subject_id: 'subj-gk-mr', name_en: 'प्रसिद्ध म्हणी व त्यांचे अर्थ', name_mr: 'म्हणी व त्यांचे अचूक अर्थ' },
  { id: 'top-mr-idioms', chapter_id: 'ch-mr-shabdasangrah', subject_id: 'subj-gk-mr', name_en: 'वाक्प्रचार व त्यांचा वाक्यात उपयोग', name_mr: 'वाक्प्रचार व लाक्षणिक अर्थ' },
  { id: 'top-mr-synonyms-antonyms', chapter_id: 'ch-mr-shabdasangrah', subject_id: 'subj-gk-mr', name_en: 'समानार्थी व विरुद्धार्थी शब्द', name_mr: 'समानार्थी व विरुद्धार्थी शब्द' },
  { id: 'top-mr-oneword', chapter_id: 'ch-mr-shabdasangrah', subject_id: 'subj-gk-mr', name_en: 'शब्दसमूहाबद्दल एक शब्द व अलंकारिक शब्द', name_mr: 'शब्दसमूहाबद्दल एक शब्द' },
  { id: 'top-mr-shuddh-ashuddh', chapter_id: 'ch-mr-shuddhlekhan', subject_id: 'subj-gk-mr', name_en: 'शुद्ध शब्द ओळखणे व विरामचिन्हे', name_mr: 'शुद्धलेखन व विरामचिन्हे' },

  // MATHEMATICS & REASONING TOPICS (अंकगणित व बुद्धिमत्ता घटक)
  { id: 'top-math-numbers-lcm', chapter_id: 'ch-math-basic', subject_id: 'subj-math-reas', name_en: 'संख्यांचे प्रकार, कसोटी, लसावि आणि मसावि', name_mr: 'संख्या ज्ञान, लसावि आणि मसावि' },
  { id: 'top-math-fractions', chapter_id: 'ch-math-basic', subject_id: 'subj-math-reas', name_en: 'दशांश व अपूर्णांक, पदावली व BODMAS नियम', name_mr: 'अपूर्णांक, दशांश व पदावली (BODMAS)' },
  { id: 'top-math-percentage', chapter_id: 'ch-math-commercial', subject_id: 'subj-math-reas', name_en: 'शेकडेवारी व टक्केवारी वरील उदाहरणे', name_mr: 'शेकडेवारी (Percentage)' },
  { id: 'top-math-profit-loss', chapter_id: 'ch-math-commercial', subject_id: 'subj-math-reas', name_en: 'खरेदी, विक्री, नफा आणि तोटा', name_mr: 'नफा आणि तोटा (Profit & Loss)' },
  { id: 'top-math-average', chapter_id: 'ch-math-commercial', subject_id: 'subj-math-reas', name_en: 'सरासरी (Average) व सरासरी काढणे', name_mr: 'सरासरी (Average)' },
  { id: 'top-math-ratio', chapter_id: 'ch-math-commercial', subject_id: 'subj-math-reas', name_en: 'गुणोत्तर व प्रमाण (Ratio & Proportion)', name_mr: 'गुणोत्तर व प्रमाण' },
  { id: 'top-math-time-work', chapter_id: 'ch-math-timework', subject_id: 'subj-math-reas', name_en: 'काळ, काम, मजूर व नळ-टाकी', name_mr: 'काळ, काम आणि वेग (Time & Work)' },
  { id: 'top-math-trains', chapter_id: 'ch-math-timework', subject_id: 'subj-math-reas', name_en: 'आगगाडी व रेल्वे अंतर-वेग गणिते', name_mr: 'रेल्वे व आगगाडीची गणिते' },
  { id: 'top-math-simple-interest', chapter_id: 'ch-math-interest-age', subject_id: 'subj-math-reas', name_en: 'सरळव्याज व चक्रवाढ व्याज', name_mr: 'सरळव्याज व चक्रवाढ व्याज' },
  { id: 'top-math-ages', chapter_id: 'ch-math-interest-age', subject_id: 'subj-math-reas', name_en: 'वयावर आधारित उदाहरणे (वयवारी)', name_mr: 'वयावर आधारित गणिते (Problems on Ages)' },
  { id: 'top-reas-series', chapter_id: 'ch-reas-series-coding', subject_id: 'subj-math-reas', name_en: 'संख्या मालिका व अक्षर मालिका', name_mr: 'संख्या व अक्षर मालिका' },
  { id: 'top-reas-coding', chapter_id: 'ch-reas-series-coding', subject_id: 'subj-math-reas', name_en: 'सांकेतिक भाषा व कोडिंग-डिकोडिंग', name_mr: 'कोडिंग-डिकोडिंग (Coding-Decoding)' },
  { id: 'top-reas-relations', chapter_id: 'ch-reas-relations-dir', subject_id: 'subj-math-reas', name_en: 'नातेसंबंध (Blood Relations)', name_mr: 'नातेसंबंध (Blood Relations)' },
  { id: 'top-reas-directions', chapter_id: 'ch-reas-relations-dir', subject_id: 'subj-math-reas', name_en: 'दिशा व अंतर ज्ञान (Direction Sense)', name_mr: 'दिशा आणि अंतर ज्ञान' },
  { id: 'top-reas-clock-calendar', chapter_id: 'ch-reas-relations-dir', subject_id: 'subj-math-reas', name_en: 'घड्याळ व कॅलेंडर (वार काढणे)', name_mr: 'घड्याळ व कॅलेंडर' },

  // ENGLISH TOPICS
  { id: 'top-eng-tenses', chapter_id: 'ch-eng-grammar', subject_id: 'subj-eng', name_en: 'Tenses & Correct Forms of Verbs', name_mr: 'काळ (Tenses) आणि क्रियापद रूपे' },
  { id: 'top-eng-articles-prep', chapter_id: 'ch-eng-grammar', subject_id: 'subj-eng', name_en: 'Articles (A, An, The) & Prepositions', name_mr: 'आर्टिकल्स आणि प्रेपोझिशन्स' },
  { id: 'top-eng-voice-speech', chapter_id: 'ch-eng-voice-speech', subject_id: 'subj-eng', name_en: 'Active & Passive Voice, Direct/Indirect', name_mr: 'व्हॉइस व डायरेक्ट-इनडायरेक्ट स्पीच' },
  { id: 'top-eng-synonyms-antonyms', chapter_id: 'ch-eng-vocab', subject_id: 'subj-eng', name_en: 'Synonyms & Antonyms', name_mr: 'समानार्थी व विरुद्धार्थी शब्द' },
  { id: 'top-eng-idioms', chapter_id: 'ch-eng-vocab', subject_id: 'subj-eng', name_en: 'Idioms & Phrases, One-Word Substitutions', name_mr: 'इंग्रजी वाक्प्रचार व म्हणी' },
  { id: 'top-eng-errors', chapter_id: 'ch-eng-errors', subject_id: 'subj-eng', name_en: 'Spotting Errors in Sentences', name_mr: 'वाक्यातील चुका शोधणे (Spotting Errors)' },

  // GENERAL KNOWLEDGE & MAHARASHTRA TOPICS
  { id: 'top-gk-mh-geog', chapter_id: 'ch-gk-mh-geog-hist', subject_id: 'subj-gk-mh', name_en: 'Maharashtra Geography, Rivers & Districts', name_mr: 'महाराष्ट्राचा भूगोल, नद्या व जिल्हे' },
  { id: 'top-gk-mh-reformers', chapter_id: 'ch-gk-mh-geog-hist', subject_id: 'subj-gk-mh', name_en: 'Great Social Reformers of Maharashtra', name_mr: 'महाराष्ट्रातील थोर समाजसुधारक' },
  { id: 'top-gk-polity-const', chapter_id: 'ch-gk-mh-polity', subject_id: 'subj-gk-mh', name_en: 'Indian Constitution, Articles & Fundamental Rights', name_mr: 'भारतीय राज्यघटना, कलमे व मूलभूत हक्क' },
  { id: 'top-gk-mjpjay-ayushman', chapter_id: 'ch-gk-mh-health-schemes', subject_id: 'subj-gk-mh', name_en: 'MJPJAY & Ayushman Bharat Health Insurance', name_mr: 'महात्मा जोतिराव फुले जन आरोग्य योजना व आयुष्यमान भारत' },
  { id: 'top-gk-nhm-programmes', chapter_id: 'ch-gk-mh-health-schemes', subject_id: 'subj-gk-mh', name_en: 'National Health Mission & Disease Control Programs', name_mr: 'राष्ट्रीय आरोग्य अभियान आणि रोग नियंत्रण कार्यक्रम' },
  { id: 'top-gk-current-health-days', chapter_id: 'ch-gk-mh-current', subject_id: 'subj-gk-mh', name_en: 'Important International Health Days & Current Affairs', name_mr: 'महत्त्वाचे जागतिक आरोग्य दिवस व चालू घडामोडी' }
];

// Seed Subjects
store.subjects = MAHARASHTRA_SUBJECTS;
store.chapters = MAHARASHTRA_CHAPTERS;
store.topics = MAHARASHTRA_TOPICS;

// Sample verified Maharashtra Staff Nurse Questions for Non-Tech Subjects (मराठी, गणित, बुद्धिमत्ता, इंग्रजी, सामान्य ज्ञान)
const SAMPLE_NONTECH_QUESTIONS = [
  // 1. MARATHI GRAMMAR QUESTIONS (महाराष्ट्र आरोग्य सेवा व DMER पॅटर्न)
  {
    id: 'q-mr-01',
    subject_id: 'subj-gk-mr',
    chapter_id: 'ch-mr-shabdasangrah',
    topic_id: 'top-mr-mhane',
    exam_target: 'maha_staff_nurse',
    question_en: 'What is the meaning of the Marathi proverb "हातच्या काकणाला आरसा कशाला"?',
    question_mr: '"हातच्या काकणाला आरसा कशाला?" या म्हणीचा योग्य अर्थ खालीलपैकी कोणता आहे?',
    option_a_en: 'A glass mirror is needed to see bangles',
    option_a_mr: 'हातात बांगड्या भरण्यासाठी आरशाची गरज भासते',
    option_b_en: 'No proof is required for something that is obvious and clear',
    option_b_mr: 'प्रत्यक्ष दिसणाऱ्या पुराव्याला इतर कोणत्याही सिद्धतेची गरज नसते',
    option_c_en: 'Only rich people can afford glass mirrors',
    option_c_mr: 'आरसा खूप महाग असतो म्हणून तो जपून वापरावा',
    option_d_en: 'Work done with one’s own hands is always difficult',
    option_d_mr: 'स्वतःच्या हाताने केलेले काम नेहमी यशस्वी होते',
    correct_option: 'B',
    explanation_en: '"हातच्या काकणाला आरसा कशाला" means obvious truths do not require external verification or mirror.',
    explanation_mr: 'जे सत्य किंवा गोष्ट उघडपणे डोळ्यांसमोर दिसत आहे, तिला सिद्ध करण्यासाठी वेगळा पुरावा देण्याची आवश्यकता नसते, असा या म्हणीचा अर्थ आहे.',
    difficulty: 'easy',
    question_type: 'single_best',
    exam_name: 'DHS Maharashtra Staff Nurse Exam',
    exam_year: 2023,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'q-mr-02',
    subject_id: 'subj-gk-mr',
    chapter_id: 'ch-mr-shabdasangrah',
    topic_id: 'top-mr-idioms',
    exam_target: 'maha_staff_nurse',
    question_en: 'What is the meaning of the Marathi idiom "अळवावरचे पाणी"?',
    question_mr: '"अळवावरचे पाणी" या वाक्प्रचाराचा अचूक अर्थ कोणता?',
    option_a_en: 'Very pure and clean water',
    option_a_mr: 'अतिशय शुद्ध व निर्मळ पाणी',
    option_b_en: 'Extremely short-lived or momentary',
    option_b_mr: 'अतिशय अल्पकाळ टिकणारे किंवा क्षणभंगुर',
    option_c_en: 'A medicinal water prepared from colocasia leaves',
    option_c_mr: 'औषधी गुणधर्म असलेले अळूच्या पानांचे पाणी',
    option_d_en: 'Unshakable and permanent friendship',
    option_d_mr: 'कधीही नष्ट न होणारे कायमस्वरूपी नाते',
    correct_option: 'B',
    explanation_en: '"अळवावरचे पाणी" refers to something that stays only for a moment and easily drops off (ephemeral / transient).',
    explanation_mr: 'अळूच्या पानावर पाण्याचा थेंब फार काळ टिकत नाही, तो लगेच ओघळून जातो; म्हणून क्षणभंगुर किंवा अल्पकाळ टिकणाऱ्या गोष्टीला "अळवावरचे पाणी" म्हणतात.',
    difficulty: 'medium',
    question_type: 'single_best',
    exam_name: 'DMER Maharashtra Staff Nurse Exam',
    exam_year: 2023,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'q-mr-03',
    subject_id: 'subj-gk-mr',
    chapter_id: 'ch-mr-kaal-prayog-samas',
    topic_id: 'top-mr-prayog',
    exam_target: 'maha_staff_nurse',
    question_en: 'Identify the Prayog in the sentence: "रामाने रावणास मारले."',
    question_mr: '"रामाने रावणास मारले" या वाक्यातील प्रयोग कोणता आहे?',
    option_a_en: 'Kartari Prayog (कर्तरी प्रयोग)',
    option_a_mr: 'कर्तरी प्रयोग',
    option_b_en: 'Karmani Prayog (कर्मणी प्रयोग)',
    option_b_mr: 'कर्मणी प्रयोग',
    option_c_en: 'Bhave Prayog (भावे प्रयोग)',
    option_c_mr: 'भावे प्रयोग',
    option_d_en: 'Mishra Prayog (मिश्र प्रयोग)',
    option_d_mr: 'मिश्र किंवा संकर प्रयोग',
    correct_option: 'C',
    explanation_en: 'When the verb does not agree with subject or object and both have case endings (रामाने - तृतीया, रावणास - द्वितीया), it is Bhave Prayog.',
    explanation_mr: 'जेव्हा कर्ता (रामाने) तृतीया विभक्तीत आणि कर्म (रावणास) द्वितीया विभक्तीत असून क्रियापद (मारले) तृतीयपुरुषी, नपुंसकलिंगी, एकवचनी असते, तेव्हा त्याला "भावे प्रयोग" म्हणतात.',
    difficulty: 'medium',
    question_type: 'single_best',
    exam_name: 'Zilla Parishad Arogya Sevak/Nurse Exam',
    exam_year: 2024,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'q-mr-04',
    subject_id: 'subj-gk-mr',
    chapter_id: 'ch-mr-kaal-prayog-samas',
    topic_id: 'top-mr-samas',
    exam_target: 'maha_staff_nurse',
    question_en: 'Which type of Samas is the word "नीलकंठ" (ज्याचा कंठ निळा आहे असा तो)?',
    question_mr: '"नीलकंठ" (ज्याचा कंठ निळा आहे असा तो - महादेव) हा कोणत्या प्रकारचा समास आहे?',
    option_a_en: 'Tatpurush Samas (तत्पुरुष समास)',
    option_a_mr: 'तत्पुरुष समास',
    option_b_en: 'Bahuvrihi Samas (बहुव्रीही समास)',
    option_b_mr: 'बहुव्रीही समास',
    option_c_en: 'Dwandwa Samas (द्वंद्व समास)',
    option_c_mr: 'द्वंद्व समास',
    option_d_en: 'Avyayibhav Samas (अव्ययीभाव समास)',
    option_d_mr: 'अव्ययीभाव समास',
    correct_option: 'B',
    explanation_en: 'When both components of the compound word point to a third distinct entity (Lord Shiva), it is Bahuvrihi Samas.',
    explanation_mr: 'ज्या सामासिक शब्दातील दोन्ही पदे प्रमुख नसून त्या दोन्ही पदांवरून तिसऱ्याच घटकाचा (महादेव) बोध होतो, त्याला "बहुव्रीही समास" म्हणतात.',
    difficulty: 'medium',
    question_type: 'single_best',
    exam_name: 'DMER Maharashtra Exam',
    exam_year: 2023,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },

  // 2. MATHEMATICS & REASONING QUESTIONS (अंकगणित व बुद्धिमत्ता)
  {
    id: 'q-math-01',
    subject_id: 'subj-math-reas',
    chapter_id: 'ch-math-commercial',
    topic_id: 'top-math-percentage',
    exam_target: 'maha_staff_nurse',
    question_en: 'A hospital ward has 80 beds. If 60 beds are currently occupied by patients, what is the bed occupancy percentage?',
    question_mr: 'एका रुग्णालयाच्या वॉर्डमध्ये एकूण ८० बेड्स आहेत. त्यांपैकी ६० बेड्सवर सध्या रुग्ण दाखल असतील, तर बेड्स भरण्याचे प्रमाण (Occupancy Percentage) किती टक्के आहे?',
    option_a_en: '65%',
    option_a_mr: '६५%',
    option_b_en: '70%',
    option_b_mr: '७०%',
    option_c_en: '75%',
    option_c_mr: '७५%',
    option_d_en: '80%',
    option_d_mr: '८०%',
    correct_option: 'C',
    explanation_en: 'Percentage = (Occupied beds / Total beds) * 100 = (60 / 80) * 100 = (3 / 4) * 100 = 75%.',
    explanation_mr: 'टक्केवारी = (दाखल बेड्स / एकूण बेड्स) × १०० = (६० / ८०) × १०० = (३ / ४) × १०० = ७५%. म्हणून वॉर्डमधील बेड्सचे प्रमाण ७५% आहे.',
    difficulty: 'easy',
    question_type: 'single_best',
    exam_name: 'DHS Maharashtra Staff Nurse Exam',
    exam_year: 2023,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'q-math-02',
    subject_id: 'subj-math-reas',
    chapter_id: 'ch-math-commercial',
    topic_id: 'top-math-profit-loss',
    exam_target: 'maha_staff_nurse',
    question_en: 'A medical distributor purchases a pulse oximeter for ₹800 and sells it for ₹1000. What is the profit percentage?',
    question_mr: 'एका मेडिकल वितरकाने ₹८०० ला खरेदी केलेले पल्स ऑक्सिमीटर ₹१००० ला विकले, तर त्याला किती टक्के नफा झाला?',
    option_a_en: '20%',
    option_a_mr: '२०%',
    option_b_en: '25%',
    option_b_mr: '२५%',
    option_c_en: '30%',
    option_c_mr: '३०%',
    option_d_en: '15%',
    option_d_mr: '१५%',
    correct_option: 'B',
    explanation_en: 'Profit = Selling Price - Cost Price = 1000 - 800 = 200. Profit % = (200 / 800) * 100 = 25%.',
    explanation_mr: 'नफा = विक्री किंमत - खरेदी किंमत = १००० - ८०० = ₹२००. शेकडा नफा = (नफा / खरेदी किंमत) × १०० = (२०० / ८००) × १०० = २५%.',
    difficulty: 'easy',
    question_type: 'single_best',
    exam_name: 'Zilla Parishad Arogya Sevak Exam',
    exam_year: 2024,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'q-math-03',
    subject_id: 'subj-math-reas',
    chapter_id: 'ch-math-timework',
    topic_id: 'top-math-time-work',
    exam_target: 'maha_staff_nurse',
    question_en: 'If 4 staff nurses can dress 24 post-operative wounds in 2 hours, how many wounds can 6 staff nurses dress in 3 hours at the same rate?',
    question_mr: 'जर ४ स्टाफ नर्सेस २ तासांत २४ शस्त्रक्रियेनंतरच्या जखमांचे ड्रेसिंग करतात, तर त्याच वेगाने ६ स्टाफ नर्सेस ३ तासांत किती जखमांचे ड्रेसिंग करू शकतील?',
    option_a_en: '36 wounds',
    option_a_mr: '३६ जखमा',
    option_b_en: '48 wounds',
    option_b_mr: '४८ जखमा',
    option_c_en: '54 wounds',
    option_c_mr: '५४ जखमा',
    option_d_en: '60 wounds',
    option_d_mr: '६० जखमा',
    correct_option: 'C',
    explanation_en: 'Formula: (M1 * D1 * H1) / W1 = (M2 * D2 * H2) / W2. Here (4 * 2) / 24 = (6 * 3) / W2 => 8 / 24 = 18 / W2 => 1/3 = 18 / W2 => W2 = 54 wounds.',
    explanation_mr: 'सूत्र: (माणसे १ × वेळ १) / काम १ = (माणसे २ × वेळ २) / काम २. (४ × २) / २४ = (६ × ३) / W२. ८ / २४ = १८ / W२. १/३ = १८ / W२ => W२ = १८ × ३ = ५४ जखमा.',
    difficulty: 'medium',
    question_type: 'single_best',
    exam_name: 'DMER Maharashtra Nursing Exam',
    exam_year: 2023,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'q-math-04',
    subject_id: 'subj-math-reas',
    chapter_id: 'ch-reas-series-coding',
    topic_id: 'top-reas-series',
    exam_target: 'maha_staff_nurse',
    question_en: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
    question_mr: 'खालील संख्या मालिकेतील पुढील पद ओळखा: ३, ७, १५, ३१, ६३, ?',
    option_a_en: '125',
    option_a_mr: '१२५',
    option_b_en: '127',
    option_b_mr: '१२७',
    option_c_en: '129',
    option_c_mr: '१२९',
    option_d_en: '131',
    option_d_mr: '१३१',
    correct_option: 'B',
    explanation_en: 'Pattern: (n * 2) + 1. 3*2+1=7; 7*2+1=15; 15*2+1=31; 31*2+1=63; 63*2+1=127.',
    explanation_mr: 'पॅटर्न: मागील संख्येची दुप्पट करून १ मिळवणे. (३ × २) + १ = ७; (७ × २) + १ = १५; (१५ × २) + १ = ३१; (३१ × २) + १ = ६३; (६३ × २) + १ = १२७.',
    difficulty: 'easy',
    question_type: 'single_best',
    exam_name: 'DHS Maharashtra Exam',
    exam_year: 2023,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'q-math-05',
    subject_id: 'subj-math-reas',
    chapter_id: 'ch-reas-relations-dir',
    topic_id: 'top-reas-relations',
    exam_target: 'maha_staff_nurse',
    question_en: 'Pointing to a photograph of a woman, Rahul said: "She is the only daughter of my father’s mother." How is the woman related to Rahul?',
    question_mr: 'एका महिलेच्या छायाचित्राकडे बोट दाखवून राहुल म्हणाला: "ही माझ्या वडिलांच्या आईची एकुलती एक मुलगी आहे." तर ती महिला राहुलची कोण लागेल?',
    option_a_en: 'Mother (आई)',
    option_a_mr: 'आई',
    option_b_en: 'Paternal Aunt / Bua (आत्या)',
    option_b_mr: 'आत्या',
    option_c_en: 'Sister (बहीण)',
    option_c_mr: 'बहीण',
    option_d_en: 'Maternal Aunt / Mausi (मावशी)',
    option_d_mr: 'मावशी',
    correct_option: 'B',
    explanation_en: 'Rahul’s father’s mother is his grandmother (दादी). The only daughter of grandmother is father’s sister, which is Paternal Aunt (आत्या).',
    explanation_mr: 'राहुलच्या वडिलांची आई म्हणजेच राहुलची आजी. आजीची मुलगी ही वडिलांची बहीण असते. वडिलांच्या बहिणीला "आत्या" म्हणतात. म्हणून ती महिला राहुलची आत्या आहे.',
    difficulty: 'easy',
    question_type: 'single_best',
    exam_name: 'ZP Nursing Exam',
    exam_year: 2024,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },

  // 3. ENGLISH GRAMMAR QUESTIONS (इंग्रजी व्याकरण)
  {
    id: 'q-eng-01',
    subject_id: 'subj-eng',
    chapter_id: 'ch-eng-grammar',
    topic_id: 'top-eng-articles-prep',
    exam_target: 'maha_staff_nurse',
    question_en: 'Fill in the blank with the appropriate preposition: "The patient has been suffering from typhoid _____ last Monday."',
    question_mr: 'योग्य preposition निवडा: "The patient has been suffering from typhoid _____ last Monday."',
    option_a_en: 'for',
    option_a_mr: 'for',
    option_b_en: 'since',
    option_b_mr: 'since',
    option_c_en: 'from',
    option_c_mr: 'from',
    option_d_en: 'in',
    option_d_mr: 'in',
    correct_option: 'B',
    explanation_en: 'In Present Perfect Continuous Tense, "since" is used to denote a specific point of time in the past ("last Monday").',
    explanation_mr: 'Present Perfect Continuous tense मध्ये भूतकाळातील निश्चित वेळ (point of time) दर्शवण्यासाठी "since" चा वापर केला जातो (उदा. since last Monday).',
    difficulty: 'easy',
    question_type: 'single_best',
    exam_name: 'DMER Staff Nurse Exam',
    exam_year: 2023,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'q-eng-02',
    subject_id: 'subj-eng',
    chapter_id: 'ch-eng-vocab',
    topic_id: 'top-eng-synonyms-antonyms',
    exam_target: 'maha_staff_nurse',
    question_en: 'What is the SYNONYM of the clinical word "LETHARGIC"?',
    question_mr: '"LETHARGIC" या शब्दाचा समानार्थी (SYNONYM) शब्द कोणता आहे?',
    option_a_en: 'Sluggish / Drowsy',
    option_a_mr: 'Sluggish / मंद, सुस्त, ग्लानी असलेला',
    option_b_en: 'Hyperactive',
    option_b_mr: 'Hyperactive / अतिउत्साही',
    option_c_en: 'Alert',
    option_c_mr: 'Alert / सावध',
    option_d_en: 'Aggressive',
    option_d_mr: 'Aggressive / आक्रमक',
    correct_option: 'A',
    explanation_en: '"Lethargic" means lacking energy, sluggish, drowsy or fatigued.',
    explanation_mr: '"Lethargic" चा वैद्यकीय अर्थ सुस्त, निरुत्साही किंवा ग्लानी असलेला असा होतो, ज्याचा समानार्थी शब्द "Sluggish" किंवा "Drowsy" आहे.',
    difficulty: 'medium',
    question_type: 'single_best',
    exam_name: 'DHS Maharashtra Staff Nurse Exam',
    exam_year: 2023,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },

  // 4. GENERAL KNOWLEDGE & MAHARASHTRA HEALTH SCHEMES (महाराष्ट्र सामान्य ज्ञान व आरोग्य योजना)
  {
    id: 'q-gk-01',
    subject_id: 'subj-gk-mh',
    chapter_id: 'ch-gk-mh-health-schemes',
    topic_id: 'top-gk-mjpjay-ayushman',
    exam_target: 'maha_staff_nurse',
    question_en: 'What is the revised annual health insurance cover per family under the Maharashtra Government’s "Mahatma Jyotirao Phule Jan Arogya Yojana" (MJPJAY)?',
    question_mr: 'महाराष्ट्र शासनाच्या "महात्मा जोतिराव फुले जन आरोग्य योजने" (MJPJAY) अंतर्गत प्रति कुटुंब प्रति वर्ष आरोग्य संरक्षणाची सुधारित मर्यादा किती करण्यात आली आहे?',
    option_a_en: '₹1.5 Lakh per year',
    option_a_mr: '₹१.५ लाख प्रति वर्ष',
    option_b_en: '₹2.5 Lakh per year',
    option_b_mr: '₹२.५ लाख प्रति वर्ष',
    option_c_en: '₹5 Lakh per year',
    option_c_mr: '₹५ लाख प्रति वर्ष',
    option_d_en: '₹10 Lakh per year',
    option_d_mr: '₹१० लाख प्रति वर्ष',
    correct_option: 'C',
    explanation_en: 'The Maharashtra Cabinet enhanced the MJPJAY annual medical cover from ₹1.5 lakh to ₹5 lakh per family, integrated with Ayushman Bharat.',
    explanation_mr: 'महाराष्ट्र शासनाने महात्मा जोतिराव फुले जन आरोग्य योजनेची वार्षिक मोफत उपचार मर्यादा ₹१.५ लाखांवरून वाढवून ₹५ लाख केली आहे व ती सर्व शिधापत्रिकाधारकांना लागू केली आहे.',
    difficulty: 'medium',
    question_type: 'single_best',
    exam_name: 'DHS Maharashtra Staff Nurse Exam',
    exam_year: 2024,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'q-gk-02',
    subject_id: 'subj-gk-mh',
    chapter_id: 'ch-gk-mh-current',
    topic_id: 'top-gk-current-health-days',
    exam_target: 'maha_staff_nurse',
    question_en: 'On which date is "International Nurses Day" observed globally every year?',
    question_mr: 'दरवर्षी "आंतरराष्ट्रीय परिचारिका दिन" (International Nurses Day) कोणत्या तारखेला साजरा केला जातो?',
    option_a_en: '7th April',
    option_a_mr: '७ एप्रिल',
    option_b_en: '12th May',
    option_b_mr: '१२ मे',
    option_c_en: '1st July',
    option_c_mr: '१ जुलै',
    option_d_en: '1st December',
    option_d_mr: '१ डिसेंबर',
    correct_option: 'B',
    explanation_en: 'International Nurses Day is celebrated on May 12th worldwide to commemorate the birth anniversary of Florence Nightingale, the founder of modern nursing.',
    explanation_mr: 'आधुनिक नर्सिंगच्या जनक फ्लोरेन्स नाइटिंगेल यांच्या जन्मदिनानिमित्त दरवर्षी १२ मे रोजी जगभरात आंतरराष्ट्रीय परिचारिका दिन साजरा केला जातो. (७ एप्रिल हा जागतिक आरोग्य दिन आहे).',
    difficulty: 'easy',
    question_type: 'single_best',
    exam_name: 'DMER Maharashtra Nursing Exam',
    exam_year: 2023,
    is_pyq: true,
    is_free: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  }
];

// Merge sample questions if they don't already exist
SAMPLE_NONTECH_QUESTIONS.forEach(newQ => {
  const exists = store.questions.find(q => q.id === newQ.id);
  if (!exists) {
    store.questions.push(newQ);
  }
});

// Update topic_id for existing questions where missing
store.questions.forEach(q => {
  if (!q.topic_id) {
    if (q.subject_id === 'subj-fon') q.topic_id = 'top-vitals-temp';
    else if (q.subject_id === 'subj-msn') q.topic_id = 'top-cvs-mi';
    else if (q.subject_id === 'subj-obg') q.topic_id = 'top-obg-labour-stages';
    else if (q.subject_id === 'subj-peds') q.topic_id = 'top-peds-apgar';
    else if (q.subject_id === 'subj-chn') q.topic_id = 'top-chn-phc-setup';
    else if (q.subject_id === 'subj-pharm') q.topic_id = 'top-pharm-adrenaline-atropine';
    else if (q.subject_id === 'subj-infection') q.topic_id = 'top-bmw-segregation';
    else if (q.subject_id === 'subj-gk-mr') q.topic_id = 'top-mr-mhane';
  }
});

// Sample Topic-wise Test Series Papers in store.mock_tests
const TOPIC_MOCK_TESTS = [
  {
    id: 'test-topic-mr-01',
    test_number: 101,
    title_mr: 'मराठी व्याकरण: म्हणी व वाक्प्रचार विशेष घटक चाचणी',
    title_en: 'Marathi Grammar: Idioms & Proverbs Special Topic Test',
    exam_name: 'DHS / DMER / ZP Staff Nurse',
    exam_pattern: 'DHS Maharashtra',
    description: 'महाराष्ट्र शासन परिचारिका परीक्षेसाठी मराठी भाषेतील म्हणी, वाक्प्रचार व शब्दसंग्रह यावर विशेष आधारित सराव चाचणी.',
    description_mr: 'महाराष्ट्र शासन परिचारिका परीक्षेसाठी मराठी भाषेतील म्हणी, वाक्प्रचार व शब्दसंग्रह यावर विशेष आधारित सराव चाचणी.',
    description_en: 'Topic-wise mock test focused on Marathi proverbs, idioms, and vocabulary for Maharashtra Nursing Officer exams.',
    test_type: 'topic_test',
    subject_id: 'subj-gk-mr',
    topic_id: 'top-mr-mhane',
    topic_name_mr: 'म्हणी व वाक्प्रचार',
    topic_name_en: 'Proverbs & Idioms',
    duration_minutes: 20,
    total_marks: 20,
    passing_marks: 10,
    negative_marking_rate: 0,
    question_ids: ['q-mr-01', 'q-mr-02', 'q-mr-03', 'q-mr-04'],
    is_published: true,
    is_premium: false,
    is_free: true,
    is_active: true,
    price: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'test-topic-math-01',
    test_number: 102,
    title_mr: 'अंकगणित व बुद्धिमत्ता: शेकडेवारी, नफा-तोटा व मालिका चाचणी',
    title_en: 'Arithmetic & Reasoning: Percentage, Profit-Loss & Series Test',
    exam_name: 'DHS / DMER / ZP Staff Nurse',
    exam_pattern: 'DHS Maharashtra',
    description: 'महाराष्ट्र आरोग्य सेवा भरतीमधील अंकगणित व बुद्धिमत्ता चाचणीच्या घटकांवर आधारित विशेष सराव पेपर.',
    description_mr: 'महाराष्ट्र आरोग्य सेवा भरतीमधील अंकगणित व बुद्धिमत्ता चाचणीच्या घटकांवर आधारित विशेष सराव पेपर.',
    description_en: 'Topic test on percentage, profit & loss, time-work, and reasoning series for Maharashtra Staff Nurse.',
    test_type: 'topic_test',
    subject_id: 'subj-math-reas',
    topic_id: 'top-math-percentage',
    topic_name_mr: 'शेकडेवारी व नफा-तोटा',
    topic_name_en: 'Percentage & Commercial Math',
    duration_minutes: 25,
    total_marks: 20,
    passing_marks: 10,
    negative_marking_rate: 0,
    question_ids: ['q-math-01', 'q-math-02', 'q-math-03', 'q-math-04', 'q-math-05'],
    is_published: true,
    is_premium: false,
    is_free: true,
    is_active: true,
    price: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'test-topic-fon-01',
    test_number: 103,
    title_mr: 'नर्सिंग मूलभूत घटक चाचणी: Vital Signs & Medication Rights',
    title_en: 'Fundamentals Nursing Topic Test: Vitals & 10 Rights',
    exam_name: 'DHS / DMER / ZP / NORCET',
    exam_pattern: 'DHS Maharashtra',
    description: 'रक्तदाब, तापमान, ऑक्सिजन थेरपी आणि औषध प्रशासनाचे १० नियम यावर आधारित सराव चाचणी.',
    description_mr: 'रक्तदाब, तापमान, ऑक्सिजन थेरपी आणि औषध प्रशासनाचे १० नियम यावर आधारित सराव चाचणी.',
    description_en: 'Topic test on Vital signs, catheterization, and medication rights.',
    test_type: 'topic_test',
    subject_id: 'subj-fon',
    topic_id: 'top-vitals-temp',
    topic_name_mr: 'महत्त्वाची चिन्हे (Vital Signs)',
    topic_name_en: 'Vital Signs & Temperature',
    duration_minutes: 30,
    total_marks: 30,
    passing_marks: 15,
    negative_marking_rate: 0.25,
    question_ids: store.questions.filter(q => q.subject_id === 'subj-fon').slice(0, 15).map(q => q.id),
    is_published: true,
    is_premium: false,
    is_free: true,
    is_active: true,
    price: 0,
    created_at: new Date().toISOString()
  }
];

TOPIC_MOCK_TESTS.forEach(test => {
  const idx = store.mock_tests.findIndex(m => m.id === test.id);
  if (idx >= 0) {
    store.mock_tests[idx] = { ...store.mock_tests[idx], ...test };
  } else {
    store.mock_tests.push(test);
  }
});

// Write to store.json
fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log('Successfully seeded Maharashtra Nursing Officer syllabus into store.json!');
console.log(`Subjects: ${store.subjects.length}`);
console.log(`Chapters: ${store.chapters.length}`);
console.log(`Topics: ${store.topics.length}`);
console.log(`Questions: ${store.questions.length}`);
console.log(`Mock Tests: ${store.mock_tests.length}`);
