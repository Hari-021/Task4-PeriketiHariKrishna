import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart3, Brain, Shield } from 'lucide-react';

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[hsl(201,100%,13%)]">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
        poster="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920"
      >
        <source
          src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight text-white mb-8"
            >
              Master interviews with{' '}
              <span className="text-white/60">AI-powered practice.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Practice technical and behavioral interviews using AI-generated questions,
              receive instant feedback, improve your communication skills, and track your
              progress with personalized analytics—all in one intelligent platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/mock-interview"
                className="liquid-glass-strong px-8 py-4 rounded-full text-white font-medium text-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
              >
                Start Free Mock Interview
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/dashboard"
                className="liquid-glass px-8 py-4 rounded-full text-white/80 font-medium text-lg hover:text-white hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                Explore Dashboard
                <BarChart3 size={18} />
              </Link>
            </motion.div>
          </div>
        </main>

        {/* Features Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                Everything you need to ace your next interview
              </h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                A complete interview preparation ecosystem powered by intelligent AI.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: 'AI-Generated Questions',
                  description:
                    'Practice with dynamically generated questions across 10+ technical categories, tailored to your skill level.',
                },
                {
                  icon: Sparkles,
                  title: 'Instant Feedback',
                  description:
                    'Receive real-time scoring, detailed feedback, strengths, weaknesses, and actionable improvement tips.',
                },
                {
                  icon: Shield,
                  title: 'Progress Tracking',
                  description:
                    'Visualize your growth with analytics, weekly trends, and personalized recommendations for focused practice.',
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="liquid-glass rounded-2xl p-8 hover:scale-[1.02] transition-transform"
                >
                  <feature.icon className="w-10 h-10 text-cyan-300 mb-4" />
                  <h3 className="font-display text-2xl text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                10+ Interview Categories
              </h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                From coding fundamentals to system design, cover every topic that matters.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                'Python',
                'Java',
                'C++',
                'JavaScript',
                'React',
                'SQL',
                'Machine Learning',
                'Cybersecurity',
                'Data Structures & Algorithms',
                'System Design',
              ].map((cat, i) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="liquid-glass rounded-xl p-5 text-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <span className="text-white font-medium text-sm">{cat}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto liquid-glass-strong rounded-3xl p-12 text-center"
          >
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              Ready for your next round?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of candidates who have improved their interview performance with AI-powered practice.
            </p>
            <Link
              to="/register"
              className="liquid-glass bg-white/10 px-8 py-4 rounded-full text-white font-medium text-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 px-6 py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-display text-xl text-white/80">NextRound AI</span>
            <span className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} NextRound AI. All rights reserved.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
