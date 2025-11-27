import { useEffect, useState } from 'react'
import { API_ENDPOINTS, API_BASE_URL } from '../config/api'

export function useMatchStream(matchId = null) {
  const [matches, setMatches] = useState([])
  const [singleMatch, setSingleMatch] = useState(null)

  useEffect(() => {
    // Initial Fetch
    fetch(`${API_BASE_URL}${API_ENDPOINTS.MATCHES}`)
      .then(res => res.json())
      .then(data => {
        setMatches(data || [])
        if (matchId) {
          const found = (data || []).find(m => m.id === matchId)
          if (found) setSingleMatch(found)
        }
      })
      .catch(err => console.error("API Error:", err))
  }, [matchId])

  useEffect(() => {
    // SSE Connection
    const eventSource = new EventSource(`${API_BASE_URL}${API_ENDPOINTS.STREAM}`)
    
    eventSource.onmessage = (event) => {
      const updatedMatch = JSON.parse(event.data)
      
      setMatches(prev => {
        const exists = prev.find(m => m.id === updatedMatch.id)
        if (exists) {
          return prev.map(m => m.id === updatedMatch.id ? updatedMatch : m)
        }
        return [...prev, updatedMatch]
      })

      if (matchId && updatedMatch.id === matchId) {
        setSingleMatch(updatedMatch)
      }
    }

    return () => eventSource.close()
  }, [matchId])

  return { matches, singleMatch }
}