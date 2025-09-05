import { useState, useEffect } from 'react'
import { userService } from '../services/dataService'
import { stripeService } from '../services/api'

export function useSubscription() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user data and subscription status
    const user = userService.getCurrentUser()
    if (user.subscription) {
      setSubscription(user.subscription)
    }
    setLoading(false)
  }, [])

  const createSubscription = async () => {
    setLoading(true)
    
    try {
      // Use Stripe service for subscription creation
      const newSubscription = await stripeService.createSubscription()
      
      // Update user data with new subscription
      userService.updateSubscription(newSubscription)
      setSubscription(newSubscription)
      
      return newSubscription
    } catch (error) {
      console.error('Subscription creation failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async () => {
    setLoading(true)
    
    try {
      // In production, this would call Stripe to cancel the subscription
      const cancelledSubscription = {
        ...subscription,
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      }
      
      userService.updateSubscription(cancelledSubscription)
      setSubscription(cancelledSubscription)
      
      return cancelledSubscription
    } catch (error) {
      console.error('Subscription cancellation failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { 
    subscription, 
    loading, 
    createSubscription, 
    cancelSubscription,
    isPro: subscription?.status === 'active'
  }
}
