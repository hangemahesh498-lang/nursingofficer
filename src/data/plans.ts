import { PaymentPlan } from '../types';

/**
 * SINGLE SOURCE OF TRUTH FOR ALL PRICING & SUBSCRIPTION PLANS
 * 
 * Razorpay Compliance Enforcements:
 * 1. Exact Original Pricing preserved (₹99, ₹149, ₹199).
 * 2. Explicit "(Inclusive of all taxes)" disclosure on all price displays.
 * 3. Clear validity duration visibility (e.g. 90 Days / 180 Days / 365 Days).
 * 4. "Instant Digital Access upon payment" fulfillment badge.
 */
export const DEFAULT_PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'plan-mcq-only',
    name: 'MCQ Practice Special Plan',
    name_mr: 'फक्त MCQs सराव प्लॅन',
    price: 99,
    currency: 'INR',
    duration_days: 90,
    duration_label: '90 Days (3 Months)',
    duration_label_mr: '९० दिवस (३ महिने अमर्यादित MCQ सराव)',
    is_active: true,
    plan_type: 'PRO_MCQ',
    tax_label: '(Inclusive of all taxes)',
    fulfillment_note: 'Instant Digital Access upon payment',
    features: [
      'Unlimited MCQ Practice (18 Core Nursing Subjects)',
      'Clinical Vignettes, ECG & Image-based Questions',
      'Marathi & English Explanations',
      'Mistake Notebook & Spaced Repetition'
    ],
    features_mr: [
      'सर्व १८ विषयांचे अमर्यादित सराव MCQs',
      'क्लिनिकल केसेस, ईसीजी व फोटो प्रश्नसंच',
      'मराठी व इंग्रजी सविस्तर स्पष्टीकरण',
      'चूक वही व स्वयंचलित उजळणी'
    ]
  },
  {
    id: 'plan-test-series-only',
    name: 'Full Mock Test Series Plan',
    name_mr: 'फक्त टेस्ट सिरीज प्लॅन',
    price: 149,
    currency: 'INR',
    duration_days: 180,
    duration_label: '180 Days (6 Months)',
    duration_label_mr: '१८० दिवस (६ महिने टेस्ट सिरीज पास)',
    is_active: true,
    popular: true,
    plan_type: 'TEST_SERIES',
    tax_label: '(Inclusive of all taxes)',
    fulfillment_note: 'Instant Digital Access upon payment',
    features: [
      '50+ Grand Mock Tests with 1/3 Negative Marking',
      'Timed Exam Environment & Auto-Submit Proctoring',
      'Verified Previous Year Papers (NORCET, ESIC, DMER, DHS)',
      'Instant Downloadable PDF Scorecards'
    ],
    features_mr: [
      '५०+ संपूर्ण मॉक टेस्ट्स (१/३ निगेटिव्ह मार्किंग)',
      'परीक्षेसारखा टाइमर व ऑटो-सबमिट सुविधा',
      'मागील वर्षांचे प्रमाणित प्रश्नपत्रिका संच',
      'पीडीएफ गुणपत्रिका डाऊनलोड सुविधा'
    ]
  },
  {
    id: 'plan-combo-pass',
    name: 'All-Access Combo Plan (MCQ + Test Series)',
    name_mr: 'MCQ + टेस्ट सिरीज कम्बो प्लॅन',
    price: 199,
    currency: 'INR',
    duration_days: 365,
    duration_label: '365 Days (1 Year)',
    duration_label_mr: '३६५ दिवस (१ वर्ष संपूर्ण कव्हरेज)',
    is_active: true,
    plan_type: 'COMBO',
    tax_label: '(Inclusive of all taxes)',
    fulfillment_note: 'Instant Digital Access upon payment',
    features: [
      'All 18 Subject MCQ Question Banks Included',
      'All 50+ Mock Test Series Pass Included',
      'AI Clinical Study Coach & Memory Mnemonics',
      'VIP Telegram Doubt & Verification Support'
    ],
    features_mr: [
      'सर्व १८ विषयांचे विषयवार सराव MCQs समाविष्ट',
      'सर्व ५०+ मॉक टेस्ट सिरीज पूर्ण प्रवेश',
      'एआय क्लिनिकल स्टडी कोच व मेमरी ट्रिक्स',
      'व्हीआयपी टेलिग्राम थेट शंका निरसन'
    ]
  }
];

export const SINGLE_MOCK_TEST_PRICE = {
  price: 29,
  currency: 'INR',
  tax_label: '(Inclusive of all taxes)',
  fulfillment_note: 'Instant Digital Access upon payment',
  label_en: 'Single Test Access',
  label_mr: 'एकच चाचणी प्रवेश'
};
