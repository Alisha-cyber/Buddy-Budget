import React, { createContext, useEffect, useMemo, useState } from "react";
import { getSession, saveSession, clearSession } from "../services/sessionService";
import { signOutGoogle } from "../services/googleAuthService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = await getSession();
        if (savedUser) {
          setUser(savedUser);
        }
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await saveSession(userData);
  };

  const logout = async () => {
    setUser(null);
    await clearSession();

    try {
      await signOutGoogle();
    } catch (err) {}
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      login,
      logout,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}