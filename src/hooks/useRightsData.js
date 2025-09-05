import { useState, useEffect } from 'react'
import { rightsDataService } from '../services/dataService'

export function useRightsData(state, language) {
  const [rightsData, setRightsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRightsData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await rightsDataService.getRightsData(state, language)
        setRightsData(data)
      } catch (err) {
        console.error('Failed to fetch rights data:', err)
        setError(err.message)
        
        // Fallback to basic rights data
        setRightsData({
          coreRights: [
            language === 'es' ? "Tiene derecho a permanecer en silencio" : "You have the right to remain silent",
            language === 'es' ? "Tiene derecho a un abogado" : "You have the right to an attorney"
          ],
          whatToSay: [
            language === 'es' ? "Estoy ejerciendo mi derecho a permanecer en silencio" : "I am exercising my right to remain silent",
            language === 'es' ? "Quiero hablar con un abogado" : "I want to speak with an attorney"
          ],
          whatNotToSay: [
            language === 'es' ? "No tengo nada que ocultar" : "I have nothing to hide"
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    if (state || language) {
      fetchRightsData()
    }
  }, [state, language])

  const refreshRightsData = async () => {
    // Clear cache and refetch
    rightsDataService.clearCache()
    const data = await rightsDataService.getRightsData(state, language)
    setRightsData(data)
  }

  return { 
    rightsData, 
    loading, 
    error,
    refreshRightsData 
  }
}
