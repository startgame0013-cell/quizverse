import { io } from 'socket.io-client'
import { SOCKET_URL } from './api.js'

export function createSocket() {
  if (!SOCKET_URL) return null
  return io(SOCKET_URL, { transports: ['websocket', 'polling'], reconnection: true, reconnectionAttempts: 5 })
}
