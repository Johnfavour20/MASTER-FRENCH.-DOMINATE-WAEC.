import React from 'react'
import { useNavigate } from 'react-router-dom'
import ParcoursView from '../../components/ParcoursView'
import { useAuthStore } from '../../stores/authStore'

export default function ParcoursPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleSetCurrentView = (view: string) => {
    if (view === 'dashboard') navigate('/dashboard')
    else if (view === 'blitz') navigate('/blitz')
    else if (view === 'exams') navigate('/examens')
    else if (view === 'profile') navigate('/profil')
    else if (view === 'landing') navigate('/')
    else if (view === 'lesson-viewer') navigate('/cours/l1')
  }

  return (
    <ParcoursView
      userXP={user?.xp ?? 680}
      userStreak={user?.streak ?? 12}
      isPremium={user?.isPremium ?? false}
      setCurrentView={handleSetCurrentView}
      hideSidebar={true}
    />
  )
}
