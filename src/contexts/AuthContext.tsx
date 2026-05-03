import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/types';

interface AuthContextType {
  user: (User & { name: string; role: UserRole; company: string }) | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  enterDemo: (passport: string) => void;
  logout: () => Promise<void>;
}

const REMEMBER_KEY = 'visahobe.rememberMe';
const TAB_FLAG = 'visahobe.tab';
const DEMO_KEY = 'visahobe.demoPassport';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [supaUser, setSupaUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [demoPassport, setDemoPassport] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(DEMO_KEY) : null
  );

  // Fetch role + profile (deferred to avoid deadlocks inside auth callback)
  const hydrateProfile = useCallback((uid: string) => {
    setTimeout(async () => {
      const [{ data: roleRow }, { data: profile }] = await Promise.all([
        supabase.from('user_roles').select('role').eq('user_id', uid).order('role').limit(1).maybeSingle(),
        supabase.from('profiles').select('display_name').eq('id', uid).maybeSingle(),
      ]);
      setRole((roleRow?.role as UserRole) ?? 'viewer');
      setDisplayName(profile?.display_name ?? '');
    }, 0);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess);
      setSupaUser(sess?.user ?? null);
      if (sess?.user) hydrateProfile(sess.user.id);
      else if (!localStorage.getItem(DEMO_KEY)) { setRole(null); setDisplayName(''); }
    });
    supabase.auth.getSession().then(async ({ data: { session: sess } }) => {
      const remember = localStorage.getItem(REMEMBER_KEY) !== 'false';
      const sameTabSession = sessionStorage.getItem(TAB_FLAG) === '1';
      if (sess && !remember && !sameTabSession) {
        await supabase.auth.signOut();
        setSession(null); setSupaUser(null);
      } else {
        setSession(sess);
        setSupaUser(sess?.user ?? null);
        if (sess?.user) hydrateProfile(sess.user.id);
      }
      sessionStorage.setItem(TAB_FLAG, '1');
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [hydrateProfile]);

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = true) => {
    localStorage.setItem(REMEMBER_KEY, rememberMe ? 'true' : 'false');
    sessionStorage.setItem(TAB_FLAG, '1');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: name ?? email.split('@')[0] },
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const enterDemo = useCallback((passport: string) => {
    localStorage.setItem(DEMO_KEY, passport);
    setDemoPassport(passport);
    setRole('owner');
    setDisplayName(`Passport ${passport}`);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(DEMO_KEY);
    setDemoPassport(null);
    await supabase.auth.signOut();
  }, []);

  const isDemo = !!demoPassport;
  const userObj = supaUser ? {
    ...supaUser,
    name: displayName || supaUser.email?.split('@')[0] || 'User',
    role: role ?? 'viewer',
    company: 'VisaHOBe PTE. LTD.',
  } : isDemo ? ({
    id: `demo-${demoPassport}`,
    email: `passport-${demoPassport}@demo.visahobe`,
    name: `Passport ${demoPassport}`,
    role: role ?? 'owner',
    company: 'VisaHOBe PTE. LTD.',
  } as unknown as User & { name: string; role: UserRole; company: string }) : null;

  return (
    <AuthContext.Provider value={{
      user: userObj, session, role: role ?? (isDemo ? 'owner' : null), loading,
      isAuthenticated: !!session || isDemo, signIn, signUp, enterDemo, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function roleHomePath(role: UserRole | null | undefined): string {
  switch (role) {
    case 'super_admin': return '/admin';
    case 'owner':       return '/owners';
    case 'partner':     return '/partners';
    case 'staff':       return '/workers';
    default:            return '/';
  }
}
