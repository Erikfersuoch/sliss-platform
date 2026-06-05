import { urlBase64ToUint8Array } from "./helpers.js";

const subscribeToPush = async () => {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return false;
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return false;
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  const sub = existing || await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
  });
  const tester = new URLSearchParams(window.location.search).get('tester') || localStorage.getItem('sliss-tester') || 'unknown';
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub.toJSON(), tester })
  });
  return true;
};

export { subscribeToPush };
