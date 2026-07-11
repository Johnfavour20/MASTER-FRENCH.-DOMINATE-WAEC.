import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface GuardProps {
  children?: React.ReactNode
}

export const OnboardingGuard: React.FC<GuardProps> = ({ children }) => {
  const { user } = useAuthStore()

  if (user && !user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default OnboardingGuard
