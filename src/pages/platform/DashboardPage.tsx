import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardWidget from '../../components/DashboardWidget'
import { useAuthStore } from '../../stores/authStore'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleSetCurrentView = (view: string) => {
    if (view === 'parcours') navigate('/parcours')
    else if (view === 'blitz') navigate('/blitz')
    else if (view === 'quiz') navigate('/quiz')
    else if (view === 'validation') navigate('/validation')
    else if (view === 'chat') navigate('/chat')
    else if (view === 'profile') navigate('/profil')
    else if (view === 'plan-selection') navigate('/plan-selection')
    else if (view === 'landing') navigate('/')
  }

  return (
    <DashboardWidget
      userXP={user?.xp ?? 680}
      userStreak={user?.streak ?? 12}
      isPremium={user?.isPremium ?? false}
      userFullName={user?.name ?? "Johnfavour"}
      setCurrentView={handleSetCurrentView}
      hideHeader={true}
    />
  )
}

export default DashboardPage
