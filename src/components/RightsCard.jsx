import React, { useState } from 'react'
import { MapPin, Globe, AlertTriangle, Shield, Scale } from 'lucide-react'
import { InfoCard } from './InfoCard'
import { Button } from './Button'
import { useRightsData } from '../hooks/useRightsData'

export function RightsCard({ state, loading, isPro }) {
  const [language, setLanguage] = useState('en')
  const { rightsData, loading: rightsLoading } = useRightsData(state, language)

  if (loading || rightsLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-8 bg-border rounded animate-pulse" />
        <div className="h-32 bg-border rounded animate-pulse" />
        <div className="h-24 bg-border rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-bold text-text-primary">
            {state ? `${state} Rights Guide` : 'Your Rights Guide'}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-text-secondary" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>

      {/* Emergency Info */}
      <InfoCard variant="highlighted">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-text-primary mb-2">
              {language === 'es' ? 'Información de Emergencia' : 'Emergency Information'}
            </h3>
            <p className="text-sm text-text-secondary">
              {language === 'es' 
                ? 'Mantenga la calma, mantenga las manos visibles y siga las instrucciones.'
                : 'Stay calm, keep your hands visible, and follow instructions.'
              }
            </p>
          </div>
        </div>
      </InfoCard>

      {/* Core Rights */}
      <InfoCard>
        <div className="flex items-start gap-3 mb-4">
          <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <h3 className="text-xl font-semibold text-text-primary">
            {language === 'es' ? 'Sus Derechos Fundamentales' : 'Your Core Rights'}
          </h3>
        </div>
        
        <div className="space-y-4">
          {rightsData?.coreRights?.map((right, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-text-primary">{right}</p>
            </div>
          ))}
        </div>
      </InfoCard>

      {/* What to Say */}
      <InfoCard>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-accent" />
          {language === 'es' ? 'Qué Decir' : 'What to Say'}
        </h3>
        
        <div className="space-y-3">
          {rightsData?.whatToSay?.map((phrase, index) => (
            <div key={index} className="p-3 bg-accent/5 border border-accent/20 rounded-md">
              <p className="text-text-primary font-medium">"{phrase}"</p>
            </div>
          ))}
        </div>
      </InfoCard>

      {/* What NOT to Say */}
      <InfoCard>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          {language === 'es' ? 'Qué NO Decir' : 'What NOT to Say'}
        </h3>
        
        <div className="space-y-3">
          {rightsData?.whatNotToSay?.map((phrase, index) => (
            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">✗ "{phrase}"</p>
            </div>
          ))}
        </div>
      </InfoCard>

      {!isPro && (
        <InfoCard className="text-center">
          <h3 className="font-semibold text-text-primary mb-2">
            {language === 'es' ? 'Desbloquear Más Funciones' : 'Unlock More Features'}
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            {language === 'es' 
              ? 'Actualice a Pro para obtener guías personalizadas por IA y documentación ilimitada de incidentes.'
              : 'Upgrade to Pro for AI-personalized guides and unlimited incident documentation.'
            }
          </p>
          <Button variant="accent" size="sm">
            {language === 'es' ? 'Actualizar a Pro' : 'Upgrade to Pro'}
          </Button>
        </InfoCard>
      )}
    </div>
  )
}