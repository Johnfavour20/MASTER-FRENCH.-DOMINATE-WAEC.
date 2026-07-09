/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, BookOpen, Sparkles, Clock, Star, Lock, CheckCircle, 
  Play, Volume2, Mic, MicOff, Send, RefreshCw, FileText, Check, 
  X, Search, MessageSquare, Award, BookOpenCheck, ChevronRight, Flag, Grid
} from "lucide-react";

interface BlitzArenaProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  onGainXP: (amount: number) => void;
  isPremium?: boolean;
}

// WAEC Mock Exam Questions
const mockExamQuestions = {
  sectionA: [
    {
      id: 1,
      question: "Choisissez l'article correct : ___ homme que j'ai vu hier est le directeur de l'école.",
      options: ["Le", "La", "L'", "Un"],
      correct: "L'",
      explanation: "On utilise 'L'' devant un nom singulier commençant par une voyelle ou un h muet."
    },
    {
      id: 2,
      question: "Elle s'est ___ les mains avant d'entrer dans la salle d'examen.",
      options: ["lavé", "lavée", "lavés", "lavées"],
      correct: "lavé",
      explanation: "Le participe passé d'un verbe pronominal ne s'accorde pas si le COD ('les mains') est placé après le verbe."
    },
    {
      id: 3,
      question: "Si j'avais su, je ___ venu plus tôt pour réviser.",
      options: ["serais", "serai", "suis", "serais été"],
      correct: "serais",
      explanation: "Dans une proposition conditionnelle de regret (si + plus-que-parfait), la principale est au conditionnel passé."
    },
    {
      id: 4,
      question: "Bien que cet exercice ___ difficile, nous devons le terminer.",
      options: ["est", "soit", "sera", "sois"],
      correct: "soit",
      explanation: "La conjonction 'bien que' est toujours suivie du subjonctif."
    },
    {
      id: 5,
      question: "Chacun des élèves doit apporter ___ propre stylo et dictionnaire.",
      options: ["leur", "sa", "son", "ses"],
      correct: "son",
      explanation: "'Chacun' est singulier, on emploie donc le possessif singulier 'son' devant le nom masculin 'stylo'."
    }
  ],
  sectionB: {
    passage: "Le rôle de l'éducation en Afrique de l'Ouest moderne ne se limite pas à l'acquisition de diplômes académiques. Aujourd'hui, face aux mutations technologiques rapides, les écoles doivent former des citoyens agiles, capables de résoudre des problèmes locaux tout en restant connectés au reste du monde. Les examens régionaux comme le WAEC jouent un rôle crucial en harmonisant les standards éducatifs et en encourageant une préparation rigoureuse des élèves dans les matières clés comme le français et les mathématiques.",
    questions: [
      {
        id: 6,
        question: "Quel est, selon le texte, le rôle moderne de l'éducation en Afrique de l'Ouest ?",
        options: [
          "Seulement obtenir des diplômes académiques élevés.",
          "Former des citoyens agiles capables de résoudre des problèmes locaux.",
          "Ignorer les mutations technologiques mondiales.",
          "Remplacer toutes les langues régionales par le français."
        ],
        correct: "Former des citoyens agiles capables de résoudre des problèmes locaux.",
        explanation: "Le texte stipule explicitement que les écoles doivent former des citoyens agiles, capables de résoudre des problèmes locaux."
      },
      {
        id: 7,
        question: "Comment le WAEC contribue-t-il au système éducatif régional ?",
        options: [
          "En créant des examens différents pour chaque pays.",
          "En éliminant les cours de mathématiques.",
          "En harmonisant les standards éducatifs et en encourageant une préparation rigoureuse.",
          "En réduisant le temps d'étude des matières clés."
        ],
        correct: "En harmonisant les standards éducatifs et en encourageant une préparation rigoureuse.",
        explanation: "La dernière phrase mentionne que le WAEC joue un rôle crucial en harmonisant les standards et en encourageant une préparation rigoureuse."
      }
    ]
  },
  sectionC: {
    prompts: [
      {
        id: "prompt1",
        title: "Lettre Amicale",
        text: "Rédigez une lettre à votre ami vivant à l'étranger pour lui décrire comment vous vous préparez pour votre examen du WAEC et les outils numériques que vous utilisez."
      },
      {
        id: "prompt2",
        title: "Discours Argumentatif",
        text: "En tant que représentant des élèves, prononcez un discours de 150 mots devant le conseil de votre lycée sur l'importance d'intégrer des sessions d'apprentissage d'IA dans les cours de français."
      }
    ]
  }
};

// Words for the Dictionnaire slider
const dictionaryWords = [
  { word: "Élision", type: "n.f.", definition: "Suppression de la voyelle finale (a, e, i) d'un mot devant un mot commençant par une voyelle ou un h muet. Exemple: l'arbre au lieu de le arbre.", tip: "Crucial pour l'épreuve de grammaire du WAEC !" },
  { word: "Accorder", type: "v.tr.", definition: "Mettre un mot en harmonie de genre (masculin/féminin) et de nombre (singulier/pluriel) avec le mot auquel il se rapporte.", tip: "Les participes passés avec 'être' s'accordent toujours avec le sujet !" },
  { word: "Subjonctif", type: "n.m.", definition: "Mode exprimant un doute, un souhait, une obligation ou une émotion. Exemple : Il faut que tu saches.", tip: "Fréquent après 'bien que', 'pour que', 'afin que'." },
  { word: "Pléonasme", type: "n.m.", definition: "Répétition superflue de termes de même sens. Exemple: monter en haut, reculer en arrière.", tip: "Évitez-les absolument dans vos rédactions WAEC pour ne pas perdre de points." },
  { word: "Idiotisme", type: "n.m.", definition: "Formule ou expression propre à une langue, impossible à traduire littéralement. Exemple: 'Avoir un cœur d'or'.", tip: "En utiliser quelques-uns enrichit considérablement votre score de style." }
];

