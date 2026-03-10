/**
 * Browser notifications for live game events
 */
export function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission !== 'denied') {
    Notification.requestPermission()
  }
  return Notification.permission === 'granted'
}

export function notify(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  try {
    new Notification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      ...options,
    })
  } catch {}
}
