import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Clock, ArrowRight, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { InterviewSession } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface Stats {
  total: number;
  average: number;
  highest: number;
  byCategory: { category: string; count: number; avg: number }[];
  recent: InterviewSession[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    average: 0,
    highest: 0,
    byCategory: [],
    recent: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadStats();
  }, [user]);

  const loadStats = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    const sessions: InterviewSession[] = data || [];
    const total = sessions.length;
    const average = total > 0 ? Math.round(sessions.reduce((s, i) => s + i.score, 0) / total) : 0;
    const highest = total > 0 ? Math.max(...sessions.map((i) => i.score)) : 0;

    const catMap = new Map<string, { count: number; sum: number }>();
    sessions.forEach((s) => {
      const existing = catMap.get(s.category) || { count: 0, sum: 0 };
      catMap.set(s.category, { count: existing.count + 1, sum: existing.sum + s.score });
    });
    const byCategory = Array.from(catMap.entries()).map(([category, v]) => ({
      category,
      count: v.count,
      avg: Math.round(v.sum / v.count),
    }));

    setStats({
      total,
      average,
      highest,
      byCategory,
      recent: sessions.slice(0, 5),
    });
    setLoading(false);
  };

  const radarData = stats.byCategory.map((c) => ({
    subject: c.category.split(' ').slice(0, 2).join(' '),
    A: c.avg,
    fullMark: 100,
  }));

  const weeklyData = stats.recent
    .slice()
    .reverse()
    .map((s, i) => ({
      name: `Q${i + 1}`,
      score: s.score,
    }));

  const statCards = [
    { label: 'Total Interviews', value: stats.total, icon: BarChart3, color: 'text-cyan-300' },
    { label: 'Average Score', value: `${stats.average}%`, icon: TrendingUp, color: 'text-emerald-300' },
    { label: 'Highest Score', value: `${stats.highest}%`, icon: Award, color: 'text-amber-300' },
    { label: 'This Week', value: stats.recent.filter((r) => new Date(r.created_at) > new Date(Date.now() - 7 * 86400000)).length, icon: Clock, color: 'text-rose-300' },
  ];

  return (
    <div className="min-h-screen bg-[hsl(201,100%,13%)] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl md:text-5xl text-white mb-2">Dashboard</h1>
          <p className="text-white/50 mb-8">Track your interview preparation progress</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="liquid-glass rounded-xl p-6 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="liquid-glass rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/50 text-sm">{card.label}</span>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <span className="font-display text-3xl text-white">{card.value}</span>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="liquid-glass rounded-xl p-6"
              >
                <h3 className="font-display text-xl text-white mb-4">Score Trend</h3>
                <div className="h-64">
                  {weeklyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                        <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.4)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                        />
                        <Line type="monotone" dataKey="score" stroke="#67e8f9" strokeWidth={2} dot={{ fill: '#67e8f9' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/40">
                      Complete interviews to see your trend
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="liquid-glass rounded-xl p-6"
              >
                <h3 className="font-display text-xl text-white mb-4">Category Performance</h3>
                <div className="h-64">
                  {radarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.2)" fontSize={10} />
                        <Radar name="Score" dataKey="A" stroke="#67e8f9" fill="#67e8f9" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/40">
                      Complete interviews to see category breakdown
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Category Breakdown */}
            {stats.byCategory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="liquid-glass rounded-xl p-6 mb-8"
              >
                <h3 className="font-display text-xl text-white mb-4">Category Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.byCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="category" stroke="rgba(255,255,255,0.4)" fontSize={11} angle={-20} textAnchor="end" height={60} />
                      <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.4)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(0,0,0,0.8)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="avg" fill="#67e8f9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Recent Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl text-white">Recent Sessions</h3>
                <Link to="/history" className="text-cyan-300 text-sm hover:text-cyan-200 flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              {stats.recent.length === 0 ? (
                <div className="liquid-glass rounded-xl p-8 text-center">
                  <Target className="w-10 h-10 text-white/30 mx-auto mb-3" />
                  <p className="text-white/50 mb-4">No interviews completed yet</p>
                  <Link
                    to="/mock-interview"
                    className="liquid-glass bg-white/10 px-6 py-2.5 rounded-full text-white text-sm hover:scale-105 transition-transform inline-flex items-center gap-2"
                  >
                    Start your first interview <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recent.map((session) => (
                    <Link
                      key={session.id}
                      to={`/results/${session.id}`}
                      className="liquid-glass rounded-xl p-5 flex items-center justify-between hover:scale-[1.01] transition-transform"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <span className="text-cyan-300 font-bold">{session.score}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{session.category}</p>
                          <p className="text-white/40 text-sm">{session.difficulty} &middot; {new Date(session.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-white/30" />
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
