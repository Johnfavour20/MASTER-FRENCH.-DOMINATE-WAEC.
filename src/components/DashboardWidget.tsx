/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Award, Flame, Users, Trophy, Sparkles, TrendingUp, UserCheck } from "lucide-react";
import { StudentProfile, LeaderboardEntry } from "../types";

interface DashboardWidgetProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
}

export default function DashboardWidget({ userXP, userStreak, setCurrentView }: DashboardWidgetProps) {
  // Mock Leaderboard with User dynamically positioned
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: "Kofi Mensah (Ghana)", xp: 2400 },
    { rank: 2, name: "Amara Temi (Vous)", xp: 1220, isCurrentUser: true },
    { rank: 3, name: "Zainab Balogun (Nigeria)", xp: 1150 },
    { rank: 4, name: "Kwame Appiah (Ghana)", xp: 950 },
    { rank: 5, name: "Nkechi Egwu (Nigeria)", xp: 820 }
  ]);

  // Sync leaderboard with user's actual cumulative XP
  useEffect(() => {
    setLeaderboard(prev => {
      // Find user, update XP, then sort and assign ranks
      const updatedList = prev.map(entry => {
        if (entry.isCurrentUser) {
          return { ...entry, xp: userXP };
        }
        return entry;
      });

      // Sort by XP descending
      const sorted = [...updatedList].sort((a, b) => b.xp - a.xp);

      // Re-calculate ranks
      return sorted.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
    });
  }, [userXP]);

  const badges = [
    { id: "b1", name: "Elite Membre", icon: "🏆", desc: "Rejoint la Cohorte d'élite française", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { id: "b2", name: "Savoir-Faire", icon: "📚", desc: "A obtenu 100% à 3 quiz consécutifs", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { id: "b3", name: "Top 10", icon: "🔥", desc: "Parmi les 10 meilleurs de sa cohorte", color: "bg-rose-50 text-brand-coral border-rose-100" }
  ];

  // Derive level from XP
  const userLevel = userXP >= 2000 ? "Niveau B2 (Supérieur)" : userXP >= 1500 ? "Niveau B1 (Intermédiaire +)" : "Niveau B1";
  const nextLevelXP = userXP >= 2000 ? 3000 : userXP >= 1500 ? 2000 : 1500;
  const progressPercent = Math.min(100, Math.floor((userXP / nextLevelXP) * 100));

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-12">
      
      {/* Dashboard Section Title */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-blue tracking-tight">
          Votre Tableau de Bord
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Suivez vos progrès, gagnez de la réputation et dominez la cohorte.
        </p>
      </div>

      {/* Main Student Card */}
      <div className="bg-brand-blue text-white rounded-3xl border border-blue-950 shadow-2xl p-6 md:p-8 mb-6 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-700/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Profile Details */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                alt="Amara Temi" 
                className="w-16 h-16 rounded-2xl border-4 border-white/20 object-cover shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-lg text-[10px] font-bold">
                B2
              </span>
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl md:text-2xl leading-none flex items-center gap-2">
                Amara Temi <span className="text-sm font-normal text-slate-300">({userLevel})</span>
              </h3>
              
              {/* Daily Streak Indicator */}
              <div className="flex items-center gap-1.5 mt-2 text-brand-yellow font-bold text-xs uppercase tracking-wide">
                <Flame className="w-4 h-4 fill-brand-yellow text-brand-yellow animate-pulse" />
                Série de {userStreak} jours !
              </div>
            </div>
          </div>

          {/* XP Display Block */}
          <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 text-center min-w-[120px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block mb-0.5">Total XP</span>
            <span className="text-2xl font-black font-mono text-brand-yellow">{userXP}</span>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-8 relative z-10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span>Progression du Niveau</span>
            <span className="font-mono">{userXP} / {nextLevelXP} XP ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-brand-yellow to-amber-500 rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges and Leaderboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        
        {/* Badges card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md">
          <h4 className="font-display font-extrabold text-base text-brand-blue mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Badges Récents
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-2xl border border-dashed flex flex-col items-center text-center transition-all hover:scale-102 ${b.color}`}
              >
                <span className="text-2xl mb-1">{b.icon}</span>
                <span className="text-[11px] font-black tracking-tight leading-tight block">{b.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-extrabold text-base text-brand-blue flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Classement Cohorte 1
            </h4>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
              Mise à jour en direct
            </span>
          </div>

          <div className="space-y-2">
            {leaderboard.map((entry, i) => {
              // Styling if user is current student
              const isUser = entry.isCurrentUser;
              return (
                <div 
                  key={i}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all border ${
                    isUser 
                      ? "bg-brand-blue border-brand-blue text-white shadow-md transform hover:scale-[1.01]" 
                      : "bg-slate-50/50 hover:bg-slate-50 border-slate-100/50 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-black text-sm w-6 text-center ${isUser ? 'text-brand-yellow' : 'text-slate-400'}`}>
                      {entry.rank}
                    </span>
                    <span className={`font-sans text-sm font-semibold ${isUser ? 'font-bold text-white' : 'text-slate-700'}`}>
                      {entry.name}
                    </span>
                  </div>
                  <span className={`font-mono text-xs font-black ${isUser ? 'text-brand-yellow' : 'text-brand-blue-light'}`}>
                    {entry.xp} XP
                  </span>
                </div>
              );
            })}
          </div>

          {/* Prompt to gain XP */}
          <div className="mt-5 text-center">
            <button
              onClick={() => setCurrentView("quiz")}
              className="text-xs font-bold text-brand-blue hover:text-brand-blue-light flex items-center justify-center gap-1 mx-auto group transition-all"
            >
              Faites des quiz pour grimper dans le classement !
              <TrendingUp className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
