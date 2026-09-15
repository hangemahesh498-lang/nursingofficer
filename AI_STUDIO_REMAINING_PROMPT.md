# AI Studio — Final Remaining Configuration Prompt

या project मध्ये code-level सुधारणा आधीच केलेल्या आहेत. आता खालील production configuration आणि end-to-end testing **code न बदलता योग्य ठिकाणी पूर्ण करा**.

## 1. Razorpay — Production Safe Setup
- Razorpay Key ID आणि Key Secret फक्त server-side secrets/environment मध्ये ठेवा.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` configure करा.
- Razorpay dashboard मध्ये webhook तयार करा आणि signature verification सक्षम ठेवा.
- Payment success झाल्यावरच access activate करा.
- Failed / cancelled / pending / amount-mismatch payment वर कोणताही plan activate करू नका.
- Signature + Razorpay API payment status + order ID + amount + plan/item ID server-side verify करा.
- Duplicate payment ID पुन्हा process होऊ देऊ नका.
- Production mode मध्ये test keys वापरू नका.

## 2. Firebase Cloud Messaging
- `FIREBASE_SERVICE_ACCOUNT_JSON` server secret म्हणून configure करा.
- Firebase Console मधून Web Push certificate/VAPID public key घ्या आणि `FIREBASE_WEB_VAPID_KEY` मध्ये द्या.
- `public/firebase-messaging-sw.js` मधील Firebase web config placeholders actual Firebase config ने replace/compile करा.
- Browser notification permission flow test करा.
- Foreground आणि background notifications दोन्ही test करा.
- Android PWA/Capacitor build मध्ये notification permission आणि notification channel/default sound test करा.
- Notification आल्यावर default notification sound व vibration OS-level settings प्रमाणे चालली पाहिजे; web browsers custom sound स्वतःहून force करू शकत नाहीत.

## 3. Referral System
- Registration मधील optional Referral Code validate करा.
- Referrer → referred students mapping कायमस्वरूपी database मध्ये ठेवा.
- Admin Referral Leaderboard मध्ये rank, referral count आणि referred student list दाखवा.
- Reward tiers admin-editable करा. Default: 5=5 days, 10=7 days, 25=15 days, 50=30 days.
- Reward manually grant करण्यापूर्वी duplicate reward टाळण्यासाठी reward history ठेवा.

## 4. Plan Entitlements — अत्यंत महत्त्वाचे
Plans independent असावेत:
- MCQ Plan → फक्त MCQ access
- Test Series Plan → फक्त Test Series access
- YouTube Plan → paid YouTube library access
- Combo → MCQ + Test Series + YouTube
- Single Test → फक्त खरेदी केलेली test
- Single Video → फक्त खरेदी केलेला video
एका प्लॅनचे payment झाले म्हणून दुसऱ्या स्वतंत्र product ला चुकीने access मिळू नये.

## 5. Admin UI
- Students table responsive करा.
- Name, mobile, email, district, taluka/city, PIN, full address, referral code, plan/access badges, payment status, expiry आणि registration date दाखवा.
- Student detail drawer/modal मध्ये पूर्ण profile दाखवा.
- Search/filter/export working test करा.
- Bulk delete आणि single delete दोन्हीवर server-side admin authorization + deletion password `790916` लागू आहे हे verify करा.
- Admin/Super Admin कधीही student bulk-delete operation मधून delete होऊ नयेत.
- Registration accounts वर कोणतेही automatic 2-month deletion लागू करू नका.

## 6. Student Profile
- Profile photo optional ठेवा.
- Registration नंतर Profile → Edit मधून photo आणि editable profile fields बदलता यावेत.
- Profile मध्ये active plan(s), access type, start/end date, remaining days, referral code आणि referral count स्पष्ट दाखवा.

## 7. Payment UX
प्रत्येक product वेगळ्या card/section मध्ये दाखवा:
MCQ / Test Series / YouTube / Combo / Single Test / Single Video.

प्रत्येक checkout वर:
- Product name
- Final amount
- Taxes/inclusive pricing disclosure
- Validity/access details
- Razorpay checkout
- Success → verify → unlock
- Failed/cancelled → locked

## 8. Database
Production मध्ये JSON demo store ऐवजी persistent production database वापरा.
Migration मध्ये existing users/payments सुरक्षित राहिले पाहिजेत.
Referral, entitlement, FCM token आणि payment verification fields migrate करा.

## 9. Security
- Delete password client code मध्ये hard-code करून security control म्हणून वापरू नका; production मध्ये server environment secret वापरणे अधिक सुरक्षित आहे. Existing requested password `790916` सध्या compatibility requirement म्हणून आहे; production deployment आधी secret मध्ये हलवा.
- Razorpay Secret, Firebase service account आणि AI keys frontend bundle मध्ये जाऊ देऊ नका.
- Admin endpoints server-side authorization ने protect करा.
- User IDs फक्त client header वर विश्वास ठेवून authorization करू नका; production मध्ये Firebase ID token verify करून actor ठरवा.

## 10. Final Testing Checklist
खालील प्रत्येक case प्रत्यक्ष test करून report द्या:
1. Successful MCQ payment → MCQ only.
2. Successful Test Series payment → Test Series only.
3. Successful YouTube plan payment → YouTube only.
4. Successful Combo payment → all three.
5. Failed Razorpay payment → no access.
6. Cancelled Razorpay payment → no access.
7. Wrong signature → no access.
8. Wrong amount → no access.
9. Duplicate payment ID → no duplicate entitlement.
10. Single test payment → only selected test.
11. Single video payment → only selected video.
12. Referral registration → referrer count + leaderboard update.
13. 5/10/25/50 referral reward rules.
14. Student profile photo optional.
15. Student address visible in Admin.
16. Single and bulk deletion requires protected password.
17. Admin account cannot be deleted.
18. Existing student remains after 2 months.
19. Push foreground notification.
20. Push background notification with default sound/vibration where OS/browser permits.

## अंतिम नियम
या checklist मधील एखादी गोष्ट काम करत नसेल तर फक्त UI बदलू नका; root cause server/API/database level वर fix करा आणि पुन्हा build + test करा.
