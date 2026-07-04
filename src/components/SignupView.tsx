/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  GraduationCap, ArrowRight, Eye, EyeOff, Sparkles, Compass, 
  MapPin, BookOpen, Target, Check, Trophy, Heart, Shield, Flame
} from "lucide-react";

interface SignupViewProps {
  setCurrentView: (view: string) => void;
  onSignupSuccess: (name: string) => void;
}

export default function SignupView({ setCurrentView, onSignupSuccess }: SignupViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Côte d'Ivoire",
    school: "",
    classe: "Terminale (S/L/ES)",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onSignupSuccess(formData.fullName || "Amara");
    }, 2200);
  };

  if (isSuccess) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] bg-[#fef2f0] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden border border-rose-100/50 text-center flex flex-col items-center py-12 animate-slide-up">
          <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full border border-emerald-100 w-16 h-16 flex items-center justify-center mb-6 shadow-inner animate-bounce">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="font-display text-2xl font-extrabold text-brand-blue mb-2">Inscription Réussie !</h3>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-4">
            Bienvenue dans la Cohorte 1, <strong className="text-brand-blue">{formData.fullName || "Amara"}</strong> ! Vous avez gagné un bonus de bienvenue de <strong className="text-amber-500 font-mono">+150 XP</strong>.
          </p>
          <div className="text-xs text-brand-blue-light bg-slate-50 px-4 py-2 rounded-xl font-bold font-mono">
            Redirection vers votre tableau de bord...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
      
      {/* LHS Section: Soft Peach/Rose background containing the sign-up card */}
      <div className="w-full lg:w-[58%] bg-[#fef2f0] py-12 px-4 md:px-8 lg:px-12 flex items-center justify-center">
        
        {/* Main Sign-up white card */}
        <div className="bg-white w-full max-w-[560px] rounded-3xl p-6 md:p-8 shadow-xl border border-rose-100/40 relative">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-[#e6ebf4] text-[#1e3a8a] text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <Compass className="w-4 h-4 text-brand-blue" />
            <span>Inscription pour Cohorte 1 — Commence dans 29 jours</span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            Commençons.
          </h2>
          <p className="text-slate-500 text-sm mb-6 font-medium">
            Rejoignez l'élite académique et préparez-vous pour le succès.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Grid 1: Nom complet & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Nom complet
                </label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Ex: Jean Kouassi"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="nom@exemple.com"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Grid 2: Téléphone & Pays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Téléphone
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234  80 0000 0000"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Pays
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all cursor-pointer"
                >
                  <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                  <option value="Ghana">🇬🇭 Ghana</option>
                  <option value="Kenya">🇰🇪 Kenya</option>
                </select>
              </div>
            </div>

            {/* Grid 3: École & Classe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  École
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    placeholder="Nom de votre établissement"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl pl-4 pr-10 py-3 text-xs md:text-sm font-semibold transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    🏢
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Classe
                </label>
                <select
                  name="classe"
                  value={formData.classe}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all cursor-pointer"
                >
                  <option value="Terminale (S/L/ES)">Terminale (S/L/ES)</option>
                  <option value="Première">Première</option>
                  <option value="Seconde">Seconde</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            {/* Grid 4: Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="********"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl pl-4 pr-10 py-3 text-xs md:text-sm font-semibold transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Confirmer
                </label>
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="********"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                id="agreeToTerms"
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
                className="w-4 h-4 rounded-sm border-slate-200 text-brand-blue focus:ring-brand-blue mt-0.5 cursor-pointer"
              />
              <label htmlFor="agreeToTerms" className="text-xs text-slate-600 font-medium leading-relaxed select-none cursor-pointer">
                J'accepte les <span className="text-brand-blue underline cursor-pointer hover:text-brand-blue-light">Conditions d'Utilisation</span> et la <span className="text-brand-blue underline cursor-pointer hover:text-brand-blue-light">Politique de Confidentialité</span>.
              </label>
            </div>

            {/* Main Submit Button */}
            <button
              type="submit"
              className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer text-sm"
            >
              Créer Mon Compte
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* OU Divider */}
          <div className="relative flex py-4 items-center mt-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 font-mono">OU</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={() => {
              onSignupSuccess("User (Google)");
            }}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-full border border-slate-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all text-xs"
          >
            🗺️ Continuer avec Google
          </button>

          {/* Footer sign-in switch link */}
          <div className="text-center mt-6 text-xs text-slate-500 font-medium">
            Vous avez déjà un compte?{" "}
            <button
              onClick={() => setCurrentView("dashboard")}
              className="text-brand-blue font-bold underline hover:text-brand-blue-light cursor-pointer"
            >
              Se connecter
            </button>
          </div>

        </div>

      </div>

      {/* RHS Section: Deep blue content containing features, quotes, and leaderboard */}
      <div className="w-full lg:w-[42%] bg-brand-blue py-16 px-6 md:px-12 text-white flex flex-col justify-between relative overflow-hidden">
        
        {/* Subtle decorative mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.4),transparent)] pointer-events-none" />

        {/* Brand Logo & Slogan Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-brand-yellow">
              <GraduationCap className="w-6 h-6 fill-brand-yellow/15" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight">
              La Plume
            </span>
          </div>
          <p className="text-slate-300 text-sm font-medium">
            L'excellence académique à portée de main.
          </p>
        </div>

        {/* Middle Area: Quote and Gold line */}
        <div className="my-10 relative z-10 max-w-sm">
          <p className="font-display italic text-lg md:text-xl text-slate-100 font-medium leading-relaxed">
            "La plume est plus puissante que l'épée."
          </p>
          <div className="w-20 h-1 bg-brand-yellow rounded-full mt-4" />
        </div>

        {/* Live Leaderboard Interactive Widget card */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-sm">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono tracking-widest text-brand-yellow font-bold uppercase">
              CLASSEMENT EN DIRECT
            </span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </div>

          {/* List */}
          <div className="space-y-2.5">
            {[
              { rank: 1, name: "Ibrahim S.", country: "🇸🇳", xp: "2,450 XP", color: "text-amber-500", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" },
              { rank: 2, name: "Awa D.", country: "🇨🇮", xp: "2,120 XP", color: "text-slate-300", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60" },
              { rank: 3, name: "Kofi B.", country: "🇬🇭", xp: "1,980 XP", color: "text-amber-700", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=60" },
              { rank: 4, name: "Zainab L.", country: "🇳🇬", xp: "1,840 XP", color: "text-slate-400", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=60" }
            ].map((usr, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-white/2 border border-white/5 px-3 py-2 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className={`font-mono font-bold ${usr.color}`}>{usr.rank}</span>
                  <img src={usr.avatar} alt={usr.name} className="w-6 h-6 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                  <span className="font-semibold text-slate-100">{usr.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">{usr.country}</span>
                  <span className="font-bold text-amber-400 font-mono text-[11px]">{usr.xp}</span>
                </div>
              </div>
            ))}

            {/* Current User highlighted placeholder */}
            <div className="flex items-center justify-between text-xs bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 rounded-xl">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-black text-brand-yellow">5</span>
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-brand-yellow/30 flex items-center justify-center text-xs">
                  👤
                </div>
                <span className="font-black text-brand-yellow uppercase tracking-wider text-[11px]">Vous</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">--</span>
                <span className="font-black text-brand-yellow font-mono text-[11px]">0 XP</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Student Count and Overlapping Avatars */}
        <div className="relative z-10 flex items-center justify-between max-w-sm mt-auto border-t border-white/10 pt-6">
          <div>
            <h4 className="text-xl md:text-2xl font-black text-white font-mono tracking-tight leading-none">
              4,200
            </h4>
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-extrabold mt-1">
              Étudiants inscrits
            </p>
          </div>

          <div className="flex items-center">
            {/* Multi-avatar stack */}
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border border-brand-blue object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Student" referrerPolicy="no-referrer" />
              <img className="w-8 h-8 rounded-full border border-brand-blue object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Student" referrerPolicy="no-referrer" />
              <img className="w-8 h-8 rounded-full border border-brand-blue object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="Student" referrerPolicy="no-referrer" />
            </div>
            {/* Plus yellow badge */}
            <div className="w-8 h-8 rounded-full bg-brand-yellow text-brand-blue font-extrabold text-xs flex items-center justify-center border border-brand-blue -ml-2 font-mono shadow-md">
              +
            </div>
          </div>
        </div>

        {/* Pill Badges wrapped at the bottom */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-6 max-w-sm">
          <span className="bg-white/10 border border-white/10 text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            📈 +34% d'amélioration moy.
          </span>
          <span className="bg-white/10 border border-white/10 text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            🏆 Top student
          </span>
          <span className="bg-white/10 border border-white/10 text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            🔥 Streak record
          </span>
        </div>

      </div>

    </div>
  );
}
