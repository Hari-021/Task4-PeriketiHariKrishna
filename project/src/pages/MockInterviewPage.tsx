import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { categories, difficulties, getQuestions, evaluateAnswer } from '@/lib/interviewData';
import type { InterviewCategory, Difficulty, InterviewQuestion } from '@/types';
import { toast } from 'sonner';

export default function MockInterviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'select' | 'interview' | 'review'>('select');
  const [category, setCategory] = useState<InterviewCategory | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const startInterview = () => {
    if (!category || !difficulty) return;
    const qs = getQuestions(category, difficulty);
    setQuestions(qs);
    setStep('interview');
    setCurrentQIndex(0);
    setAnswers({});
  };

  const submitAnswer = () => {
    const currentQ = questions[currentQIndex];
    if (!answers[currentQ.id]?.trim()) {
      toast.error('Please provide an answer');
      return;
    }
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    setLoading(true);
    const evaluations = questions.map((q) => {
      const ans = answers[q.id] || '';
      return evaluateAnswer(q.question, ans);
    });

    const avgScore = Math.round(evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length);
    const allStrengths = evaluations.flatMap((e) => e.strengths);
    const allWeaknesses = evaluations.flatMap((e) => e.weaknesses);
    const allSuggestions = evaluations.flatMap((e) => e.improvement_suggestions);

    const feedback = evaluations.map((e) => e.feedback).join(' ');

    const sessionData = {
      user_id: user?.id || null,
      category: category!,
      difficulty: difficulty!,
      score: avgScore,
      feedback,
      strengths: [...new Set(allStrengths)].slice(0, 5),
      weaknesses: [...new Set(allWeaknesses)].slice(0, 5),
      improvement_suggestions: [...new Set(allSuggestions)].slice(0, 5),
    };

    const { data, error } = await supabase.from('interview_sessions').insert(sessionData).select().single();
    setLoading(false);

    if (error) {
      toast.error('Failed to save results');
      return;
    }

    // Save answers
    const answerRecords = questions.map((q) => ({
      session_id: data.id,
      question_id: q.id,
      answer: answers[q.id] || '',
      score: evaluations.find((_e, i) => questions[i].id === q.id)?.score || 0,
      feedback: evaluations.find((_e, i) => questions[i].id === q.id)?.feedback || '',
    }));

    await supabase.from('interview_answers').insert(answerRecords);

    setResults({ ...sessionData, id: data.id, evaluations });
    setStep('review');
  };

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-[hsl(201,100%,13%)] px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-2">AI Mock Interview</h1>
            <p className="text-white/50 mb-10">Select your category and difficulty to begin</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
            <h2 className="text-white/70 text-sm font-medium mb-3 uppercase tracking-wider">Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`liquid-glass rounded-xl p-4 text-sm font-medium transition-all hover:scale-105 ${
                    category === cat ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200' : 'text-white/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-10">
            <h2 className="text-white/70 text-sm font-medium mb-3 uppercase tracking-wider">Difficulty</h2>
            <div className="flex gap-3">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`liquid-glass rounded-xl px-6 py-3 text-sm font-medium transition-all hover:scale-105 ${
                    difficulty === diff ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200' : 'text-white/70'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <button
              onClick={startInterview}
              disabled={!category || !difficulty}
              className="liquid-glass-strong px-8 py-4 rounded-full text-white font-medium hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100 inline-flex items-center gap-2"
            >
              Start Interview <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === 'interview') {
    const currentQ = questions[currentQIndex];
    const progress = ((currentQIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-[hsl(201,100%,13%)] px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-sm">Question {currentQIndex + 1} of {questions.length}</span>
              <span className="text-white/50 text-sm">{category} &middot; {difficulty}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="liquid-glass-strong rounded-2xl p-8 mb-6"
            >
              <h2 className="font-display text-2xl text-white mb-6">{currentQ.question}</h2>
              <textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                placeholder="Type your answer here..."
                className="w-full h-48 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-end">
            <button
              onClick={submitAnswer}
              disabled={loading}
              className="liquid-glass-strong px-6 py-3 rounded-full text-white font-medium hover:scale-105 transition-transform disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : currentQIndex === questions.length - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
              {currentQIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review step
  return (
    <div className="min-h-screen bg-[hsl(201,100%,13%)] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-4xl text-cyan-300">{results.score}</span>
          </div>
          <h1 className="font-display text-3xl text-white mb-2">Interview Complete!</h1>
          <p className="text-white/50">{results.category} &middot; {results.difficulty}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="liquid-glass rounded-xl p-6 mb-6">
          <h3 className="font-display text-xl text-white mb-3">Feedback</h3>
          <p className="text-white/70 leading-relaxed">{results.feedback}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="liquid-glass rounded-xl p-6">
            <h3 className="font-display text-lg text-emerald-300 mb-3">Strengths</h3>
            <ul className="space-y-2">
              {results.strengths.map((s: string, i: number) => (
                <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                  <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass rounded-xl p-6">
            <h3 className="font-display text-lg text-rose-300 mb-3">Weaknesses</h3>
            <ul className="space-y-2">
              {results.weaknesses.map((w: string, i: number) => (
                <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 shrink-0">&bull;</span>
                  {w}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="liquid-glass rounded-xl p-6 mb-8">
          <h3 className="font-display text-lg text-cyan-300 mb-3">Improvement Suggestions</h3>
          <ul className="space-y-2">
            {results.improvement_suggestions.map((s: string, i: number) => (
              <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5 shrink-0">&rarr;</span>
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="liquid-glass bg-white/10 px-8 py-3 rounded-full text-white font-medium hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => {
              setStep('select');
              setCategory(null);
              setDifficulty(null);
              setAnswers({});
              setResults(null);
            }}
            className="liquid-glass-strong px-8 py-3 rounded-full text-white font-medium hover:scale-105 transition-transform"
          >
            Practice Again
          </button>
        </motion.div>
      </div>
    </div>
  );
}
