import React, { useState, useRef, useEffect } from 'react'
import { Video, Square, Play, Pause, MapPin, Clock, FileText, Lock } from 'lucide-react'
import { InfoCard } from './InfoCard'
import { Button } from './Button'
import { useIncidentRecording } from '../hooks/useIncidentRecording'

export function IncidentRecorder({ location, isPro, onUpgradeClick }) {
  const videoRef = useRef(null)
  const { 
    isRecording, 
    recordingTime, 
    startRecording, 
    stopRecording, 
    generateSummary,
    summary,
    loading 
  } = useIncidentRecording()

  const [notes, setNotes] = useState('')

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      startRecording(stream)
    } catch (error) {
      alert('Camera/microphone access denied. Please allow permissions to record incidents.')
    }
  }

  const handleStopRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    
    stopRecording()
  }

  const handleGenerateSummary = () => {
    if (!isPro) {
      onUpgradeClick()
      return
    }
    
    generateSummary({
      notes,
      location,
      timestamp: new Date().toISOString(),
      duration: recordingTime
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Video className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold text-text-primary">Incident Recorder</h2>
      </div>

      {/* Recording Interface */}
      <InfoCard className="text-center">
        {/* Video Preview */}
        <div className="relative mb-6">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full max-w-sm mx-auto rounded-lg bg-gray-900"
            style={{ aspectRatio: '16/9' }}
          />
          
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm recording-pulse">
              <div className="w-2 h-2 bg-white rounded-full" />
              REC {formatTime(recordingTime)}
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center gap-4 mb-6">
          {!isRecording ? (
            <Button
              variant="destructive"
              size="lg"
              onClick={handleStartRecording}
              className="flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Recording
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleStopRecording}
              className="flex items-center gap-2"
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </Button>
          )}
        </div>

        {/* Location Info */}
        {location && (
          <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
            <MapPin className="w-4 h-4" />
            <span>Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
          </div>
        )}
      </InfoCard>

      {/* Notes */}
      <InfoCard>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Additional Notes
        </h3>
        
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe what happened, who was involved, badge numbers, etc..."
          className="w-full h-32 px-3 py-2 border border-border rounded-md bg-surface text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        
        {!isPro && notes.length > 100 && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800 text-sm">
              <Lock className="w-4 h-4 inline mr-1" />
              Upgrade to Pro for unlimited note length and AI-powered summaries
            </p>
          </div>
        )}
      </InfoCard>

      {/* Summary Generation */}
      <InfoCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Generate Incident Summary</h3>
          {isPro && (
            <Button
              variant="accent"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={loading || (!notes && recordingTime === 0)}
            >
              {loading ? 'Generating...' : 'Generate Summary'}
            </Button>
          )}
        </div>
        
        {!isPro ? (
          <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
            <Lock className="w-8 h-8 text-text-secondary mx-auto mb-3" />
            <h4 className="font-semibold text-text-primary mb-2">Pro Feature</h4>
            <p className="text-text-secondary text-sm mb-4">
              Upgrade to Pro for AI-powered incident summaries that can be shared with legal counsel
            </p>
            <Button variant="primary" size="sm" onClick={onUpgradeClick}>
              Upgrade to Pro
            </Button>
          </div>
        ) : summary ? (
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-md">
            <h4 className="font-semibold text-text-primary mb-2">Incident Summary</h4>
            <p className="text-text-secondary text-sm whitespace-pre-wrap">{summary}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm">
                Copy Link
              </Button>
              <Button variant="secondary" size="sm">
                Download PDF
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-text-secondary text-sm">
            Record an incident and add notes to generate a shareable summary
          </p>
        )}
      </InfoCard>

      {/* Tips */}
      <InfoCard>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recording Tips</h3>
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
              1
            </div>
            <p>Start recording before any interaction begins if possible</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
              2
            </div>
            <p>Hold phone steady and try to capture faces and badge numbers</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
              3
            </div>
            <p>State your name, the date, time, and location clearly</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
              4
            </div>
            <p>Continue recording until the encounter is completely over</p>
          </div>
        </div>
      </InfoCard>
    </div>
  )
}