import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlitzArena from '../../components/BlitzArena'
import { useAuthStore } from '../../stores/authStore'

export default function BlitzPage() {
  const navigate = useNavigate()
  const { user, updateXP } = useAuthStore()

  const handleSetCurrentView = (view: string) => {
    if (view === 'dashboard') navigate('/dashboard')
    else if (view === 'parcours') navigate('/parcours')
    else if (view === 'landing') navigate('/')
    else if (view === 'results') navigate('/blitz/results')
  }

  return (
    <BlitzArena
      userXP={user?.xp ?? 680}
      userStreak={user?.streak ?? 12}
      isPremium={user?.isPremium ?? false}
      setCurrentView={handleSetCurrentView}
      onGainXP={(amount) => updateXP(amount)}
    />
  )
}
