export interface ClinicalTopicNote {
  id: string;
  keywords: string[];
  title_en: string;
  title_mr: string;
  category: 'formula' | 'mnemonic' | 'assessment' | 'pharmacology' | 'pediatrics' | 'obstetrics';
  content_en: string;
  content_mr: string;
  key_nursing_points_mr: string[];
}

export const CLINICAL_NOTES_DATABASE: ClinicalTopicNote[] = [
  {
    id: 'gcs',
    keywords: ['glasgow', 'coma', 'scale', 'gcs', 'eye', 'verbal', 'motor', 'neurological'],
    title_en: 'Glasgow Coma Scale (GCS) Assessment',
    title_mr: 'ग्लासगो कोमा स्केल (GCS Score) - मज्जासंस्था व मेंदू मूल्यमापन',
    category: 'assessment',
    content_en: `### Glasgow Coma Scale (GCS) Summary
The GCS is used to objectively evaluate a patient's level of consciousness following head injury or acute brain insult.

#### 1. Eye Opening Response (E - Max 4)
- **4**: Spontaneous eye opening
- **3**: To verbal command/sound
- **2**: To pressure / painful stimuli
- **1**: No eye opening

#### 2. Verbal Response (V - Max 5)
- **5**: Oriented & converses
- **4**: Confused conversation
- **3**: Inappropriate words
- **2**: Incomprehensible sounds (groaning)
- **1**: No verbal response

#### 3. Motor Response (M - Max 6)
- **6**: Obeys commands
- **5**: Localizes to pain
- **4**: Normal flexion (withdrawal from pain)
- **3**: Abnormal flexion (Decorticate posture)
- **2**: Extension (Decerebrate posture)
- **1**: No motor response

---
### Clinical Interpretation
- **15/15**: Fully conscious and oriented.
- **≤ 8/15**: Severe brain injury — **"GCS 8, Intubate!"** (Airway protection required).
- **3/15**: Deep coma or brain death (Minimum possible score).`,
    content_mr: `### ग्लासगो कोमा स्केल (GCS Score) संपूर्ण तक्ता
GCS द्वारे रुग्णाच्या मेंदूची आणि मज्जासंस्थेची जाणीव पातळी (Level of Consciousness) अचूक मोजली जाते.

#### १. डोळे उघडण्याची क्रिया (Eye Opening - कमाल ४ गुण)
- **४ (4)**: आपोआप डोळे उघडणे (Spontaneous)
- **३ (3)**: आवाजाला / हाकेला प्रतिसाद देऊन डोळे उघडणे
- **२ (2)**: वेदनेला (Pressure/Pain) प्रतिसाद म्हणून डोळे उघडणे
- **१ (1)**: कोणताही प्रतिसाद नाही

#### २. बोलण्याचा प्रतिसाद (Verbal Response - कमाल ५ गुण)
- **५ (5)**: पूर्ण शुद्धीवर व संवाद योग्य (Oriented)
- **४ (4)**: गोंधळलेला संवाद (Confused)
- **३ (3)**: असंबद्ध शब्द वापरणे (Inappropriate words)
- **२ (2)**: केवळ कण्हण्याचे आवाज (Incomprehensible sounds)
- **१ (1)**: कोणताही शब्द/आवाज नाही

#### ३. स्नायू हालचाल प्रतिसाद (Motor Response - कमाल ६ गुण)
- **६ (6)**: सांगितलेली हालचाल करणे (Obeys commands)
- **५ (5)**: वेदनेची जागा ओळखणे (Localizes pain)
- **४ (4)**: वेदनेपासून हात/पाय मागे घेणे (Withdrawal)
- **३ (3)**: असामान्य वाकणे - डीकॉर्टिकेट पोश्चर (Decorticate)
- **२ (2)**: स्नायू ताठ ताणणे - डीसेरेब्रेट पोश्चर (Decerebrate)
- **१ (1)**: कोणतीही हालचाल नाही

---
### महत्त्वाचे निष्कर्ष (Key Clinical Points)
- **एकूण सर्वोच्च गुण**: १५/१५ (पूर्ण शुद्धीवर)
- **GCS ≤ ८ असल्यास**: गंभीर दुखापत — **रुग्णाला तातडीने व्हेंटिलेटर/इन्ट्युबेशन आवश्यक असते!**
- **एकूण किमान गुण**: ३/३ (अतिगंभीर कोमा)`,
    key_nursing_points_mr: [
      'GCS स्कोर ८ किंवा त्यापेक्षा कमी असल्यास श्वसनमार्ग मोकळा ठेवण्यासाठी (Airway Intubation) त्वरित तयारी करा.',
      'Decorticate (३ गुण): हात छातीवर घट्ट मुडपणे. Decerebrate (२ गुण): हात बाहेरच्या बाजूला ताठ होणे - हे मेंदूच्या खोडाला (Brainstem) दुखापत दर्शवते.',
      'मद्यप्राशन किंवा भूल दिलेल्या रुग्णात GCS नोंदवताना स्पष्ट टीप लिहा.'
    ]
  },
  {
    id: 'parkland_burns',
    keywords: ['parkland', 'burns', 'formula', 'fluid', 'resuscitation', 'tbsa', 'lactated', 'ringers'],
    title_en: "Parkland Burns Fluid Resuscitation Formula & Rule of Nines",
    title_mr: 'पार्कसंड बर्न्स फ्लुइड फॉर्म्युला व रूल ऑफ नाईन्स (Rule of Nines)',
    category: 'formula',
    content_en: `### Parkland Formula for Fluid Resuscitation
Used to calculate 24-hour IV fluid requirement for burn patients using **Lactated Ringer's (LR)** solution.

$$\\text{Total 24-hr Fluid (mL)} = 4 \\text{ mL} \\times \\text{Weight (kg)} \\times \\% \\text{ TBSA Burned}$$

---
### Fluid Administration Schedule
1. **First 8 Hours**: Administer **50%** of total calculated volume (calculated from the **exact time of burn injury**, NOT hospital admission time).
2. **Next 16 Hours**: Administer remaining **50%** of total calculated volume.

---
### Rule of Nines (Adult TBSA Estimation)
- **Head & Neck**: 9% (Front 4.5%, Back 4.5%)
- **Anterior Trunk (Chest + Abdomen)**: 18%
- **Posterior Trunk (Back + Buttocks)**: 18%
- **Right Arm**: 9% (Front 4.5%, Back 4.5%)
- **Left Arm**: 9% (Front 4.5%, Back 4.5%)
- **Right Leg**: 18% (Front 9%, Back 9%)
- **Left Leg**: 18% (Front 9%, Back 9%)
- **Perineum/Genitalia**: 1%

---
### Calculation Example
- **Patient Weight**: 70 kg
- **TBSA Burned**: 40%
- **Calculation**: $4 \\times 70 \\times 40 = 11,200 \\text{ mL in 24 hours}$
  - **First 8 hrs**: $5,600 \\text{ mL}$ ($700 \\text{ mL/hr}$)
  - **Next 16 hrs**: $5,600 \\text{ mL}$ ($350 \\text{ mL/hr}$)`,
    content_mr: `### पार्कसंड बर्न्स फ्लुइड कॅल्क्युलेशन फॉर्म्युला
भाजलेल्या रुग्णासाठी २४ तासांत द्यावयाच्या **लॅक्टेटेड रिंगर्स (Lactated Ringer's - LR)** द्रवाचे प्रमाण ठरवणारा सूत्र:

$$\\text{एकूण २४ तासांचे द्रव (mL)} = ४ \\text{ mL} \\times \\text{रुग्णाचे वजन (kg)} \\times \\% \\text{ भाजलेला भाग (TBSA)}$$

---
### द्रव देण्याचे वेळापत्रक (Fluid Schedule)
१. **पहिल्या ८ तासांत**: एकूण काढलेल्या द्रवाच्या **५०% (अर्धा भाग)** द्रव द्या (हा वेळ रुग्ण हॉस्पिटलमध्ये आल्यापासून नसून **अपघात घडल्याच्या वेळेपासून** मोजला जातो).
२. **पुढील १६ तासांत**: उरलेला **५०% भाग** द्रव द्या.

---
### रूल ऑफ नाईन्स (Rule of Nines - भाजलेल्या भागाची टक्केवारी)
- **डोके व मान**: ९% (पुढे ४.५%, मागे ४.५%)
- **छाती व पोट (पुढचा भाग)**: १८%
- **पाठ व मांड्या (मागचा भाग)**: १८%
- **उजवा हात**: ९% (पुढे ४.५%, मागे ४.५%)
- **डावा हात**: ९% (पुढे ४.५%, मागे ४.५%)
- **उजवा पाय**: १८% (पुढे ९%, मागे ९%)
- **डावा पाय**: १८% (पुढे ९%, मागे ९%)
- **जननेंद्रिय भाग (Perineum)**: १%

---
### प्रात्यक्षिक उदाहरण
- **वजन**: ७० किलो | **भाजलेला भाग**: ४०%
- **फॉर्म्युला**: ४ × ७० × ४० = **११,२०० mL (२४ तासांत)**
  - **पहिल्या ८ तासांत**: ५,६०० mL (दर तासाला ७०० mL)
  - **पुढील १६ तासांत**: ५,६०० mL (दर तासाला ३५० mL)`,
    key_nursing_points_mr: [
      'बर्न्समध्ये फक्त २रा आणि ३रा डिग्री डाग मोजावेत. पहिल्या डिग्रीचे (Superficial sunburn) भाग TBSA मध्ये मोजू नका.',
      'बर्न्स पेशंटमध्ये युरिन आऊटपुट किमान 0.5 to 1 mL/kg/hr (अंदाजे 30-50 mL/hr) असणे आवश्यक आहे.',
      'निवडलेले द्रव नेहमी लॅक्टेटेड रिंगर्स (LR) असावे, कारण ते प्लाझ्मा इलेक्ट्रोलाईटशी जुळणारे असते.'
    ]
  },
  {
    id: 'digoxin_toxicity',
    keywords: ['digoxin', 'lanoxin', 'toxicity', 'halos', 'bradycardia', 'potassium', 'apical', 'pulse'],
    title_en: 'Digoxin Toxicity & Critical Nursing Care',
    title_mr: 'डायजॉक्सिन विषबाधा (Digoxin Toxicity) व नर्सिंग काळजी',
    category: 'pharmacology',
    content_en: `### Digoxin Overview
Cardiac glycoside used in heart failure and atrial fibrillation to increase myocardial contractility and slow AV node conduction.

---
### Therapeutic Window & Toxicity
- **Therapeutic Blood Level**: **0.5 to 2.0 ng/mL**
- **Toxic Blood Level**: **> 2.0 ng/mL**

---
### Signs & Symptoms of Toxicity
1. **Gastrointestinal (Earliest Signs)**: Anorexia, severe nausea, vomiting, abdominal pain.
2. **Visual Disturbances (Classic Hallmark)**: **Yellow-green halos** around lights, blurred vision, double vision.
3. **Cardiovascular (Life-threatening)**: Bradycardia (HR < 60 bpm), ventricular dysrhythmias, AV blocks.
4. **Neurological**: Fatigue, confusion, headache, dizziness.

---
### Critical Nursing Interventions
- **Apical Pulse Check**: Measure apical pulse for **1 full minute** prior to administration.
  - **HOLD dose** if apical pulse is **< 60 bpm in adults**, **< 70 in children**, or **< 90 in infants**.
- **Potassium Correlation**: **Hypokalemia (< 3.5 mEq/L)** greatly increases the risk of digoxin toxicity! Always monitor serum potassium levels.
- **Antidote**: **Digoxin Immune Fab (Digibind / DigiFab)**.`,
    content_mr: `### डायजॉक्सिन (Digoxin) औषधाची माहिती
हे कार्डियाक ग्लायकोसाईड गटातील औषध असून हृदय अपयशी (Heart Failure) आणि ॲट्रियल फिब्रिलेशनमध्ये हृदयाची आकुंचन क्षमता वाढवण्यासाठी दिले जाते.

---
### सुरक्षित पातळी आणि विषबाधा मर्यादा
- **सुरक्षित रक्तातील पातळी (Therapeutic Level)**: **०.५ ते २.० ng/mL**
- **विषबाधा पातळी (Toxic Level)**: **२.० ng/mL पेक्षा जास्त**

---
### विषबाधेची लक्षणे (Signs & Symptoms)
१. **पचनसंस्थेची लक्षणे (सर्वप्रथम दिसणारी लक्षणे)**: भूक न लागणे (Anorexia), उलट्या होणे, मळमळ.
२. **दृष्टीची लक्षणे (खास वैशिष्ट्यपूर्ण)**: **दिव्यांभोवती पिवळी-हिरवी वलये (Yellow-Green Halos) दिसणे**, अंधूक दिसणे.
३. **हृदयाची लक्षणे**: हृदयाचे ठोके खूप मंदावणे (Bradycardia < ६०/मिनिट), अनियमित ठोके (Arrhythmia).
४. **मज्जासंस्था**: अत्यंत थकवा, चक्कर येणे, गोंधळ.

---
### अत्यावश्यक नर्सिंग काळजी (Critical Nursing Actions)
- **नाडी तपासणी (Apical Pulse)**: औषध देण्यापूर्वी **१ पूर्ण मिनिट छातीवर स्टेथॉस्कोप ठेवून (Apical Pulse) ठोके मोजा**.
  - **ठोके ६० पेक्षा कमी (Adult HR < 60 bpm) असल्यास औषध थांबवा (HOLD dose)** आणि डॉक्टरांना कळवा.
- **पोटॅशियम पातळी (Hypokalemia Risk)**: रक्तातील पोटॅशियम कमी झाल्यास (Hypokalemia < 3.5) डायजॉक्सिन विषबाधेचा धोका अनेक पटींनी वाढतो!
- **विषबाधेवरील उपाय (Antidote)**: **डायजॉक्सिन इम्यून फॅब (Digibind / DigiFab)**.`,
    key_nursing_points_mr: [
      'औषध देण्यापूर्वी १ मिनिट Apical Pulse मोजणे हे अनिवार्य कर्तव्य आहे.',
      'दिव्यांभोवती पिवळी-हिरवी रिंग दिसणे (Yellow-green halos) हे परीक्षांमध्ये वारंवार विचारले जाणारे चिन्ह आहे.',
      'लॅसिक्स (Furosemide) सोबत डायजॉक्सिन सुरु असल्यास पोटॅशियम कमी होण्याची दाट शक्यता असते.'
    ]
  },
  {
    id: 'apgar_score',
    keywords: ['apgar', 'score', 'newborn', 'neonatal', 'appearance', 'pulse', 'grimace', 'activity', 'respiration'],
    title_en: 'APGAR Score Newborn Assessment',
    title_mr: 'ॲपगार स्कोर (APGAR Score) नवजात बालक मूल्यमापन',
    category: 'assessment',
    content_en: `### APGAR Scoring System
Evaluated at **1 minute** and **5 minutes** after birth to assess neonatal transition to extrauterine life.

| Parameter | Score 0 | Score 1 | Score 2 |
|---|---|---|---|
| **A**ppearance (Color) | Blue, pale all over | Body pink, extremities blue (Acrocyanosis) | Completely pink |
| **P**ulse (Heart Rate) | Absent | < 100 beats/min | ≥ 100 beats/min |
| **G**rimace (Reflexes) | No response to suction | Grimace / weak cry | Vigorous cry, cough/sneeze |
| **A**ctivity (Muscle Tone) | Flaccid, limp | Some flexion of arms/legs | Active movement, well flexed |
| **R**espiration (Effort) | Absent (Apnea) | Slow, irregular, shallow | Strong, lusty cry |

---
### Clinical Score Interpretation
- **7 to 10**: Normal / Excellent condition. Standard newborn care.
- **4 to 6**: Moderately depressed. Needs tactile stimulation and oxygen.
- **0 to 3**: Severely depressed. Immediate resuscitation & CPR required!`,
    content_mr: `### ॲपगार स्कोर (APGAR Score) तक्ता
बाळाच्या जन्मानंतर **१ मिनिटाने** आणि **५ मिनिटांनी** बाळाच्या आरोग्याची तपासणी करण्यासाठी APGAR स्केल वापरतात.

| घटक (Parameter) | ० गुण (0) | १ गुण (1) | २ गुण (2) |
|---|---|---|---|
| **A**ppearance (त्वचेचा रंग) | संपूर्ण निळा किंवा पांढरा | शरीर गुलाबी, हात-पाय निळे (Acrocyanosis) | संपूर्ण शरीर गुलाबी |
| **P**ulse (हृदयाचे ठोके) | ठोके नाहीत (Absent) | १०० पेक्षा कमी ( < 100 bpm) | १०० किंवा जास्त ( ≥ 100 bpm) |
| **G**rimace (प्रतिसाद) | कोणताही प्रतिसाद नाही | चेहरा वेडावाकडा करणे / हळू रडणे | जोरात रडणे, शिंकणे, खोकणे |
| **A**ctivity (स्नायूंची ताकद) | बाळ सैल पडलेले (Flaccid) | हात-पाय थोडे वाकवलेले | खूप हालचाल, हात-पाय दुमडलेले |
| **R**espiration (श्वासोच्छ्वास) | श्वास बंद (Apnea) | मंद, अनियमित श्वास | मोकळ्या ढाकळ्या आवाजात जोरात रडणे |

---
### स्कोरनुसार वर्गीकरण
- **७ ते १०**: बाळ उत्तम स्थितीत आहे. नेहमीप्रमाणे काळजी घ्या.
- **४ ते ६**: मध्यम स्वरूपाचा त्रास. ऑक्सिजन व त्वचा चोळणे (Stimulation) आवश्यक.
- **० ते ३**: अत्यंत गंभीर अवस्था. तातडीने पुनरुज्जीवन (CPR & Resuscitation) सुरू करा!`,
    key_nursing_points_mr: [
      'हात-पाय निळे आणि शरीर गुलाबी असणे (Acrocyanosis) हे जन्मानंतर पहिल्या २४ तासांत सामान्य मानले जाते (१ गुण).',
      'स्कोर ७ पेक्षा कमी आल्यास दर ५ मिनिटांनी एकूण २० मिनिटांपर्यंत APGAR स्कोर पुन्हा मोजावा.'
    ]
  },
  {
    id: 'cranial_nerves',
    keywords: ['cranial', 'nerves', 'mnemonic', 'olfactory', 'optic', 'oculomotor', 'trochlear', 'trigeminal', 'abducens', 'facial', 'vagus'],
    title_en: '12 Cranial Nerves Mnemonic & Functions',
    title_mr: '१२ क्रेनिअल नर्व्ह्ज (Cranial Nerves) व स्मरण सूत्र (Mnemonic)',
    category: 'mnemonic',
    content_en: `### 12 Cranial Nerves Mnemonic
> **"On Old Olympus' Towering Tops A Finn And German Viewed Some Hops"**

| Nerve | Name | Type | Key Function |
|---|---|---|---|
| **CN I** | Olfactory | Sensory | Smell |
| **CN II** | Optic | Sensory | Vision & Visual Acuity |
| **CN III** | Oculomotor | Motor | Eye movement, Pupil constriction |
| **CN IV** | Trochlear | Motor | Downward & inward eye movement |
| **CN V** | Trigeminal | Both | Facial sensation, Mastication (chewing) |
| **CN VI** | Abducens | Motor | Lateral eye movement (abduction) |
| **CN VII** | Facial | Both | Facial expressions, Taste anterior 2/3 tongue |
| **CN VIII** | Vestibulocochlear | Sensory | Hearing & Balance |
| **CN IX** | Glossopharyngeal | Both | Swallowing, Gag reflex, Taste posterior 1/3 |
| **CN X** | Vagus | Both | Gag reflex, Heart rate, Digestion |
| **CN XI** | Accessory | Motor | Shoulder shrug (Trapezius), Head turn |
| **CN XII** | Hypoglossal | Motor | Tongue movement |

---
### Type Mnemonic (Sensory, Motor, Both)
> **"Some Say Marry Money But My Brother Says Big Brains Matter More"**
*(S = Sensory, M = Motor, B = Both)*`,
    content_mr: `### १२ क्रेनिअल नर्व्ह्ज स्मरण सूत्र (Mnemonic)
> **Mnemonic Sequence**: *"On Old Olympus' Towering Tops A Finn And German Viewed Some Hops"*

| मज्जातंतू (CN) | नाव (Name) | प्रकार (Type) | मुख्य कार्य (Function) |
|---|---|---|---|
| **CN I** | Olfactory | ज्ञानेंद्रिय (Sensory) | वासाची जाणीव (Smell) |
| **CN II** | Optic | ज्ञानेंद्रिय (Sensory) | दृष्टी व नजर (Vision) |
| **CN III** | Oculomotor | संवेदक (Motor) | डोळ्यांची हालचाल व बाहुलीचे लहान होणे |
| **CN IV** | Trochlear | संवेदक (Motor) | डोळ्याची खाली-आत हालचाल |
| **CN V** | Trigeminal | दोन्ही (Both) | चेहऱ्याची जाणीव व घास चावणे (Mastication) |
| **CN VI** | Abducens | संवेदक (Motor) | डोळ्याची तिरपी बाजूला हालचाल |
| **CN VII** | Facial | दोन्ही (Both) | चेहऱ्याचे भाव, जिभेच्या पुढील २/३ भागाची चव |
| **CN VIII** | Vestibulocochlear | ज्ञानेंद्रिय (Sensory) | ऐकणे (Hearing) व शरीराचा समतोल (Balance) |
| **CN IX** | Glossopharyngeal | दोन्ही (Both) | गिळणे, गॅग रिफ्लेक्स, जिभेच्या मागच्या १/३ ची चव |
| **CN X** | Vagus | दोन्ही (Both) | हृदयगती नियंत्रण, पचनसंस्था व गॅग रिफ्लेक्स |
| **CN XI** | Accessory | संवेदक (Motor) | खांदे उडवणे (Shoulder shrug) व मान वळवणे |
| **CN XII** | Hypoglossal | संवेदक (Motor) | जिभेची हालचाल (Tongue movement) |

---
### प्रकार ओळखणारे सूत्र (Sensory/Motor/Both)
> **"Some Say Marry Money But My Brother Says Big Brains Matter More"**
*(S = Sensory/ज्ञानेंद्रिय, M = Motor/संवेदक, B = Both/दोन्ही)*`,
    key_nursing_points_mr: [
      'CN VII (Facial Nerve) चे नुकसान झाल्यास बेलचा अर्धांगवायू (Bell’s Palsy) होतो.',
      'CN IX व CN X तपासून पाहण्यासाठी गॅग रिफ्लेक्स (Gag Reflex) तपासला जातो.'
    ]
  },
  {
    id: 'abg_analysis',
    keywords: ['abg', 'arterial', 'blood', 'gas', 'ph', 'paco2', 'hco3', 'acidosis', 'alkalosis', 'rome'],
    title_en: 'Arterial Blood Gas (ABG) Analysis & ROME Method',
    title_mr: 'एबीजी विश्लेषण (ABG Analysis) व ROME पद्धत',
    category: 'formula',
    content_en: `### Normal ABG Values
- **pH**: 7.35 – 7.45 (Below 7.35 = Acidosis | Above 7.45 = Alkalosis)
- **PaCO2**: 35 – 45 mmHg (Respiratory parameter)
- **HCO3**: 22 – 26 mEq/L (Metabolic parameter)
- **PaO2**: 80 – 100 mmHg

---
### ROME Mnemonic
- **R**espiratory **O**pposite:
  - pH ↑ & PaCO2 ↓ = **Respiratory Alkalosis** (Hyperventilation)
  - pH ↓ & PaCO2 ↑ = **Respiratory Acidosis** (COPD, Hypoventilation)
- **M**etabolic **E**qual:
  - pH ↑ & HCO3 ↑ = **Metabolic Alkalosis** (Vomiting, Nasogastric suctioning)
  - pH ↓ & HCO3 ↓ = **Metabolic Acidosis** (Diabetic Ketoacidosis, Severe Diarrhea)`,
    content_mr: `### नेहमीची ABG प्रमाण मूल्ये (Normal Values)
- **pH**: ७.३५ ते ७.४५ (७.३५ पेक्षा कमी = ॲसिडोसिस | ७.४५ पेक्षा जास्त = अल्कॅलोसिस)
- **PaCO2**: ३५ ते ४५ mmHg (श्वसनसंस्था घटक)
- **HCO3**: २२ ते २६ mEq/L (चयापचय घटक)
- **PaO2**: ८० ते १०० mmHg

---
### ROME फॉर्म्युला (योग्य निदान करण्याची सोपी पद्धत)
- **R**espiratory **O**pposite (विरुद्ध दिशा):
  - pH ↑ आणि PaCO2 ↓ = **रेस्पिरेटरी अल्कॅलोसिस** (भरभर श्वास घेणे)
  - pH ↓ आणि PaCO2 ↑ = **रेस्पिरेटरी ॲसिडोसिस** (दमा/COPD/मंद श्वास)
- **M**etabolic **E**qual (समान दिशा):
  - pH ↑ आणि HCO3 ↑ = **मेटाबॉलिक अल्कॅलोसिस** (अति उलट्या होणे)
  - pH ↓ आणि HCO3 ↓ = **मेटाबॉलिक ॲसिडोसिस** (डायबेटिक कीटोॲसिडोसिस / अतिसार)`,
    key_nursing_points_mr: [
      'ॲलन टेस्ट (Allen Test) ही ABG सॅम्पल रेडिअल आर्टरीमधून काढण्यापूर्वी करणे अनिवार्य असते.',
      'DKA मध्ये Kussmaul breathing दिसते जी मेटाबॉलिक ॲसिडोसिस दुरुस्त करण्याचा शरीराचा प्रयत्न असतो.'
    ]
  }
];

export function findMatchingClinicalNote(query: string): ClinicalTopicNote | null {
  if (!query || !query.trim()) return null;
  const q = query.toLowerCase().trim();
  
  // Exact or keyword match
  const found = CLINICAL_NOTES_DATABASE.find(note => {
    return note.id.toLowerCase() === q ||
      note.keywords.some(kw => q.includes(kw.toLowerCase())) ||
      note.title_en.toLowerCase().includes(q) ||
      note.title_mr.toLowerCase().includes(q);
  });

  return found || null;
}
