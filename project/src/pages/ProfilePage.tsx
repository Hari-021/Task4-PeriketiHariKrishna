import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, Briefcase, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProfileData {
  full_name: string;
  email: string;
  bio: string;
  target_role: string;
  experience_level: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    email: '',
    bio: '',
    target_role: '',
    experience_level: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        bio: '',
        target_role: '',
        experience_level: '',
      });
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (data) {
      setProfile((prev) => ({
        ...prev,
        bio: data.bio || '',
        target_role: data.target_role || '',
        experience_level: data.experience_level || '',
      }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: profile.full_name,
      email: profile.email,
      bio: profile.bio,
      target_role: profile.target_role,
      experience_level: profile.experience_level,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast.error('Failed to save profile');
    } else {
      toast.success('Profile updated');
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(201,100%,13%)] px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-2">Profile</h1>
          <p className="text-white/50 mb-8">Manage your account and preferences</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="liquid-glass-strong rounded-2xl p-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-1.5">
                  <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-1.5">
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-1.5">
                  <Briefcase size={14} /> Target Role
                </label>
                <input
                  type="text"
                  value={profile.target_role}
                  onChange={(e) => setProfile({ ...profile, target_role: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-1.5">
                  <Award size={14} /> Experience Level
                </label>
                <select
                  value={profile.experience_level}
                  onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                >
                  <option value="" className="bg-[hsl(201,100%,13%)]">Select level</option>
                  <option value="Entry Level" className="bg-[hsl(201,100%,13%)]">Entry Level</option>
                  <option value="Mid Level" className="bg-[hsl(201,100%,13%)]">Mid Level</option>
                  <option value="Senior Level" className="bg-[hsl(201,100%,13%)]">Senior Level</option>
                  <option value="Staff/Principal" className="bg-[hsl(201,100%,13%)]">Staff/Principal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="liquid-glass bg-white/10 px-6 py-3 rounded-xl text-white font-medium hover:scale-[1.02] transition-transform disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
