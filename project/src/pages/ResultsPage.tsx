import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { InterviewSession, InterviewAnswer } from '@/types';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadSession();
  }, [id]);

  const loadSession = async () => {
    setLoading(true);
    const [{ data: sessionData }, { data: answersData }] = await Promise.all([
      supabase.from('interview_sessions').select('*').eq('id', id).single(),
      supabase.from('interview_answers').select('*').eq('session_id', id),
    ]);
    setSession(sessionData);
    setAnswers(answersData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(201,100%,13%)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-300 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[hsl(201,100%,13%)] px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/50">Session not found</p>
          <button onClick={() => navigate('/history')} className="mt-4 liquid-glass px-6 py-2 rounded-full text-white text-sm">
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(201,100%,13%)] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to History
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-4xl text-cyan-300">{session.score}</span>
          </div>
          <h1 className="font-display text-3xl text-white mb-2">{session.category}</h1>
          <p className="text-white/50">{session.difficulty} &middot; {new Date(session.created_at).toLocaleDateString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="liquid-glass rounded-xl p-6 mb-6">
          <h3 className="font-display text-xl text-white mb-3">Feedback</h3>
          <p className="text-white/70 leading-relaxed">{session.feedback}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="liquid-glass rounded-xl p-6">
            <h3 className="font-display text-lg text-emerald-300 mb-3">Strengths</h3>
            <ul className="space-y-2">
              {session.strengths.map((s, i) => (
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
              {session.weaknesses.map((w, i) => (
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
            {session.improvement_suggestions.map((s, i) => (
              <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5 shrink-0">&rarr;</span>
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {answers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h3 className="font-display text-xl text-white mb-4">Your Answers</h3>
            <div className="space-y-4">
              {answers.map((ans, i) => (
                <div key={ans.id} className="liquid-glass rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/50 text-sm">Question {i + 1}</span>
                    <span className="text-cyan-300 text-sm font-medium">{ans.score}%</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{ans.answer}</p>
                  {ans.feedback && (
                    <p className="text-white/40 text-xs mt-2 italic">{ans.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
