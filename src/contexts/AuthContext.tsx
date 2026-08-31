import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the current URL is an auth callback (from Google OAuth)
    const isAuthCallback = window.location.hash.includes("access_token=") || 
                           window.location.hash.includes("id_token=") ||
                           window.location.search.includes("code=");

    if (isAuthCallback) {
      localStorage.setItem('last_login_timestamp', Date.now().toString());
    }

    // Centralized helper to check and create user profile if missing (e.g. Google OAuth signups)
    const ensureProfileExists = async (currentUser: any) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (!profile && !error) {
          const fullName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "طالب جديد";
          const { error: insertError } = await supabase.from('profiles').insert({
            id: currentUser.id,
            full_name: fullName,
            academic_year: "1",
            is_admin: false,
            student_id: "00000000000",
            phone: "0000000000",
            major: "computer",
            gender: "male",
            bio: "",
          });
          if (insertError) {
            console.error("Failed to insert profile:", insertError);
          } else {
            console.log("Automatically created profile for OAuth/new user with fallbacks.");
          }
        }
      } catch (err) {
        console.error("Error in ensureProfileExists:", err);
      }
    };

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // 3-Hour Auto-Logout Logic
      if (session?.user) {
        ensureProfileExists(session.user);

        const now = Date.now();
        const lastLoginTime = localStorage.getItem('last_login_timestamp');
        const THREE_HOURS = 3 * 60 * 60 * 1000;
        
        if (lastLoginTime && (now - parseInt(lastLoginTime)) > THREE_HOURS) {
          // Session expired, sign out the user
          console.log("Session expired (3 hours). Auto-logging out.");
          supabase.auth.signOut();
          setSession(null);
          setUser(null);
          localStorage.removeItem('last_login_timestamp');
        } else if (!lastLoginTime) {
          // Set initial timestamp if missing
          localStorage.setItem('last_login_timestamp', now.toString());
        }
      }

      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'PASSWORD_RECOVERY') {
        // Redirect to dedicated reset password page
        window.location.href = `${window.location.origin}/reset-password`;
      }
      
      if (session?.user) {
        ensureProfileExists(session.user);

        // If it's a new sign in, update the timestamp
        if (event === 'SIGNED_IN') {
          localStorage.setItem('last_login_timestamp', Date.now().toString());
        }
      } else {
        localStorage.removeItem('last_login_timestamp');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
