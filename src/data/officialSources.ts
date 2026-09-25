export interface OfficialSource {
  id: string;
  organization: string;
  organization_mr: string;
  category: string;
  website_url: string;
  description: string;
  description_mr: string;
  last_verified: string;
}

export const OFFICIAL_GOVERNMENT_SOURCES: OfficialSource[] = [
  {
    id: 'aiims',
    organization: 'AIIMS Examination Section (NORCET)',
    organization_mr: 'एम्स परीक्षा विभाग (NORCET)',
    category: 'Central Institute',
    website_url: 'https://www.aiimsexams.ac.in/',
    description: 'Official examination portal for Nursing Officer Recruitment Common Eligibility Test (NORCET).',
    description_mr: 'नर्सिंग ऑफिसर भरती परीक्षेचे (NORCET) अधिकृत परीक्षा पोर्टल.',
    last_verified: '2026-09-24'
  },
  {
    id: 'esic',
    organization: "Employees' State Insurance Corporation (ESIC)",
    organization_mr: 'कर्मचारी राज्य विमा महामंडळ (ESIC)',
    category: 'Central Corporation',
    website_url: 'https://www.esic.gov.in/',
    description: 'Official portal for ESIC Nursing Officer and paramedical recruitment notifications and syllabi.',
    description_mr: 'ESIC नर्सिंग ऑफिसर व पॅरामेडिकल भरती सूचना आणि अभ्यासक्रमाचे अधिकृत पोर्टल.',
    last_verified: '2026-09-24'
  },
  {
    id: 'rrb',
    organization: 'Railway Recruitment Boards (RRB Central)',
    organization_mr: 'रेल्वे भरती नियंत्रण मंडळ (RRB)',
    category: 'Central Railway Recruitment',
    website_url: 'https://www.rrcb.gov.in/',
    description: 'Official Railway Recruitment Control Board reference portal for paramedical and nursing staff categories.',
    description_mr: 'रेल्वे भरती नियंत्रण मंडळाचे पॅरामेडिकल व नर्सिंग संवर्ग परीक्षा अधिकृत पोर्टल.',
    last_verified: '2026-09-24'
  },
  {
    id: 'dmer-maha',
    organization: 'DMER Maharashtra (Medical Education & Research)',
    organization_mr: 'वैद्यकीय शिक्षण व संशोधन संचालनालय महाराष्ट्र शासन',
    category: 'State Directorate',
    website_url: 'https://dmer.maharashtra.gov.in/',
    description: 'Official website of Directorate of Medical Education and Research, Government of Maharashtra.',
    description_mr: 'वैद्यकीय शिक्षण आणि संशोधन संचालनालय, महाराष्ट्र शासनाचे अधिकृत संकेतस्थळ.',
    last_verified: '2026-09-24'
  },
  {
    id: 'phd-maha',
    organization: 'Maharashtra Public Health Department (PHD)',
    organization_mr: 'सार्वजनिक आरोग्य विभाग महाराष्ट्र शासन',
    category: 'State Department',
    website_url: 'https://phd.maharashtra.gov.in/',
    description: 'Official portal of Public Health Department, Government of Maharashtra.',
    description_mr: 'सार्वजनिक आरोग्य विभाग, महाराष्ट्र शासनाचे अधिकृत संकेतस्थळ.',
    last_verified: '2026-09-24'
  },
  {
    id: 'nhm',
    organization: 'National Health Mission (NHM)',
    organization_mr: 'राष्ट्रीय आरोग्य अभियान (NHM)',
    category: 'National Mission',
    website_url: 'https://nhm.gov.in/',
    description: 'Official portal of Ministry of Health and Family Welfare for NHM and Community Health Officer (CHO) updates.',
    description_mr: 'केंद्रीय आरोग्य व कुटुंब कल्याण मंत्रालय अंतर्गत राष्ट्रीय आरोग्य अभियानाचे अधिकृत पोर्टल.',
    last_verified: '2026-09-24'
  },
  {
    id: 'inc',
    organization: 'Indian Nursing Council (INC)',
    organization_mr: 'भारतीय परिचारिका परिषद (INC)',
    category: 'Statutory Body',
    website_url: 'https://indiannursingcouncil.org/',
    description: 'Official statutory body establishing uniform standards of nursing education in India.',
    description_mr: 'भारतातील नर्सिंग शिक्षणाचे राष्ट्रीय नियमन करणारी अधिकृत वैधानिक परिषद.',
    last_verified: '2026-09-24'
  },
  {
    id: 'dsssb',
    organization: 'Delhi Subordinate Services Selection Board (DSSSB)',
    organization_mr: 'दिल्ली दुय्यम सेवा निवड मंडळ (DSSSB)',
    category: 'UT Recruitment Board',
    website_url: 'https://dsssb.delhi.gov.in/',
    description: 'Official recruitment authority for Nursing Officer posts in Government of NCT of Delhi hospitals.',
    description_mr: 'दिल्ली शासनाच्या रुग्णालयांमधील नर्सिंग ऑफिसर पदांसाठीचे अधिकृत भरती मंडळ.',
    last_verified: '2026-09-24'
  },
  {
    id: 'pgimer',
    organization: 'PGIMER Chandigarh',
    organization_mr: 'पीजीआयएमईआर चंदीगड',
    category: 'Autonomous Institute',
    website_url: 'https://www.pgimer.edu.in/',
    description: 'Postgraduate Institute of Medical Education & Research official examination portal.',
    description_mr: 'पीजीआयएमईआर चंदीगडचे अधिकृत परीक्षा व पदभरती पोर्टल.',
    last_verified: '2026-09-24'
  },
  {
    id: 'nimhans',
    organization: 'NIMHANS Bengaluru',
    organization_mr: 'निमहान्स बंगळुरू',
    category: 'Autonomous Institute',
    website_url: 'https://www.nimhans.ac.in/',
    description: 'National Institute of Mental Health and Neurosciences official recruitment and exam portal.',
    description_mr: 'राष्ट्रीय मानसिक आरोग्य आणि मज्जाविज्ञान संस्था बंगळुरू अधिकृत पोर्टल.',
    last_verified: '2026-09-24'
  }
];

