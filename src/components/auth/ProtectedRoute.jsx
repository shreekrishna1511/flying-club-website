import React from 'react'
import { Shield, Lock, AlertTriangle, Loader2, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole = 'member' }) {
  const { loading, isAuthenticated, isAdmin, isMember, currentUser, signInWithGoogle } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-navy-600 mx-auto" />
          <p className="font-sans text-steel-500 text-sm">Verifying credentials…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full card-formal p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-navy-50 border border-navy-200 rounded-sm flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-navy-600" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy-900">Restricted Access</h2>
            <div className="section-rule mx-auto" />
            <p className="font-sans text-steel-600 text-sm leading-relaxed">
              Sign in with your institutional Google account to access the Equipment Portal.
            </p>
          </div>
          <button onClick={signInWithGoogle} className="btn-primary w-full justify-center">
            <LogIn className="w-4 h-4" /> Sign In with Google
          </button>
          <p className="font-mono text-xs text-steel-400">Access restricted to verified Flying Club members.</p>
        </div>
      </div>
    )
  }

  const hasAccess = requiredRole === 'admin' ? isAdmin : isMember

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-lg w-full card-formal p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-sm flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy-900">Access Denied</h2>
            <div className="w-16 h-0.5 bg-red-400 mt-3 mb-6 mx-auto" />
            <p className="font-sans text-steel-600 text-sm leading-relaxed">
              Your account (<span className="font-mono text-navy-700">{currentUser?.email}</span>) is not
              registered as a verified member of Flying Club Pulchowk Campus.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-left flex gap-3">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-sans font-semibold text-amber-800 text-sm">Members Only Section</p>
              <p className="font-sans text-amber-700 text-xs leading-relaxed mt-1">
                Contact the Equipment Manager to verify your membership and gain access.
              </p>
            </div>
          </div>
          <p className="font-mono text-xs text-steel-400">equipment.manager@pcampus.edu.np</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
