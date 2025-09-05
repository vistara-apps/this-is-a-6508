/**
 * Data Service Layer
 * Handles data persistence, user management, and incident storage
 * Implements the data model from the PRD specifications
 */

/**
 * User Entity Management
 */
export class UserService {
  constructor() {
    this.storageKey = 'kyr_user_data'
  }

  // Get current user data
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.storageKey)
      return userData ? JSON.parse(userData) : this.createDefaultUser()
    } catch (error) {
      console.error('Error loading user data:', error)
      return this.createDefaultUser()
    }
  }

  // Create default user structure
  createDefaultUser() {
    const defaultUser = {
      userId: this.generateUserId(),
      email: null,
      subscriptionStatus: 'free',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
      settings: {
        autoLocation: true,
        notifications: true,
        dataRetention: 30 // days
      }
    }
    
    this.saveUser(defaultUser)
    return defaultUser
  }

  // Save user data
  saveUser(userData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(userData))
      return true
    } catch (error) {
      console.error('Error saving user data:', error)
      return false
    }
  }

  // Update user subscription
  updateSubscription(subscriptionData) {
    const user = this.getCurrentUser()
    user.subscriptionStatus = subscriptionData.status
    user.subscription = {
      ...subscriptionData,
      updatedAt: new Date().toISOString()
    }
    return this.saveUser(user)
  }

  // Update user preferences
  updatePreferences(preferences) {
    const user = this.getCurrentUser()
    user.preferredLanguage = preferences.language || user.preferredLanguage
    user.email = preferences.email || user.email
    user.settings = { ...user.settings, ...preferences.settings }
    user.updatedAt = new Date().toISOString()
    return this.saveUser(user)
  }

  // Generate unique user ID
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
  }
}

/**
 * Incident Entity Management
 */
export class IncidentService {
  constructor() {
    this.storageKey = 'kyr_incidents'
    this.maxIncidents = 50 // Limit storage to prevent overflow
  }

  // Get all incidents for current user
  getAllIncidents() {
    try {
      const incidents = localStorage.getItem(this.storageKey)
      return incidents ? JSON.parse(incidents) : []
    } catch (error) {
      console.error('Error loading incidents:', error)
      return []
    }
  }

  // Get incident by ID
  getIncident(incidentId) {
    const incidents = this.getAllIncidents()
    return incidents.find(incident => incident.incidentId === incidentId)
  }

  // Create new incident
  createIncident(incidentData) {
    const incident = {
      incidentId: this.generateIncidentId(),
      userId: incidentData.userId,
      timestamp: incidentData.timestamp || new Date().toISOString(),
      location: incidentData.location || null,
      audioRecordingUrl: null,
      videoRecordingUrl: null,
      userNotes: incidentData.notes || '',
      generatedSummaryUrl: null,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const incidents = this.getAllIncidents()
    incidents.unshift(incident) // Add to beginning

    // Limit storage
    if (incidents.length > this.maxIncidents) {
      incidents.splice(this.maxIncidents)
    }

    this.saveIncidents(incidents)
    return incident
  }

  // Update incident
  updateIncident(incidentId, updates) {
    const incidents = this.getAllIncidents()
    const index = incidents.findIndex(incident => incident.incidentId === incidentId)
    
    if (index === -1) {
      throw new Error('Incident not found')
    }

    incidents[index] = {
      ...incidents[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.saveIncidents(incidents)
    return incidents[index]
  }

  // Delete incident
  deleteIncident(incidentId) {
    const incidents = this.getAllIncidents()
    const filteredIncidents = incidents.filter(incident => incident.incidentId !== incidentId)
    
    if (filteredIncidents.length === incidents.length) {
      throw new Error('Incident not found')
    }

    this.saveIncidents(filteredIncidents)
    return true
  }

  // Save recording URLs
  saveRecordingUrls(incidentId, recordingUrls) {
    return this.updateIncident(incidentId, {
      audioRecordingUrl: recordingUrls.audioUrl,
      videoRecordingUrl: recordingUrls.videoUrl,
      status: 'recorded'
    })
  }

  // Save generated summary
  saveSummary(incidentId, summaryUrl, summaryText) {
    return this.updateIncident(incidentId, {
      generatedSummaryUrl: summaryUrl,
      summaryText: summaryText,
      status: 'completed'
    })
  }

  // Get incidents by date range
  getIncidentsByDateRange(startDate, endDate) {
    const incidents = this.getAllIncidents()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return incidents.filter(incident => {
      const incidentDate = new Date(incident.timestamp)
      return incidentDate >= start && incidentDate <= end
    })
  }

  // Get recent incidents
  getRecentIncidents(limit = 10) {
    const incidents = this.getAllIncidents()
    return incidents.slice(0, limit)
  }

  // Save incidents to storage
  saveIncidents(incidents) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(incidents))
      return true
    } catch (error) {
      console.error('Error saving incidents:', error)
      return false
    }
  }

