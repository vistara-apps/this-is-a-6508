import { useState, useEffect } from 'react'

const mockRightsData = {
  en: {
    coreRights: [
      "You have the right to remain silent",
      "You have the right to refuse searches without a warrant",
      "You have the right to ask if you are free to go",
      "You have the right to an attorney",
      "You have the right to record police interactions in public"
    ],
    whatToSay: [
      "I am exercising my right to remain silent",
      "I do not consent to any searches",
      "Am I free to go?",
      "I want to speak with an attorney"
    ],
    whatNotToSay: [
      "I wasn't doing anything wrong",
      "I have nothing to hide",
      "Just this once, I'll let you search",
      "I know my rights" (in an aggressive tone)
    ]
  },
  es: {
    coreRights: [
      "Tiene derecho a permanecer en silencio",
      "Tiene derecho a rechazar registros sin una orden judicial",
      "Tiene derecho a preguntar si puede irse",
      "Tiene derecho a un abogado",
      "Tiene derecho a grabar interacciones policiales en público"
    ],
    whatToSay: [
      "Estoy ejerciendo mi derecho a permanecer en silencio",
      "No consiento a ningún registro",
      "¿Puedo irme?",
      "Quiero hablar con un abogado"
    ],
    whatNotToSay: [
      "No estaba haciendo nada malo",
      "No tengo nada que ocultar",
      "Solo esta vez, les permitiré registrar",
      "Conozco mis derechos" (en tono agresivo)
    ]
  }
}

export function useRightsData(state, language) {
  const [rightsData, setRightsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch state-specific rights data
    setTimeout(() => {
      setRightsData(mockRightsData[language] || mockRightsData.en)
      setLoading(false)
    }, 500)
  }, [state, language])

  return { rightsData, loading }
}