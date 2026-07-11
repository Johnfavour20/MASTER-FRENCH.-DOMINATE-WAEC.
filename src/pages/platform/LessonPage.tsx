import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LessonViewer from '../../components/LessonViewer'
import { useAuthStore } from '../../stores/authStore'

export default function LessonPage() {
  const navigate = useNavigate()
  const { lessonId } = useParams()
  const { user, updateXP } = useAuthStore()

  const handleSetCurrentView = (view: string) => {
    if (view === 'parcours') navigate('/parcours')
    else if (view === 'dashboard') navigate('/dashboard')
    else if (view === 'landing') navigate('/')
  }

  return (
    <LessonViewer
      userXP={user?.xp ?? 680}
      userStreak={user?.streak ?? 12}
      setCurrentView={handleSetCurrentView}
      onGainXP={(amount) => updateXP(amount)}
    />
  )
}
