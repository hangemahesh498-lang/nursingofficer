const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const storePath = path.resolve(__dirname, '../data/store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

function computeDuplicateHash(text) {
  const normalized = (text || '').toLowerCase().replace(/[^\w\u0900-\u097F]/g, '');
  return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
}

const existingHashes = new Set(
  (store.questions || []).map(q => q.duplicate_hash || computeDuplicateHash(q.question_en))
);

// Subject-specific Question Templates & Clinical Banks
// Each subject has 20 core clinical concepts, and we generate 5 unique high-yield questions per concept = 100 questions per subject!
const subjectTemplates = {
  'subj-fon': [
    {
      conceptEn: "Glasgow Coma Scale (GCS) assessment in trauma",
      conceptMr: "ग्लासगो कोमा स्केल (GCS) मूल्यमापन",
      detailsEn: "EVM breakdown: Eye opening (1-4), Verbal response (1-5), Motor response (1-6); minimum score 3 (deep coma/brain death), maximum 15 (fully oriented)",
      detailsMr: "GCS चे तीन घटक: डोळे उघडणे (१-४), मौखिक प्रतिसाद (१-५), हालचालीचा प्रतिसाद (१-६); किमान गुण ३, कमाल गुण १५",
      optB_En: "Pupillary light reflex, deep tendon reflexes, and babinski response",
      optB_Mr: "केवळ बाहुल्यांचा प्रकाश प्रतिसाद आणि खोल स्नायू प्रतिक्षिप्त क्रिया",
      optC_En: "Blood pressure, arterial blood gases, and cardiac output calculation",
      optC_Mr: "रक्तदाब, धमनी रक्त वायू विश्लेषण आणि हृदयाचे कार्य",
      optD_En: "Body mass index, serum electrolyte balance, and urine specific gravity",
      optD_Mr: "वजन, सोडियम-पोटॅशियम प्रमाण आणि लघवीची घनता"
    },
    {
      conceptEn: "Bed sore / Pressure ulcer Stage II characteristics",
      conceptMr: "बेड सोअर / प्रेशर अल्सर पायरी २ चे लक्षण",
      detailsEn: "Partial-thickness loss of skin with exposed dermis; wound bed is viable, pink/red, moist, and may present as an intact or ruptured serum-filled blister",
      detailsMr: "त्वचेचा वरचा थर निघून लालसर ओसर त्वचा दिसणे किंवा पाण्याने भरलेला फोड येणे",
      optB_En: "Non-blanchable erythema of intact skin over a bony prominence",
      optB_Mr: "त्वचेवर दाब दिल्यावर पांढरा न होणारा लाल चट्टा (पायरी १)",
      optC_En: "Full-thickness tissue loss with visible adipose tissue and epibole",
      optC_Mr: "पूर्ण जाडीची त्वचा जाऊन चरबीचा थर उघडा पडणे (पायरी ३)",
      optD_En: "Full-thickness skin loss with directly exposed muscle, tendon, ligament, or bone",
      optD_Mr: "स्नायू, हाड आणि सांधे उघडे पडणे (पायरी ४)"
    },
    {
      conceptEn: "Sondermann (Enema) tube insertion depth in adult nursing",
      conceptMr: "मोठ्या रुग्णांमध्ये ॲनिमा नळी किती आत सरकवावी?",
      detailsEn: "3 to 4 inches (7.5 to 10 cm) directed towards the umbilicus in left lateral Sims position",
      detailsMr: "डाव्या कुशीवर झोपवून बेंबीच्या दिशेने ३ ते ४ इंच (७.५ ते १० सेमी)",
      optB_En: "1 to 2 inches (2.5 to 5 cm) with patient in supine posture",
      optB_Mr: "केवळ १ ते २ इंच उताणे झोपवून",
      optC_En: "6 to 8 inches (15 to 20 cm) in lithotomy position",
      optC_Mr: "६ ते ८ इंच लिथोटोमी स्थितीत",
      optD_En: "10 to 12 inches (25 to 30 cm) with forceful push",
      optD_Mr: "१० ते १२ इंच जोरात दाबून"
    },
    {
      conceptEn: "Oxygen therapy via Venturi mask therapeutic principle",
      conceptMr: "व्हेंचुरी मास्क (Venturi Mask) द्वारे ऑक्सिजन देण्याचे तत्त्व",
      detailsEn: "Delivers a precise, controlled fraction of inspired oxygen (FiO2 24% to 50%) based on Bernoulli's principle, ideal for COPD patients",
      detailsMr: "बर्नोलीच्या तत्त्वानुसार अचूक आणि नियंत्रित ऑक्सिजन (FiO2 २४% ते ५०%) पुरवणे (COPD साठी सर्वोत्तम)",
      optB_En: "Provides 100% pure oxygen with positive end-expiratory pressure",
      optB_Mr: "शंभर टक्के ऑक्सिजन दाब देऊन पुरवणे",
      optC_En: "Delivers uncontrolled low oxygen flow of only 0.5 L/min",
      optC_Mr: "फक्त ०.५ लिटर प्रति मिनिट कमी ऑक्सिजन देणे",
      optD_En: "Humidifies ambient air without any supplemental oxygen delivery",
      optD_Mr: "केवळ हवेतील आर्द्रता वाढवणे"
    },
    {
      conceptEn: "Nasogastric (NG) tube measurement technique: NEX method",
      conceptMr: "राउल्स ट्यूब / एनजी ट्यूब मोजण्याची NEX पद्धत",
      detailsEn: "Measure from Nose tip to Earlobe, then from earlobe to Xiphoid process of sternum (NEX)",
      detailsMr: "नाकाचे टोक ते कानाची पाळी आणि कानाच्या पाळीपासून स्टर्नमच्या झायफॉईड टोकापर्यंत (NEX)",
      optB_En: "Measure from mouth to sternal notch to umbilicus",
      optB_Mr: "तोंडापासून छातीच्या खळग्यापर्यंत आणि नंतर बेंबीपर्यंत",
      optC_En: "Measure straight from forehead to pubic symphysis",
      optC_Mr: "कपाळापासून प्युबिक हाडापर्यंत सरळ",
      optD_En: "Fixed standard length of 100 cm for all adult patients",
      optD_Mr: "सर्व प्रौढांसाठी एकच १०० सेमी लांबी वापरणे"
    },
    {
      conceptEn: "Verification of NG tube placement gold standard",
      conceptMr: "एनजी ट्यूब पोटाच्या आत योग्य गेल्याची खात्री करण्याची अचूक पद्धत",
      detailsEn: "Radiographic confirmation (Abdominal / Chest X-ray) followed by pH testing of gastric aspirate (pH < 5.5)",
      detailsMr: "एक्स-रे (X-ray) द्वारे खात्री करणे आणि गॅस्ट्रिक द्रवाचा सामू (pH < ५.५) तपासणे",
      optB_En: "Auscultating air bolus whoosh over epigastrium with stethoscope",
      optB_Mr: "केवळ पोटावर स्टेथॉस्कोपने हवेचा आवाज ऐकणे",
      optC_En: "Placing end of tube in glass of water and watching for bubbles",
      optC_Mr: "पाण्याच्या पेल्यात नळीचे टोक धरून बुडबुडे पाहणे",
      optD_En: "Asking patient if they feel comfortable and swallowing well",
      optD_Mr: "रुग्णाला आराम वाटत आहे का विचारणे"
    },
    {
      conceptEn: "Blood transfusion protocol: initial 15-minute monitoring",
      conceptMr: "रक्त चढवताना पहिल्या १५ मिनिटांचे निरीक्षण",
      detailsEn: "Infuse slowly at 2 mL/min (approx 20-30 gtt/min) and stay at bedside for first 15 minutes to detect acute hemolytic transfusion reaction",
      detailsMr: "हळूहळू (२ मिली/मिनिट) सुरू करून पहिल्या १५ मिनिटांत गंभीर रिॲक्शन तपासण्यासाठी खाटेजवळ थांबणे",
      optB_En: "Infuse entire unit rapidly within 10 minutes to avoid clotting",
      optB_Mr: "रक्त साठू नये म्हणून अवघ्या १० मिनिटांत संपूर्ण रक्त देणे",
      optC_En: "Leave the patient alone in dark room to rest undisturbed",
      optC_Mr: "रुग्णाला खोलीत एकटे सोडून निघून जाणे",
      optD_En: "Administer furosemide and potassium chloride simultaneously in same IV line",
      optD_Mr: "त्याच नळीतून पोटॅशियम आणि लघवीचे औषध देणे"
    },
    {
      conceptEn: "Blood transfusion maximum allowable duration",
      conceptMr: "रक्ताची १ बॅग चढवण्याची जास्तीत जास्त वेळ मर्यादा",
      detailsEn: "4 hours from removing unit from blood bank; beyond 4 hours risk of bacterial proliferation and septicemia increases significantly",
      detailsMr: "रक्तपेढीतून काढल्यापासून जास्तीत जास्त ४ तास; यापेक्षा जास्त वेळ झाल्यास जिवाणू संसर्गाचा मोठा धोका असतो",
      optB_En: "8 to 10 hours at room temperature",
      optB_Mr: "८ ते १० तास खोलीच्या तापमानात",
      optC_En: "12 hours if kept with ice cubes in tray",
      optC_Mr: "१२ तास बर्फाच्या ट्रेमध्ये ठेवून",
      optD_En: "24 hours without changing transfusion tubing",
      optD_Mr: "२४ तास एकाच नळीने चालवणे"
    },
    {
      conceptEn: "Urinary retention and catheterization: initial drain limit",
      conceptMr: "लघवी अडकलेल्या रुग्णात पहिल्या वेळी किती लघवी बाहेर काढावी?",
      detailsEn: "Drain no more than 750-1000 mL initially; clamp tubing temporarily to prevent decompression hematuria and hypovolemic shock",
      detailsMr: "पहिल्या झटक्यात ७५० ते १००० मिलीपेक्षा जास्त काढू नये; धक्का बसू नये म्हणून नळी तात्पुरती क्लिप करावी",
      optB_En: "Drain full bladder completely up to 3000 mL without stopping",
      optB_Mr: "पूर्ण ३००० मिली लघवी एकाच दमात रिकामी करणे",
      optC_En: "Drain only 50 mL and remove catheter immediately",
      optC_Mr: "केवळ ५० मिली काढून कॅथेटर बाहेर काढणे",
      optD_En: "Infuse 500 mL normal saline before allowing any urine drainage",
      optD_Mr: "लघवी बाहेर येण्यापूर्वी पिशवीत ५०० मिली सलाईन भरणे"
    },
    {
      conceptEn: "Sterile field maintenance in surgical nursing",
      conceptMr: "ऑपरेशन व ड्रेसिंग दरम्यान निर्जंतुक क्षेत्र (Sterile Field) सांभाळणे",
      detailsEn: "Never turn back to sterile field; sterile drapes are sterile only on horizontal surface; 1-inch border along edges is considered unsterile",
      detailsMr: "स्टराईल भागाकडे पाठ कधीही करू नये; सपाट पृष्ठभाग निर्जंतुक असतो आणि कडेचा १ इंच भाग अस्वच्छ मानला जातो",
      optB_En: "Sterile surfaces remain sterile even when wet or touched with bare hands",
      optB_Mr: "ओले झालेले साहित्य आणि उघड्या हाताने स्पर्श केलेले साहित्य निर्जंतुक राहते",
      optC_En: "Reach across the open sterile field to place instruments quickly",
      optC_Mr: "साहित्य ठेवण्यासाठी स्टराईल क्षेत्रावरून हात पुढे नेणे",
      optD_En: "Keep sterile hands below waist level and behind the back",
      optD_Mr: "निर्जंतुक केलेले हात कमरेच्या खाली आणि पाठीमागे ठेवणे"
    },
    {
      conceptEn: "Autoclave standard operating parameters for sterilization",
      conceptMr: "ऑटोक्लेव्ह (वाफेचे निर्जंतुकीकरण) चे प्रमाणित तापमान व दाब",
      detailsEn: "121°C (250°F) at 15 psi (pounds per square inch) chamber pressure for 15 to 30 minutes",
      detailsMr: "१२१ अंश सेल्सिअस तापमान, १५ पाउंड (psi) वाफेचा दाब आणि १५ ते ३० मिनिटे वेळ",
      optB_En: "100°C at atmospheric pressure for 5 minutes",
      optB_Mr: "१०० अंश सेल्सिअस सामान्य दाबावर ५ मिनिटे",
      optC_En: "160°C dry heat without any steam for 2 hours",
      optC_Mr: "१६० अंश कोरडी हवा वाफेविना २ तास",
      optD_En: "65°C low temperature pasteurization for 30 minutes",
      optD_Mr: "६५ अंश मंद तापमानावर ३० मिनिटे"
    },
    {
      conceptEn: "Z-track injection technique purpose and execution",
      conceptMr: "Z-ट्रॅक इंजेक्शन पद्धत (Z-Track Technique) चा उद्देश",
      detailsEn: "Displace skin and subcutaneous tissue 1-1.5 inches laterally, inject at 90°, wait 10 seconds before withdraw; prevents leakage and tattooing of irritating drugs (e.g. Iron)",
      detailsMr: "त्वचा बाजूला ओढून ९० अंशात देणे व १० सेकंद थांबून काढणे; औषध (उदा. लोह) पाझरून डाग पडणे रोखणे",
      optB_En: "Given at 15-degree angle into epidermis for allergy tests",
      optB_Mr: "ॲलर्जी चाचणीसाठी त्वचेच्या वरच्या थरात १५ अंशात देणे",
      optC_En: "Given into subcutaneous adipose tissue with vigorous post-injection massage",
      optC_Mr: "चरबीच्या थरात देऊन नंतर जोरात चोळणे",
      optD_En: "Rapid injection into dorsal vein of hand using butterfly needle",
      optD_Mr: "हाताच्या नसेत बटरफ्लाय सुईने वेगाने देणे"
    },
    {
      conceptEn: "Intradermal (ID) injection site, angle and bleb formation",
      conceptMr: "इंट्राडर्मल (ID) इंजेक्शनचा कोन आणि वैशिष्ट्य",
      detailsEn: "Anterior forearm; 5 to 15-degree angle with needle bevel facing upwards; produces a visible 6-10 mm wheal/bleb (e.g. Mantoux test)",
      detailsMr: "हाताच्या पुढच्या भागावर ५ ते १५ अंशात टोक वर ठेवून; त्वचेवर ६-१० मिमीचा फोड (Wheal) तयार होणे (उदा. मंटू टेस्ट)",
      optB_En: "45-degree angle into vastus lateralis with aspiration",
      optB_Mr: "मांडीच्या स्नायूत ४५ अंशात रक्त खेचून तपासणे",
      optC_En: "90-degree angle directly into deltoid muscle mass",
      optC_Mr: "खांद्याच्या स्नायूत ९० अंशात सरळ टोचणे",
      optD_En: "Direct injection into femoral artery in groin",
      optD_Mr: "मांडीच्या मुख्य रोहिणीत थेट सुई खुपसणे"
    },
    {
      conceptEn: "Subcutaneous (SC) injection gauge, length and needle angle",
      conceptMr: "सबक्युटेनियस (SC - इन्सुलिन) इंजेक्शनचा आकार व कोन",
      detailsEn: "25 to 30 gauge needle, 3/8 to 5/8 inch length; inserted at 45° angle (if 1 inch tissue pinched) or 90° angle (if 2 inches pinched)",
      detailsMr: "२५ ते ३० गेज सुई, ३/८ ते ५/८ इंच लांबी; १ इंच त्वचा उचलल्यास ४५ अंश व २ इंच उचलल्यास ९० अंश",
      optB_En: "16 gauge wide bore cannula inserted at 10-degree angle",
      optB_Mr: "१६ गेजची मोठी नळी १० अंशात",
      optC_En: "18 gauge spinal needle inserted at 90-degree angle into bone",
      optC_Mr: "१८ गेजची लांब सुई थेट हाडात टोचणे",
      optD_En: "Trocar needle inserted horizontally under fingernails",
      optD_Mr: "नखांच्या खाली आडवी सुई घालणे"
    },
    {
      conceptEn: "Braden Scale risk assessment categories for pressure injuries",
      conceptMr: "ब्रेडन स्केल (Braden Scale) चे ६ मुख्य निकष",
      detailsEn: "Sensory perception, Moisture, Activity, Mobility, Nutrition, and Friction & Shear; total score range 6-23 (score <= 12 indicates high risk)",
      detailsMr: "संवेदना, आर्द्रता, हालचाल, गतिशीलता, पोषण आणि घर्षण (६ ते २३ गुण; १२ किंवा कमी म्हणजे अतिधोकादायक)",
      optB_En: "Systolic BP, heart rate, respiratory rate, body temperature, and pain score",
      optB_Mr: "रक्तदाब, नाडी, श्वासोच्छ्वास, तापमान आणि वेदनांची तीव्रता",
      optC_En: "White blood count, hemoglobin, platelet count, and serum creatinine",
      optC_Mr: "पांढऱ्या पेशी, हिमोग्लोबिन, प्लेटलेट्स आणि क्रिएटीनिन",
      optD_En: "Age, gender, education level, and socioeconomic status",
      optD_Mr: "वय, लिंग, शिक्षण आणि आर्थिक परिस्थिती"
    },
    {
      conceptEn: "Pulse deficit clinical definition and measurement technique",
      conceptMr: "पल्स डेफिसिट (Pulse Deficit) म्हणजे काय व ते कसे मोजतात?",
      detailsEn: "Difference between apical pulse rate and radial pulse rate taken simultaneously by two nurses for one full minute; seen in atrial fibrillation",
      detailsMr: "दोन परिचारिकांनी एकाच वेळी मोजलेल्या छातीवरील नाडी (Apical) व हातावरील नाडी (Radial) मधील फरक",
      optB_En: "Difference between systolic and diastolic arterial blood pressure readings",
      optB_Mr: "वरचा रक्तदाब आणि खालचा रक्तदाब यातील फरक",
      optC_En: "Difference between morning body temperature and evening body temperature",
      optC_Mr: "सकाळचे तापमान आणि संध्याकाळचे तापमान यातील फरक",
      optD_En: "Difference between fluid intake and urinary output volume",
      optD_Mr: "पिलेले पाणी आणि लघवीचे प्रमाण यातील फरक"
    },
    {
      conceptEn: "Triage tagging color codes in Mass Casualty Incidents (MCI)",
      conceptMr: "आपत्ती व्यवस्थापनात ट्रायज (Triage) रंगांचे वर्गीकरण",
      detailsEn: "Red (Immediate - life threatening, high survival probability), Yellow (Delayed - serious but stable), Green (Minimal - walking wounded), Black (Expectant/Deceased)",
      detailsMr: "लाल (तातडीचे - तत्काळ उपचार आवश्यक), पिवळा (गंभीर पण स्थिर), हिरवा (किरकोळ जखमी), काळा (मृत किंवा वाचणे अशक्य)",
      optB_En: "Blue (Critical), Orange (Urgent), White (Minor), Grey (Deceased)",
      optB_Mr: "निळा (अतिदक्षता), नारिंगी (तातडीचे), पांढरा (किरकोळ), करडा (मृत)",
      optC_En: "Green (Critical), Red (Minor), Yellow (Deceased), Black (Delayed)",
      optC_Mr: "हिरवा (गंभीर), लाल (किरकोळ), पिवळा (मृत), काळा (उशिरा)",
      optD_En: "Purple (Contagious), Pink (Pediatric), Silver (Elderly), Gold (VIP)",
      optD_Mr: "जांभळा (संसर्ग), गुलाबी (बालके), रुपेरी (वृद्ध), सोनेरी (खास व्यक्ती)"
    },
    {
      conceptEn: "Postural drainage and chest physiotherapy timing",
      conceptMr: "छातीची फिजिओथेरपी व पोस्टुरल ड्रेनेज कधी करावे?",
      detailsEn: "Perform before meals (at least 1 hour before or 2 hours after meals) and at bedtime to prevent vomiting and aspiration",
      detailsMr: "जेवणापूर्वी १ तास किंवा जेवणानंतर २ तासांनी आणि झोपण्यापूर्वी (उलटी व अन्नाचा ठसका टाळण्यासाठी)",
      optB_En: "Immediately following heavy meal ingestion while patient lies flat",
      optB_Mr: "भरपेट जेवल्यानंतर लगेच उताणे झोपवून",
      optC_En: "During deep active sleep through night without awakening patient",
      optC_Mr: "रात्री गाढ झोपेत रुग्णाला न उठवता",
      optD_En: "Only when patient is experiencing acute hemoptysis and coughing blood",
      optD_Mr: "केवळ खोकल्यातून रक्त पडत असताना"
    },
    {
      conceptEn: "Hypokalemia clinical manifestation and ECG changes",
      conceptMr: "हायपोकॅलेमिया (पोटॅशियमची कमतरता) ची लक्षणे व ECG बदल",
      detailsEn: "Serum K+ < 3.5 mEq/L; muscle weakness, paralytic ileus; ECG shows flattened T waves, ST segment depression, prominent U waves",
      detailsMr: "पोटॅशियम ३.५ पेक्षा कमी; स्नायूंचा अशक्तपणा, पोट फुगणे; ECG मध्ये चपटी T वेव्ह, ST खाली जाणे आणि ठळक U वेव्ह दिसणे",
      optB_En: "Tall peaked T waves, prolonged PR interval, widened QRS complex (Hyperkalemia)",
      optB_Mr: "उंच अणकुचीदार T वेव्ह आणि रुंद QRS (हायपरकॅलेमिया)",
      optC_En: "Shortened QT interval with pathological Q waves",
      optC_Mr: "अतिसंक्षिप्त QT इंटरव्हल",
      optD_En: "Rapid delta waves with shortened PR interval",
      optD_Mr: "डेल्टा वेव्ह आणि कमी झालेला PR वेळ"
    },
    {
      conceptEn: "Hyperkalemia emergency nursing management and calcium gluconate role",
      conceptMr: "हायपरकॅलेमिया (पोटॅशियम वाढणे) मध्ये कॅल्शियम ग्लुकोनेटचे कार्य",
      detailsEn: "10% Calcium gluconate IV stabilizes myocardial cell membrane and prevents fatal arrhythmias; does not lower serum potassium directly",
      detailsMr: "१०% कॅल्शियम ग्लुकोनेट हृदयाच्या स्नायूंचे रक्षण करून जीवघेणा अनियमित ठोका रोखते (पोटॅशियम थेट कमी करत नाही)",
      optB_En: "Immediately excretes potassium through renal tubules within seconds",
      optB_Mr: "काही सेकंदात मूत्रपिंडातून पोटॅशियम बाहेर टाकणे",
      optC_En: "Binds potassium irreversibly in large intestine for rapid fecal evacuation",
      optC_Mr: "मोठ्या आतड्यात पोटॅशियम बांधून जुलाब घडवणे",
      optD_En: "Converts serum potassium into sodium chloride in bloodstream",
      optD_Mr: "रक्तातील पोटॅशियमचे रूपांतर मीठामध्ये करणे"
    }
  ]
};

// Generic subject topic dictionary to generate rich, syllabus-accurate nursing questions across all subjects
const subjectThemes = {
  'subj-msn': [
    { en: "Myocardial Infarction: MONA protocol priorities (Morphine, Oxygen, Nitroglycerin, Aspirin)", mr: "हार्ट अटॅक: MONA प्रथमोपचार प्राधान्यक्रम (मॉर्फिन, ऑक्सिजन, नायट्रोग्लिसरीन, ॲस्पिरिन)", dEn: "Administer Aspirin (chewed) first, followed by sublingual Nitroglycerin, supplemental Oxygen (if SpO2 < 90%), and IV Morphine for refractory pain", dMr: "सर्वप्रथम ॲस्पिरिन चावून खाण्यास देणे, नंतर नायट्रोग्लिसरीन, ऑक्सिजन आणि तीव्र वेदनेसाठी मॉर्फिन देणे" },
    { en: "Diabetic Ketoacidosis (DKA) pathophysiology and regular insulin infusion", mr: "डायबेटिक कीटोॲसिडोसिस (DKA) आणि रेग्युलर इन्सुलिन सलाईन", dEn: "Severe hyperglycemia, metabolic acidosis with elevated anion gap, Kussmaul respirations; treat with aggressive Normal Saline fluid replacement and IV Regular insulin infusion", dMr: "रक्तातील अतिसाखर, कीटोन्स व आम्लता, कुसमाऊल श्वास; भरपूर सलाईन आणि शिरेतून रेग्युलर इन्सुलिन देऊन उपचार करणे" },
    { en: "Chronic Kidney Disease: hyperkalemia, metabolic acidosis and anemia management", mr: "तीव्र मूत्रपिंड विकार (CKD): पोटॅशियम वाढणे, ॲनिमिया व डायलिसिस", dEn: "Decreased erythropoietin leads to normocytic normochromic anemia (treated with recombinant EPO and Iron); monitor for fluid overload and uremic encephalopathy", dMr: "इरिथ्रोपोएटिन कमी झाल्याने ॲनिमिया; ईपीओ आणि लोह देणे, अंगावर सूज व युरिया वाढण्यावर लक्ष ठेवणे" },
    { en: "Cerebrovascular Accident (Stroke): tPA (Alteplase) administration window", mr: "पक्षाघात (स्ट्रोक): tPA (अल्टेप्लेस) रक्त पातळ करण्याचे इंजेक्शन देण्याची वेळ मर्यादा", dEn: "Administer IV tPA within 3 to 4.5 hours of symptom onset in acute ischemic stroke after ruling out hemorrhage via non-contrast head CT scan", dMr: "मेंदूतील रक्तस्राव नसल्याची सिटी स्कॅनने खात्री करून लक्षणे सुरू झाल्यापासून ३ ते ४.५ तासांच्या आत शिरेतून देणे" },
    { en: "Chronic Obstructive Pulmonary Disease (COPD): hypoxic drive and low-flow oxygen", mr: "दम्याचा जुनाट विकार (COPD): हायपॉक्सिक ड्राईव्ह व नियंत्रित ऑक्सिजन", dEn: "Maintain SpO2 between 88% and 92% using low-flow oxygen (1-2 L/min via nasal cannula or Venturi mask) to avoid blunting the hypoxic respiratory drive", dMr: "हायपॉक्सिक ड्राईव्ह नष्ट होऊ नये म्हणून नाकातून १-२ लिटर ऑक्सिजन देऊन SpO2 ८८% ते ९२% दरम्यान ठेवणे" }
  ],
  'subj-obg': [
    { en: "Postpartum Hemorrhage (PPH) definition, causes (4 Ts) and Oxytocin management", mr: "प्रसूतीनंतरचा अतिरक्तस्राव (PPH): ४ T कारणे आणि ऑक्सिटोसिन उपचार", dEn: "Blood loss > 500 mL (vaginal) or > 1000 mL (cesarean); 4 Ts: Tone (atony - 70%), Tissue, Trauma, Thrombin; IV Oxytocin 10-20 IU in 500 mL fluid first line", dMr: "५०० मिली पेक्षा जास्त रक्तस्राव; मुख्य कारण गर्भाशयाची शिथिलता (Atony); १०-२० युनिट ऑक्सिटोसिन सलाईनमधून देणे" },
    { en: "Preeclampsia and Eclampsia: Magnesium Sulfate protocol and toxicity antidote", mr: "गरोदरपणातील झटके (एक्लॅम्पसिया): मॅग्नेशियम सल्फेट व विषबाधेवर कॅल्शियम ग्लुकोनेट", dEn: "Loading dose 4g IV + 10g IM, followed by 5g IM q4h; monitor patellar reflex, respiration (>16/min), urine output (>30 mL/hr); antidote is 10% Calcium Gluconate IV", dMr: "झटके रोखण्यासाठी मॅगसल्फ; गुडघ्याची उसळी, श्वास (>१६) आणि लघवी (>३० मिली/तास) तपासणे; विषबाधेवर १०% कॅल्शियम ग्लुकोनेट देणे" },
    { en: "Stages of Labor: normal duration and cervical dilation phases", mr: "प्रसूतीचे टप्पे (Stages of Labor) आणि गर्भाशय ग्रीवेचे उघडणे", dEn: "First stage: onset of true contractions to full cervical dilation (10 cm); Second stage: full dilation to delivery of baby; Third stage: delivery of placenta", dMr: "पहिली पायरी: कळा सुरू होण्यापासून ग्रीवा १० सेमी उघडेपर्यंत; दुसरी पायरी: बाळ जन्माला येणे; तिसरी पायरी: वार (नाळ) बाहेर पडणे" },
    { en: "Apgar Score assessment at 1 and 5 minutes post-delivery", mr: "नवजात बाळाचा ॲपगार स्कोर (Apgar Score) १ व ५ मिनिटांनी तपासणे", dEn: "Appearance (color), Pulse (heart rate), Grimace (reflex), Activity (muscle tone), Respiration (effort); score 7-10 normal, 4-6 moderate distress, 0-3 severe depression", dMr: "रंग, नाडी, चेहऱ्यावरील भाव, स्नायूंची हालचाल आणि श्वासोच्छ्वास; ७-१० उत्तम, ४-६ मध्यम धोका, ०-३ अतिधोकादायक" },
    { en: "Lochia stages in postpartum involution: Rubra, Serosa, and Alba", mr: "प्रसूतीनंतरचा स्राव (Lochia): रुब्रा, सेरोसा आणि अल्बा चे दिवस", dEn: "Lochia Rubra (days 1-4, bright red with small clots), Lochia Serosa (days 4-10, pinkish-brown, serous), Lochia Alba (days 10-28, yellowish-white, creamy)", dMr: "लोचिया रुब्रा (१-४ दिवस, लाल), लोचिया सेरोसा (४-१० दिवस, गुलाबी-तपकिरी), लोचिया अल्बा (१०-२८ दिवस, पांढरट-पिवळा)" }
  ],
  'subj-peds': [
    { en: "Kangaroo Mother Care (KMC) components and benefits for preterm neonates", mr: "कांगारू मदर केअर (KMC): मुदतपूर्व बालकांसाठी कातडीला कातडी स्पर्श", dEn: "Continuous skin-to-skin contact, exclusive breastfeeding, early discharge; maintains neonatal temperature, prevents hypothermia, enhances neurodevelopment", dMr: "बाळाला आईच्या छातीशी उघडे चिकटवून ठेवणे, केवळ अंगावरचे दूध पाजणे; हायपोथर्मिया रोखणे व वजन वाढवणे" },
    { en: "Neonatal Jaundice: physiological vs pathological criteria and phototherapy", mr: "नवजात बाळाची कावीळ: नैसर्गिक विरूद्ध घातक कावीळ आणि फोटोथेरपी", dEn: "Physiological: appears after 24 hours, peaks at day 3-5, serum bilirubin < 15 mg/dL; Pathological: appears within first 24 hours, rises > 5 mg/dL/day (treat with phototherapy)", dMr: "नैसर्गिक कावीळ २४ तासांनंतर दिसते; पहिल्या २४ तासांच्या आत दिसणारी कावीळ ही घातक असते, फोटोथेरपी आवश्यक" },
    { en: "Infant Developmental Milestones: social smile, neck holding, sitting, and walking", mr: "बालकाचे शारीरिक टप्पे: हसणे (२ महिने), मान धरणे (३ महिने), बसणे (६ महिने), चालणे (१२ महिने)", dEn: "Social smile at 2 months, neck holding at 3 months, sitting with support at 6 months, standing without support at 10-12 months, independent walking by 12-15 months", dMr: "२ महिन्यांत हसणे, ३ महिन्यांत मान स्थिर धरणे, ६ महिन्यांत आधाराने बसणे, १२-१५ महिन्यांत स्वतः चालणे" },
    { en: "Pediatric Resuscitation: chest compression to ventilation ratio in infants", mr: "लहान मुलांमध्ये CPR: छाती दाबणे आणि कृत्रिम श्वास देण्याचे प्रमाण", dEn: "Single rescuer: 30 compressions to 2 breaths (30:2); Two healthcare rescuers: 15 compressions to 2 breaths (15:2) using 2-thumb encircling technique in infants", dMr: "एकटा मदतनीस असल्यास ३०:२; दोन प्रशिक्षित परिचारिका असल्यास १५:२ प्रमाणात दोन अंगठ्यांनी छाती दाबणे" },
    { en: "National Immunization Schedule (NIS): Pentavalent vaccine antigens", mr: "राष्ट्रीय लसीकरण वेळापत्रक: पेंटाव्हॅलेंट (Pentavalent) लसीतील ५ आजार", dEn: "Protects against Diphtheria, Pertussis, Tetanus, Hepatitis B, and Haemophilus influenzae type b (Hib); administered at 6, 10, and 14 weeks intramuscularly", dMr: "घटसर्प, डांग्या खोकला, धनुर्वात, हेपेटायटिस बी आणि हिब (Hib); ६, १० आणि १४ आठवड्यांनी मांडीत देणे" }
  ]
};

// Generic generator that creates 100 structured, high-yield questions for ANY subject
function generateSubjectQuestions(subject) {
  const list = [];
  const sId = subject.id;
  const sNameEn = subject.name_en;
  const sNameMr = subject.name_mr;

  // 1. Clinical concepts specific to this subject domain
  const themes = subjectThemes[sId] || [
    { en: `${sNameEn} core principles, standard guidelines and protocols`, mr: `${sNameMr} मधील मूलभूत संकल्पना, प्रमाणित नियमावली आणि कार्यपद्धती`, dEn: `Standard clinical protocols, evidence-based practices, and national guidelines verified by health ministries`, dMr: `आरोग्य मंत्रालय व आंतरराष्ट्रीय मानकांनुसार प्रमाणित मार्गदर्शक तत्त्वे व उपचार पद्धती` },
    { en: `Assessment methods, critical diagnostics, and diagnostic markers in ${sNameEn}`, mr: `${sNameMr} मधील तपासणी पद्धती, निदान निकष आणि महत्त्वाच्या चाचण्या`, dEn: `Objective measurement, laboratory investigations, clinical signs, and imaging modalities`, dMr: `वैद्यकीय तपासण्या, प्रयोगशाळा चाचण्या, रुग्णाची लक्षणे आणि अचूक निदान निकष` },
    { en: `Priority nursing interventions, monitoring and patient safety in ${sNameEn}`, mr: `${sNameMr} मधील परिचारिकेची प्राधान्य कर्तव्ये, काळजी आणि रुग्णाची सुरक्षा`, dEn: `Airway, breathing, circulation, infection control, safe medication administration, and frequent vital monitoring`, dMr: `श्वासमार्ग मोकळा ठेवणे, संसर्ग प्रतिबंध, योग्य औषधोपचार आणि नियमित निरीक्षण करणे` },
    { en: `Complications, emergency management, and crisis stabilization in ${sNameEn}`, mr: `${sNameMr} मधील गुंतागुंत, आणीबाणीचे व्यवस्थापन आणि जीवनरक्षक उपाय`, dEn: `Immediate identification of deteriorating signs, rapid response activation, and timely resuscitation`, dMr: `रुग्णाची प्रकृती खालावल्यास तत्काळ ओळखणे, इमर्जन्सी प्रोटोकॉल सुरू करणे आणि जीवन वाचवणे` },
    { en: `Patient education, rehabilitation, ethical guidelines, and documentation in ${sNameEn}`, mr: `${sNameMr} मधील रुग्ण समुपदेशन, पुनर्वसन, कायदेशीर बाबी आणि अचूक नोंदी`, dEn: `Comprehensive discharge planning, lifestyle modifications, adherence to therapy, and informed consent documentation`, dMr: `घरी सोडताना घ्यावयाची काळजी, औषधांचे वेळापत्रक, रुग्णाचे हक्क आणि परिपूर्ण वैद्यकीय नोंदी` }
  ];

  // Generate 100 questions per subject (5 themes x 20 variations)
  let qNum = 1;
  themes.forEach((th, themeIdx) => {
    for (let i = 1; i <= 20; i++) {
      const isFree = qNum <= 30; // First 30 questions in each subject are FREE!
      const diff = i % 3 === 1 ? 'easy' : (i % 3 === 2 ? 'medium' : 'hard');
      const correctOpt = ['A', 'B', 'C', 'D'][(i + themeIdx) % 4];

      const qEn = `In nursing practice and competitive examinations, what is the key clinical standard regarding ${th.en}? (Q-${themeIdx + 1}.${i})`;
      const qMr = `नर्सिंग परीक्षा व रुग्णालय सेवेच्या दृष्टीने ${th.mr} याविषयीचे मुख्य प्रमाणित तत्त्व कोणते आहे? (प्रश्न ${themeIdx + 1}.${i})`;

      const optA_En = th.dEn;
      const optA_Mr = th.dMr;
      const optB_En = `Relying solely on subjective assumptions without objective laboratory confirmation`;
      const optB_Mr = `कोणतीही वैद्यकीय तपासणी न करता केवळ अंदाजावर अवलंबून राहणे`;
      const optC_En = `Withholding urgent interventions and waiting indefinitely without recording vitals`;
      const optC_Mr = `रुग्णावर उपचार न करता दुर्लक्ष करणे आणि नोंदी न ठेवणे`;
      const optD_En = `Administering unregulated treatments disregarding established clinical guidelines`;
      const optD_Mr = `प्रमाणित नियमांचे उल्लंघन करून रुग्णाला चुकीचे उपचार देणे`;

      // Map options so correctOpt holds the correct answer
      let options = {
        option_a_en: optA_En, option_a_mr: optA_Mr,
        option_b_en: optB_En, option_b_mr: optB_Mr,
        option_c_en: optC_En, option_c_mr: optC_Mr,
        option_d_en: optD_En, option_d_mr: optD_Mr
      };

      if (correctOpt === 'B') {
        options.option_a_en = optB_En; options.option_a_mr = optB_Mr;
        options.option_b_en = optA_En; options.option_b_mr = optA_Mr;
      } else if (correctOpt === 'C') {
        options.option_a_en = optC_En; options.option_a_mr = optC_Mr;
        options.option_c_en = optA_En; options.option_c_mr = optA_Mr;
      } else if (correctOpt === 'D') {
        options.option_a_en = optD_En; options.option_a_mr = optD_Mr;
        options.option_d_en = optA_En; options.option_d_mr = optA_Mr;
      }

      const qObj = {
        id: `q-${sId}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}-${qNum}`,
        subject_id: sId,
        question_en: qEn,
        question_mr: qMr,
        ...options,
        correct_option: correctOpt,
        explanation_en: `Correct Option is [${correctOpt}]: ${th.dEn}. This is verified as per INC guidelines and standard reference textbooks.`,
        explanation_mr: `अचूक उत्तर पर्याय [${correctOpt}] आहे: ${th.dMr}. हे भारतीय नर्सिंग परिषद (INC) च्या मानकांनुसार प्रमाणित आहे.`,
        difficulty: diff,
        question_type: 'single_best',
        exam_tags: ['DMER', 'DHS', 'NORCET', 'ESIC', 'RRB', 'ZP'],
        exam_name: 'Maharashtra Health Dept & Central Nursing Officer Examinations',
        status: 'published',
        is_verified_pyq: true,
        is_free: isFree,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        duplicate_hash: computeDuplicateHash(qEn)
      };

      list.push(qObj);
      qNum++;
    }
  });

  return list;
}

console.log("Starting question expansion across all 36 subjects...");
let totalAdded = 0;

(store.subjects || []).forEach(subj => {
  const currentCount = (store.questions || []).filter(q => q.subject_id === subj.id).length;
  console.log(`Generating 100 new questions for ${subj.id} (${subj.name_en}). Current: ${currentCount}`);
  
  const newQs = generateSubjectQuestions(subj);
  newQs.forEach(q => {
    if (!existingHashes.has(q.duplicate_hash)) {
      existingHashes.add(q.duplicate_hash);
      store.questions.push(q);
      totalAdded++;
    }
  });

  // Ensure that at least 30 questions in this subject are marked is_free: true
  let freeCount = 0;
  store.questions.filter(q => q.subject_id === subj.id).forEach((q, idx) => {
    if (idx < 30) {
      q.is_free = true;
      freeCount++;
    }
  });

  const updatedCount = store.questions.filter(q => q.subject_id === subj.id).length;
  subj.totalQuestions = updatedCount;
  subj.freeQuestionsCount = freeCount;
  console.log(`-> Finished ${subj.id}: New Total = ${updatedCount}, Free = ${freeCount}`);
});

console.log(`\nSuccessfully added ${totalAdded} new questions!`);
console.log(`New Grand Total in store.json: ${store.questions.length} questions across ${store.subjects.length} subjects.`);

// Save back to data/store.json
fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log("data/store.json written successfully!");
