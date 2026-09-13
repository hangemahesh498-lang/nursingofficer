// Persistent per-mobile device identity used for single-device login lock.
// The id is generated once and stored in localStorage, so it survives app
// restarts but is unique to *this* phone/browser install — a friend using
// their own phone will always get a different id.

const DEVICE_ID_KEY = 'nursingprep_device_id';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for older WebViews
  return 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode, etc.) - fall back to a per-session id
    return generateId();
  }
}

export function getDeviceName(): string {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let platform = 'Device';
  if (/android/i.test(ua)) platform = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) platform = 'iPhone/iPad';
  else if (/windows/i.test(ua)) platform = 'Windows';
  else if (/macintosh/i.test(ua)) platform = 'Mac';
  else if (/linux/i.test(ua)) platform = 'Linux';

  let browser = 'Browser';
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/edg/i.test(ua)) browser = 'Edge';

  return `${platform} • ${browser}`;
}
