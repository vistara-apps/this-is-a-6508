import React, { useState, useEffect } from 'react'
import { AppShell } from './components/AppShell'
import { RightsCard } from './components/RightsCard'
import { DeescalationScripts } from './components/DeescalationScripts'
import { IncidentRecorder } from './components/IncidentRecorder'
import { SubscriptionModal } from './components/SubscriptionModal'
import { useLocation } from './hooks/useLocation'
import { useSubscription } from './hooks/useSubscription'

function App() {
  const [activeTab, setActiveTab] = useState('rights')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const { location, state, loading: locationLoading } = useLocation()
  const { subscription, loading: subscriptionLoading } = useSubscription()

  return (
    <div className="min-h-screen bg-bg">
      <AppShell
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSubscribeClick={() => setShowSubscriptionModal(true)}
        subscription={subscription}
      >
        <main className="max-w-4xl mx-auto px-4 py-6">
          {activeTab === 'rights' && (
            <RightsCard
              state={state}
              loading={locationLoading}
              isPro={subscription?.status === 'active'}
            />
          )}
          
          {activeTab === 'scripts' && (
            <DeescalationScripts
              isPro={subscription?.status === 'active'}
              onUpgradeClick={() => setShowSubscriptionModal(true)}
            />
          )}
          
          {activeTab === 'record' && (
            <IncidentRecorder
              location={location}
              isPro={subscription?.status === 'active'}
              onUpgradeClick={() => setShowSubscriptionModal(true)}
            />
          )}
        </main>
      </AppShell>

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          currentSubscription={subscription}
        />
      )}
    </div>
  )
}

export default App