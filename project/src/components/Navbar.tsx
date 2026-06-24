import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Practice', href: '/practice' },
  { label: 'AI Mock Interview', href: '/mock-interview' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'History', href: '/history' },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="relative z-50">
      <div className="liquid-glass rounded-none border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="font-display text-2xl tracking-tight text-white">
            NextRound AI
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <User size={16} />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="liquid-glass-strong px-5 py-2.5 rounded-full text-sm font-medium text-white hover:scale-105 transition-transform"
                >
                  Start Practicing
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 z-40 liquid-glass border-b border-white/10"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium ${
                    location.pathname === link.href ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">
                      Profile
                    </Link>
                    <button onClick={handleSignOut} className="text-sm text-white/70 text-left">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="liquid-glass-strong px-5 py-2.5 rounded-full text-sm font-medium text-white text-center"
                    >
                      Start Practicing
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
