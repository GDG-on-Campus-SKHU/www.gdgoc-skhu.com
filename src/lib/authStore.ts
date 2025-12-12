import create from 'zustand';

interface AuthState {
  accessToken: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  setAuth: (data: { accessToken: string; email?: string; name?: string; role?: string }) => void;
  clearAuth: () => void;
  hydrateFromSession: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  email: null,
  name: null,
  role: null,
  setAuth: ({ accessToken, email, name, role }) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', accessToken);
      if (email) sessionStorage.setItem('auth.email', email);
      if (name) sessionStorage.setItem('auth.name', name);
      if (role) sessionStorage.setItem('auth.role', role);
    }
    set({
      accessToken,
      email: email ?? null,
      name: name ?? null,
      role: role ?? null,
    });
  },
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('auth.email');
      sessionStorage.removeItem('auth.name');
      sessionStorage.removeItem('auth.role');
    }
    set({
      accessToken: null,
      email: null,
      name: null,
      role: null,
    });
  },
  hydrateFromSession: () => {
    if (typeof window === 'undefined') return;
    const accessToken = sessionStorage.getItem('accessToken');
    const email = sessionStorage.getItem('auth.email');
    const name = sessionStorage.getItem('auth.name');
    const role = sessionStorage.getItem('auth.role');
    set({
      accessToken: accessToken || null,
      email: email || null,
      name: name || null,
      role: role || null,
    });
  },
}));
