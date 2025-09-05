import React, { useState } from 'react'
import { Crown, Check, X } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { useSubscription } from '../hooks/useSubscription'

export function SubscriptionModal({ onClose, currentSubscription }) {
  const [loading, setLoading] = useState(false)
  const { createSubscription } = useSubscription()

  const features = [
    'Unlimited incident documentation',
    'AI-powered de-escalation scripts',
    'Personalized rights guidance',
    'Advanced incident summaries',
    'Priority support',
    'Shareable incident reports',
  ]

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      await createSubscription()
      onClose()
    } catch (error) {
      alert('Failed to process subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose} title="Upgrade to Pro">
      <div className="space-y-6">
        {/* Pricing */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-accent" />
            <span className="text-2xl font-bold text-text-primary">$4.99</span>
            <span className="text-text-secondary">/month</span>
          </div>
          <p className="text-text-secondary">Cancel anytime</p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary">Pro Features:</h3>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-text-primary">{feature}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Maybe Later
          </Button>
          <Button
            variant="accent"
            className="flex-1"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Subscribe Now'}
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-text-secondary text-center">
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          This app provides educational information only and is not a substitute for legal counsel.
        </p>
      </div>
    </Modal>
  )
}