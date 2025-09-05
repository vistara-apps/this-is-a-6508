import { useState } from 'react'
import { openAIService } from '../services/api'
import { userService } from '../services/dataService'

export function useAIScripts() {
  const [loading, setLoading] = useState(false)
  const [scripts, setScripts] = useState([])
  const [error, setError] = useState(null)

  const generateScript = async (scenario, userContext = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      // Get user preferences for context
      const user = userService.getCurrentUser()
      const context = {
        language: user.preferredLanguage,
        ...userContext
      }

      // Generate scripts using OpenAI service
      const generatedScripts = await openAIService.generateDeescalationScript(scenario, context)
      
      setScripts(generatedScripts)
      return generatedScripts
      
    } catch (error) {
      console.error('Failed to generate AI script:', error)
      setError('Failed to generate scripts: ' + error.message)
      
      // Return fallback scripts
      const fallbackScripts = getFallbackScripts(scenario, userContext.language || 'en')
      setScripts(fallbackScripts)
      return fallbackScripts
    } finally {
      setLoading(false)
    }
  }

  const getFallbackScripts = (scenario, language = 'en') => {
    const fallbackScripts = {
      en: {
        'traffic-stop': [
          "Officer, I understand you're doing your job. I am exercising my right to remain silent and do not consent to any searches.",
          "I respect your authority and will comply with lawful orders. May I ask if I am free to go?",
          "I want to be cooperative while protecting my constitutional rights. I do not consent to any searches of my vehicle.",
          "I understand this is routine for you. I'm invoking my right to remain silent and would like to contact my attorney."
        ],
        'stop-and-frisk': [
          "I am not resisting, but I do not consent to this search. I am exercising my constitutional rights.",
          "Officer, I want to be cooperative while also protecting my rights. I invoke my right to remain silent.",
          "I understand you have a job to do. I do not consent to this search and am exercising my Fourth Amendment rights.",
          "I am complying with your instructions but want to clearly state I do not consent to any searches."
        ],
        'home-visit': [
          "I appreciate you coming to speak with me. I exercise my right to remain silent and do not consent to entry without a warrant.",
          "I understand you have questions, but I would prefer to have my attorney present before we continue.",
          "Thank you for your service. I need to see a warrant before allowing entry to my home.",
          "I want to be helpful, but I'm exercising my constitutional right to refuse entry without a warrant."
        ],
        'questioning': [
          "I understand this is important to you. I am invoking my right to remain silent and would like to speak with an attorney.",
          "I want to be helpful, but I need to protect my rights. I will not answer questions without my lawyer present.",
          "I respect your investigation. I'm invoking my Fifth Amendment right to remain silent.",
          "I understand you're doing your job. I need my attorney present before answering any questions."
        ]
      },
      es: {
        'traffic-stop': [
          "Oficial, entiendo que está haciendo su trabajo. Estoy ejerciendo mi derecho a permanecer en silencio y no consiento a ningún registro.",
          "Respeto su autoridad y cumpliré con las órdenes legales. ¿Puedo preguntar si puedo irme?",
          "Quiero ser cooperativo mientras protejo mis derechos constitucionales. No consiento a ningún registro de mi vehículo.",
          "Entiendo que esto es rutinario para usted. Estoy invocando mi derecho a permanecer en silencio y me gustaría contactar a mi abogado."
        ],
        'stop-and-frisk': [
          "No me estoy resistiendo, pero no consiento a este registro. Estoy ejerciendo mis derechos constitucionales.",
          "Oficial, quiero ser cooperativo mientras también protejo mis derechos. Invoco mi derecho a permanecer en silencio.",
          "Entiendo que tiene un trabajo que hacer. No consiento a este registro y estoy ejerciendo mis derechos de la Cuarta Enmienda.",
          "Estoy cumpliendo con sus instrucciones pero quiero declarar claramente que no consiento a ningún registro."
        ],
        'home-visit': [
          "Agradezco que haya venido a hablar conmigo. Ejerzo mi derecho a permanecer en silencio y no consiento la entrada sin una orden judicial.",
          "Entiendo que tiene preguntas, pero preferiría tener a mi abogado presente antes de continuar.",
          "Gracias por su servicio. Necesito ver una orden judicial antes de permitir la entrada a mi hogar.",
          "Quiero ser útil, pero estoy ejerciendo mi derecho constitucional a rechazar la entrada sin una orden judicial."
        ],
        'questioning': [
          "Entiendo que esto es importante para usted. Estoy invocando mi derecho a permanecer en silencio y me gustaría hablar con un abogado.",
          "Quiero ser útil, pero necesito proteger mis derechos. No responderé preguntas sin mi abogado presente.",
          "Respeto su investigación. Estoy invocando mi derecho de la Quinta Enmienda a permanecer en silencio.",
          "Entiendo que está haciendo su trabajo. Necesito que mi abogado esté presente antes de responder cualquier pregunta."
        ]
      }
    }
    
    return fallbackScripts[language]?.[scenario] || fallbackScripts.en[scenario] || []
  }

  const saveScript = (script) => {
    // Save custom script to user preferences
    const user = userService.getCurrentUser()
    const savedScripts = user.savedScripts || []
    
    const newScript = {
      id: Date.now().toString(),
      text: script,
      createdAt: new Date().toISOString()
    }
    
    savedScripts.push(newScript)
    
    userService.updatePreferences({
      savedScripts: savedScripts.slice(-20) // Keep only last 20 scripts
    })
    
    return newScript
  }

  const getSavedScripts = () => {
    const user = userService.getCurrentUser()
    return user.savedScripts || []
  }

  const deleteScript = (scriptId) => {
    const user = userService.getCurrentUser()
    const savedScripts = user.savedScripts || []
    
    const filteredScripts = savedScripts.filter(script => script.id !== scriptId)
    
    userService.updatePreferences({
      savedScripts: filteredScripts
    })
    
    return true
  }

  const clearScripts = () => {
    setScripts([])
    setError(null)
  }

  return { 
    generateScript, 
    scripts,
    loading, 
    error,
    saveScript,
    getSavedScripts,
    deleteScript,
    clearScripts
  }
}
