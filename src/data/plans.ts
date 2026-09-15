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
  { id:'plan-mcq-only', name:'MCQ Practice Plan', name_mr:'फक्त MCQ सराव प्लॅन', price:99, currency:'INR', duration_days:90, duration_label:'90 Days', duration_label_mr:'९० दिवस', is_active:true, plan_type:'PRO_MCQ', tax_label:'(Inclusive of all taxes)', fulfillment_note:'Instant digital access after successful payment', features:['Unlimited MCQ Practice','All Nursing Subjects','Marathi & English Explanations','Mistake Notebook'], features_mr:['अमर्यादित MCQ सराव','सर्व नर्सिंग विषय','मराठी व इंग्रजी स्पष्टीकरण','चूक वही'] },
  { id:'plan-test-series-only', name:'Test Series Plan', name_mr:'फक्त टेस्ट सिरीज प्लॅन', price:149, currency:'INR', duration_days:180, duration_label:'180 Days', duration_label_mr:'१८० दिवस', is_active:true, popular:true, plan_type:'TEST_SERIES', tax_label:'(Inclusive of all taxes)', fulfillment_note:'Instant digital access after successful payment', features:['50+ Grand Mock Tests','Timed Exam Environment','Verified PYQs','Scorecards'], features_mr:['५०+ मॉक टेस्ट','परीक्षेसारखा टाइमर','प्रमाणित PYQ','गुणपत्रिका'] },
  { id:'plan-youtube-only', name:'YouTube Video Access Plan', name_mr:'YouTube व्हिडिओ प्लॅन', price:99, currency:'INR', duration_days:90, duration_label:'90 Days', duration_label_mr:'९० दिवस', is_active:true, plan_type:'YOUTUBE', tax_label:'(Inclusive of all taxes)', fulfillment_note:'Instant digital access after successful payment', features:['Paid YouTube Lecture Library','Nursing Exam Video Classes','Access while plan is active'], features_mr:['पेड YouTube व्याख्यान लायब्ररी','नर्सिंग परीक्षा व्हिडिओ क्लासेस','प्लॅन सक्रिय असेपर्यंत प्रवेश'] },
  { id:'plan-combo-pass', name:'All Access Combo Plan', name_mr:'सर्व सुविधा कम्बो प्लॅन', price:199, currency:'INR', duration_days:365, duration_label:'365 Days', duration_label_mr:'३६५ दिवस', is_active:true, plan_type:'COMBO', tax_label:'(Inclusive of all taxes)', fulfillment_note:'Instant digital access after successful payment', features:['MCQ + Test Series + YouTube','AI Study Coach','All Core Nursing Content'], features_mr:['MCQ + टेस्ट सिरीज + YouTube','AI स्टडी कोच','सर्व मुख्य नर्सिंग कंटेंट'] },
];

export const SINGLE_MOCK_TEST_PRICE = {
  price: 29,
  currency: 'INR',
  tax_label: '(Inclusive of all taxes)',
  fulfillment_note: 'Instant Digital Access upon payment',
  label_en: 'Single Test Access',
  label_mr: 'एकच चाचणी प्रवेश'
};

export const SINGLE_YOUTUBE_VIDEO_PRICE = { price: 49, currency: 'INR', tax_label: '(Inclusive of all taxes)', fulfillment_note: 'Instant digital access after successful payment', label_en: 'Single Video Access', label_mr: 'एक व्हिडिओ प्रवेश' };
