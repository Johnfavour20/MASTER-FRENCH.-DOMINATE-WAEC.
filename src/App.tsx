/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Flame } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuizWidget from "./components/QuizWidget";
import DashboardWidget from "./components/DashboardWidget";
import AiValidationWidget from "./components/AiValidationWidget";
import AiTutorChat from "./components/AiTutorChat";
import FAQ from "./components/FAQ";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import SignupView from "./components/SignupView";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [userXP, setUserXP] = useState<number>(1220); // Initial XP matches screenshot
  const [userStreak, setUserStreak] = useState<number>(12); // Initial streak matches screenshot

  const handleGainXP = (amount: number) => {
    setUserXP(prev => prev + amount);
  };

  const incrementStreak = () => {
    setUserStreak(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans selection:bg-brand-blue selection:text-white">
      
      {/* Navigation Header */}
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        openSignupModal={() => setCurrentView("signup")}
      />

      {/* Main Content Sections */}
      <main className="flex-grow w-full">
        {currentView === "landing" && (
          <div className="w-full">
            {/* Landing Hero */}
            <Hero 
              setCurrentView={setCurrentView} 
              openSignupModal={() => setCurrentView("signup")} 
            />

            {/* Inline Quick Teaser Widgets to spark engagement */}
            <div className="w-full bg-slate-50 border-t border-slate-100 py-16">
              <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-coral block font-mono">Démo Interactive</span>
                  <h3 className="font-display text-2xl font-black text-brand-blue mt-1">Tester l'expérience La Plume</h3>
                  <p className="text-slate-500 text-sm mt-1">Pratiquez avec notre outil réel d'examen ci-dessous.</p>
                </div>
                <QuizWidget 
                  onGainXP={handleGainXP} 
                  incrementStreak={incrementStreak} 
                />
              </div>
            </div>

            {/* Pricing Offer */}
            <Pricing openSignupModal={() => setCurrentView("signup")} />

            {/* FAQ Accordions */}
            <FAQ />
          </div>
        )}

        {currentView === "signup" && (
          <div className="w-full">
            <SignupView 
              setCurrentView={setCurrentView}
              onSignupSuccess={(name) => {
                setUserXP(prev => prev + 150);
                setCurrentView("dashboard");
              }}
            />
          </div>
        )}

        {currentView === "dashboard" && (
          <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <DashboardWidget 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
            />
          </div>
        )}

        {currentView === "quiz" && (
          <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold uppercase px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Défis Quotidiens
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-blue tracking-tight mt-2">
                Pratique d'Examen Interactive
              </h2>
            </div>
            <QuizWidget 
              onGainXP={handleGainXP} 
              incrementStreak={incrementStreak} 
            />
          </div>
        )}

        {currentView === "validation" && (
          <div className="w-full">
            <AiValidationWidget onGainXP={handleGainXP} />
          </div>
        )}

        {currentView === "chat" && (
          <div className="w-full">
            <AiTutorChat />
          </div>
        )}
      </main>

      {/* Persistent Beautiful Footer */}
      <Footer 
        setCurrentView={setCurrentView} 
        openSignupModal={() => setCurrentView("signup")} 
      />

    </div>
  );
}
