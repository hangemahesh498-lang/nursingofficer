import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<string, { en: string; mr: string }> = {
  // Brand & Header
  appName: { en: 'Nursing Officer Exam Prep', mr: 'नर्सिंग ऑफिसर परीक्षा तयारी' },
  appTagline: { en: 'AIIMS NORCET • ESIC • RRB • State Nursing Recruitment', mr: 'एम्स NORCET • ESIC • रेल्वे • राज्य आरोग्य भरती' },
  dashboard: { en: 'Dashboard', mr: 'डॅशबोर्ड' },
  subjects: { en: 'Subjects', mr: 'विषय' },
  practice: { en: 'Practice Quiz', mr: 'सराव प्रश्नसंच' },
  mockTests: { en: 'Mock Tests', mr: 'मॉक टेस्ट्स' },
  cases: { en: 'Clinical Cases', mr: 'क्लिनिकल केसेस' },
  mistakes: { en: 'Mistake Notebook', mr: 'चूक वही (उजळणी)' },
  pyq: { en: 'PYQ Hub', mr: 'मागील वर्षांचे प्रश्न' },
  aiCoach: { en: 'AI Study Coach', mr: 'एआय अभ्यास मार्गदर्शक' },
  adminCms: { en: 'Admin CMS', mr: 'अ‍ॅडमिन पोर्टल' },

  // Metrics
  dailyTarget: { en: 'Daily Target', mr: 'दैनिक उद्दिष्ट' },
  questionsSolved: { en: 'Questions Solved', mr: 'सोडवलेले प्रश्न' },
  overallAccuracy: { en: 'Overall Accuracy', mr: 'एकूण अचूकता' },
  streak: { en: 'Day Streak', mr: 'सलग दिवस (Streak)' },
  studyPoints: { en: 'Study XP', mr: 'अभ्यास गुण' },
  weakSubjects: { en: 'Weak Subjects Detected', mr: 'अशक्त विषय (सुधारणा आवश्यक)' },
  dueForRevision: { en: 'Due for Spaced Revision', mr: 'आज उजळणीसाठी बाकी' },
  retestMistakes: { en: 'Retest Mistakes Now', mr: 'चुकांवर पुन्हा सराव करा' },

  // Buttons & Controls
  startTest: { en: 'Start Mock Test', mr: 'मॉक टेस्ट सुरू करा' },
  startPractice: { en: 'Start Practice', mr: 'सराव सुरू करा' },
  submit: { en: 'Submit Test', mr: 'टेस्ट जमा करा' },
  next: { en: 'Next Question', mr: 'पुढील प्रश्न' },
  previous: { en: 'Previous', mr: 'मागील' },
  markForReview: { en: 'Mark for Review', mr: 'पुनरावलोकनासाठी ठेवा' },
  clearResponse: { en: 'Clear Response', mr: 'उत्तर पुसा' },
  viewExplanation: { en: 'View Explanation', mr: 'वैद्यकीय स्पष्टीकरण पहा' },
  hideExplanation: { en: 'Hide Explanation', mr: 'स्पष्टीकरण लपवा' },
  bookmark: { en: 'Bookmark', mr: 'बुकमार्क करा' },
  reportQuestion: { en: 'Report Error', mr: 'त्रुटी नोंदवा' },
  askAiCoach: { en: 'Ask AI Coach', mr: 'एआय मार्गदर्शकाला विचारा' },

  // Question Types & Status
  singleBest: { en: 'Single Best Answer', mr: 'एकमेव योग्य उत्तर' },
  clinicalCase: { en: 'Clinical Case Scenario', mr: 'क्लिनिकल केस परिस्थिती' },
  verifiedPyq: { en: 'Verified Previous Year Question', mr: 'प्रमाणित मागील वर्षाचा प्रश्न' },
  easy: { en: 'Easy', mr: 'सोपा' },
  medium: { en: 'Medium', mr: 'मध्यम' },
  hard: { en: 'Hard / High Yield', mr: 'कठीण / उच्च प्राधान्य' },

  // Roles
  student: { en: 'Student Aspirant', mr: 'परीक्षार्थी (विद्यार्थी)' },
  contentEditor: { en: 'Content Editor', mr: 'कंटेंट एडिटर' },
  reviewer: { en: 'Subject Reviewer', mr: 'तज्ज्ञ परीक्षक' },
  admin: { en: 'Exam Administrator', mr: 'मुख्य प्रशासक' },
  superAdmin: { en: 'Super Admin', mr: 'सुपर अ‍ॅडमिन' }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('nursingprep_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nursingprep_lang', lang);
  };

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
