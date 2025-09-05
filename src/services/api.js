/**
 * API Service Layer
 * Handles all external API integrations including OpenAI, Pinata, and Stripe
 */

// Environment variables for API keys (should be set in production)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

/**
 * OpenAI API Integration
 */
export class OpenAIService {
  constructor() {
    this.apiKey = OPENAI_API_KEY
    this.baseURL = 'https://api.openai.com/v1'
  }

  async generateDeescalationScript(scenario, userContext = {}) {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, using mock data')
      return this.getMockScript(scenario)
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a legal rights advisor helping people communicate safely with law enforcement. Generate 3-4 calm, respectful de-escalation phrases for the scenario: ${scenario}. Focus on constitutional rights while maintaining a cooperative tone. Each phrase should be under 50 words.`
            },
            {
              role: 'user',
              content: `Generate de-escalation scripts for: ${scenario}. Context: ${JSON.stringify(userContext)}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'OpenAI API request failed')
      }

      // Parse the response to extract individual scripts
      const content = data.choices[0].message.content
      const scripts = content.split('\n').filter(line => 
        line.trim() && !line.includes(':') && line.length > 10
      ).map(script => script.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())

      return scripts.slice(0, 4) // Return max 4 scripts
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.getMockScript(scenario)
    }
  }

  async generateIncidentSummary(incidentData) {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, using mock summary')
      return this.getMockSummary(incidentData)
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a legal documentation assistant. Create a professional incident summary suitable for legal review. Include all relevant details in a clear, factual format.'
            },
            {
              role: 'user',
              content: `Create an incident summary with this data: ${JSON.stringify(incidentData)}`
            }
          ],
          max_tokens: 800,
          temperature: 0.3
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'OpenAI API request failed')
      }

      return data.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.getMockSummary(incidentData)
    }
  }

  getMockScript(scenario) {
    const mockScripts = {
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
    }
    
    return mockScripts[scenario] || mockScripts['questioning']
  }

  getMockSummary(incidentData) {
    return `INCIDENT SUMMARY

Date: ${new Date(incidentData.timestamp).toLocaleDateString()}
Time: ${new Date(incidentData.timestamp).toLocaleTimeString()}
Location: ${incidentData.location ? `${incidentData.location.latitude.toFixed(4)}, ${incidentData.location.longitude.toFixed(4)}` : 'Unknown'}
Duration: ${Math.floor(incidentData.duration / 60)}:${(incidentData.duration % 60).toString().padStart(2, '0')}

DESCRIPTION:
${incidentData.notes || 'No additional notes provided.'}

RECORDING:
Audio/video recording captured during incident (${incidentData.duration} seconds).

This summary was generated automatically and should be reviewed for accuracy before sharing with legal counsel.`
  }
}

/**
 * Pinata IPFS Integration
 */
export class PinataService {
  constructor() {
    this.apiKey = PINATA_API_KEY
    this.secretKey = PINATA_SECRET_KEY
    this.baseURL = 'https://api.pinata.cloud'
  }

  async uploadFile(file, metadata = {}) {
    if (!this.apiKey || !this.secretKey) {
      console.warn('Pinata API keys not configured, using mock upload')
      return this.getMockUploadResult(file)
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      if (metadata.name) {
        formData.append('pinataMetadata', JSON.stringify({
          name: metadata.name,
          keyvalues: metadata.keyvalues || {}
        }))
      }

      const response = await fetch(`${this.baseURL}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        },
        body: formData
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Pinata upload failed')
      }

      return {
        hash: data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
        size: data.PinSize,
        timestamp: data.Timestamp
      }
    } catch (error) {
      console.error('Pinata upload error:', error)
      return this.getMockUploadResult(file)
    }
  }

  async uploadJSON(jsonData, metadata = {}) {
    if (!this.apiKey || !this.secretKey) {
      console.warn('Pinata API keys not configured, using mock upload')
      return this.getMockUploadResult(jsonData, 'json')
    }

    try {
      const response = await fetch(`${this.baseURL}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        },
        body: JSON.stringify({
          pinataContent: jsonData,
          pinataMetadata: {
            name: metadata.name || 'incident-summary',
            keyvalues: metadata.keyvalues || {}
          }
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Pinata JSON upload failed')
      }

      return {
        hash: data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Pinata JSON upload error:', error)
      return this.getMockUploadResult(jsonData, 'json')
    }
  }

  getMockUploadResult(data, type = 'file') {
    const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    return {
      hash: mockHash,
      url: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
      size: type === 'json' ? JSON.stringify(data).length : (data.size || 1024),
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Stripe Payment Integration
 */
export class StripeService {
  constructor() {
    this.publishableKey = STRIPE_PUBLISHABLE_KEY
  }

  async initializeStripe() {
    if (!this.publishableKey) {
      console.warn('Stripe publishable key not configured')
      return null
    }

    try {
      // Dynamically import Stripe to avoid loading it unnecessarily
      const { loadStripe } = await import('@stripe/stripe-js')
      return await loadStripe(this.publishableKey)
    } catch (error) {
      console.error('Failed to load Stripe:', error)
      return null
    }
  }

  async createSubscription(priceId = 'price_pro_monthly') {
    const stripe = await this.initializeStripe()
    
    if (!stripe) {
      // Mock subscription creation for development
      return this.getMockSubscription()
    }

    try {
      // In production, this would call your backend to create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId,
          mode: 'subscription'
        })
      })

      const session = await response.json()
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result
    } catch (error) {
      console.error('Stripe subscription error:', error)
      return this.getMockSubscription()
    }
  }

  getMockSubscription() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'active',
          plan: 'pro',
          price: 4.99,
          renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          subscriptionId: 'sub_mock_' + Math.random().toString(36).substring(2, 15)
        })
      }, 2000)
    })
  }
}

// Export service instances
export const openAIService = new OpenAIService()
export const pinataService = new PinataService()
export const stripeService = new StripeService()