export const OFFICIAL_APP_DISCLAIMER_EN = `DISCLAIMER:
Nursing Officer: BY MH is an independent educational application for nursing exam preparation. It is NOT a government application and is NOT affiliated with, endorsed by, sponsored by, or officially connected with any government department, recruitment board, examination authority, hospital, institute, or public authority.

Official government information, notifications, recruitment details, eligibility requirements, dates and application procedures should always be verified directly from the relevant official government website.

Official Sources:
AIIMS Examinations: https://www.aiimsexams.ac.in/
ESIC: https://www.esic.gov.in/
Railway Recruitment Boards: https://www.rrcb.gov.in/
DMER Maharashtra: https://dmer.maharashtra.gov.in/
Maharashtra Public Health Department: https://phd.maharashtra.gov.in/
National Health Mission: https://nhm.gov.in/
Indian Nursing Council: https://indiannursingcouncil.org/
DSSSB: https://dsssb.delhi.gov.in/
PGIMER Chandigarh: https://www.pgimer.edu.in/
NIMHANS Bengaluru: https://www.nimhans.ac.in/

These links are provided only as references to official sources. The app does not represent or provide government services.`;

export const OFFICIAL_APP_DISCLAIMER_MR = `अस्वीकरण (DISCLAIMER):
'Nursing Officer: BY MH' हे नर्सिंग परीक्षांच्या तयारीसाठी विकसित केलेले एक स्वतंत्र खाजगी शैक्षणिक ॲप्लिकेशन आहे. हे कोणतेही शासकीय ॲप्लिकेशन नसून, याचा कोणत्याही शासकीय विभागाशी, भरती मंडळाशी, परीक्षा प्राधिकरणाशी, शासकीय रुग्णालयाशी किंवा संस्थेशी कोणताही थेट संबंध, संलग्नता, प्रायोजकत्व किंवा अधिकृत मान्यता नाही.

अधिकृत शासकीय माहिती, भरती जाहिराती, पात्रता अटी, परीक्षा तारखा आणि अर्ज करण्याची पद्धत यासाठी विद्यार्थ्यांनी नेहमी संबंधित अधिकृत शासकीय संकेतस्थळावरूनच थेट पडताळणी करावी.

अधिकृत माहिती स्रोत (Official Sources):
एम्स परीक्षा (AIIMS NORCET): https://www.aiimsexams.ac.in/
ईएसआयसी (ESIC): https://www.esic.gov.in/
रेल्वे भरती मंडळ (RRB): https://www.rrcb.gov.in/
डीएमईआर महाराष्ट्र (DMER): https://dmer.maharashtra.gov.in/
सार्वजनिक आरोग्य विभाग महाराष्ट्र: https://phd.maharashtra.gov.in/
राष्ट्रीय आरोग्य अभियान (NHM): https://nhm.gov.in/
भारतीय परिचारिका परिषद (INC): https://indiannursingcouncil.org/
डीएसएसएसबी (DSSSB Delhi): https://dsssb.delhi.gov.in/
पीजीआयएमईआर चंदीगड (PGIMER): https://www.pgimer.edu.in/
निमहान्स बंगळुरू (NIMHANS): https://www.nimhans.ac.in/

हे संकेतस्थळ दुवे केवळ अधिकृत माहितीच्या संदर्भासाठी दिले आहेत. हे ॲप शासकीय सेवा किंवा अर्ज प्रक्रिया पुरवत नाही.`;
