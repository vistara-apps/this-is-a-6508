import { useState, useRef, useEffect } from 'react'
import { incidentService, userService } from '../services/dataService'
import { openAIService, pinataService } from '../services/api'

export function useIncidentRecording() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [summary, setSummary] = useState(null)
  const [summaryUrl, setSummaryUrl] = useState(null)
  const [currentIncident, setCurrentIncident] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = (stream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []

      // Create new incident record
      const user = userService.getCurrentUser()
      const incident = incidentService.createIncident({
        userId: user.userId,
        timestamp: new Date().toISOString(),
        notes: ''
      })
      setCurrentIncident(incident)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Upload recorded data to IPFS when recording stops
        await uploadRecording()
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setError(null)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Failed to start recording:', error)
      setError('Failed to start recording: ' + error.message)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const uploadRecording = async () => {
    if (recordedChunksRef.current.length === 0 || !currentIncident) {
      return
    }

    setLoading(true)
    
    try {
      // Create blob from recorded chunks
      const recordedBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
      
      // Upload to Pinata IPFS
      const uploadResult = await pinataService.uploadFile(recordedBlob, {
        name: `incident-${currentIncident.incidentId}-${Date.now()}`,
        keyvalues: {
          incidentId: currentIncident.incidentId,
          type: 'video-recording',
          timestamp: new Date().toISOString()
        }
      })

      // Update incident with recording URL
      incidentService.saveRecordingUrls(currentIncident.incidentId, {
        videoUrl: uploadResult.url,
        audioUrl: uploadResult.url // Same file contains both
      })

      console.log('Recording uploaded successfully:', uploadResult.url)
    } catch (error) {
      console.error('Failed to upload recording:', error)
      setError('Failed to upload recording: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const generateSummary = async (incidentData) => {
    if (!currentIncident) {
      setError('No active incident to generate summary for')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Update incident with notes
      const updatedIncident = incidentService.updateIncident(currentIncident.incidentId, {
        userNotes: incidentData.notes,
        location: incidentData.location
      })

      // Generate summary using OpenAI
      const summaryText = await openAIService.generateIncidentSummary({
        ...incidentData,
        incidentId: currentIncident.incidentId,
        duration: recordingTime
      })

      // Upload summary to IPFS
      const summaryData = {
        incidentId: currentIncident.incidentId,
        summary: summaryText,
        metadata: {
          generatedAt: new Date().toISOString(),
          duration: recordingTime,
          location: incidentData.location,
          notes: incidentData.notes
        }
      }

      const uploadResult = await pinataService.uploadJSON(summaryData, {
        name: `incident-summary-${currentIncident.incidentId}`,
        keyvalues: {
          incidentId: currentIncident.incidentId,
          type: 'incident-summary'
        }
      })

      // Save summary to incident
      incidentService.saveSummary(currentIncident.incidentId, uploadResult.url, summaryText)

      setSummary(summaryText)
      setSummaryUrl(uploadResult.url)

    } catch (error) {
      console.error('Failed to generate summary:', error)
      setError('Failed to generate summary: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const copyShareableLink = () => {
    if (summaryUrl) {
      navigator.clipboard.writeText(summaryUrl)
      return true
    }
    return false
  }

  const downloadSummary = () => {
    if (summary) {
      const blob = new Blob([summary], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `incident-summary-${currentIncident?.incidentId || Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const resetRecording = () => {
    setCurrentIncident(null)
    setSummary(null)
    setSummaryUrl(null)
    setRecordingTime(0)
    setError(null)
    recordedChunksRef.current = []
  }

  return {
    isRecording,
    recordingTime,
    summary,
    summaryUrl,
    currentIncident,
    loading,
    error,
    startRecording,
    stopRecording,
    generateSummary,
    copyShareableLink,
    downloadSummary,
    resetRecording
  }
}
