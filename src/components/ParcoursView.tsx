/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  GraduationCap, Star, Play, Lock, Settings, Bell, ChevronRight, Sparkles,
  Mic, Trophy, BookOpen, Compass, Award, Activity, Heart, ArrowLeft, Check,
  Volume2, CheckCircle2, MessageSquare, Flag, Mail, Newspaper, FileEdit, X
} from "lucide-react";

interface ParcoursViewProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  isPremium?: boolean;
  defaultTab?: "roadmap" | "stats";
}

interface NodeInfo {
  id: string;
  title: string;
  subtitle?: string;
  score: string;
  status: "Complété" | "En cours" | "Déverrouillé" | "Locked";
  description: string;
  type: "start" | "lesson" | "checkpoint" | "project" | "graduation";
  icon: React.ComponentType<any>;
}

export default function ParcoursView({ 
  userXP, 
  userStreak, 
  setCurrentView,
  isPremium = false,
  defaultTab = "roadmap"
}: ParcoursViewProps) {
  const [localXP, setLocalXP] = useState(userXP);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<"roadmap" | "stats">(defaultTab);
  const [attempts, setAttempts] = useState<any[]>([]);

  // Seed baseline attempts if empty
  useEffect(() => {
    const stored = localStorage.getItem("blitz_attempts");
    if (stored) {
      setAttempts(JSON.parse(stored));
    } else {
      const initialAttempts = [
        {
          id: "seed_1",
          date: "12 Juin 2026, 14:15",
          score: 58,
          grade: "D7 (Passable)",
          sectionA: 60,
          sectionB: 50,
          sectionC: 64,
          essayPrompt: "Lettre Amicale",
          timeSpent: { total: "01:45:12" }
        },
        {
          id: "seed_2",
          date: "25 Juin 2026, 09:30",
          score: 71,
          grade: "B2 (Très Bien)",
          sectionA: 80,
          sectionB: 70,
          sectionC: 63,
          essayPrompt: "Discours Argumentatif",
          timeSpent: { total: "02:10:05" }
        },
        {
          id: "seed_3",
          date: "04 Juillet 2026, 11:00",
          score: 83,
          grade: "A1 (Excellent)",
          sectionA: 100,
          sectionB: 80,
          sectionC: 69,
          essayPrompt: "Lettre Amicale",
          timeSpent: { total: "02:02:40" }
        }
      ];
      localStorage.setItem("blitz_attempts", JSON.stringify(initialAttempts));
      setAttempts(initialAttempts);
    }
  }, []);
  
  // Interactive Lesson simulation state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonStep, setLessonStep] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"idle" | "correct" | "incorrect">("idle");

  const activeNodeRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active node (Leçon 12) on mount
  useEffect(() => {
    if (activeNodeRef.current) {
      activeNodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, []);

  // Sidebar navigation options
  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: Compass },
    { id: "parcours", label: "Parcours", icon: Award, active: true },
    { id: "courses", label: "Mes Cours", icon: BookOpen },
    { id: "blitz", label: "Le Blitz", icon: Play },
    { id: "exams", label: "Examens", icon: Lock },
    { id: "leaderboard", label: "Classement", icon: Trophy },
    { id: "progression", label: "Ma Progression", icon: Activity },
    { id: "badges", label: "Mes Badges", icon: Star },
    { id: "certificate", label: "Certificat", icon: Award },
  ];

  // List of all nodes along the path
  const nodes: NodeInfo[] = [
    {
      id: "start",
      title: "DÉBUT",
      subtitle: "Commencement du parcours",
      score: "",
      status: "Complété",
      description: "Votre point de départ vers l'excellence en français et la réussite absolue de votre examen WAEC.",
      type: "start",
      icon: Flag
    },
    // SEMAINE 1
    {
      id: "l1",
      title: "Leçon 1: Syntaxe",
      score: "100%",
      status: "En cours",
      description: "Apprenez les bases de la structure des phrases en français et évitez les erreurs d'inversion courantes.",
      type: "lesson",
      icon: Play
    },
    {
      id: "l2",
      title: "Leçon 2: Ponctuation",
      score: "92%",
      status: "Complété",
      description: "Maîtrisez l'usage délicat des virgules, des points-virgules et des points d'exclamation pour structurer vos écrits.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l3",
      title: "Leçon 3: Vocabulaire",
      score: "87%",
      status: "Complété",
      description: "Enrichissez votre lexique avec des synonymes d'élite pour rehausser le niveau académique de vos productions.",
      type: "lesson",
      icon: Star
    },
    {
      id: "cp1",
      title: "CHECKPOINT 1",
      score: "Validé",
      status: "Complété",
      description: "Vérification globale des notions de grammaire et d'orthographe de la première semaine.",
      type: "checkpoint",
      icon: CheckCircle2
    },
    {
      id: "p1",
      title: "Projet: La Lettre",
      score: "100%",
      status: "Complété",
      description: "Rédigez une lettre formelle respectant scrupuleusement les formules de politesse et les codes de correspondance française.",
      type: "project",
      icon: Mail
    },
    // SEMAINE 2
    {
      id: "l4",
      title: "Leçon 4: Grammaire avancée",
      score: "95%",
      status: "Complété",
      description: "Comprenez les règles d'accord complexes des participes passés et l'emploi du subjonctif présent.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l5",
      title: "Leçon 5: Faux amis",
      score: "88%",
      status: "Complété",
      description: "Identifiez et évitez les pièges de traduction et d'interprétation les plus fréquents.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l6",
      title: "Leçon 6: Registres de langue",
      score: "91%",
      status: "Complété",
      description: "Sachez différencier et employer à bon escient les langages soutenu, courant et familier selon les contextes.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l7",
      title: "Leçon 7: Idiotismes",
      score: "94%",
      status: "Complété",
      description: "Intégrez des expressions idiomatiques typiquement françaises pour donner du naturel et de la couleur à votre écriture.",
      type: "lesson",
      icon: Star
    },
    {
      id: "cp2",
      title: "CHECKPOINT 2",
      score: "Validé",
      status: "Complété",
      description: "Évaluation sur la traduction et l'analyse syntaxique bidirectionnelle.",
      type: "checkpoint",
      icon: CheckCircle2
    },
    {
      id: "p2",
      title: "Projet: La Traduction",
      score: "90%",
      status: "Complété",
      description: "Traduisez un article d'actualité économique ou culturel du français vers l'anglais avec fidélité et rigueur.",
      type: "project",
      icon: Newspaper
    },
    // SEMAINE 3
    {
      id: "l8",
      title: "Leçon 8: Rhétorique",
      score: "92%",
      status: "Complété",
      description: "Apprenez les secrets d'un plan dialectique convaincant (Thèse, Antithèse, Synthèse).",
      type: "lesson",
      icon: Star
    },
    {
      id: "l9",
      title: "Leçon 9: Connecteurs logiques",
      score: "85%",
      status: "Complété",
      description: "Structurez vos transitions logiques (cependant, néanmoins, par conséquent) pour rendre vos argumentations limpides.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l10",
      title: "Leçon 10: Réfutation",
      score: "89%",
      status: "Complété",
      description: "Apprenez l'art de déconstruire poliment et efficacement les objections d'un opposant virtuel.",
      type: "lesson",
      icon: Star
    },
    {
      id: "cp3",
      title: "CHECKPOINT 3",
      score: "Validé",
      status: "Complété",
      description: "Examen blanc d'argumentation écrite chronométré de 45 minutes.",
      type: "checkpoint",
      icon: CheckCircle2
    },
    {
      id: "p3",
      title: "Projet: Le Débat",
      score: "94%",
      status: "Complété",
      description: "Rédigez la tribune d'un grand débat de société, évaluée par notre IA sur la force argumentative et la structure.",
      type: "project",
      icon: FileEdit
    },
    // SEMAINE 4
    {
      id: "l11",
      title: "Leçon 11: Phonétique",
      score: "90%",
      status: "Complété",
      description: "Perfectionnez votre diction, votre articulation et le rythme de vos liaisons à l'oral.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l12",
      title: "Leçon 12: Métaphores",
      score: "85%",
      status: "Complété",
      description: "Apprenez à enrichir votre expression écrite avec des figures de style complexes pour impressionner vos examinateurs.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l13",
      title: "Leçon 13: Improvisation",
      score: "Pas encore noté",
      status: "Déverrouillé",
      description: "Maîtrisez l'improvisation sur des thèmes inattendus de l'oral du WAEC.",
      type: "lesson",
      icon: Star
    },
    {
      id: "cp4",
      title: "CHECKPOINT FINAL",
      score: "",
      status: "Locked",
      description: "Simulation complète des épreuves orales et écrites du baccalauréat.",
      type: "checkpoint",
      icon: CheckCircle2
    },
    {
      id: "p4",
      title: "Projet: L'Oral",
      score: "",
      status: "Locked",
      description: "Présentez un exposé de 5 minutes devant notre jury vocal IA et recevez une note globale de fluidité.",
      type: "project",
      icon: Mic
    },
    {
      id: "graduation",
      title: "REMISE DES DIPLÔMES",
      score: "",
      status: "Locked",
      description: "Félicitations! Vous avez terminé l'intégralité du bootcamp d'excellence de La Plume.",
      type: "graduation",
      icon: GraduationCap
    }
  ];

  const handleNodeClick = (node: NodeInfo) => {
    setSelectedNode(node);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Lesson interactive flow questions
  const quizQuestions = {
    audioText: "Bonjour, cher élève! Comment décririez-vous l'impact du débat dans la démocratie?",
    options: [
      "Le débat favorise la confrontation pacifique des idées et enrichit l'opinion publique.",
      "Le débat empêche de prendre des décisions rapides et sème la discorde.",
      "Le débat n'a aucun rôle significatif dans un gouvernement moderne."
    ],
    correctIndex: 0,
    explanation: "Excellent! Un débat bien mené est la pierre angulaire d'un échange constructif, permettant à chacun de s'exprimer de manière respectueuse."
  };

  const startLesson = () => {
    setShowPopup(false);
    setLessonStep(1);
    setSelectedAnswer(null);
    setAnswerStatus("idle");
    setShowLessonModal(true);
  };

  const handleSelectAnswer = (idx: number) => {
    if (answerStatus !== "idle") return;
    setSelectedAnswer(idx);
    if (idx === quizQuestions.correctIndex) {
      setAnswerStatus("correct");
      setLocalXP(prev => prev + 50);
    } else {
      setAnswerStatus("incorrect");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0D1117] text-slate-100 flex font-sans antialiased selection:bg-[#F5C518] selection:text-[#0D1117]">
      
      {/* 1. Side Navigation Rail */}
      <aside className="w-64 border-r border-white/5 bg-[#0D1117] flex flex-col justify-between shrink-0 sticky top-0 h-screen hidden md:flex transition-all">
        <div className="p-6">
          {/* Logo with Cap Icon */}
          <div 
            className="flex items-center gap-3 cursor-pointer group mb-8"
            onClick={() => setCurrentView("landing")}
          >
            <div className="bg-[#F5C518] p-1.5 rounded-xl text-[#0D1117] group-hover:bg-yellow-400 transition-all shadow-md shadow-yellow-400/10 shrink-0">
              <GraduationCap className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-tight text-white block leading-none">
                La Plume
              </span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-amber-400 font-bold block -mt-0.5">
                French Prep
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                (item.id === "parcours" && activeTab === "roadmap") || 
                (item.id === "progression" && activeTab === "stats");
              return (
                <button
                  key={item.id}
                  id={`sidebar-item-${item.id}`}
                  onClick={() => {
                    if (item.id === "dashboard") {
                      setCurrentView("dashboard");
                    } else if (item.id === "blitz") {
                      setCurrentView("blitz");
                    } else if (item.id === "parcours") {
                      setActiveTab("roadmap");
                    } else if (item.id === "progression") {
                      setActiveTab("stats");
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20" 
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#F5C518]" : ""}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === "exams" && (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Settings */}
        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => setCurrentView("dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-30 w-full bg-[#0D1117] border-b border-white/5 px-8 py-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView("dashboard")}
              className="md:hidden p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 text-white cursor-pointer"
              title="Retour au Tableau de Bord"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-display font-black text-lg text-[#F5C518] tracking-tight">
              La Plume Africa
            </span>
            <div className="hidden md:flex items-center bg-[#0D1117] border border-white/10 px-3 py-1 rounded-full gap-2">
              <span className="text-[#F5C518] text-xs font-mono font-black animate-pulse flex items-center gap-1">
                ⚡ {localXP} XP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-xs font-bold">
              <button onClick={() => setCurrentView("landing")} className="text-slate-400 hover:text-[#F5C518] transition-colors">Home</button>
              <button onClick={() => setCurrentView("parcours")} className="text-[#F5C518] border-b-2 border-[#F5C518] pb-1 font-black">Parcours</button>
              <button onClick={() => setCurrentView("plan-selection")} className="text-slate-400 hover:text-[#F5C518] transition-colors">Pricing</button>
            </nav>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-slate-800/40 hover:bg-slate-800 border border-white/5 flex items-center justify-center text-slate-300 relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>
              
              <div className="w-10 h-10 rounded-full border-2 border-[#F5C518] p-0.5 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Sub-Header Tabs Switcher */}
        <div className="bg-[#0D1117] border-b border-white/5 px-8 py-3.5 flex flex-wrap gap-4 items-center justify-between shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("roadmap")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "roadmap"
                  ? "bg-[#F5C518] text-[#0D1117] shadow-lg shadow-yellow-400/10 scale-102"
                  : "text-slate-400 hover:text-white bg-slate-800/25 border border-white/5"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Syllabus & Carte d'Apprentissage</span>
            </button>

            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "stats"
                  ? "bg-[#F5C518] text-[#0D1117] shadow-lg shadow-yellow-400/10 scale-102"
                  : "text-slate-400 hover:text-white bg-slate-800/25 border border-white/5"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Mon Parcours (Performance & Stats)</span>
            </button>
          </div>
          
          {activeTab === "stats" && attempts.length > 0 && (
            <div className="text-[10px] font-mono font-bold bg-[#17263C] border border-white/10 px-3 py-1 rounded-lg text-[#F5C518] flex items-center gap-1.5">
              <Trophy className="w-3 h-3 animate-bounce" />
              <span>{attempts.length} Simulations de Blitz Enregistrées</span>
            </div>
          )}
        </div>

        {/* 3. Main Scrollable Journey Canvas or Performance Dashboard */}
        <main className="flex-1 relative overflow-hidden bg-[#0D1117] flex">
          
          {activeTab === "roadmap" ? (<>
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar h-[calc(100vh-8rem)] relative"
              style={{ 
                backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }}
            >
            {/* Scrollable Map Stage container - 4500px tall to fit all nodes nicely spaced out */}
            <div className="relative w-full max-w-2xl mx-auto py-24 px-8 min-h-[4600px]">
              
              {/* Journey Map SVG for Connecting Path Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {/* Master Path Line */}
                <line stroke="#374151" strokeDasharray="8,8" strokeWidth="4" x1="50%" x2="50%" y1="50" y2="4450" />
                {/* Completed Path Line (Up to Leçon 12, approx 3550px) */}
                <line 
                  className="path-completed" 
                  stroke="#F5C518" 
                  strokeWidth="6" 
                  x1="50%" 
                  x2="50%" 
                  y1="50" 
                  y2="3410" 
                  style={{ 
                    filter: "drop-shadow(0 0 8px rgba(245, 197, 24, 0.4))",
                    strokeDasharray: "10,10"
                  }} 
                />
              </svg>

              {/* Journey Nodes List */}
              <div className="relative z-10 flex flex-col items-center gap-32">
                
                {/* 1. DÉBUT */}
                <div 
                  className="group relative flex flex-col items-center cursor-pointer"
                  onClick={() => handleNodeClick(nodes[0])}
                >
                  <div className="w-16 h-16 bg-[#F5C518] rotate-45 flex items-center justify-center shadow-lg shadow-yellow-400/20 transition-transform hover:scale-110">
                    <Flag className="-rotate-45 w-6 h-6 text-[#0D1117] fill-current" />
                  </div>
                  <span className="mt-4 font-black text-sm tracking-widest text-[#F5C518] uppercase">DÉBUT ◇</span>
                </div>

                {/* 2. SEMAINE 1 */}
                <div className="w-full flex flex-col items-center gap-12">
                  <div className="text-center">
                    <h3 className="font-display font-black text-lg text-white">Semaine 1: Fondations</h3>
                    <p className="text-slate-400 text-xs mt-1">L'art de l'expression écrite</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-16">
                    {/* Lesson 1 */}
                    <div 
                      ref={activeNodeRef}
                      className="flex flex-col items-center cursor-pointer relative" 
                      onClick={() => handleNodeClick(nodes[1])}
                    >
                      <div className="relative">
                        {/* Golden pulsing ring effect */}
                        <div className="absolute inset-0 bg-[#F5C518]/40 rounded-full animate-ping pointer-events-none" style={{ animationDuration: "2s" }} />
                        <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-yellow-400/40 border-4 border-[#0D1117] hover:scale-110 transition-all">
                          <Play className="w-6 h-6 text-[#0D1117] fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="mt-2 text-xs font-black text-[#F5C518]">Leçon 1 (En cours)</span>
                    </div>
                    {/* Lesson 2 */}
                    <div className="flex flex-col items-center cursor-pointer translate-x-8" onClick={() => handleNodeClick(nodes[2])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 2</span>
                    </div>
                    {/* Lesson 3 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[3])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 3</span>
                    </div>
                  </div>
                </div>

                {/* 3. CHECKPOINT 1 */}
                <div 
                  className="w-16 h-16 border-4 border-orange-500 bg-[#0D1117] rounded-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-110 relative"
                  onClick={() => handleNodeClick(nodes[4])}
                >
                  <CheckCircle2 className="w-6 h-6 text-orange-500" />
                  <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-mono text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    CHECKPOINT 1
                  </div>
                </div>

                {/* 4. PROJET: LA LETTRE */}
                <div 
                  className="relative group flex flex-col items-center cursor-pointer" 
                  onClick={() => handleNodeClick(nodes[5])}
                >
                  <div 
                    className="w-24 h-24 bg-[#F5C518] flex items-center justify-center shadow-xl shadow-yellow-400/30 hover:scale-105 transition-all" 
                    style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                  >
                    <Mail className="w-9 h-9 text-[#0D1117] fill-current" />
                  </div>
                  <span className="mt-4 font-black text-xs text-[#F5C518] uppercase tracking-wider">✉️ PROJET: LA LETTRE</span>
                </div>

                {/* 5. SEMAINE 2 */}
                <div className="w-full flex flex-col items-center gap-12">
                  <div className="text-center">
                    <h3 className="font-display font-black text-lg text-white">Semaine 2: Analyse & Traduction</h3>
                    <p className="text-slate-400 text-xs mt-1">Naviguer entre les langues</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-12 max-w-md">
                    {/* Lesson 4 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[6])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 4</span>
                    </div>
                    {/* Lesson 5 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[7])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 5</span>
                    </div>
                    {/* Lesson 6 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[8])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 6</span>
                    </div>
                    {/* Lesson 7 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[9])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 7</span>
                    </div>
                  </div>
                </div>

                {/* 6. CHECKPOINT 2 */}
                <div 
                  className="w-16 h-16 border-4 border-orange-500 bg-[#0D1117] rounded-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-110 relative"
                  onClick={() => handleNodeClick(nodes[10])}
                >
                  <CheckCircle2 className="w-6 h-6 text-orange-500" />
                  <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-mono text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    CHECKPOINT 2
                  </div>
                </div>

                {/* 7. PROJET: LA TRADUCTION */}
                <div 
                  className="relative group flex flex-col items-center cursor-pointer" 
                  onClick={() => handleNodeClick(nodes[11])}
                >
                  <div 
                    className="w-24 h-24 bg-[#F5C518] flex items-center justify-center shadow-xl shadow-yellow-400/30 hover:scale-105 transition-all" 
                    style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                  >
                    <Newspaper className="w-9 h-9 text-[#0D1117] fill-current" />
                  </div>
                  <span className="mt-4 font-black text-xs text-[#F5C518] uppercase tracking-wider">📰 PROJET: LA TRADUCTION</span>
                </div>

                {/* 8. SEMAINE 3 */}
                <div className="w-full flex flex-col items-center gap-12">
                  <div className="text-center">
                    <h3 className="font-display font-black text-lg text-white">Semaine 3: Argumentation</h3>
                    <p className="text-slate-400 text-xs mt-1">Convaincre par l'écrit</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-16">
                    {/* Lesson 8 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[12])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 8</span>
                    </div>
                    {/* Lesson 9 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[13])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 9</span>
                    </div>
                    {/* Lesson 10 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[14])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 10</span>
                    </div>
                  </div>
                </div>

                {/* 9. CHECKPOINT 3 */}
                <div 
                  className="w-16 h-16 border-4 border-orange-500 bg-[#0D1117] rounded-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-110 relative"
                  onClick={() => handleNodeClick(nodes[15])}
                >
                  <CheckCircle2 className="w-6 h-6 text-orange-500" />
                  <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-mono text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    CHECKPOINT 3
                  </div>
                </div>

                {/* 10. PROJET: LE DÉBAT */}
                <div 
                  className="relative group flex flex-col items-center cursor-pointer" 
                  onClick={() => handleNodeClick(nodes[16])}
                >
                  <div 
                    className="w-24 h-24 bg-[#F5C518] flex items-center justify-center shadow-xl shadow-yellow-400/30 hover:scale-105 transition-all" 
                    style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                  >
                    <FileEdit className="w-9 h-9 text-[#0D1117]" />
                  </div>
                  <span className="mt-4 font-black text-xs text-[#F5C518] uppercase tracking-wider">✍️ PROJET: LE DÉBAT</span>
                </div>

                {/* 11. SEMAINE 4 (Current Week) */}
                <div className="w-full flex flex-col items-center gap-12">
                  <div className="text-center">
                    <h3 className="font-display font-black text-lg text-white">Semaine 4: Maîtrise Orale</h3>
                    <p className="text-slate-400 text-xs mt-1">L'éloquence au service des idées</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-16 relative">
                    
                    {/* Leçon 11 */}
                    <div className="flex flex-col items-center cursor-pointer animate-fade-in" onClick={() => handleNodeClick(nodes[17])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 11</span>
                    </div>

                    {/* Leçon 12 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[18])}>
                      <div className="w-14 h-14 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-[#0D1117] fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-300">Leçon 12</span>
                    </div>

                    {/* Leçon 13 (UNLOCKED OUTLINE NODE) */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[19])}>
                      <div className="w-14 h-14 border-2 border-[#F5C518] rounded-full flex items-center justify-center hover:bg-[#F5C518]/10 transition-all">
                        <Star className="w-6 h-6 text-[#F5C518]" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-slate-400">Leçon 13</span>
                    </div>

                  </div>
                </div>

                {/* 12. CHECKPOINT FINAL */}
                <div 
                  className="w-16 h-16 border-4 border-orange-500/50 bg-[#0D1117] rounded-full flex items-center justify-center cursor-pointer opacity-70 transition-transform hover:scale-110 relative"
                  onClick={() => handleNodeClick(nodes[20])}
                >
                  <CheckCircle2 className="w-6 h-6 text-orange-500/70" />
                  <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-mono text-orange-400/70 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    CHECKPOINT FINAL
                  </div>
                </div>

                {/* 13. PROJET: L'ORAL (Locked) */}
                <div 
                  className="relative group flex flex-col items-center cursor-pointer" 
                  onClick={() => handleNodeClick(nodes[21])}
                >
                  <div 
                    className="w-24 h-24 bg-slate-800/60 border-2 border-dashed border-white/20 flex items-center justify-center shadow-xl hover:scale-105 transition-all opacity-60" 
                    style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                  >
                    <Mic className="w-9 h-9 text-slate-400" />
                  </div>
                  <span className="mt-4 font-bold text-slate-500 text-xs uppercase tracking-wider">🎙️ PROJET: L'ORAL</span>
                </div>

                {/* 14. REMISE DES DIPLÔMES */}
                <div 
                  className="mt-12 flex flex-col items-center cursor-pointer group"
                  onClick={() => handleNodeClick(nodes[22])}
                >
                  <div className="w-24 h-24 bg-[#F5C518]/10 border-2 border-[#F5C518]/30 rotate-45 flex items-center justify-center shadow-2xl opacity-65 group-hover:scale-105 transition-all">
                    <GraduationCap className="-rotate-45 w-10 h-10 text-[#F5C518]" />
                  </div>
                  <span className="mt-10 font-display font-bold text-sm text-[#F5C518]/60 uppercase tracking-widest">REMISE DES DIPLÔMES 🎓</span>
                </div>

              </div>
            </div>
          </div>

          {/* Floating Right Progress Panel (Desktop only) */}
          <aside className="hidden lg:block absolute right-8 top-8 w-80 z-20">
            <div className="bg-[#0F1B2D]/95 border border-white/5 p-6 rounded-2xl shadow-2xl space-y-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display font-black text-sm text-white uppercase tracking-wider">Progression</h4>
                <span className="text-[#F5C518] font-bold text-sm">85%</span>
              </div>
              
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#F5C518] h-full w-[85%] rounded-full shadow-xs" />
              </div>

              <div className="space-y-4">
                
                {/* Milestone 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5 text-[#F5C518]" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Objectif atteint</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Maîtrise de l'argumentation</p>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white font-sans">Série en cours</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{userStreak} jours consécutifs</p>
                  </div>
                </div>

              </div>

              <button 
                onClick={() => setCurrentView("lesson-viewer")}
                className="w-full py-4 bg-[#F5C518] hover:bg-yellow-400 text-[#0D1117] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-102 active:scale-100 cursor-pointer"
              >
                Continuer le Parcours
              </button>
            </div>
          </aside>

          {/* Mobile Bottom Sheet Progress (hidden on desktop) */}
          <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0F1B2D]/95 border-t border-white/10 rounded-t-3xl p-5 z-40 backdrop-blur-md flex items-center justify-between">
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-wider">85% du Parcours</h4>
              <p className="text-slate-400 text-[10px] font-semibold mt-0.5">Prochaine: Leçon 1 (En cours)</p>
            </div>
            <button 
              onClick={() => setCurrentView("lesson-viewer")}
              className="px-6 py-3 bg-[#F5C518] hover:bg-yellow-400 text-[#0D1117] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            >
              Continuer
            </button>
          </div>
          </>
          ) : (
            /* ==================== STATS & PERFORMANCE HISTORIC PANEL ==================== */
            <div className="flex-1 overflow-y-auto custom-scrollbar h-[calc(100vh-8rem)] p-4 md:p-8 space-y-8 bg-[#0D1117] text-white">
              
              {/* Row 1: Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-[#F5C518]/20 transition-all">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Simulations Jouées</span>
                  <div className="font-display font-black text-4xl text-white tracking-tight">{attempts.length}</div>
                  <p className="text-[10px] font-semibold text-slate-500">Attempts complets de 2h30</p>
                </div>

                <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-[#F5C518]/20 transition-all">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#F5C518]">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Score Moyen</span>
                  <div className="font-display font-black text-4xl text-[#F5C518] tracking-tight">
                    {attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length) : 0}%
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500">Équivalent Grade WAEC: B2</p>
                </div>

                <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-[#F5C518]/20 transition-all">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Meilleur Score</span>
                  <div className="font-display font-black text-4xl text-emerald-400 tracking-tight">
                    {attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0}%
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500">Mention Très Bien (A1)</p>
                </div>

                <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-[#F5C518]/20 transition-all">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center text-[#F5C518]">
                    <Sparkles className="w-5 h-5 text-[#F5C518]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Niveau Global IA</span>
                  <div className="font-display font-black text-2xl text-[#F5C518] tracking-tight pt-1">Élite WAEC</div>
                  <p className="text-[10px] font-semibold text-slate-500">Prêt à 94% pour le concours</p>
                </div>
              </div>

              {/* Row 2: Score Trend Chart & Readiness */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SVG Chart Container */}
                <div className="lg:col-span-2 bg-[#0F172A] border border-white/5 rounded-3xl p-6 space-y-6">
                  <div>
                    <h3 className="font-display font-black text-base text-white">Évolution de la Performance</h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Comparatif chronologique de vos simulations d'examen blanc</p>
                  </div>

                  <div className="w-full h-64 relative bg-[#090D1A]/50 border border-white/5 rounded-2xl p-4">
                    {attempts.length > 1 ? (
                      <svg viewBox="0 0 500 240" className="w-full h-full text-slate-500 font-mono text-[9px] font-bold">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F5C518" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#F5C518" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="40" y1="30" x2="480" y2="30" stroke="#1e293b" strokeDasharray="4,4" />
                        <line x1="40" y1="90" x2="480" y2="90" stroke="#1e293b" strokeDasharray="4,4" />
                        <line x1="40" y1="150" x2="480" y2="150" stroke="#1e293b" strokeDasharray="4,4" />
                        <line x1="40" y1="210" x2="480" y2="210" stroke="#334155" />

                        {/* Y Labels */}
                        <text x="30" y="34" textAnchor="end" className="fill-slate-500">100%</text>
                        <text x="30" y="94" textAnchor="end" className="fill-slate-500">75%</text>
                        <text x="30" y="154" textAnchor="end" className="fill-slate-500">50%</text>
                        <text x="30" y="214" textAnchor="end" className="fill-slate-500">0%</text>

                        {/* Connection line & Gradient fill */}
                        {(() => {
                          const points = attempts.map((a, idx) => {
                            const segmentSize = attempts.length > 1 ? 400 / (attempts.length - 1) : 400;
                            const x = 50 + idx * segmentSize;
                            const y = 210 - (a.score / 100) * 180;
                            return { x, y, score: a.score, date: a.date.split(",")[0] };
                          });
                          const pointsString = points.map(p => `${p.x},${p.y}`).join(" ");
                          const fillString = `50,210 ${pointsString} ${points[points.length - 1].x},210`;

                          return (
                            <>
                              <polygon points={fillString} fill="url(#chartGradient)" />
                              <polyline points={pointsString} fill="none" stroke="#F5C518" strokeWidth="3" style={{ filter: "drop-shadow(0 0 6px rgba(245, 197, 24, 0.3))" }} />
                              {points.map((p, i) => (
                                <g key={i} className="group/point">
                                  <circle cx={p.x} cy={p.y} r="8" className="fill-yellow-400/20 group-hover/point:fill-yellow-400/40 cursor-pointer transition-all" />
                                  <circle cx={p.x} cy={p.y} r="4" className="fill-[#F5C518] stroke-[#0D1117] stroke-2 cursor-pointer" />
                                  <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-black fill-[#F5C518]">{p.score}%</text>
                                  <text x={p.x} y="228" textAnchor="middle" className="text-[8px] font-bold fill-slate-500">{p.date}</text>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-2 text-center p-4">
                        <Activity className="w-10 h-10 text-slate-600 animate-pulse" />
                        <h4 className="text-xs font-black text-slate-300">Pas assez de données pour le graphique</h4>
                        <p className="text-[10px] max-w-xs leading-relaxed font-semibold">Réalisez au moins deux examens Blitz pour tracer votre courbe d'amélioration.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtopic Readiness (Bento boxes for special disciplines) */}
                <div className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 space-y-6">
                  <div>
                    <h3 className="font-display font-black text-base text-white">Par Thème de l'Examen</h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Niveau d'assimilation par sous-discipline clé</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#090D1A]/40 border border-white/5 rounded-2xl p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-300">Philosophie Politique (WAEC B)</span>
                        <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[10px]">88% Prêt</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: "88%" }} />
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed font-bold">
                        Maîtrise complète de l'analyse des textes institutionnels et philosophiques.
                      </p>
                    </div>

                    <div className="bg-[#090D1A]/40 border border-white/5 rounded-2xl p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-300">Littérature Classique (WAEC C)</span>
                        <span className="text-[#F5C518] bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-lg text-[10px]">79% Prêt</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#F5C518] h-full rounded-full" style={{ width: "79%" }} />
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed font-bold">
                        Bonne intégration des figures de style classiques. Pensez à l'accord des adjectifs de couleur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Bento Grid Detail Sub-topic Readiness */}
              <div className="space-y-4">
                <h3 className="font-display font-black text-base text-white">Analyse de Préparation Fine</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest bg-yellow-500/5 px-2 py-1 rounded-lg border border-yellow-500/10 inline-block">Grammaire & Conjugaison</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-white">Élision & Subjonctif</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">92%</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">Excellent emploi des temps du subjonctif après les conjonctions exprimant le doute.</p>
                    <div className="text-[10px] font-bold text-[#A67C00] bg-[#FFFCE8]/10 border border-[#FFEB85]/20 p-2.5 rounded-xl">
                      💡 Réviser : l'inversion du sujet interrogatif.
                    </div>
                  </div>

                  <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest bg-yellow-500/5 px-2 py-1 rounded-lg border border-yellow-500/10 inline-block">Vocabulaire & Idiotismes</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-white">Richesse Lexicale</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">95%</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">Excellente utilisation d'idiotismes raffinés qui distinguent votre copie d'un candidat ordinaire.</p>
                    <div className="text-[10px] font-bold text-[#A67C00] bg-[#FFFCE8]/10 border border-[#FFEB85]/20 p-2.5 rounded-xl">
                      💡 Réviser : les expressions pour lettre formelle.
                    </div>
                  </div>

                  <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest bg-yellow-500/5 px-2 py-1 rounded-lg border border-yellow-500/10 inline-block">Rédaction & Structuration</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-white">Articulations Logiques</span>
                      <span className="text-xs font-bold text-[#F5C518] font-mono">74%</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">Structure formelle soignée mais manque de fluidité dans la transition entre les paragraphes.</p>
                    <div className="text-[10px] font-bold text-[#A67C00] bg-[#FFFCE8]/10 border border-[#FFEB85]/20 p-2.5 rounded-xl">
                      💡 Réviser : connecteurs logiques de concession.
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Attempt History Table */}
              <div className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-base text-white">Historique Récent des Simulations</h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Détail complet de vos 2h30 d'épreuves de Blitz</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView("blitz")}
                    className="bg-[#F5C518] hover:bg-yellow-400 text-[#0D1117] font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer text-center"
                  >
                    Nouveau Blitz ⚡
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-400 font-mono font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Date de Simulation</th>
                        <th className="py-3 px-4">Score Global</th>
                        <th className="py-3 px-4">Grade Estimé</th>
                        <th className="py-3 px-4">Section A/B/C</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {attempts.map((att) => (
                        <tr key={att.id} className="hover:bg-white/1">
                          <td className="py-4 px-4 font-black text-slate-200">{att.date}</td>
                          <td className="py-4 px-4">
                            <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
                              att.score >= 80 ? "text-emerald-400 bg-emerald-500/10" :
                              att.score >= 70 ? "text-amber-400 bg-yellow-500/10" :
                              "text-rose-400 bg-rose-500/10"
                            }`}>
                              {att.score}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-300 font-bold">{att.grade}</td>
                          <td className="py-4 px-4 font-mono text-[10px] text-slate-400">
                            A: {att.sectionA}% • B: {att.sectionB}% • C: {att.sectionC}%
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                localStorage.setItem("current_correction_attempt", JSON.stringify(att));
                                setCurrentView("blitz");
                              }}
                              className="text-[#F5C518] hover:text-yellow-400 text-xs font-black underline cursor-pointer"
                            >
                              Consulter le Corrigé Détaillé 🔍
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* 4. MODAL POPUP FOR MAP NODES */}
      {showPopup && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs" onClick={closePopup} />
          
          <div className="bg-[#0F1B2D] border border-white/10 w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl text-left scale-100 transition-all">
            <div className="flex justify-between items-start mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#F5C518] text-[#0D1117] flex items-center justify-center shadow-lg shadow-yellow-400/10 shrink-0">
                {React.createElement(selectedNode.icon || Star, { className: "w-8 h-8 stroke-[2.2]" })}
              </div>
              <button 
                onClick={closePopup}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-display font-black text-lg text-white mb-2">{selectedNode.title}</h3>
            
            <div className="flex gap-2.5 mb-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black font-mono border uppercase ${
                selectedNode.status === "Complété" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : selectedNode.status === "En cours"
                    ? "bg-[#F5C518]/10 border-[#F5C518]/20 text-[#F5C518]"
                    : "bg-slate-800 border-slate-700 text-slate-400"
              }`}>
                {selectedNode.status}
              </span>

              {selectedNode.score && (
                <span className="px-2.5 py-1 bg-emerald-500/10 rounded-full text-[10px] font-mono text-emerald-400 font-extrabold border border-emerald-500/20">
                  Score: {selectedNode.score}
                </span>
              )}
            </div>

            <p className="text-slate-300 text-xs font-medium leading-relaxed mb-6">
              {selectedNode.description}
            </p>

            <div className="space-y-2">
              {selectedNode.status === "Complété" && (
                <button
                  onClick={() => {
                    setShowPopup(false);
                    if (selectedNode.id === "l1") {
                      setCurrentView("lesson-viewer");
                    } else {
                      startLesson();
                    }
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-white/5 shadow-sm"
                >
                  Réviser la leçon
                </button>
              )}

              {selectedNode.status === "En cours" && (
                <button
                  onClick={() => {
                    setShowPopup(false);
                    if (selectedNode.id === "l1") {
                      setCurrentView("lesson-viewer");
                    } else {
                      startLesson();
                    }
                  }}
                  className="w-full py-3.5 bg-[#F5C518] hover:bg-yellow-400 text-[#0D1117] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Commencer
                </button>
              )}

              {selectedNode.status === "Déverrouillé" && (
                <button
                  onClick={() => {
                    setShowPopup(false);
                    if (selectedNode.id === "l1") {
                      setCurrentView("lesson-viewer");
                    } else {
                      startLesson();
                    }
                  }}
                  className="w-full py-3.5 bg-[#F5C518] hover:bg-yellow-400 text-[#0D1117] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Commencer
                </button>
              )}

              {selectedNode.status === "Locked" && (
                <button
                  disabled
                  className="w-full py-3 bg-slate-850 text-slate-500 font-black text-xs uppercase tracking-wider rounded-xl cursor-not-allowed border border-slate-800 text-center"
                >
                  Verrouillé
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 5. INTERACTIVE LEÇON MODAL SIMULATOR */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1B2D] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative text-left">
            
            {/* Modal header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0D1117]">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20 px-2.5 py-1 rounded-full font-mono font-black uppercase">
                  Leçon active
                </span>
                <h3 className="text-sm font-black text-white">Figures de Style</h3>
              </div>
              <button 
                onClick={() => setShowLessonModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Quitter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            {lessonStep === 1 ? (
              <div className="p-6 space-y-6">
                <div className="bg-slate-900 rounded-2xl p-4 border border-white/5 flex items-start gap-4">
                  <div className="p-2.5 bg-[#F5C518]/10 rounded-xl text-[#F5C518] shrink-0">
                    <Volume2 className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-500">
                      AUDIO DU TUTEUR
                    </p>
                    <p className="text-xs font-semibold text-slate-200 mt-1 leading-relaxed">
                      "{quizQuestions.audioText}"
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                    Sélectionnez la meilleure réponse argumentative:
                  </p>
                  {quizQuestions.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full text-left p-4 rounded-2xl text-xs font-semibold leading-relaxed transition-all cursor-pointer border ${
                        selectedAnswer === idx
                          ? idx === quizQuestions.correctIndex
                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/5"
                            : "bg-rose-500/10 border-rose-500/50 text-rose-300 shadow-md shadow-rose-500/5"
                          : "bg-slate-900 hover:bg-slate-850 border-white/5 text-slate-300 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-black shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {answerStatus !== "idle" && (
                  <div className={`p-4 rounded-2xl border ${
                    answerStatus === "correct" 
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/5 border-rose-500/20 text-rose-300"
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      {answerStatus === "correct" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Félicitations! +50 XP</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-rose-400" />
                          <span className="text-xs font-black text-rose-400 uppercase tracking-wider">Erreur. Essayez encore!</span>
                        </>
                      )}
                    </div>
                    {answerStatus === "correct" && (
                      <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                        {quizQuestions.explanation}
                      </p>
                    )}
                  </div>
                )}

                {answerStatus === "correct" && (
                  <button
                    onClick={() => setLessonStep(2)}
                    className="w-full bg-[#F5C518] hover:bg-yellow-400 text-[#0D1117] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Valider l'Étape
                  </button>
                )}
              </div>
            ) : (
              <div className="p-6 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-lg font-black text-white">Leçon validée! 🎉</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
                    Vous venez de remporter 50 XP. Votre progression a été enregistrée avec succès!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowLessonModal(false);
                    setCurrentView("dashboard");
                  }}
                  className="w-full bg-[#F5C518] hover:bg-yellow-400 text-[#0D1117] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Retour au Tableau de Bord
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
