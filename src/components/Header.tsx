/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GraduationCap, LogIn, ChevronDown, Sparkles } from "lucide-react";

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openSignupModal: () => void;
}

export default function Header({ currentView, setCurrentView, openSignupModal }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView("landing")} 
          className="flex items-center gap-2 cursor-pointer group"
          id="brand-logo"
        >
          <div className="bg-brand-blue p-2 rounded-xl text-white group-hover:bg-brand-blue-light transition-all shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-brand-blue block">
              La Plume
            </span>
            <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-bold -mt-1 block">
              French Prep
            </span>
          </div>
        </div>

        {/* Navigation - Centered Desktop Link Grid */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
          <button
            id="nav-home"
            onClick={() => setCurrentView("landing")}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentView === "landing"
                ? "bg-slate-50 text-brand-blue font-bold"
                : "hover:bg-slate-50 hover:text-brand-blue"
            }`}
          >
            Accueil
          </button>
          
          <button
            id="nav-dashboard"
            onClick={() => setCurrentView("dashboard")}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentView === "dashboard"
                ? "bg-slate-50 text-brand-blue font-bold"
                : "hover:bg-slate-50 hover:text-brand-blue"
            }`}
          >
            Tableau de Bord
          </button>

          <button
            id="nav-quiz"
            onClick={() => setCurrentView("quiz")}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentView === "quiz"
                ? "bg-slate-50 text-brand-blue font-bold"
                : "hover:bg-slate-50 hover:text-brand-blue"
            }`}
          >
            Pratique Quiz
          </button>

          <button
            id="nav-validation"
            onClick={() => setCurrentView("validation")}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentView === "validation"
                ? "bg-slate-50 text-brand-blue font-bold"
                : "hover:bg-slate-50 hover:text-brand-blue"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              AI Validation
            </span>
          </button>

          <button
            id="nav-chat"
            onClick={() => setCurrentView("chat")}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentView === "chat"
                ? "bg-slate-50 text-brand-blue font-bold"
                : "hover:bg-slate-50 hover:text-brand-blue"
            }`}
          >
            Tuteur d'IA Direct
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            id="btn-login"
            onClick={() => setCurrentView("login")}
            className="flex items-center gap-1.5 text-slate-700 hover:text-brand-blue font-medium text-sm px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-slate-50"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Se connecter</span>
          </button>

          <button
            id="btn-join-cohort"
            onClick={openSignupModal}
            className="bg-brand-blue hover:bg-brand-blue-light text-white text-xs md:text-sm font-semibold px-4 md:px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Rejoindre cohorte 1
          </button>
        </div>
      </div>
    </header>
  );
}
