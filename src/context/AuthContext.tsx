"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserData } from "@/helpers/jwtHelper";
import { getAuthCookie } from "@/lib/cookies/setCookies";

interface User {
  sub: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserData: () => Promise<void>;
  language: string;
  setLanguage: (lan: string) => void;
  messages: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState<any>(null);

  const updateUserData = async () => {
    const userData = (await getUserData()) as any;
    const data = (await getAuthCookie("language")) as any;
    setLanguage(data?.value);
    setUser(userData);
  };

  useEffect(() => {
    updateUserData();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [language]);

  const loadMessages = async () => {
    try {
      const messagesModule = await import(`../messages/${language}.json`);
      setMessages(messagesModule.default);
    } catch (error) {
      console.error("Error loading language file", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, updateUserData, language, setLanguage, messages }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
