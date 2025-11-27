// API configuration
// Automatically detects the backend URL based on the current hostname
const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // In development, check if we're accessing from network (not localhost)
  if (import.meta.env.DEV) {
    const hostname = window.location.hostname
    
    // If accessing from network IP (not localhost/127.0.0.1), use the same hostname for backend
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:8080`
    }
    
    // If localhost, use proxy (Vite will handle it)
    return ''
  }
  
  // In production, use the same hostname as the frontend
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  return `${protocol}//${hostname}:8080`
}

export const API_BASE_URL = getApiBaseUrl()

export const API_ENDPOINTS = {
  MATCHES: '/api/matches',
  STREAM: '/api/stream',
  MATCH_BY_ID: (id) => `/api/matches/${id}`,
  START_MATCH: (id) => `/api/matches/${id}/start`,
  ADD_EVENT: (id) => `/api/matches/${id}/event`,
}