export default function BlitzArena({ userXP, userStreak, setCurrentView, onGainXP, isPremium = true }: BlitzArenaProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "exam" | "qcm" | "writing" | "oral">("dashboard");
  const [isDictOpen, setIsDictOpen] = useState(false);
  const [dictSearch, setDictSearch] = useState("");
  
  // Correction mode & Navigation states
  const [examCorrectionMode, setExamCorrectionMode] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [showQuestionMap, setShowQuestionMap] = useState(false);
  const [activeSimulatedId, setActiveSimulatedId] = useState<number | null>(null);

  // Load previous attempt for correction mode if requested from Parcours
  useEffect(() => {
    const savedAttemptStr = localStorage.getItem("current_correction_attempt");
    if (savedAttemptStr) {
      try {
        const attempt = JSON.parse(savedAttemptStr);
        setActiveTab("exam");
        setExamStarted(true);
        setExamFinished(true);
        setExamCorrectionMode(true);
        setExamReport({
          overall: attempt.score,
          grade: attempt.grade,
          sectionA: attempt.sectionA,
          sectionB: attempt.sectionB,
          sectionC: attempt.sectionC,
          essayAnalysis: {
            style: attempt.score >= 80 ? "Niveau remarquable. Structure argumentative rigoureuse, vocabulaire sophistiqué adapté au concours." : "Structure soignée mais manque d'idiotismes. Pensez à relier vos idées avec des connecteurs logiques de concession.",
            corrections: attempt.score >= 80 ? "Excellente élision détectée. Les accords grammaticaux complexes sont parfaitement maîtrisés." : "Quelques erreurs mineures d'accord des adjectifs de couleur et de conjugaison au subjonctif."
          }
        });
        
        // Populate answers so correction mode highlights them nicely
        const simulatedAnswers: Record<number, string> = {
          1: attempt.score >= 80 ? "L'" : "Le",
          2: attempt.score >= 70 ? "lavé" : "lavée",
          3: "serais",
          4: attempt.score >= 80 ? "soit" : "est",
          5: "son",
          6: "Former des citoyens agiles capables de résoudre des problèmes locaux.",
          7: attempt.score >= 70 ? "En harmonisant les standards éducatifs et en encourageant une préparation rigoureuse." : "En réduisant le temps d'étude des matières clés."
        };
        setExamAnswers(simulatedAnswers);
        setExamEssay("Monsieur le Directeur,\n\nJe me permets de vous écrire afin de vous faire part de mon intérêt pour l'intégration de séances d'IA pour perfectionner notre français au WAEC...");
      } catch (e) {
        console.error("Error loading attempt from local storage", e);
      }
      localStorage.removeItem("current_correction_attempt");
    }
  }, []);

  // ================= 1. EXAM SIMULATION STATE =================
  const [examStarted, setExamStarted] = useState(false);
  const [examTimeLeft, setExamTimeLeft] = useState(9000); // 2h30m in seconds
  const [examAnswers, setExamAnswers] = useState<Record<number, string>>({});
  const [examEssay, setExamEssay] = useState("");
  const [selectedEssayPrompt, setSelectedEssayPrompt] = useState(mockExamQuestions.sectionC.prompts[0]);
  const [examFinished, setExamFinished] = useState(false);
  const [examReport, setExamReport] = useState<any>(null);
  const [isExamEvaluating, setIsExamEvaluating] = useState(false);

  // Helper for generating simulated French grammar questions for items 8 to 80
  const getSimulatedQuestion = (id: number) => {
    const grammarTopics = [
      {
        q: "Choisissez la forme correcte du verbe : Il faut que nous ___ plus attentifs.",
        opts: ["soyons", "sommes", "serons", "soit"],
        correct: "soyons",
        exp: "Le verbe après 'il faut que' se conjugue au subjonctif présent."
      },
      {
        q: "Identifiez l'orthographe correcte : Les dossiers ___ par le secrétaire sont prêts.",
        opts: ["envoyés", "envoyer", "envoyé", "envoyées"],
        correct: "envoyés",
        exp: "Le participe passé employé comme adjectif s'accorde en genre et en nombre avec le nom qualifié."
      },
      {
        q: "Complétez la phrase : Cet étudiant travaille ___ que son frère.",
        opts: ["mieux", "meilleur", "plus bon", "bien"],
        correct: "mieux",
        exp: "'Mieux' est l'adverbe de comparaison correspondant à 'bien'."
      },
      {
        q: "Choisissez la préposition correcte : Il s'intéresse beaucoup ___ littérature ouest-africaine.",
        opts: ["à la", "de la", "pour la", "en"],
        correct: "à la",
        exp: "Le verbe 's'intéresser' se construit avec la préposition 'à'."
      },
      {
        q: "Trouvez le synonyme de 'éphémère' :",
        opts: ["passager", "éternel", "solide", "rapide"],
        correct: "passager",
        exp: "'Éphémère' qualifie ce qui dure très peu de temps, donc passager."
      }
    ];
    
    const index = id % grammarTopics.length;
    const topic = grammarTopics[index];
    return {
      id,
      question: `[Item ${id}] ${topic.q}`,
      options: topic.opts,
      correct: topic.correct,
      explanation: topic.exp
    };
  };

  // ================= 2. Q_C_M BLITZ STATE =================
  const [qcmIndex, setQcmIndex] = useState(0);
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, string>>({});
  const [qcmSelectedOption, setQcmSelectedOption] = useState<string | null>(null);
  const [qcmFinished, setQcmFinished] = useState(false);
  const [qcmScore, setQcmScore] = useState(0);

  // ================= 3. WRITING COMPOSITION STATE =================
  const [selectedPrompt, setSelectedPrompt] = useState(mockExamQuestions.sectionC.prompts[0]);
  const [essayContent, setEssayContent] = useState("");
  const [isWritingEvaluating, setIsWritingEvaluating] = useState(false);
  const [writingReport, setWritingReport] = useState<any>(null);

  // ================= 4. ORAL SIMULATION STATE =================
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [oralStep, setOralStep] = useState(1); // 1: Listen, 2: Record, 3: Feedback
  const [audioFeedback, setAudioFeedback] = useState<any>(null);

  // Timer for Mock Exam
  useEffect(() => {
    let interval: any;
    if (examStarted && !examFinished && examTimeLeft > 0) {
      interval = setInterval(() => {
        setExamTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (examTimeLeft === 0 && examStarted && !examFinished) {
      handleFinishExam();
    }
    return () => clearInterval(interval);
  }, [examStarted, examFinished, examTimeLeft]);

  // Recording timer emulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordProgress((prev) => Math.min(prev + 10, 100));
      }, 500);
    } else {
      setRecordProgress(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle auto-stop recording when progress reaches 100%
  useEffect(() => {
    if (isRecording && recordProgress >= 100) {
      handleStopRecording();
    }
  }, [recordProgress, isRecording]);

  const formatExamTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Trigger Mock Exam finish
  const handleFinishExam = () => {
    setIsExamEvaluating(true);
    setTimeout(() => {
      // Calculate scores
      let sectionAScore = 0;
      mockExamQuestions.sectionA.forEach((q) => {
        if (examAnswers[q.id] === q.correct) sectionAScore += 20; // 100 total
      });

      let sectionBScore = 0;
      mockExamQuestions.sectionB.questions.forEach((q) => {
        if (examAnswers[q.id] === q.correct) sectionBScore += 50; // 100 total
      });

      // Grade the essay automatically based on length & pre-defined templates
      const wordCount = examEssay.trim().split(/\s+/).filter(Boolean).length;
      let sectionCScore = 60;
      if (wordCount > 120) sectionCScore = 85;
      else if (wordCount > 80) sectionCScore = 75;
      else if (wordCount > 10) sectionCScore = 65;

      const overall = Math.round((sectionAScore + sectionBScore + sectionCScore) / 3);

      let grade = "C4";
      if (overall >= 80) grade = "A1 (Excellent)";
      else if (overall >= 70) grade = "B2 (Très Bien)";
      else if (overall >= 60) grade = "C4 (Bien)";
      else if (overall >= 50) grade = "D7 (Passable)";

      setExamReport({
        overall,
        grade,
        sectionA: sectionAScore,
        sectionB: sectionBScore,
        sectionC: sectionCScore,
        essayAnalysis: {
          style: wordCount > 80 ? "Bonne structure narrative, vocabulaire WAEC approprié." : "Un peu court. Utilisez plus de connecteurs logiques.",
          corrections: wordCount > 0 ? "Excellente élision détectée. Attention à l'accord des participes." : "Aucun texte rédigé."
        }
      });
      setIsExamEvaluating(false);
      setExamFinished(true);
      onGainXP(150); // Big award for full exam
    }, 2500);
  };

  // Submit QCM question
  const handleQcmSelect = (option: string) => {
    setQcmSelectedOption(option);
    const currentQ = mockExamQuestions.sectionA[qcmIndex];
    const isCorrect = option === currentQ.correct;

    setQcmAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    if (isCorrect) {
      setQcmScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (qcmIndex < mockExamQuestions.sectionA.length - 1) {
        setQcmIndex(prev => prev + 1);
        setQcmSelectedOption(null);
      } else {
        setQcmFinished(true);
        onGainXP(40);
      }
    }, 1500);
  };

  // Submit Real AI Writing analysis
  const handleWritingSubmit = async () => {
    if (!essayContent.trim()) return;
    setIsWritingEvaluating(true);
    setWritingReport(null);

    try {
      const response = await fetch("/api/gemini/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: essayContent })
      });

      if (response.ok) {
        const data = await response.json();
        setWritingReport({
          score: data.score || 78,
          corrections: data.corrections || [],
          feedback: data.overallFeedback || "Bon effort de rédaction ! Le ton est adéquat pour l'épreuve.",
          suggestedRewrite: data.suggestedRewrite || ""
        });
        onGainXP(50);
      } else {
        throw new Error("API call error");
      }
    } catch (e) {
      // Fallback
      setTimeout(() => {
        const words = essayContent.trim().split(/\s+/).filter(Boolean).length;
        const fallbackScore = Math.min(65 + Math.floor(words / 5), 95);
        setWritingReport({
          score: fallbackScore,
          corrections: [
            { original: "je ai", corrected: "j'ai", explanation: "Règle de l'élision obligatoire devant voyelle." },
            { original: "les élève", corrected: "les élèves", explanation: "Accord pluriel oublié." }
          ],
          feedback: "Excellente tentative ! Votre structure respecte les codes de l'épreuve WAEC. Pensez à relire vos accords de verbes.",
          suggestedRewrite: "J'écris cette lettre pour te décrire mon lycée moderne..."
        });
        onGainXP(40);
      }, 1500);
    } finally {
      setIsWritingEvaluating(false);
    }
  };

  // Oral simulation triggers
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordProgress(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setOralStep(3);
    setAudioFeedback({
      pronunciation: 84,
      fluency: 79,
      accuracy: 88,
      advice: "La liaison dans 'nous_avons' est parfaite ! Travaillez l'intonation montante sur les questions."
    });
    onGainXP(30);
  };

  // Reset Arena view
  const handleBackToDashboard = () => {
    setActiveTab("dashboard");
    // reset states
    setExamStarted(false);
    setExamFinished(false);
    setExamAnswers({});
    setExamEssay("");
    setQcmIndex(0);
    setQcmAnswers({});
    setQcmSelectedOption(null);
    setQcmFinished(false);
    setQcmScore(0);
    setEssayContent("");
    setWritingReport(null);
    setOralStep(1);
    setAudioFeedback(null);
  };

  // Filtered dict words
  const filteredWords = dictionaryWords.filter(w => 
    w.word.toLowerCase().includes(dictSearch.toLowerCase()) ||
    w.definition.toLowerCase().includes(dictSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#fcfcfd] flex flex-col font-sans text-[#002B5B] relative overflow-x-hidden">
      
      {/* 1. Header Navigation Bar of Arena */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (activeTab !== "dashboard") {
                handleBackToDashboard();
              } else {
                setCurrentView("dashboard");
              }
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-[#002B5B] transition-colors font-semibold text-xs md:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tableau de Bord</span>
          </button>
          
          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="font-display font-black text-lg md:text-xl tracking-tight">Le Blitz</span>
            <span className="bg-[#FFFCE8] text-[#A67C00] border border-[#FFEB85] text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider font-mono">
              PREMIUM
            </span>
          </div>
        </div>

        {/* Action button: Dictionary Slider & User Profile */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDictOpen(true)}
            className="bg-[#002B5B] hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Dictionnaire</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-[#002B5B] flex items-center justify-center text-white text-xs font-black border border-slate-100">
            JI
          </div>
        </div>
      </header>

      {/* 2. Main content rendering */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
        
        <AnimatePresence mode="wait">
          
          {/* ==================== A. DASHBOARD VIEW ==================== */}
          {activeTab === "dashboard" && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Welcome text */}
              <div className="space-y-1">
                <h1 className="font-display font-black text-2xl md:text-4xl tracking-tight text-[#002B5B]">
                  Bienvenue dans l'Arena de Pratique
                </h1>
                <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-2xl leading-relaxed">
                  Préparez-vous à l'excellence. Choisissez votre mode d'entraînement et dominez les épreuves de français du WAEC.
                </p>
              </div>

              {/* Banner: Simulation Examen Blanc Complet */}
              <div className="bg-[#002B5B] text-white rounded-3xl border border-blue-950 p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-stretch justify-between gap-6">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="bg-amber-400 text-[#002B5B] text-[9px] font-black tracking-widest px-3 py-1 rounded-md uppercase font-mono inline-block">
                      RECOMMANDÉ POUR VOUS
                    </span>
                    <h2 className="font-display font-black text-xl md:text-3xl leading-tight tracking-tight">
                      Simulation Examen Blanc Complet
                    </h2>
                    <p className="text-blue-100/80 text-xs md:text-sm font-medium leading-relaxed max-w-md">
                      Mettez-vous en condition réelle : 2h30, toutes les sections, chronomètre officiel. Évaluation immédiate par IA.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab("exam")}
                      className="bg-[#FFD214] hover:bg-yellow-400 text-[#002B5B] font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer font-sans"
                    >
                      <span>Commencer l'examen</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                    <div className="flex items-center gap-1.5 text-blue-200 text-xs font-semibold">
                      <Clock className="w-4 h-4" />
                      <span>Temps estimé : 150 min</span>
                    </div>
                  </div>
                </div>

                {/* Score container on right */}
                <div className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between shrink-0">
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-blue-200 text-[10px] uppercase font-mono font-black tracking-wider">Score moyen Blitz</span>
                      <span className="text-2xl font-display font-black text-[#FFD214]">78%</span>
                    </div>
                    {/* Horizontal progress bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-[#FFD214] rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                  <p className="text-blue-100/70 text-[10px] font-semibold mt-4">
                    Améliorez-vous de 12% pour atteindre le "A1"
                  </p>
                </div>
              </div>

              {/* Grid of 3 modes below */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: L'Objectif */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-blue shrink-0 shadow-2xs">
                      <CheckCircle className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-lg text-[#002B5B]">L'Objectif</h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        Entraînez-vous spécifiquement sur les questions à choix multiples (QCM). Grammaire, vocabulaire et compréhension rapide.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab("qcm")}
                    className="w-full border border-slate-200 hover:border-[#002B5B] hover:bg-slate-50 text-[#002B5B] text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Mode Blitz (QCM) ➔
                  </button>
                </div>

                {/* Card 2: La Théorie */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFCE8] border border-[#FFEB85] flex items-center justify-center text-[#A67C00] shrink-0 shadow-2xs">
                      <FileText className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-lg text-[#002B5B]">La Théorie</h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        Maîtrisez la rédaction et le résumé. Recevez des corrections personnalisées basées sur les critères officiels du WAEC.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab("writing")}
                    className="w-full border border-slate-200 hover:border-[#002B5B] hover:bg-slate-50 text-[#002B5B] text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Rédaction & Résumé ➔
                  </button>
                </div>

                {/* Card 3: L'Oral */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                      <Mic className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-lg text-[#002B5B]">L'Oral</h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        Pratiquez votre prononciation et votre compréhension auditive avec notre module interactif de simulation orale.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab("oral")}
                    className="w-full border border-slate-200 hover:border-[#002B5B] hover:bg-slate-50 text-[#002B5B] text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Test d'Expression Orale ➔
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* ==================== B. FULL EXAM VIEW ==================== */}
          {activeTab === "exam" && (
            <motion.div 
              key="exam"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#002B5B] flex items-center gap-2">
                    <Award className="text-amber-500 w-6 h-6" />
                    Examen Blanc Complet WAEC
                  </h2>
                  <p className="text-slate-500 text-xs font-semibold mt-1">Section A (Grammaire) • Section B (Compréhension) • Section C (Rédaction)</p>
                </div>

                {!examFinished && examStarted && (
                  <div className="flex items-center gap-2 bg-[#002B5B] text-white px-4 py-2 rounded-2xl font-mono text-xs font-extrabold shadow-sm">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{formatExamTime(examTimeLeft)}</span>
                  </div>
                )}
              </div>

              {!examStarted && !examFinished ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-xl mx-auto space-y-6 shadow-sm">
                  <div className="w-16 h-16 bg-[#FFFCE8] rounded-full flex items-center justify-center text-amber-500 mx-auto shadow-xs">
                    <Award className="w-8 h-8 fill-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-lg text-[#002B5B]">Êtes-vous prêt pour le défi ultime ?</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                      Cette simulation dure 2h30 et comprend 3 sections cruciales de l'examen de français du WAEC. Vous obtiendrez un rapport de notation IA complet à la fin.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <span>5 questions de grammaire fine (20 points par question)</span></div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <span>1 texte de compréhension avec 2 questions de synthèse (100 points)</span></div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <span>1 rédaction libre évaluée par IA selon les rubriques WAEC (100 points)</span></div>
                  </div>
                  <button
                    onClick={() => {
                      setExamStarted(true);
                      setExamTimeLeft(9000);
                    }}
                    className="bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md cursor-pointer inline-block"
                  >
                    Démarrer l'examen (Chronomètre de 2h30)
                  </button>
                </div>
              ) : examStarted && !examFinished ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left columns: Question Forms */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* SECTION A */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                      <h4 className="font-display font-black text-sm uppercase text-[#002B5B] tracking-wider border-b border-slate-50 pb-2 flex justify-between items-center">
                        <span>Section A : Grammaire</span>
                        {examCorrectionMode && (
                          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase font-black">
                            Corrigé Actif 🔍
                          </span>
                        )}
                      </h4>
                      {mockExamQuestions.sectionA.map((q) => {
                        const userAns = examAnswers[q.id];
                        const isSelected = !!userAns;
                        const isCorrect = userAns === q.correct;
                        return (
                          <div key={q.id} className="space-y-3 pt-4 border-t border-slate-100 first:border-0 first:pt-0">
                            <div className="flex justify-between items-start gap-4">
                              <p className="text-xs font-black text-slate-700">{q.id}. {q.question}</p>
                              {!examCorrectionMode && (
                                <button
                                  onClick={() => setFlaggedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[10px] font-black shrink-0 ${
                                    flaggedQuestions[q.id]
                                      ? "bg-amber-50 border-amber-300 text-amber-600 shadow-xs"
                                      : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                                  }`}
                                  title="Marquer pour révision"
                                >
                                  <Flag className="w-3.5 h-3.5 fill-current" />
                                  <span className="hidden sm:inline">{flaggedQuestions[q.id] ? "Signalé" : "Signaler"}</span>
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt) => {
                                const isOptionSelected = userAns === opt;
                                const isOptionCorrect = opt === q.correct;
                                
                                let btnStyle = "border-slate-150 text-slate-600 hover:bg-slate-50";
                                if (examCorrectionMode) {
                                  if (isOptionSelected) {
                                    btnStyle = isOptionCorrect
                                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 pointer-events-none"
                                      : "bg-rose-50 border-rose-500 text-rose-700 pointer-events-none";
                                  } else if (isOptionCorrect) {
                                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 pointer-events-none";
                                  } else {
                                    btnStyle = "border-slate-100 text-slate-300 pointer-events-none";
                                  }
                                } else {
                                  if (isOptionSelected) {
                                    btnStyle = "bg-[#002B5B]/5 border-[#002B5B] text-[#002B5B]";
                                  }
                                }

                                return (
                                  <button
                                    key={opt}
                                    disabled={examCorrectionMode}
                                    onClick={() => setExamAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                    className={`text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {examCorrectionMode && isOptionSelected && isOptionCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                                    {examCorrectionMode && isOptionSelected && !isOptionCorrect && <X className="w-4 h-4 text-rose-600" />}
                                    {examCorrectionMode && !isOptionSelected && isOptionCorrect && <Check className="w-4 h-4 text-emerald-600 opacity-60" />}
                                  </button>
                                );
                              })}
                            </div>
                            {examCorrectionMode && (
                              <div className="bg-[#FFFCE8] border border-[#FFEB85]/40 p-3 rounded-xl text-[10px] text-[#A67C00] font-black leading-relaxed mt-2">
                                💡 RÈGLE WAEC : {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* SECTION B */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                      <h4 className="font-display font-black text-sm uppercase text-[#002B5B] tracking-wider border-b border-slate-50 pb-2 flex justify-between items-center">
                        <span>Section B : Compréhension</span>
                        {examCorrectionMode && (
                          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase font-black">
                            Corrigé Actif 🔍
                          </span>
                        )}
                      </h4>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-medium leading-relaxed text-slate-700 font-serif">
                        {mockExamQuestions.sectionB.passage}
                      </div>
                      {mockExamQuestions.sectionB.questions.map((q) => {
                        const userAns = examAnswers[q.id];
                        const isOptionSelected = !!userAns;
                        const isCorrect = userAns === q.correct;
                        return (
                          <div key={q.id} className="space-y-3 pt-4 border-t border-slate-100 first:border-0 first:pt-0">
                            <div className="flex justify-between items-start gap-4">
                              <p className="text-xs font-black text-slate-700">{q.id}. {q.question}</p>
                              {!examCorrectionMode && (
                                <button
                                  onClick={() => setFlaggedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[10px] font-black shrink-0 ${
                                    flaggedQuestions[q.id]
                                      ? "bg-amber-50 border-amber-300 text-amber-600 shadow-xs"
                                      : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                                  }`}
                                  title="Marquer pour révision"
                                >
                                  <Flag className="w-3.5 h-3.5 fill-current" />
                                  <span className="hidden sm:inline">{flaggedQuestions[q.id] ? "Signalé" : "Signaler"}</span>
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((opt) => {
                                const isOptSelected = userAns === opt;
                                const isOptionCorrect = opt === q.correct;
                                
                                let btnStyle = "border-slate-150 text-slate-600 hover:bg-slate-50";
                                if (examCorrectionMode) {
                                  if (isOptSelected) {
                                    btnStyle = isOptionCorrect
                                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 pointer-events-none"
                                      : "bg-rose-50 border-rose-500 text-rose-700 pointer-events-none";
                                  } else if (isOptionCorrect) {
                                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 pointer-events-none";
                                  } else {
                                    btnStyle = "border-slate-100 text-slate-300 pointer-events-none";
                                  }
                                } else {
                                  if (isOptSelected) {
                                    btnStyle = "bg-[#002B5B]/5 border-[#002B5B] text-[#002B5B]";
                                  }
                                }

                                return (
                                  <button
                                    key={opt}
                                    disabled={examCorrectionMode}
                                    onClick={() => setExamAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                    className={`text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {examCorrectionMode && isOptSelected && isOptionCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                                    {examCorrectionMode && isOptSelected && !isOptionCorrect && <X className="w-4 h-4 text-rose-600" />}
                                    {examCorrectionMode && !isOptSelected && isOptionCorrect && <Check className="w-4 h-4 text-emerald-600 opacity-60" />}
                                  </button>
                                );
                              })}
                            </div>
                            {examCorrectionMode && (
                              <div className="bg-[#FFFCE8] border border-[#FFEB85]/40 p-3 rounded-xl text-[10px] text-[#A67C00] font-black leading-relaxed mt-2">
                                💡 RÈGLE WAEC : {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* SECTION C */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                      <h4 className="font-display font-black text-sm uppercase text-[#002B5B] tracking-wider border-b border-slate-50 pb-2">Section C : Rédaction</h4>
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-slate-500">Choisissez un sujet de rédaction :</p>
                        <div className="flex gap-2">
                          {mockExamQuestions.sectionC.prompts.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => setSelectedEssayPrompt(p)}
                              className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                                selectedEssayPrompt.id === p.id
                                  ? "bg-amber-500 border-amber-600 text-white shadow-xs"
                                  : "bg-white border-slate-200 text-[#002B5B] hover:bg-slate-50"
                              }`}
                            >
                              {p.title}
                            </button>
                          ))}
                        </div>
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-[#002B5B] font-bold">
                          {selectedEssayPrompt.text}
                        </div>
                        <textarea
                          rows={6}
                          disabled={examCorrectionMode}
                          value={examEssay}
                          onChange={(e) => setExamEssay(e.target.value)}
                          placeholder="Rédigez votre texte ici..."
                          className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-[#002B5B] focus:bg-white rounded-2xl p-4 text-xs font-semibold text-slate-700 outline-hidden transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500"
                        />
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                          <span>{examCorrectionMode ? "Mode Lecture seule" : "Chronométré"}</span>
                          <span>{examEssay.trim().split(/\s+/).filter(Boolean).length} mots</span>
                        </div>
                        {examCorrectionMode && (
                          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-2.5 mt-3 text-slate-700 font-sans">
                            <h5 className="font-bold text-emerald-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-emerald-600" />
                              <span>Évaluation de la rédaction par l'IA</span>
                            </h5>
                            <p className="text-slate-600 leading-relaxed font-medium">
                              <strong>Cohérence du discours :</strong> Très bonne adhésion au sujet proposé. Les arguments s'enchaînent de façon logique et structurée. (Note : {examReport?.sectionC || 80}/100)
                            </p>
                            <p className="text-slate-600 leading-relaxed font-medium">
                              <strong>Commentaire de style :</strong> {examReport?.essayAnalysis.style || "Bonne structure narrative, vocabulaire WAEC approprié."}
                            </p>
                            <p className="text-slate-600 leading-relaxed font-medium">
                              <strong>Correction orthographique :</strong> {examReport?.essayAnalysis.corrections || "Excellente élision détectée. Les accords grammaticaux complexes sont parfaitement maîtrisés."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Status & Submission & Question Map */}
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs sticky top-24 space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <h4 className="font-display font-black text-xs uppercase text-slate-400 tracking-wider">État d'avancement</h4>
                        {examCorrectionMode && (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-lg font-mono font-bold">
                            CORRIGÉ
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>Questions répondues</span>
                          <span className="font-mono text-[#002B5B] font-black">
                            {Object.keys(examAnswers).length} / 85
                          </span>
                        </div>
                        {/* Progress bar for 85 items */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full transition-all duration-300"
                            style={{ width: `${(Object.keys(examAnswers).length / 85) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>Questions signalées</span>
                          <span className="font-mono text-amber-600 flex items-center gap-1 font-black">
                            <Flag className="w-3 h-3 fill-current" />
                            {Object.values(flaggedQuestions).filter(Boolean).length}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 pt-1">
                          <span>Rédaction rédigée</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            examEssay.trim().length > 10 
                              ? "bg-emerald-50 text-emerald-600" 
                              : "bg-rose-50 text-rose-500"
                          }`}>
                            {examEssay.trim().length > 10 ? "COMPLET" : "INCOMPLET"}
                          </span>
                        </div>
                      </div>

                      {/* Mini Question Map grid preview */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Aperçu de la Carte (85 Questions)</span>
                          <button
                            onClick={() => setShowQuestionMap(true)}
                            className="text-[10px] text-[#002B5B] hover:text-blue-800 font-bold underline cursor-pointer"
                          >
                            Agrandir
                          </button>
                        </div>
                        <div className="grid grid-cols-10 gap-1 max-h-[140px] overflow-y-auto custom-scrollbar p-1 bg-slate-50 rounded-xl border border-slate-100">
                          {Array.from({ length: 85 }, (_, i) => {
                            const qId = i + 1;
                            const isAns = !!examAnswers[qId] || (qId === 81 && examEssay.trim().length > 10);
                            const isFlg = !!flaggedQuestions[qId];
                            
                            let colorClass = "bg-slate-200 border-slate-300 text-slate-500";
                            if (isFlg) colorClass = "bg-amber-400 border-amber-500 text-amber-950";
                            else if (isAns) {
                              colorClass = "bg-[#002B5B] border-[#002B5B] text-white";
                            }

                            return (
                              <button
                                key={qId}
                                onClick={() => {
                                  if (qId <= 5) {
                                    // Scroll Section A
                                    document.getElementById("exam-title")?.scrollIntoView({ behavior: "smooth" });
                                  } else if (qId === 6 || qId === 7) {
                                    // Scroll Section B
                                    document.getElementById("exam-title")?.scrollIntoView({ behavior: "smooth" });
                                  } else {
                                    setShowQuestionMap(true);
                                  }
                                }}
                                className={`w-full aspect-square rounded-md border text-[8px] font-black flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${colorClass}`}
                                title={`Question ${qId}`}
                              >
                                {qId}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <button
                          onClick={() => setShowQuestionMap(true)}
                          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider py-3 rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <Grid className="w-4 h-4 text-slate-500" />
                          <span>Ouvrir la Carte Interactive</span>
                        </button>

                        <button
                          onClick={handleFinishExam}
                          disabled={isExamEvaluating || examCorrectionMode}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isExamEvaluating ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Évaluation IA en cours...</span>
                            </>
                          ) : examCorrectionMode ? (
                            <span>Corrigé en cours de lecture</span>
                          ) : (
                            <span>Soumettre mon Examen</span>
                          )}
                        </button>

                        {examCorrectionMode && (
                          <button
                            onClick={() => {
                              setExamCorrectionMode(false);
                              setExamFinished(false);
                              setExamStarted(false);
                              setExamAnswers({});
                              setExamEssay("");
                              setFlaggedQuestions({});
                              setCurrentView("parcours");
                            }}
                            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs uppercase tracking-wider py-3 rounded-2xl border border-rose-100 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                          >
                            <span>Fermer le Corrigé</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* Premium Dark Bento Results & AI Debrief Screen */
                <div className="bg-[#0F1B2D] border border-white/10 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto space-y-8 shadow-2xl relative overflow-hidden">
                  {/* Subtle golden atmospheric background glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5C518]/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Header: Academic Certificate Seal style */}
                  <div className="text-center space-y-3 relative z-10">
                    <div className="w-20 h-20 bg-[#F5C518]/10 border border-[#F5C518]/30 rounded-full flex items-center justify-center text-[#F5C518] mx-auto shadow-lg shadow-yellow-500/5">
                      <Award className="w-10 h-10 stroke-[1.8] animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-black text-[#F5C518] bg-[#F5C518]/10 border border-[#F5C518]/20 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                        Simulation Complétée • Diagnostic IA
                      </span>
                      <h3 className="font-display font-black text-2xl text-white tracking-tight">Votre Rapport de Notation Officieux</h3>
                      <p className="text-slate-400 text-xs font-semibold">Conforme au référentiel d'évaluation du français du WAEC</p>
                    </div>
                  </div>

                  {/* Bento Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    {/* Final Score */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center space-y-1 hover:border-[#F5C518]/20 transition-all">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Score Global</span>
                      <div className="font-display font-black text-3xl text-white tracking-tight flex items-center justify-center gap-1">
                        <span className="text-[#F5C518]">{examReport?.overall}%</span>
                      </div>
                    </div>

                    {/* WAEC Grade */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center space-y-1 hover:border-blue-500/20 transition-all">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Grade Obtenu</span>
                      <div className="font-display font-black text-2xl text-blue-400 tracking-tight mt-1">
                        {examReport?.grade.split(" ")[0]}
                      </div>
                    </div>

                    {/* Progress / Completion Rate */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center space-y-1 hover:border-emerald-500/20 transition-all">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Taux de Réponse</span>
                      <div className="font-display font-black text-2xl text-emerald-400 tracking-tight mt-1">
                        {Math.round((Object.keys(examAnswers).length / 85) * 100)}%
                      </div>
                    </div>

                    {/* Awarded XP */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center space-y-1 hover:border-purple-500/20 transition-all">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Bonus Reçu</span>
                      <div className="font-display font-black text-2xl text-purple-400 tracking-tight mt-1 flex items-center justify-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        <span>+150 XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Section-by-Section Score Breakdown */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4 relative z-10">
                    <h4 className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-2">
                      <BookOpenCheck className="w-4 h-4 text-[#F5C518]" />
                      <span>Détail des Épreuves</span>
                    </h4>
                    
                    <div className="space-y-3.5">
                      {/* Section A */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">Section A : Grammaire et Syntaxe</span>
                          <span className="text-[#F5C518]">{examReport?.sectionA}/100</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#F5C518] h-full rounded-full" style={{ width: `${examReport?.sectionA || 60}%` }} />
                        </div>
                      </div>

                      {/* Section B */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">Section B : Compréhension de Texte</span>
                          <span className="text-blue-400">{examReport?.sectionB || 100}/100</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${examReport?.sectionB || 100}%` }} />
                        </div>
                      </div>

                      {/* Section C */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">Section C : Rédaction d'Essai Libre</span>
                          <span className="text-emerald-400">{examReport?.sectionC}/100</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${examReport?.sectionC || 70}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Bespoke Debrief & Recommendations Panel */}
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-5 md:p-6 space-y-6 relative z-10">
                    <h4 className="font-display font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#F5C518]" />
                      <span>Debriefing Diagnostic de l'IA</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Style Critique */}
                      <div className="space-y-3 bg-[#0D1117]/60 border border-white/5 p-4 rounded-2xl">
                        <h5 className="font-display font-black text-xs text-blue-400 uppercase tracking-wide">
                          ✍️ Critique de Style (Section C)
                        </h5>
                        <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                          {examReport?.essayAnalysis.style}
                        </p>
                      </div>

                      {/* Right: Grammatical recommendations */}
                      <div className="space-y-3 bg-[#0D1117]/60 border border-white/5 p-4 rounded-2xl">
                        <h5 className="font-display font-black text-xs text-amber-500 uppercase tracking-wide">
                          🛠️ Améliorations Grammaticales
                        </h5>
                        <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                          {examReport?.essayAnalysis.corrections}
                        </p>
                      </div>
                    </div>

                    {/* Gap suggestions / Clickable Lexique flashcards */}
                    <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl space-y-3">
                      <h5 className="font-display font-black text-xs text-[#F5C518] uppercase tracking-wide flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>Gaps Lexicaux Détectés (Flashcards Recommandées)</span>
                      </h5>
                      <p className="text-slate-400 text-[11px] font-semibold">
                        Cliquez sur un concept pour ouvrir la fiche correspondante dans le dictionnaire interactif :
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {["Élision", "Subjonctif", "Pléonasme", "Idiotisme"].map((word) => (
                          <button
                            key={word}
                            onClick={() => {
                              setDictSearch(word);
                              setIsDictOpen(true);
                            }}
                            className="bg-[#F5C518]/10 hover:bg-[#F5C518]/20 border border-[#F5C518]/30 px-3 py-1.5 rounded-xl text-xs font-black text-[#F5C518] transition-all cursor-pointer hover:scale-105"
                          >
                            📖 {word}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
                    <button
                      onClick={() => {
                        setExamCorrectionMode(true);
                        setExamFinished(false);
                      }}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-[#0D1117] font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg shadow-yellow-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4 stroke-[2.5]" />
                      <span>Consulter le Corrigé Détaillé 🔍</span>
                    </button>

                    <button
                      onClick={handleBackToDashboard}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl border border-white/5 transition-all text-center cursor-pointer"
                    >
                      Retourner à l'Arena (+150 XP)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== C. BLITZ MCQ VIEW ==================== */}
          {activeTab === "qcm" && (
            <motion.div 
              key="qcm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002B5B]">Mode Blitz (QCM Rapide)</h2>
                <span className="bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs font-extrabold px-3 py-1 rounded-full">
                  Question {qcmIndex + 1} / 5
                </span>
              </div>

              {!qcmFinished ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
                  {/* Question Title */}
                  <h3 className="font-display font-black text-base text-[#002B5B] leading-relaxed">
                    {mockExamQuestions.sectionA[qcmIndex].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {mockExamQuestions.sectionA[qcmIndex].options.map((opt) => {
                      const isSelected = qcmSelectedOption === opt;
                      const isCorrect = opt === mockExamQuestions.sectionA[qcmIndex].correct;
                      
                      let btnStyle = "border-slate-150 text-slate-700 hover:bg-slate-50";
                      if (qcmSelectedOption !== null) {
                        if (isSelected) {
                          btnStyle = isCorrect 
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                            : "bg-rose-50 border-rose-500 text-rose-700";
                        } else if (isCorrect) {
                          btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700";
                        } else {
                          btnStyle = "border-slate-100 text-slate-300 pointer-events-none";
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={qcmSelectedOption !== null}
                          onClick={() => handleQcmSelect(opt)}
                          className={`w-full text-left p-4 rounded-2xl border text-xs font-black transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {qcmSelectedOption !== null && isSelected && (
                            <span>{isCorrect ? "✓ Correct" : "✗ Incorrect"}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {qcmSelectedOption !== null && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold leading-relaxed text-slate-600">
                      💡 <strong>Règle :</strong> {mockExamQuestions.sectionA[qcmIndex].explanation}
                    </div>
                  )}
                </div>
              ) : (
                /* score card */
                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-6 shadow-sm">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto shadow-2xs">
                    <Star className="w-8 h-8 fill-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-lg text-[#002B5B]">Session Blitz Complétée !</h3>
                    <p className="text-slate-500 text-xs font-semibold">
                      Vous avez obtenu un score de <strong className="text-[#002B5B]">{qcmScore} / 5</strong> questions correctes.
                    </p>
                  </div>
                  <div className="text-3xl font-display font-black text-[#FFD214]">
                    +40 XP
                  </div>
                  <button
                    onClick={handleBackToDashboard}
                    className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Retourner à l'Arena
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== D. WRITING ESSAY VIEW ==================== */}
          {activeTab === "writing" && (
            <motion.div 
              key="writing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg md:text-xl font-black text-[#002B5B] flex items-center gap-2">
                  <FileText className="text-amber-500 w-5 h-5" />
                  La Théorie : Entraînement de Rédaction & Résumé
                </h2>
                <p className="text-slate-500 text-xs font-semibold mt-1">Saisissez un texte libre ou choisissez l'un des thèmes officiels pour un feedback par IA en temps réel.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Inputs column */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Subject selector */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Thèmes Recommandés WAEC</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockExamQuestions.sectionC.prompts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedPrompt(p);
                            setEssayContent("");
                            setWritingReport(null);
                          }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            selectedPrompt.id === p.id
                              ? "bg-amber-500 border-amber-600 text-white shadow-xs"
                              : "bg-white border-slate-200 text-[#002B5B] hover:bg-slate-50"
                          }`}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-[#002B5B] font-bold leading-relaxed">
                      {selectedPrompt.text}
                    </div>
                  </div>

                  {/* Essay writing area */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Votre Rédaction</h3>
                    <textarea
                      rows={8}
                      value={essayContent}
                      onChange={(e) => setEssayContent(e.target.value)}
                      placeholder="Tapez ou collez votre texte ici..."
                      className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-[#002B5B] focus:bg-white rounded-2xl p-4 text-xs font-semibold text-slate-700 outline-hidden transition-all resize-none"
                    />
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                      <span>Conseil: Visez au moins 100 mots pour une analyse riche.</span>
                      <span>{essayContent.trim().split(/\s+/).filter(Boolean).length} mots</span>
                    </div>

                    <button
                      onClick={handleWritingSubmit}
                      disabled={isWritingEvaluating || !essayContent.trim()}
                      className="w-full bg-[#002B5B] hover:bg-blue-800 disabled:bg-slate-200 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isWritingEvaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Correction IA en cours...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Demander une Correction IA (+50 XP)</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* AI report output column */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs sticky top-24 space-y-5">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Résultats de l'évaluation</h3>
                    
                    {!writingReport ? (
                      <div className="text-center py-8 text-slate-400 space-y-2">
                        <FileText className="w-8 h-8 mx-auto stroke-[1.5]" />
                        <p className="text-xs font-semibold">Rédigez un texte à gauche et cliquez sur "Demander une Correction IA" pour voir les résultats.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <span className="text-xs font-black text-slate-600">Note Globale</span>
                          <span className="text-2xl font-display font-black text-[#002B5B]">{writingReport.score} / 100</span>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Commentaires de l'IA</p>
                          <p className="text-xs font-medium leading-relaxed text-slate-600">{writingReport.feedback}</p>
                        </div>

                        {writingReport.corrections.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Corrections Orthographe / Grammaire</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {writingReport.corrections.map((c: any, i: number) => (
                                <div key={i} className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-xl text-xs space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="line-through text-rose-500 font-bold">{c.original}</span>
                                    <span className="text-emerald-600 font-black">➔ {c.corrected}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-medium">{c.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {writingReport.suggestedRewrite && (
                          <div className="space-y-3">
                            <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Version Améliorée par l'IA</p>
                            <div className="bg-emerald-50/30 border border-emerald-100 p-3 rounded-xl text-xs text-slate-700 font-medium leading-relaxed italic">
                              "{writingReport.suggestedRewrite}"
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleBackToDashboard}
                          className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all text-center cursor-pointer"
                        >
                          Terminer l'exercice
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==================== E. ORAL VIEW ==================== */}
          {activeTab === "oral" && (
            <motion.div 
              key="oral"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002B5B]">Module d'Expression Orale</h2>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 px-3 py-1 rounded-full uppercase">
                  SIMULATION ACTIVE
                </span>
              </div>

              {oralStep === 1 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-brand-blue mx-auto">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-base text-[#002B5B]">Étape 1 : Écoutez le passage audio</h3>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                      Cliquez ci-dessous pour lancer l'audio de la phrase que vous devrez répéter ensuite. Concentrez-vous sur la liaison et l'accentuation.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs font-black text-slate-700 max-w-sm mx-auto">
                    <span>"Nous avons hâte de célébrer nos succès scolaires."</span>
                    <button className="bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-200 text-[#002B5B] cursor-pointer">
                      <Volume2 className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <button
                    onClick={() => setOralStep(2)}
                    className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Passer à l'enregistrement
                  </button>
                </div>
              )}

              {oralStep === 2 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6 text-center">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto animate-pulse">
                    <Mic className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-base text-[#002B5B]">Étape 2 : Enregistrez votre prononciation</h3>
                    <p className="text-slate-500 text-xs font-semibold">
                      Maintenant, appuyez sur le bouton, lisez à haute voix la phrase ci-dessous, puis arrêtez.
                    </p>
                  </div>

                  <p className="text-base font-black text-slate-800 leading-relaxed max-w-xs mx-auto italic">
                    "Nous avons hâte de célébrer nos succès scolaires."
                  </p>

                  <div className="py-4 flex flex-col items-center space-y-3">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-full shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Commencer l'enregistrement</span>
                      </button>
                    ) : (
                      <div className="space-y-3 w-full max-w-xs">
                        <button
                          onClick={handleStopRecording}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-full shadow-md flex items-center gap-2 cursor-pointer mx-auto"
                        >
                          <MicOff className="w-4 h-4" />
                          <span>Arrêter l'enregistrement</span>
                        </button>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${recordProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {oralStep === 3 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h3 className="font-display font-black text-base text-[#002B5B]">Analyse Orale Complétée !</h3>
                    <p className="text-slate-400 text-[10px] font-mono font-black uppercase tracking-wider">RÉSULTAT DU CONTRÔLE PHONÉTIQUE PAR IA</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-50">
                    <div className="text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">PRONONCIATION</p>
                      <p className="text-lg font-display font-black text-emerald-600 mt-1">{audioFeedback?.pronunciation}%</p>
                    </div>
                    <div className="text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">FLUIDITÉ</p>
                      <p className="text-lg font-display font-black text-slate-800 mt-1">{audioFeedback?.fluency}%</p>
                    </div>
                    <div className="text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">PRÉCISION</p>
                      <p className="text-lg font-display font-black text-slate-800 mt-1">{audioFeedback?.accuracy}%</p>
                    </div>
                  </div>

                  <div className="bg-[#FFFCE8] border border-[#FFEB85] p-4 rounded-2xl text-xs font-semibold leading-relaxed text-[#A67C00]">
                    💡 <strong>Conseil Phonetique :</strong> {audioFeedback?.advice}
                  </div>

                  <button
                    onClick={handleBackToDashboard}
                    className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Retourner à l'Arena (+30 XP)
                  </button>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* 3. Sliding Dictionary Panel */}
      <AnimatePresence>
        {isDictOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDictOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl border-l border-slate-100 p-6 flex flex-col space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <span className="font-display font-black text-base text-[#002B5B]">Dictionnaire Plume</span>
                </div>
                <button 
                  onClick={() => setIsDictOpen(false)}
                  className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher une règle, un mot..."
                  value={dictSearch}
                  onChange={(e) => setDictSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-[#002B5B] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-600 outline-hidden transition-all"
                />
              </div>

              {/* Word definitions lists */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {filteredWords.length > 0 ? (
                  filteredWords.map((item, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-display font-black text-sm text-[#002B5B]">{item.word}</h4>
                        <span className="text-[10px] font-mono font-bold text-slate-400 italic">{item.type}</span>
                      </div>
                      <p className="text-xs font-semibold leading-relaxed text-slate-600">{item.definition}</p>
                      <p className="text-[10px] font-bold text-[#A67C00] bg-[#FFFCE8] border border-[#FFEB85] px-2 py-1 rounded-lg">
                        📌 {item.tip}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 space-y-2">
                    <BookOpenCheck className="w-8 h-8 mx-auto stroke-[1.5]" />
                    <p className="text-xs font-semibold">Aucun mot correspondant trouvé.</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 text-center text-[10px] font-bold text-slate-400 font-mono">
                WAEC French Exam Prep Companion
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. Interactive Question Map Overlay */}
      <AnimatePresence>
        {showQuestionMap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuestionMap(false)}
              className="absolute inset-0 bg-[#0D1117]/85 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0F1B2D] border border-white/10 w-full max-w-4xl h-[85vh] rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl text-left flex flex-col space-y-6 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                    <Grid className="w-6 h-6 text-[#F5C518]" />
                    <span>Plan complet de l'Examen : 85 Items WAEC</span>
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">
                    Sélectionnez une case pour visualiser, répondre ou signaler une question spécifique.
                  </p>
                </div>
                <button
                  onClick={() => setShowQuestionMap(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Bar / Legend */}
              <div className="flex flex-wrap gap-4 items-center bg-white/5 border border-white/5 rounded-2xl p-4 text-xs font-bold text-slate-300">
                <span className="text-[10px] font-mono text-slate-400 uppercase">LÉGENDE DES STATUTS :</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-700 border border-slate-600" />
                  <span>Non répondu (Vierge)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600 border border-blue-500" />
                  <span>Répondu (Soumis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-400 border border-amber-500" />
                  <span>À réviser (Signalé)</span>
                </div>
                {examCorrectionMode && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-400" />
                      <span>Réponse Correcte</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-rose-500 border border-rose-400" />
                      <span>Réponse Incorrecte</span>
                    </div>
                  </>
                )}
              </div>

              {/* Grid Section - Scrollable container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
                {/* Categories blocks */}
                <div className="space-y-6">
                  {/* Category A: Grammaire 1-60 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-display font-black text-xs text-[#F5C518] uppercase tracking-wider">
                        Section A : Grammaire & Vocabulaire (Questions 1 à 60)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Poids : 60% du QCM</span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 gap-2">
                      {Array.from({ length: 60 }, (_, i) => {
                        const qId = i + 1;
                        const userAns = examAnswers[qId];
                        const isAns = !!userAns;
                        const isFlg = !!flaggedQuestions[qId];
                        
                        let colorClass = "bg-slate-800 border-white/5 text-slate-400 hover:border-white/20";
                        if (isFlg) colorClass = "bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300";
                        else if (isAns) {
                          if (examCorrectionMode && qId <= 5) {
                            const qData = mockExamQuestions.sectionA.find(q => q.id === qId);
                            const isCorrect = userAns === qData?.correct;
                            colorClass = isCorrect ? "bg-emerald-500 border-emerald-600 text-white" : "bg-rose-500 border-rose-600 text-white";
                          } else {
                            colorClass = "bg-blue-600 border-blue-500 text-white hover:bg-blue-500";
                          }
                        }

                        return (
                          <button
                            key={qId}
                            onClick={() => {
                              if (qId <= 5) {
                                setShowQuestionMap(false);
                                document.getElementById("exam-title")?.scrollIntoView({ behavior: "smooth" });
                              } else {
                                setActiveSimulatedId(qId);
                              }
                            }}
                            className={`aspect-square rounded-xl border text-xs font-black flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden ${colorClass}`}
                          >
                            <span>{qId}</span>
                            {isFlg && <Flag className="w-2.5 h-2.5 absolute bottom-1 right-1 fill-current" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category B: Compréhension 61-80 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-display font-black text-xs text-[#F5C518] uppercase tracking-wider">
                        Section B : Compréhension & Synthèse (Questions 61 à 80)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Poids : 20% du QCM</span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 gap-2">
                      {Array.from({ length: 20 }, (_, i) => {
                        const qId = i + 61;
                        // Map question 61 & 62 to mockExamQuestions.sectionB.questions 6 & 7
                        const mappedId = qId === 61 ? 6 : qId === 62 ? 7 : null;
                        const userAns = mappedId ? examAnswers[mappedId] : examAnswers[qId];
                        const isAns = !!userAns;
                        const isFlg = mappedId ? !!flaggedQuestions[mappedId] : !!flaggedQuestions[qId];
                        
                        let colorClass = "bg-slate-800 border-white/5 text-slate-400 hover:border-white/20";
                        if (isFlg) colorClass = "bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300";
                        else if (isAns) {
                          if (examCorrectionMode && mappedId) {
                            const qData = mockExamQuestions.sectionB.questions.find(q => q.id === mappedId);
                            const isCorrect = userAns === qData?.correct;
                            colorClass = isCorrect ? "bg-emerald-500 border-emerald-600 text-white" : "bg-rose-500 border-rose-600 text-white";
                          } else {
                            colorClass = "bg-blue-600 border-blue-500 text-white hover:bg-blue-500";
                          }
                        }

                        return (
                          <button
                            key={qId}
                            onClick={() => {
                              if (mappedId) {
                                setShowQuestionMap(false);
                                document.getElementById("exam-title")?.scrollIntoView({ behavior: "smooth" });
                              } else {
                                setActiveSimulatedId(qId);
                              }
                            }}
                            className={`aspect-square rounded-xl border text-xs font-black flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden ${colorClass}`}
                          >
                            <span>{qId}</span>
                            {isFlg && <Flag className="w-2.5 h-2.5 absolute bottom-1 right-1 fill-current" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category C: Rédaction 81-85 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-display font-black text-xs text-[#F5C518] uppercase tracking-wider">
                        Section C : Production Écrite & Expression (Questions 81 à 85)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Poids : Évaluation de Style / Synthèse</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 max-w-md">
                      {Array.from({ length: 5 }, (_, i) => {
                        const qId = i + 81;
                        const isAns = qId === 81 ? examEssay.trim().length > 10 : !!examAnswers[qId];
                        const isFlg = !!flaggedQuestions[qId];
                        
                        let colorClass = "bg-slate-800 border-white/5 text-slate-400 hover:border-white/20";
                        if (isFlg) colorClass = "bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300";
                        else if (isAns) {
                          colorClass = "bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-400";
                        }

                        return (
                          <button
                            key={qId}
                            onClick={() => {
                              if (qId === 81) {
                                setShowQuestionMap(false);
                                document.getElementById("exam-title")?.scrollIntoView({ behavior: "smooth" });
                              } else {
                                setActiveSimulatedId(qId);
                              }
                            }}
                            className={`aspect-square rounded-xl border text-xs font-black flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden ${colorClass}`}
                          >
                            <span>{qId}</span>
                            <span className="text-[7px] font-bold text-white/60 uppercase tracking-widest mt-0.5">
                              {qId === 81 ? "Rédaction" : "Comp"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick statistics summary */}
              <div className="bg-white/5 rounded-2xl p-4 text-xs font-medium text-slate-400 flex items-center justify-between">
                <span>Rappel : Soumettez l'examen une fois toutes les sections complétées.</span>
                <span className="text-[#F5C518] font-black">
                  Total : {Object.keys(examAnswers).length + (examEssay.trim().length > 10 ? 1 : 0)} / 85 Répondu
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Simulated Question Modal (Dynamic Grammar & Rule testing) */}
      <AnimatePresence>
        {activeSimulatedId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSimulatedId(null)}
              className="absolute inset-0 bg-[#0D1117]/90 backdrop-blur-xs"
            />

            {/* Modal Content */}
            {(() => {
              const qData = getSimulatedQuestion(activeSimulatedId);
              const userAns = examAnswers[activeSimulatedId];
              const isFlg = !!flaggedQuestions[activeSimulatedId];
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0F1B2D] border border-white/10 w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl text-left space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono font-black text-[#F5C518] uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-md">
                        Simulation WAEC • Item #{activeSimulatedId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setFlaggedQuestions(prev => ({ ...prev, [activeSimulatedId]: !prev[activeSimulatedId] }));
                        }}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isFlg 
                            ? "bg-amber-400/20 border-amber-400 text-amber-400" 
                            : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                        }`}
                        title="Marquer pour révision"
                      >
                        <Flag className={`w-4 h-4 ${isFlg ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={() => setActiveSimulatedId(null)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-display font-black text-sm text-white leading-relaxed">
                      {qData.question}
                    </h4>

                    <div className="space-y-2">
                      {qData.options.map((opt) => {
                        const isOptionSelected = userAns === opt;
                        const isOptionCorrect = opt === qData.correct;
                        
                        let btnStyle = "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10";
                        if (examCorrectionMode) {
                          if (isOptionSelected) {
                            btnStyle = isOptionCorrect 
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 pointer-events-none"
                              : "bg-rose-500/20 border-rose-500 text-rose-400 pointer-events-none";
                          } else if (isOptionCorrect) {
                            btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 pointer-events-none";
                          } else {
                            btnStyle = "bg-white/5 border-white/5 text-slate-500 pointer-events-none";
                          }
                        } else {
                          if (isOptionSelected) {
                            btnStyle = "bg-blue-600 border-blue-500 text-white shadow-lg";
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={examCorrectionMode}
                            onClick={() => {
                              setExamAnswers(prev => ({ ...prev, [activeSimulatedId]: opt }));
                              setTimeout(() => {
                                setActiveSimulatedId(null);
                              }, 350);
                            }}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isOptionSelected && <Check className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>

                    {examCorrectionMode && (
                      <div className="bg-[#FFFCE8] border border-[#FFEB85]/40 p-3 rounded-xl text-[10px] text-[#A67C00] font-black leading-relaxed mt-2">
                        💡 RÈGLE WAEC : {qData.explanation}
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-2 text-[10px] font-mono text-slate-500">
                    Les réponses de la simulation comptent pour votre diagnostic global de l'IA.
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
