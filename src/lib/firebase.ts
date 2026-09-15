import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app: any = null;
let authInstance: any = null;
let googleProviderInstance: any = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  authInstance = getAuth(app);
  googleProviderInstance = new GoogleAuthProvider();
} catch (e) {
  console.error('Firebase initialization error in WebView/APK:', e);
}

export const auth = authInstance;
export const googleAuthProvider = googleProviderInstance;
