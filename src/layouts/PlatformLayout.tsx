import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  Menu, Search, Moon, Star, Play, RotateCcw, Users, HelpCircle, 
  Settings, Flame, Clock, MessageSquare, ChevronRight, Sparkles, GraduationCap,
  Trophy, Compass, Award, Activity, BookOpen, Shield, LogOut
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

export const PlatformLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, updateXP } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const activePath = location.pathname

  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", path: "/dashboard", icon: Compass },
    { id: "parcours", label: "Parcours", path: "/parcours", icon: Award },
    { id: "blitz", label: "Le Blitz", path: "/blitz", icon: Play },
    { id: "exams", label: "Examens du Vendredi", path: "/examens", icon: Shield, badge: "IA" },
    { id: "chat", label: "Salon d'étude", path: "/chat", icon: MessageSquare },
    { id: "profile", label: "Mon Profil", path: "/profil", icon: Users },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] flex font-sans antialiased text-[#002B5B]">
      
      {/* 1. Side Navigation Rail (Desktop - Collapsible) */}
      <aside className={`border-r border-slate-100 bg-white flex flex-col justify-between shrink-0 sticky top-0 h-screen hidden md:flex z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-6 overflow-y-auto">
          {/* Logo with Cap Icon */}
          <div 
            className="flex items-center gap-3 cursor-pointer group mb-8"
            onClick={() => navigate('/')}
          >
            <div className="bg-[#002B5B] p-1.5 rounded-xl text-white group-hover:bg-blue-800 transition-all shadow-md shrink-0">
              <GraduationCap className="w-5 h-5 stroke-[2.5]" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-display font-black text-lg tracking-tight text-[#002B5B] block leading-none">
                  La Plume
                </span>
                <span className="text-[9px] uppercase tracking-widest font-mono text-amber-500 font-bold block -mt-0.5">
                  French Prep
                </span>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.id}
                  id={`platform-sidebar-${item.id}`}
                  onClick={() => navigate(item.path)}
                  title={sidebarOpen ? undefined : item.label}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  } ${!sidebarOpen && 'justify-center'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : ""}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </div>
                  {sidebarOpen && item.badge && (
                    <span className="bg-rose-500/15 text-rose-400 text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm border border-rose-500/25">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-slate-100 space-y-1">
          <button 
            onClick={() => navigate('/profil')}
            title={sidebarOpen ? undefined : 'Paramètres'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer justify-center"
          >
            <Settings className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Paramètres</span>}
          </button>
          <button 
            onClick={handleLogout}
            title={sidebarOpen ? undefined : 'Déconnexion'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer justify-center"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* Top Header/Navbar */}
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            {/* Desktop Sidebar Toggle */}
            <button 
              id="desktop-sidebar-toggle" 
              className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer hidden md:block"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Basculer la barre latérale"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              id="mobile-menu-toggle" 
              className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Menu principal"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            
            {/* Mobile Brand Logo */}
            <div className="flex items-center gap-2 cursor-pointer md:hidden" onClick={() => navigate('/')}>
              <div className="bg-[#002B5B] p-1.5 rounded-xl text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight text-[#002B5B]">
                La Plume
              </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative w-full max-w-xs xl:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="platform-search"
                type="text"
                placeholder="Rechercher un cours, un badge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-2 px-10 text-xs font-medium text-slate-600 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            {user && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full text-xs font-black shadow-3xs">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{user.streak}j</span>
              </div>
            )}

            {/* Theme Toggle */}
            <button 
              id="theme-toggle" 
              className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Changer de thème"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* XP Badge */}
            {user && (
              <div className="flex items-center gap-1.5 bg-[#FFFCE8] border border-[#FFEB85] text-[#A67C00] px-3 py-1 rounded-full text-xs font-extrabold shadow-3xs">
                <div className="w-4.5 h-4.5 rounded-full bg-[#FFD214] flex items-center justify-center text-white shrink-0">
                  <Star className="w-2.5 h-2.5 fill-white text-[#FFD214]" />
                </div>
                <span>{user.xp} XP</span>
              </div>
            )}

            {/* User Avatar Circle */}
            <div 
              onClick={() => navigate('/profil')}
              className="w-8 h-8 rounded-full bg-[#002B5B] hover:bg-blue-800 transition-all flex items-center justify-center text-white text-xs font-black cursor-pointer border border-slate-100"
              title="Mon Profil"
            >
              {user ? user.name.slice(0, 2).toUpperCase() : 'JI'}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            
            {/* Drawer Content */}
            <div className="relative w-64 max-w-xs bg-white h-full flex flex-col justify-between p-6 shadow-xl animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2" onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>
                    <div className="bg-[#002B5B] p-1.5 rounded-xl text-white">
                      <GraduationCap className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="font-display font-black text-base text-[#002B5B] block leading-none">La Plume</span>
                      <span className="text-[8px] uppercase tracking-widest font-mono text-amber-500 font-bold block -mt-0.5">French Prep</span>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePath === item.path;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                          isActive 
                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : ""}`} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-1">
                <button 
                  onClick={() => { navigate('/profil'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  <Settings className="w-4 h-4" />
                  <span>Paramètres</span>
                </button>
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Router View Outlet */}
        <main className="flex-grow w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default PlatformLayout
