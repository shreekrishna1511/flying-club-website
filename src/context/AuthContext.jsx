import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase/config'
import { resolveUserRole } from '../data/authorizedMembers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole,    setUserRole]    = useState(null)
  const [loading,     setLoading]     = useState(true)

  function mapUser(user) {
    if (!user) return null
    return {
      uid:         user.id,
      email:       user.email,
      displayName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
      photoURL:    user.user_metadata?.avatar_url || null,
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const mapped = mapUser(session?.user ?? null)
      setCurrentUser(mapped)
      setUserRole(mapped ? resolveUserRole(mapped.email) : null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const mapped = mapUser(session?.user ?? null)
      setCurrentUser(mapped)
      setUserRole(mapped ? resolveUserRole(mapped.email) : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
    setUserRole(null)
  }

  const value = {
    currentUser,
    userRole,
    loading,
    isAuthenticated: !!currentUser,
    isAdmin:  userRole === 'admin',
    isMember: userRole === 'member' || userRole === 'admin',
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
