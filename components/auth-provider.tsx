"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useSupabase } from "@/lib/use-supabase"

interface User {
  username: string
  role: "admin" | "user"
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    // Povuci session iz Supabase-a
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        // Povuci dodatne podatke o korisniku
        const { data: userData } = await supabase
          .from("users")
          .select("username, role, permissions")
          .eq("email", session.user.email)
          .single()
        if (userData) setUser(userData as User)
      } else {
        setUser(null)
      }
    }
    getUser()
    // Slušaj promjene sesije
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [supabase])

  const login = (userData: User) => {
    setUser(userData)
    // Nema više localStorage
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const hasPermission = (permission: string) => {
    if (!user) return false
    if (user.role === "admin") return true
    return user.permissions.includes(permission) || user.permissions.includes("all")
  }

  return <AuthContext.Provider value={{ user, login, logout, hasPermission }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