  // Generate unique incident ID
  generateIncidentId() {
    return 'incident_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
  }

  // Export incidents for backup
  exportIncidents() {
    const incidents = this.getAllIncidents()
    const exportData = {
      exportDate: new Date().toISOString(),
      totalIncidents: incidents.length,
      incidents: incidents
    }
    
    return JSON.stringify(exportData, null, 2)
  }

  // Import incidents from backup
  importIncidents(importData) {
    try {
      const data = typeof importData === 'string' ? JSON.parse(importData) : importData
      
      if (!data.incidents || !Array.isArray(data.incidents)) {
        throw new Error('Invalid import data format')
      }

      // Validate incident structure
      const validIncidents = data.incidents.filter(incident => 
        incident.incidentId && incident.timestamp
      )

      this.saveIncidents(validIncidents)
      return {
        success: true,
        imported: validIncidents.length,
        skipped: data.incidents.length - validIncidents.length
      }
    } catch (error) {
      console.error('Error importing incidents:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

/**
 * Rights Card Data Management
 */
export class RightsDataService {
  constructor() {
    this.storageKey = 'kyr_rights_cache'
    this.cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours
  }

  // Get rights data for state and language
  async getRightsData(state, language = 'en') {
    const cacheKey = `${state}_${language}`
    const cached = this.getCachedRights(cacheKey)
    
    if (cached && !this.isCacheExpired(cached.timestamp)) {
      return cached.data
    }

    // In production, this would fetch from a real API
    const rightsData = this.getStaticRightsData(state, language)
    this.cacheRights(cacheKey, rightsData)
    
    return rightsData
  }

  // Get cached rights data
  getCachedRights(cacheKey) {
    try {
      const cache = localStorage.getItem(this.storageKey)
      const cacheData = cache ? JSON.parse(cache) : {}
      return cacheData[cacheKey] || null
    } catch (error) {
      console.error('Error loading rights cache:', error)
      return null
    }
  }

  // Cache rights data
  cacheRights(cacheKey, data) {
    try {
      const cache = localStorage.getItem(this.storageKey)
      const cacheData = cache ? JSON.parse(cache) : {}
      
      cacheData[cacheKey] = {
        data: data,
        timestamp: Date.now()
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error caching rights data:', error)
    }
  }

  // Check if cache is expired
  isCacheExpired(timestamp) {
    return Date.now() - timestamp > this.cacheExpiry
  }

  // Get static rights data (fallback)
  getStaticRightsData(state, language) {
    const rightsData = {
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
          "I know my rights (in an aggressive tone)"
        ],
        stateSpecific: this.getStateSpecificRights(state)
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
          "Conozco mis derechos (en tono agresivo)"
        ],
        stateSpecific: this.getStateSpecificRights(state, 'es')
      }
    }

    return rightsData[language] || rightsData.en
  }

  // Get state-specific rights information
  getStateSpecificRights(state, language = 'en') {
    // This would be expanded with real state-specific data
    const stateRights = {
      'California': {
        en: ['California has strong privacy protections', 'Recording is generally permitted in public'],
        es: ['California tiene fuertes protecciones de privacidad', 'La grabación generalmente está permitida en público']
      },
      'Texas': {
        en: ['Texas is a one-party consent state for recordings', 'Open carry laws may affect interactions'],
        es: ['Texas es un estado de consentimiento de una parte para grabaciones', 'Las leyes de portación abierta pueden afectar las interacciones']
      },
      'New York': {
        en: ['New York requires two-party consent for private conversations', 'Stop and frisk policies have specific limitations'],
        es: ['Nueva York requiere consentimiento de ambas partes para conversaciones privadas', 'Las políticas de parar y registrar tienen limitaciones específicas']
      }
    }

    return stateRights[state]?.[language] || []
  }

  // Clear cache
  clearCache() {
    try {
      localStorage.removeItem(this.storageKey)
      return true
    } catch (error) {
      console.error('Error clearing rights cache:', error)
      return false
    }
  }
}

// Export service instances
export const userService = new UserService()
export const incidentService = new IncidentService()
export const rightsDataService = new RightsDataService()
