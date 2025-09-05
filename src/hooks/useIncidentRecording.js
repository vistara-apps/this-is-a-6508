import { useState, useRef, useEffect } from 'react'

export function useIncidentRecording() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
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

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Failed to start recording:', error)
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

  const generateSummary = async (incidentData) => {
    setLoading(true)
    
    try {
      // Mock OpenAI API call for summary generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockSummary = `INCIDENT SUMMARY

Date: ${new Date(incidentData.timestamp).toLocaleDateString()}
Time: ${new Date(incidentData.timestamp).toLocaleTimeString()}
Location: ${incidentData.location ? `${incidentData.location.latitude.toFixed(4)}, ${incidentData.location.longitude.toFixed(4)}` : 'Unknown'}
Duration: ${Math.floor(incidentData.duration / 60)}:${(incidentData.duration % 60).toString().padStart(2, '0')}

DESCRIPTION:
${incidentData.notes || 'No additional notes provided.'}

RECORDING:
Audio/video recording captured during incident (${incidentData.duration} seconds).

This summary was generated automatically and should be reviewed for accuracy before sharing with legal counsel.`

      setSummary(mockSummary)
    } catch (error) {
      console.error('Failed to generate summary:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    generateSummary,
    summary,
    loading
  }
}