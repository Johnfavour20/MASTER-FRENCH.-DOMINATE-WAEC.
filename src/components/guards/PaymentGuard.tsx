import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface GuardProps {
  children?: React.ReactNode
}

export const PaymentGuard: React.FC<GuardProps> = ({ children }) => {
  const { user } = useAuthStore()

  if (user && !user.isPremium && user.trialExpired) {
    return <Navigate to="/plan-selection" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default PaymentGuard
