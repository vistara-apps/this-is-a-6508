import React from 'react'
import { Shield, MessageSquare, Video, Crown } from 'lucide-react'
import { Button } from './Button'

export function AppShell({ children, activeTab, onTabChange, onSubscribeClick, subscription }) {
  const tabs = [
    { id: 'rights', label: 'Rights', icon: Shield },
    { id: 'scripts', label: 'Scripts', icon: MessageSquare },
    { id: 'record', label: 'Record', icon: Video },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-border px-4 py-3 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">Know Your Rights Now</h1>
            <p className="text-sm text-text-secondary">Instant legal guidance in your pocket</p>
          </div>
          
          {subscription?.status !== 'active' && (
            <Button
              variant="primary"
              size="sm"
              onClick={onSubscribeClick}
              className="flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Upgrade to Pro</span>
              <span className="sm:hidden">Pro</span>
            </Button>
          )}
          
          {subscription?.status === 'active' && (
            <div className="flex items-center gap-2 text-accent">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">Pro</span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-surface border-t border-border px-4 py-2 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-4 rounded-md transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}