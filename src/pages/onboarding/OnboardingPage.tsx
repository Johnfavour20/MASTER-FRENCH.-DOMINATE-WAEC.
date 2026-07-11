import React from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingView from '../../components/OnboardingView'
import { useAuthStore } from '../../stores/authStore'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, setOnboardingComplete } = useAuthStore()

  const handleOnboardingSuccess = () => {
    setOnboardingComplete(true)
    navigate('/dashboard')
  }

  return (
    <OnboardingView 
      userFullName={user?.name || "Johnfavour"}
      onSignupSuccess={handleOnboardingSuccess}
    />
  )
}
