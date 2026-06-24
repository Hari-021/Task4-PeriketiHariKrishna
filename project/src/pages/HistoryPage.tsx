import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Filter, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { InterviewSession } from '@/types';

export default function HistoryPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [filtered, setFiltered] = useState<InterviewSession[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadSessions();
  }, [user]);

  useEffect(() => {
    let result = sessions;
    if (search) {
      result = result.filter((s) => s.category.toLowerCase().includes(search.toLowerCase()));
    }
    if (categoryFilter !== 'All') {
      result = result.filter((s) => s.category === categoryFilter);
    }
    setFiltered(result);
  }, [search, categoryFilter, sessions]);

  const loadSessions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setSessions(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  const categories = ['All', ...new Set(sessions.map((s) => s.category))];

  return (
    <div className="min-h-screen bg-[hsl(201,100%,13%)] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-2">Interview History</h1>
          <p className="text-white/50 mb-8">Review your past sessions and track improvement</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-white/40" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[hsl(201,100%,13%)]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="liquid-glass rounded-xl p-6 h-24 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="liquid-glass rounded-xl p-12 text-center">
            <Calendar className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <p className="text-white/50">No sessions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  to={`/results/${session.id}`}
                  className="liquid-glass rounded-xl p-6 flex items-center justify-between hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                      <span className="text-cyan-300 font-bold text-lg">{session.score}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg">{session.category}</p>
                      <div className="flex items-center gap-3 text-white/40 text-sm mt-1">
                        <span>{session.difficulty}</span>
                        <span>&middot;</span>
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-white/30" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
