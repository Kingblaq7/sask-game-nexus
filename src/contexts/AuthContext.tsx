import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  user: AuthUser | null;
  session: LocalSession | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface StoredUser {
  username: string;
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
}

interface LocalSession {
  user: AuthUser;
}

const USERS_STORAGE_KEY = "w3gh:users";
const SESSION_STORAGE_KEY = "w3gh:session";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toAuthUser = (storedUser: StoredUser): AuthUser => ({
  id: storedUser.email,
  username: storedUser.username,
  email: storedUser.email,
});

const readUsers = (): StoredUser[] => {
  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!rawUsers) return [];

    const parsedUsers = JSON.parse(rawUsers);
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const writeSession = (authUser: AuthUser) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
};

const readSession = (): AuthUser | null => {
  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawSession) return null;

    const parsedSession = JSON.parse(rawSession);
    if (!parsedSession?.email || !parsedSession?.username) return null;

    return {
      id: parsedSession.email,
      email: parsedSession.email,
      username: parsedSession.username,
    };
  } catch {
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const existingSession = readSession();
      setUser(existingSession);
      setSession(existingSession ? { user: existingSession } : null);
    } catch {
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    const normalizedEmail = normalizeEmail(email);
    const trimmedPassword = password.trim();
    const trimmedUsername = username?.trim() || normalizedEmail.split("@")[0];

    if (!normalizedEmail || !trimmedPassword) {
      throw new Error("Email and password are required");
    }

    try {
      const users = readUsers();
      const existingUser = users.find((storedUser) => normalizeEmail(storedUser.email) === normalizedEmail);

      if (existingUser) {
        throw new Error("User already exists");
      }

      const newUser: StoredUser = {
        username: trimmedUsername,
        email: normalizedEmail,
        password: trimmedPassword,
      };

      writeUsers([...users, newUser]);

      const authUser = toAuthUser(newUser);
      writeSession(authUser);
      setUser(authUser);
      setSession({ user: authUser });
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Unable to create account");
    }
  };

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = normalizeEmail(email);
    const trimmedPassword = password.trim();

    if (!normalizedEmail || !trimmedPassword) {
      throw new Error("Invalid login credentials");
    }

    try {
      const users = readUsers();
      const existingUser = users.find(
        (storedUser) =>
          normalizeEmail(storedUser.email) === normalizedEmail && storedUser.password === trimmedPassword,
      );

      if (!existingUser) {
        throw new Error("Invalid login credentials");
      }

      const authUser = toAuthUser(existingUser);
      writeSession(authUser);
      setUser(authUser);
      setSession({ user: authUser });
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Invalid login credentials");
    }
  };

  const signOut = async () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
