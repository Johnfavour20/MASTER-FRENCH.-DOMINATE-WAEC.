/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, CheckCircle, GraduationCap, Flame, ArrowRight } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuizWidget from "./components/QuizWidget";
import DashboardWidget from "./components/DashboardWidget";
import AiValidationWidget from "./components/AiValidationWidget";
import AiTutorChat from "./components/AiTutorChat";
import FAQ from "./components/FAQ";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [userXP, setUserXP] = useState<number>(1220); // Initial XP matches screenshot
  const [userStreak, setUserStreak] = useState<number>(12); // Initial streak matches screenshot
  const [signupModalOpen, setSignupModalOpen] = useState<boolean>(false);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "Nigeria",
    examGoal: "WAEC French"
  });

  const handleGainXP = (amount: number) => {
    setUserXP(prev => prev + amount);
  };

  const incrementStreak = () => {
    setUserStreak(prev => prev + 1);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupSuccess(true);
    // Simulate active cohorte registration reward!
    setUserXP(prev => prev + 150);
    setTimeout(() => {
      setSignupModalOpen(false);
      setSignupSuccess(false);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        country: "Nigeria",
        examGoal: "WAEC French"
      });
      // Redirect to Dashboard
      setCurrentView("dashboard");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans selection:bg-brand-blue selection:text-white">
      
      {/* Navigation Header */}
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        openSignupModal={() => setSignupModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow w-full">
        {currentView === "landing" && (
          <div className="w-full">
            {/* Landing Hero */}
            <Hero 
              setCurrentView={setCurrentView} 
              openSignupModal={() => setSignupModalOpen(true)} 
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
            <Pricing openSignupModal={() => setSignupModalOpen(true)} />

            {/* FAQ Accordions */}
            <FAQ />
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
        openSignupModal={() => setSignupModalOpen(true)} 
      />

      {/* Cohorte Registration Popup Modal */}
      {signupModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-blue/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 relative animate-fade-in">
            
            {/* Close button */}
            <button
              onClick={() => setSignupModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all focus:outline-hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {signupSuccess ? (
              /* Success signup view */
              <div className="p-8 text-center flex flex-col items-center py-12 animate-slide-up">
                <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full border border-emerald-100 w-16 h-16 flex items-center justify-center mb-6 shadow-inner animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-brand-blue mb-2">Inscription Réussie !</h3>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-4">
                  Bienvenue dans la Cohorte 1, <strong className="text-brand-blue">{formData.fullName || "Amara"}</strong> ! Vous avez gagné un bonus de bienvenue de <strong className="text-amber-500 font-mono">+150 XP</strong>.
                </p>
                <div className="text-xs text-brand-blue-light bg-slate-50 px-4 py-2 rounded-xl font-bold font-mono">
                  Redirection vers votre tableau de bord...
                </div>
              </div>
            ) : (
              /* Input Form view */
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-brand-blue text-white p-2 rounded-lg">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-brand-blue leading-none">Rejoindre la Cohorte 1</h3>
                    <span className="text-[10px] text-amber-500 font-mono uppercase font-bold tracking-wider">Inscriptions limitées</span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                  Apprenez en équipe avec d'autres étudiants du Nigeria, du Ghana et du Kenya. Obtenez votre certification et dominez votre examen officiel de français !
                </p>

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1 font-mono">Nom Complet</label>
                    <input
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      placeholder="Ex. Amara Temi"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1 font-mono">Adresse Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Ex. amara@gmail.com"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1 font-mono">Pays</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-3 py-3 text-xs font-semibold transition-all"
                      >
                        <option value="Nigeria">Nigeria 🇳🇬</option>
                        <option value="Ghana">Ghana 🇬🇭</option>
                        <option value="Kenya">Kenya 🇰🇪</option>
                        <option value="Ivory Coast">Côte d'Ivoire 🇨🇮</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1 font-mono">Objectif Examen</label>
                      <select
                        name="examGoal"
                        value={formData.examGoal}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-3 py-3 text-xs font-semibold transition-all"
                      >
                        <option value="WAEC French">WAEC French</option>
                        <option value="JAMB French">JAMB French</option>
                        <option value="NECO French">NECO French</option>
                        <option value="Conversational">Conversation</option>
                      </select>
                    </div>
                  </div>

                  <button
                    id="btn-confirm-registration"
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold text-xs md:text-sm py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Valider mon inscription
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
