import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const PublicLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname

  // Map pathnames to their respective "currentView" representations for legacy support
  const getMappedView = (path: string) => {
    if (path === '/') return 'landing'
    if (path === '/login') return 'login'
    if (path === '/register') return 'signup'
    if (path === '/plan-selection') return 'plan-selection'
    return 'landing'
  }

  const handleSetCurrentView = (view: string) => {
    if (view === 'landing') navigate('/')
    else if (view === 'login') navigate('/login')
    else if (view === 'signup') navigate('/register')
    else if (view === 'plan-selection') navigate('/plan-selection')
    else if (view === 'dashboard') navigate('/dashboard')
    else if (view === 'parcours') navigate('/parcours')
    else if (view === 'quiz') navigate('/quiz')
    else if (view === 'validation') navigate('/validation')
    else if (view === 'chat') navigate('/chat')
    else if (view === 'profile') navigate('/profil')
  }

  const currentView = getMappedView(currentPath)

  // Show header on /, /login, /register, /plan-selection, /verify-email
  const showHeader = ['/', '/login', '/register', '/plan-selection', '/verify-email'].includes(currentPath)

  // Show footer only on / (landing)
  const showFooter = currentPath === '/'

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans selection:bg-[#163673] selection:text-white">
      {showHeader && (
        <Header
          currentView={currentView}
          setCurrentView={handleSetCurrentView}
          openSignupModal={() => navigate('/register')}
        />
      )}
      
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      
      {showFooter && (
        <Footer
          setCurrentView={handleSetCurrentView}
          openSignupModal={() => navigate('/register')}
        />
      )}
    </div>
  )
}

export default PublicLayout
