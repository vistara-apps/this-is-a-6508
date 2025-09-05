import React, { useState, useEffect } from 'react'
import { MessageSquare, Sparkles, Lock, Copy, Check, Save, Trash2, Star } from 'lucide-react'
import { InfoCard } from './InfoCard'
import { Button } from './Button'
import { useAIScripts } from '../hooks/useAIScripts'

export function DeescalationScripts({ isPro, onUpgradeClick }) {
  const [selectedScenario, setSelectedScenario] = useState('traffic-stop')
  const [copiedScript, setCopiedScript] = useState(null)
  const [showSavedScripts, setShowSavedScripts] = useState(false)
  const [savedScripts, setSavedScripts] = useState([])
  const { 
    generateScript, 
    scripts, 
    loading, 
    error,
    saveScript,
    getSavedScripts,
    deleteScript,
    clearScripts
  } = useAIScripts()

  useEffect(() => {
    // Load saved scripts on component mount
    setSavedScripts(getSavedScripts())
  }, [])

  const scenarios = [
    { id: 'traffic-stop', label: 'Traffic Stop', emoji: '🚗' },
    { id: 'stop-and-frisk', label: 'Stop & Frisk', emoji: '👮' },
    { id: 'home-visit', label: 'Home Visit', emoji: '🏠' },
    { id: 'questioning', label: 'Questioning', emoji: '❓' },
  ]

  const basicScripts = {
    'traffic-stop': [
      "I am exercising my right to remain silent.",
      "I do not consent to any searches.",
      "Am I free to go?",
      "I would like to speak with an attorney.",
    ],
    'stop-and-frisk': [
      "I do not consent to this search.",
      "I am not resisting, but I do not consent.",
      "I have the right to remain silent.",
      "I want to contact my lawyer.",
    ],
    'home-visit': [
      "I do not consent to entry without a warrant.",
      "May I see your warrant?",
      "I am exercising my right to remain silent.",
      "I want to speak with an attorney before answering questions.",
    ],
    'questioning': [
      "I invoke my right to remain silent.",
      "I want to speak with an attorney.",
      "I do not waive any of my rights.",
      "Am I under arrest or am I free to go?",
    ],
  }

  const handleCopyScript = (script) => {
    navigator.clipboard.writeText(script)
    setCopiedScript(script)
    setTimeout(() => setCopiedScript(null), 2000)
  }

  const handleGenerateAIScript = async () => {
    if (!isPro) {
      onUpgradeClick()
      return
    }
    
    clearScripts() // Clear previous scripts
    await generateScript(selectedScenario)
  }

  const handleSaveScript = (script) => {
    const saved = saveScript(script)
    setSavedScripts(getSavedScripts())
    
    // Show confirmation
    setCopiedScript(`saved_${script}`)
    setTimeout(() => setCopiedScript(null), 2000)
  }

  const handleDeleteScript = (scriptId) => {
    deleteScript(scriptId)
    setSavedScripts(getSavedScripts())
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold text-text-primary">De-escalation Scripts</h2>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario.id)}
            className={`p-3 rounded-lg border transition-colors ${
              selectedScenario === scenario.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-surface text-text-primary hover:border-accent/50'
            }`}
          >
            <div className="text-2xl mb-1">{scenario.emoji}</div>
            <div className="text-sm font-medium">{scenario.label}</div>
          </button>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setShowSavedScripts(false)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            !showSavedScripts
              ? 'border-accent text-accent'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Scripts Library
        </button>
        <button
          onClick={() => setShowSavedScripts(true)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            showSavedScripts
              ? 'border-accent text-accent'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Saved Scripts ({savedScripts.length})
        </button>
      </div>

      {!showSavedScripts ? (
        <>
          {/* AI Script Generator */}
          {isPro ? (
            <InfoCard variant="highlighted">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="font-semibold text-text-primary">AI-Powered Scripts</h3>
                    <p className="text-sm text-text-secondary">Generate personalized scripts for your situation</p>
                  </div>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleGenerateAIScript}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate'}
                </Button>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                  {error}
                </div>
              )}
            </InfoCard>
          ) : (
            <InfoCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-text-secondary" />
                  <div>
                    <h3 className="font-semibold text-text-primary">AI-Powered Scripts</h3>
                    <p className="text-sm text-text-secondary">Upgrade to Pro for personalized AI scripts</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onUpgradeClick}
                >
                  Upgrade
                </Button>
              </div>
            </InfoCard>
          )}

          {/* AI Generated Scripts */}
          {scripts.length > 0 && (
            <InfoCard>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                AI-Generated Scripts
              </h3>
              
              <div className="space-y-3">
                {scripts.map((script, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-md group"
                  >
                    <p className="text-text-primary font-medium flex-1">"{script}"</p>
                    <div className="flex gap-2 ml-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSaveScript(script)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Save script"
                      >
                        {copiedScript === `saved_${script}` ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyScript(script)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy script"
                      >
                        {copiedScript === script ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {/* Basic Scripts */}
          <InfoCard>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Essential Phrases for {scenarios.find(s => s.id === selectedScenario)?.label}
            </h3>
            
            <div className="space-y-3">
              {basicScripts[selectedScenario]?.map((script, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-bg border border-border rounded-md group hover:border-accent/50 transition-colors"
                >
                  <p className="text-text-primary font-medium flex-1">"{script}"</p>
                  <div className="flex gap-2 ml-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSaveScript(script)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Save script"
                    >
                      {copiedScript === `saved_${script}` ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopyScript(script)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy script"
                    >
                      {copiedScript === script ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </>
      ) : (
        /* Saved Scripts Tab */
        <InfoCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              Your Saved Scripts
            </h3>
            {savedScripts.length > 0 && (
              <p className="text-sm text-text-secondary">
                {savedScripts.length} script{savedScripts.length !== 1 ? 's' : ''} saved
              </p>
            )}
          </div>
          
          {savedScripts.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
              <h4 className="font-semibold text-text-primary mb-2">No saved scripts yet</h4>
              <p className="text-text-secondary text-sm">
                Save scripts from the library to access them quickly here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedScripts.map((script) => (
                <div
                  key={script.id}
                  className="flex items-center justify-between p-3 bg-bg border border-border rounded-md group hover:border-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-text-primary font-medium">"{script.text}"</p>
                    <p className="text-xs text-text-secondary mt-1">
                      Saved {new Date(script.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopyScript(script.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy script"
                    >
                      {copiedScript === script.text ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteScript(script.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                      title="Delete script"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </InfoCard>
      )}

      {/* Tips */}
      <InfoCard>
        <h3 className="text-lg font-semibold text-text-primary mb-4">De-escalation Tips</h3>
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
              1
            </div>
            <p>Stay calm and speak in a clear, respectful tone</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
              2
            </div>
            <p>Keep your hands visible at all times</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
              3
            </div>
            <p>Avoid sudden movements or reaching for anything</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
              4
            </div>
            <p>Document everything you can remember afterward</p>
          </div>
        </div>
      </InfoCard>
    </div>
  )
}
