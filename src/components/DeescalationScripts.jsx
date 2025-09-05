import React, { useState } from 'react'
import { MessageSquare, Sparkles, Lock, Copy, Check } from 'lucide-react'
import { InfoCard } from './InfoCard'
import { Button } from './Button'
import { useAIScripts } from '../hooks/useAIScripts'

export function DeescalationScripts({ isPro, onUpgradeClick }) {
  const [selectedScenario, setSelectedScenario] = useState('traffic-stop')
  const [copiedScript, setCopiedScript] = useState(null)
  const { generateScript, loading } = useAIScripts()

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
    
    await generateScript(selectedScenario)
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

      {/* AI Script Generator */}
      {isPro ? (
        <InfoCard variant="highlighted">
          <div className="flex items-center justify-between">
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopyScript(script)}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-3"
              >
                {copiedScript === script ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </InfoCard>

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