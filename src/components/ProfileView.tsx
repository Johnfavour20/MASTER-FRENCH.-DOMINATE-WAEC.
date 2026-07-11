/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, Lock, Bell, Palette, Shield, Award, Sparkles, Check, 
  ChevronRight, Laptop, Smartphone, Mail, MessageSquare, AlertTriangle, 
  Trash2, RefreshCw, Eye, EyeOff, Star, Flame, Trophy, Globe, GraduationCap, ArrowLeft
} from "lucide-react";

interface ProfileViewProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  isPremium?: boolean;
  userFullName?: string;
}

export default function ProfileView({
  userXP,
  userStreak,
  setCurrentView,
  isPremium = false,
  userFullName = "Johnfavour"
}: ProfileViewProps) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>("profil");

  // Editable Profile Form state
  const [firstName, setFirstName] = useState<string>(userFullName);
  const [lastName, setLastName] = useState<string>("Igboeche");
  const [email, setEmail] = useState<string>("johnfavour.igboeche@example.com");
  const [grade, setGrade] = useState<string>("Terminale (Grade 12)");
  const [nativeLanguage, setNativeLanguage] = useState<string>("Anglais");
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Security Form state
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [pwdStrength, setPwdStrength] = useState<string>("Faible");
  const [pwdStrengthPercent, setPwdStrengthPercent] = useState<number>(30);
  const [securitySaved, setSecuritySaved] = useState<boolean>(false);

  // Notification toggles
  const [notifEmail, setNotifEmail] = useState<boolean>(true);
  const [notifWhatsapp, setNotifWhatsapp] = useState<boolean>(false);
  const [notifBrowser, setNotifBrowser] = useState<boolean>(true);

  // Apparence state
  const [textSize, setTextSize] = useState<string>("normal");

  // Confidentialite state
  const [profileVisibility, setProfileVisibility] = useState<string>("public");

  // Active Sessions state (Mock)
  const [sessions, setSessions] = useState([
    { id: 1, device: "MacBook Pro 14\"", browser: "Chrome (MacOS)", ip: "192.168.1.1", loc: "Lagos, Nigeria", isCurrent: true },
    { id: 2, device: "iPhone 13", browser: "Safari (iOS)", ip: "192.168.1.5", loc: "Lagos, Nigeria", isCurrent: false }
  ]);

  // Modal State for danger actions
  const [modalType, setModalType] = useState<"reset" | "delete" | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewPassword(val);
    if (val.length === 0) {
      setPwdStrength("Faible");
      setPwdStrengthPercent(10);
    } else if (val.length < 6) {
      setPwdStrength("Faible");
      setPwdStrengthPercent(30);
    } else if (val.length < 10) {
      setPwdStrength("Moyen");
      setPwdStrengthPercent(65);
    } else {
      setPwdStrength("Fort");
      setPwdStrengthPercent(100);
    }
  };

  const handleSaveSecurity = () => {
    setSecuritySaved(true);
    setOldPassword("");
    setNewPassword("");
    setTimeout(() => setSecuritySaved(false), 3000);
  };

  const handleRevokeSession = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const executeDangerAction = () => {
    if (modalType === "reset") {
      alert("Votre progression a été réinitialisée avec succès.");
    } else if (modalType === "delete") {
      alert("Votre compte a été supprimé. Redirection vers la page d'accueil.");
      setCurrentView("landing");
    }
    setModalType(null);
  };

  // Profile tabs list
  const tabs = [
    { id: "profil", label: "Profil", icon: User },
    { id: "badges", label: "Badges", icon: Award },
    { id: "connexion", label: "Connexion & Sécurité", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "apparence", label: "Apparence", icon: Palette },
    { id: "confidentialite", label: "Confidentialité", icon: Shield }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-800 antialiased">
      
      {/* 1. Header Navigation Bar */}
      <div className="bg-white border-b border-slate-100 py-3.5 px-4 sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-brand-blue transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Tableau de Bord</span>
          </button>
          
          <div className="flex items-center gap-3">
            {/* Quick XP Pill */}
            <div className="flex items-center gap-1.5 bg-[#FFFCE8] border border-[#FFEB85] text-[#A67C00] px-3 py-1 rounded-full text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-[#FFD214] text-[#FFD214]" />
              <span>{userXP} XP</span>
            </div>
            {/* Quick Streak Pill */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-black">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{userStreak} Jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Profile Hero Section */}
      <div className="relative overflow-hidden w-full h-44 md:h-52 bg-gradient-to-r from-blue-100 via-slate-50 to-pink-50 border-b border-slate-100 flex items-end">
        {/* Ambient abstract background blobs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-48 h-48 bg-rose-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl w-full mx-auto px-4 pb-6 flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-10">
          
          {/* Avatar Container */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white bg-brand-blue text-white shadow-lg flex items-center justify-center text-3xl font-black relative overflow-hidden -mb-1 sm:-mb-3 shrink-0">
            {firstName.substring(0, 1).toUpperCase()}
            {lastName.substring(0, 1).toUpperCase()}
            
            {isPremium && (
              <div className="absolute bottom-0 inset-x-0 bg-amber-500 text-white text-[8px] font-black uppercase text-center py-0.5 tracking-wider">
                PRO
              </div>
            )}
          </div>

          {/* User Bio Details */}
          <div className="flex-grow pb-1">
            <h1 className="font-display font-black text-xl md:text-2xl text-slate-800 leading-tight">
              {firstName} {lastName}
            </h1>
            
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-amber-100/80 border border-amber-200 text-amber-800 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-3xs">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Level 3 Elite Cadet
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] md:text-xs font-semibold flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                Nigeria • {grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Tab Bar Selector */}
      <div className="bg-white border-b border-slate-200 sticky top-12 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-6 md:gap-8 overflow-x-auto py-3.5 scrollbar-none">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-1 font-sans text-xs md:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                    isActive 
                      ? "border-brand-blue text-brand-blue" 
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? "text-brand-blue" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Active Tab Content Canvas */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* TAB 1: PROFIL - INFORMATIONS PERSONNELLES */}
        {activeTab === "profil" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-display font-black text-lg text-slate-800">Informations Personnelles</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Mettez à jour vos informations de compte La Plume.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Prénom</label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-blue focus:outline-hidden transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Nom de famille</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-blue focus:outline-hidden transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Adresse E-mail</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-blue focus:outline-hidden transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Parcours Académique</label>
                      <select 
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-850 focus:bg-white focus:border-brand-blue focus:outline-hidden transition-all"
                      >
                        <option value="Terminale (Grade 12)">Terminale (Grade 12)</option>
                        <option value="Première (Grade 11)">Première (Grade 11)</option>
                        <option value="Seconde (Grade 10)">Seconde (Grade 10)</option>
                        <option value="Autre niveau">Autre niveau</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Langue Maternelle</label>
                      <input 
                        type="text" 
                        value={nativeLanguage}
                        onChange={(e) => setNativeLanguage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-blue focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-4">
                    {isSaved ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 animate-pulse">
                        <Check className="w-4 h-4 stroke-[3]" /> Modifications enregistrées !
                      </span>
                    ) : <span />}

                    <button
                      type="submit"
                      className="bg-brand-blue hover:bg-brand-blue-light text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar Leaderboard Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 font-mono">Leaderboard Preview</h4>
                  <Eye className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex flex-col items-center p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-blue text-white flex items-center justify-center font-display font-black text-xl mb-3 border-2 border-amber-300 relative">
                    <div className="absolute top-0 right-0 w-4.5 h-4.5 bg-emerald-500 border-2 border-white rounded-full" />
                    {firstName.substring(0, 1).toUpperCase()}
                    {lastName.substring(0, 1).toUpperCase()}
                  </div>
                  
                  <p className="font-display font-black text-base text-slate-800">
                    {firstName} {lastName.substring(0, 1)}.
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5 justify-center">
                    <img src="https://flagcdn.com/w20/ng.png" alt="Nigeria" className="w-3.5 h-2.5 object-cover rounded-xs" />
                    Nigeria
                  </p>

                  <div className="w-full space-y-2 mt-5">
                    <div className="flex justify-between items-center bg-white border border-slate-100 p-2.5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score WAEC estimé</span>
                      <span className="text-xs font-black text-brand-blue">89%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white border border-slate-100 p-2.5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rang National</span>
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">#12</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className="mt-5 w-full py-2.5 text-[10px] font-black uppercase tracking-wider text-brand-blue border border-brand-blue hover:bg-slate-100/50 rounded-xl transition-all cursor-pointer"
                  >
                    Voir mon profil public
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BADGES - GAMIFIED ACHIEVEMENTS */}
        {activeTab === "badges" && (
          <div className="space-y-8">
            
            {/* Overview Stats Bento Box Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Badges Unlocked */}
              <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                  <Award className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Badges Déverrouillés</p>
                  <p className="text-lg font-black text-slate-800">12 / 52</p>
                </div>
              </div>

              {/* XP from Achievements */}
              <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue">
                  <Trophy className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">XP de Badges accumulés</p>
                  <p className="text-lg font-black text-slate-800">1,450 XP</p>
                </div>
              </div>

              {/* Current Level */}
              <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Niveau de Compte</p>
                  <p className="text-lg font-black text-slate-800">Niveau 14</p>
                </div>
              </div>

            </div>

            {/* Badges categories */}
            <div className="space-y-8">
              
              {/* 1. Séries & Discipline */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <h3 className="font-display font-black text-base text-slate-800">Séries &amp; Discipline</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Badge 1 */}
                  <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-xs transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      📅
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">Apprenti Constant</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Série de 3 jours</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black rounded-lg">+50 XP</span>
                  </div>

                  {/* Badge 2 */}
                  <div className="bg-white border-2 border-brand-blue-light/20 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-xs transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      🔥
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">Routine d'Or</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Série de 7 jours</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-brand-blue/5 text-brand-blue border border-brand-blue/10 text-[9px] font-black rounded-lg">+150 XP</span>
                  </div>

                  {/* Badge 3 (Locked) */}
                  <div className="bg-white/70 border-2 border-slate-100/50 p-4 rounded-2xl flex flex-col items-center text-center opacity-45">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl mb-3">
                      👑
                    </div>
                    <h4 className="text-xs font-black text-slate-500 leading-tight">Le Discipliné</h4>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1 uppercase">Série de 30 jours</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-lg">+500 XP</span>
                  </div>

                  {/* Badge 4 (Locked) */}
                  <div className="bg-white/70 border-2 border-slate-100/50 p-4 rounded-2xl flex flex-col items-center text-center opacity-45">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl mb-3">
                      💎
                    </div>
                    <h4 className="text-xs font-black text-slate-500 leading-tight">Immortel</h4>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1 uppercase">Série de 100 jours</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-lg">+2000 XP</span>
                  </div>
                </div>
              </div>

              {/* 2. Arène Le Blitz */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <h3 className="font-display font-black text-base text-slate-800">Arène Le Blitz</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Badge 1 */}
                  <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-xs transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      ⏱️
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">Premier Blitz</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Finir un Quiz Blitz</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black rounded-lg">+30 XP</span>
                  </div>

                  {/* Badge 2 */}
                  <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-xs transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      🎯
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">Blitz Parfait</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">10/10 sans faute</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-brand-blue/5 text-brand-blue border border-brand-blue/10 text-[9px] font-black rounded-lg">+250 XP</span>
                  </div>

                  {/* Badge 3 */}
                  <div className="bg-white border-2 border-amber-200 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-xs transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      🚀
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">Sonic</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Blitz en &lt; 60s</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black rounded-lg">+400 XP</span>
                  </div>

                  {/* Badge 4 (Special Premium or Pro Achievement) */}
                  <div className="bg-slate-900 border-2 border-amber-400 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-md transition-all cursor-pointer shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-amber-400/20 rounded-bl-full pointer-events-none" />
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      🌩️
                    </div>
                    <h4 className="text-xs font-black text-amber-400 leading-tight">Dieu du Blitz</h4>
                    <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">Gagner 50 duels</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-amber-450 text-slate-950 text-[9px] font-black rounded-lg">+1500 XP</span>
                  </div>
                </div>
              </div>

              {/* 3. Maîtrise Académique */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  <h3 className="font-display font-black text-base text-slate-800">Maîtrise Académique</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Badge 1 */}
                  <div className="bg-white border-2 border-brand-blue-light/10 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-xs transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      🖋️
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">Grammaire Pro</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Zéro faute accord</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-brand-blue/5 text-brand-blue border border-brand-blue/10 text-[9px] font-black rounded-lg">+100 XP</span>
                  </div>

                  {/* Badge 2 */}
                  <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-xs transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      🔄
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">Maître des Verbes</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Quiz Conjugaison Parfait</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-brand-blue/5 text-brand-blue border border-brand-blue/10 text-[9px] font-black rounded-lg">+200 XP</span>
                  </div>

                  {/* Badge 3 (Locked) */}
                  <div className="bg-white/70 border-2 border-slate-100/50 p-4 rounded-2xl flex flex-col items-center text-center opacity-45">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl mb-3">
                      📖
                    </div>
                    <h4 className="text-xs font-black text-slate-500 leading-tight">Lecteur Assidu</h4>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1 uppercase">10 fiches lues</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-lg">+75 XP</span>
                  </div>

                  {/* Badge 4 (Locked) */}
                  <div className="bg-white/70 border-2 border-slate-100/50 p-4 rounded-2xl flex flex-col items-center text-center opacity-45">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl mb-3">
                      🌋
                    </div>
                    <h4 className="text-xs font-black text-slate-500 leading-tight">Encyclopédiste</h4>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1 uppercase">Toutes fiches lues</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-lg">+1000 XP</span>
                  </div>
                </div>
              </div>

              {/* 4. Projets & Rédaction */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✉️</span>
                  <h3 className="font-display font-black text-base text-slate-800">Projets &amp; Rédaction</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Badge 1 */}
                  <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-xs transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      🪶
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">Plumiste</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Première rédaction</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black rounded-lg">+50 XP</span>
                  </div>

                  {/* Badge 2 */}
                  <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center hover:scale-102 hover:shadow-xs transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl mb-3 shadow-3xs">
                      📜
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">Épistolier</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Meilleur de la classe</p>
                    <span className="mt-2.5 px-2 py-0.5 bg-brand-blue/5 text-brand-blue border border-brand-blue/10 text-[9px] font-black rounded-lg">+300 XP</span>
                  </div>

                  {/* Placeholders helper card */}
                  <div className="col-span-2 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center p-4">
                    <p className="text-[11px] font-bold text-slate-400 italic">... 38 autres badges à découvrir ...</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: CONNEXION & SÉCURITÉ */}
        {activeTab === "connexion" && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Account Security Password form */}
              <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-display font-black text-base text-slate-800">Sécurité du Compte</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Mettez à jour votre mot de passe pour sécuriser votre progression.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Ancien mot de passe</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-blue focus:outline-hidden transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Nouveau mot de passe</label>
                      <span className="text-[10px] font-bold text-slate-400">Min. 8 caractères</span>
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-blue focus:outline-hidden transition-all"
                    />

                    {newPassword.length > 0 && (
                      <div className="space-y-1 mt-2">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              pwdStrength === "Fort" ? "bg-emerald-500" : pwdStrength === "Moyen" ? "bg-amber-450" : "bg-rose-500"
                            }`}
                            style={{ width: `${pwdStrengthPercent}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500">
                          Force du mot de passe :{" "}
                          <span className={`font-black ${
                            pwdStrength === "Fort" ? "text-emerald-600" : pwdStrength === "Moyen" ? "text-amber-600" : "text-rose-600"
                          }`}>
                            {pwdStrength}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  {securitySaved ? (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 animate-pulse">
                      <Check className="w-4 h-4 stroke-[3]" /> Mot de passe mis à jour !
                    </span>
                  ) : <span />}

                  <button
                    onClick={handleSaveSecurity}
                    disabled={!oldPassword || !newPassword}
                    className="bg-brand-blue disabled:bg-slate-200 hover:bg-brand-blue-light disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Mettre à jour
                  </button>
                </div>
              </div>

              {/* Linked Accounts */}
              <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-display font-black text-base text-slate-800">Comptes Liés</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Associez d'autres comptes pour vous connecter plus rapidement.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5Wt1R5DxsZJM5XRez6Bx5ptWadsbC_0PafuXoOx_wimI3yv1HwNnEwVGcVwlccFlUV0CQbVbvB3GWb0wrO8xuRQ1gZuR7TT2ZG7vK0m5bHIdhGo79Y6hjyZL4_-XT15L5kchEuo9aWrkVRG-guhYr6aaOfYFyJ9CCX14mILMPhvt3cpuRdXLmCkqfWXC4FY8dPTCF6em-8o-nVZFZbLFE_g5TppmCEBKiJE3c89gq8BWjGI06Jz8oag" 
                        alt="Google" 
                        className="w-5 h-5 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-black text-slate-800">Compte Google</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Lié le 12 Janv 2024</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black uppercase rounded-lg">Connecté</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Active Sessions List */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-display font-black text-base text-slate-800">Sessions Actives</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Les navigateurs et appareils actuellement connectés à votre compte.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-mono font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-6">Appareil</th>
                      <th className="py-3 px-6">Navigateur</th>
                      <th className="py-3 px-6">Adresse IP</th>
                      <th className="py-3 px-6">Localisation</th>
                      <th className="py-3 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {sessions.map((sess) => (
                      <tr key={sess.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6 flex items-center gap-2 font-bold text-slate-800">
                          {sess.device.includes("iPhone") ? (
                            <Smartphone className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Laptop className="w-4 h-4 text-slate-400" />
                          )}
                          <span>{sess.device}</span>
                          {sess.isCurrent && (
                            <span className="text-[8px] font-black bg-brand-blue/5 text-brand-blue border border-brand-blue/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Actuelle</span>
                          )}
                        </td>
                        <td className="py-4 px-6">{sess.browser}</td>
                        <td className="py-4 px-6 font-mono text-[11px] text-slate-500">{sess.ip}</td>
                        <td className="py-4 px-6">{sess.loc}</td>
                        <td className="py-4 px-6 text-right">
                          {sess.isCurrent ? (
                            <span className="text-[10px] font-black text-slate-400 italic">Session courante</span>
                          ) : (
                            <button
                              onClick={() => handleRevokeSession(sess.id)}
                              className="text-rose-600 hover:text-rose-700 font-black text-xs cursor-pointer hover:underline"
                            >
                              Révoquer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {sessions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 italic">Aucune autre session active.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 md:p-8 max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-display font-black text-base text-slate-800">Préférences de Notification</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Décidez comment vous souhaitez recevoir vos résumés d'études et vos alertes.</p>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              
              {/* Email Alerts */}
              <div className="flex items-center justify-between pt-4 first:pt-0 gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center rounded-2xl text-brand-blue shrink-0">
                    <Mail className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">E-mail hebdomadaire</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">Recevez un rapport détaillé de vos progrès chaque lundi matin.</p>
                  </div>
                </div>
                
                {/* Switch toggler */}
                <button
                  type="button"
                  onClick={() => setNotifEmail(!notifEmail)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifEmail ? "bg-brand-blue" : "bg-slate-200"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${notifEmail ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* WhatsApp Alerts */}
              <div className="flex items-center justify-between pt-4 gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 flex items-center justify-center rounded-2xl text-emerald-600 shrink-0">
                    <MessageSquare className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Rappels WhatsApp</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">Rappels de cours quotidiens et notifications de duels instantanées.</p>
                  </div>
                </div>
                
                {/* Switch toggler */}
                <button
                  type="button"
                  onClick={() => setNotifWhatsapp(!notifWhatsapp)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifWhatsapp ? "bg-brand-blue" : "bg-slate-200"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${notifWhatsapp ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Browser Push alerts */}
              <div className="flex items-center justify-between pt-4 gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-amber-50 border border-amber-200 flex items-center justify-center rounded-2xl text-amber-600 shrink-0">
                    <Bell className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Notifications Push Navigateur</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">Alertes instantanées sur votre bureau pour les événements en direct.</p>
                  </div>
                </div>
                
                {/* Switch toggler */}
                <button
                  type="button"
                  onClick={() => setNotifBrowser(!notifBrowser)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifBrowser ? "bg-brand-blue" : "bg-slate-200"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${notifBrowser ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: APPARENCE */}
        {activeTab === "apparence" && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Theme section */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <h3 className="font-display font-black text-base text-slate-800">Thème de l'interface</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Choisissez le style visuel de votre environnement d'étude.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Light theme */}
                <div className="border-2 border-brand-blue rounded-2xl overflow-hidden p-2 bg-white shadow-xs relative">
                  <div className="aspect-video bg-[#F8FAFC] rounded-lg border border-slate-200 flex flex-col p-3 gap-2">
                    <div className="h-3 w-2/3 bg-slate-200 rounded-full" />
                    <div className="grid grid-cols-3 gap-2 flex-grow">
                      <div className="bg-white border border-slate-100 rounded-md" />
                      <div className="bg-white border border-slate-100 rounded-md" />
                      <div className="bg-white border border-slate-100 rounded-md" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1.5 pb-1">
                    <p className="text-xs font-black text-slate-800">Mode Clair (Actif)</p>
                    <Check className="w-4 h-4 text-brand-blue stroke-[3]" />
                  </div>
                </div>

                {/* Dark theme */}
                <div className="border-2 border-transparent bg-slate-850 rounded-2xl overflow-hidden p-2 opacity-50 relative cursor-not-allowed">
                  <div className="aspect-video bg-slate-900 rounded-lg border border-slate-800 flex flex-col p-3 gap-2">
                    <div className="h-3 w-2/3 bg-slate-800 rounded-full" />
                    <div className="grid grid-cols-3 gap-2 flex-grow">
                      <div className="bg-slate-850 border border-slate-800 rounded-md" />
                      <div className="bg-slate-850 border border-slate-800 rounded-md" />
                      <div className="bg-slate-850 border border-slate-800 rounded-md" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1.5 pb-1 text-slate-400">
                    <p className="text-xs font-bold">Mode Sombre (Bientôt)</p>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Text size selector */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 md:p-8 space-y-5">
              <div>
                <h3 className="font-display font-black text-base text-slate-800">Taille du texte</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Ajustez la taille de police pour une meilleure lisibilité lors de vos lectures.</p>
              </div>

              <div className="flex flex-wrap gap-4">
                {[
                  { id: "petit", label: "Petit" },
                  { id: "normal", label: "Normal" },
                  { id: "grand", label: "Grand" }
                ].map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setTextSize(sz.id)}
                    className={`px-5 py-3 border-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      textSize === sz.id 
                        ? "border-brand-blue bg-brand-blue/5 text-brand-blue" 
                        : "border-slate-100 hover:border-slate-300 text-slate-600 bg-white"
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: CONFIDENTIALITÉ & ZONE DE DANGER */}
        {activeTab === "confidentialite" && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Profile Visibility */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <h3 className="font-display font-black text-base text-slate-800">Visibilité du Profil</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Contrôlez qui peut voir vos scores, vos badges et vos statistiques.</p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Public */}
                <label className="flex items-start gap-4 p-4 border border-slate-200 hover:border-slate-300 rounded-2xl cursor-pointer bg-slate-50/50 transition-all">
                  <input 
                    type="radio" 
                    name="profile_visibility" 
                    checked={profileVisibility === "public"} 
                    onChange={() => setProfileVisibility("public")}
                    className="mt-1 text-brand-blue focus:ring-brand-blue shrink-0"
                  />
                  <div>
                    <p className="text-xs font-black text-slate-800">Profil Public</p>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">Votre progression, vos scores duels et vos badges sont visibles sur le classement général de la Cohorte 1.</p>
                  </div>
                </label>

                {/* Option 2: Private */}
                <label className="flex items-start gap-4 p-4 border border-slate-200 hover:border-slate-300 rounded-2xl cursor-pointer bg-slate-50/50 transition-all">
                  <input 
                    type="radio" 
                    name="profile_visibility" 
                    checked={profileVisibility === "private"} 
                    onChange={() => setProfileVisibility("private")}
                    className="mt-1 text-brand-blue focus:ring-brand-blue shrink-0"
                  />
                  <div>
                    <p className="text-xs font-black text-slate-800">Profil Privé</p>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">Vous n'apparaîtrez plus dans le leaderboard public. Seules vos données personnelles de suivi restent actives.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50/30 border border-rose-200 rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <h3 className="font-display font-black text-base text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Zone de Danger</span>
                </h3>
                <p className="text-xs font-semibold text-rose-700/80 mt-0.5">Ces actions affectent votre compte et sont irréversibles.</p>
              </div>

              <div className="space-y-4">
                {/* Reset Progress */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-rose-100 rounded-2xl">
                  <div>
                    <p className="text-xs font-black text-slate-800">Réinitialiser ma progression</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Efface définitivement vos scores historiques aux examens Blitz.</p>
                  </div>
                  <button
                    onClick={() => setModalType("reset")}
                    className="px-5 py-2.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                </div>

                {/* Delete Account */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-rose-100 rounded-2xl">
                  <div>
                    <p className="text-xs font-black text-slate-800">Supprimer mon compte</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ferme votre compte et supprime toutes vos données de La Plume.</p>
                  </div>
                  <button
                    onClick={() => setModalType("delete")}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Supprimer le compte
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 5. INTERACTIVE CONFIRMATION MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setModalType(null)} />
          
          {/* Modal box */}
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl text-left">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="font-display font-black text-lg text-slate-850">
                {modalType === "reset" ? "Réinitialiser la progression" : "Supprimer le compte"}
              </h3>
              
              <p className="text-slate-500 text-xs font-medium leading-relaxed mt-2.5">
                {modalType === "reset" 
                  ? "Cette action effacera vos scores de simulations Blitz mais conservera votre compte actif. Voulez-vous continuer ?"
                  : "Cette action est définitive. Vous perdrez tout accès à vos cours, votre série de jours, vos badges et vos scores de simulation."
                }
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <button
                  onClick={() => setModalType(null)}
                  className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={executeDangerAction}
                  className={`py-3 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs ${
                    modalType === "reset" 
                      ? "bg-brand-blue hover:bg-brand-blue-light" 
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
