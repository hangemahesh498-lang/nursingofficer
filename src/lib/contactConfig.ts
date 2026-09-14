export interface ContactConfig {
  supportRepresentative: string;
  supportEmail: string;
  directTelegramUsername: string;
  directTelegramUrl: string;
  parentLegalEntity: string;
  operatingBrand: string;
  registeredOfficeAddress: string;
  showAddress: boolean;
  showPhone: boolean;
  supportPhone?: string;
  supportAvailability: string;
  grievanceOfficer: string;
  resolutionTimeline: string;
  reviewerNotice: string;
  legalOwnershipDisclaimer: string;
}

export const CONTACT_CONFIG: ContactConfig = {
  supportRepresentative: 'Vijay Gite',
  supportEmail: 'gitevijay123@gmail.com',
  directTelegramUsername: 'YOUR_TELEGRAM_USERNAME',
  directTelegramUrl: 'https://t.me/YOUR_TELEGRAM_USERNAME',
  parentLegalEntity: 'PRIME MULTI SERVICES AND SUPPLIERS',
  operatingBrand: 'Nursing Officer',
  registeredOfficeAddress: 'Main Road, Padali, Taluka Shirur (Kasar), District Beed, Maharashtra - 413249',
  showAddress: true,
  showPhone: false,
  supportPhone: '',
  supportAvailability: 'Telegram & Email Support (सोमवार ते शनिवार / Monday to Saturday)',
  grievanceOfficer: 'Vijay Gite',
  resolutionTimeline: '3 ते 7 कामकाजाचे दिवस (3 to 7 Business Days)',
  reviewerNotice: 'विद्यार्थी मदत, रिफंड किंवा तक्रारींसाठी थेट टेलिग्राम किंवा अधिकृत ईमेलवर संपर्क करा. सर्व तक्रारी व रिफंड ३ ते ७ कामकाजाच्या दिवसांत (3 to 7 business days) सोडवले जातात.',
  legalOwnershipDisclaimer: 'Nursing Officer is operated by PRIME MULTI SERVICES AND SUPPLIERS.'
};
