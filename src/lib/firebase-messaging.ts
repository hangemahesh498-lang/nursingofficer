import { getMessaging, getToken, onMessage, isSupported, type MessagePayload } from 'firebase/messaging';
import { auth } from './firebase';

export async function registerForPushNotifications(vapidKey?: string): Promise<string | null> {
  if (!vapidKey || typeof window === 'undefined' || !('Notification' in window)) return null;
  if (!(await isSupported())) return null;
  const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
  if (permission !== 'granted') return null;
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const messaging = getMessaging();
  return getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
}

export async function listenForForegroundPush(handler: (payload: MessagePayload) => void) {
  if (!(await isSupported())) return () => {};
  return onMessage(getMessaging(), handler);
}
