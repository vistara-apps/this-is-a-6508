import React from 'react'

export function InfoCard({ children, variant = 'default', className = '', ...props }) {
  const baseClasses = 'bg-surface border border-border rounded-lg p-4 shadow-card'
  
  const variantClasses = {
    default: '',
    highlighted: 'border-accent bg-accent/5',
  }
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}