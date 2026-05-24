import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X, LogIn, LogOut, ChevronDown, Shield, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home',             to: '/' },
  { label: 'Committee',        to: '/committee' },
  { label: 'Calendar',         to: '/calendar' },
  { label: 'Equipment Portal', to: '/portal', protected: true },
]

export default function Navbar() {
  const { currentUser, isAdmin, isMember, signInWithGoogle, signOut, loading } = useAuth()
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false) }, [location])

  const roleLabel = isAdmin ? 'Administrator' : isMember ? 'Member' : null

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-navy-900 transition-shadow duration-300 ${scrolled ? 'shadow-xl shadow-navy-950/50' : ''}`}>
      <div className="h-0.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600" />

      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-9 h-9 bg-navy-700 border border-navy-500 rounded-sm flex items-center justify-center group-hover:border-gold-500 transition-colors duration-200">
              <span className="font-mono text-gold-400 text-xs font-bold tracking-widest">FC</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-serif text-white font-semibold text-sm leading-tight group-hover:text-gold-200 transition-colors duration-200">Flying Club</p>
              <p className="font-mono text-navy-300 text-xs tracking-wider">PULCHOWK CAMPUS · IOE · TU</p>
            </div>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 font-sans text-sm font-medium tracking-wide rounded-sm transition-all duration-200 border border-transparent
                   ${isActive ? 'text-white bg-navy-700 border-navy-600' : 'text-navy-300 hover:text-white hover:bg-navy-800'}`
                }>
                {link.label}
                {link.protected && <Shield className="inline w-3 h-3 ml-1.5 opacity-60" />}
              </NavLink>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-sm bg-navy-700 animate-pulse" />
            ) : currentUser ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-navy-600 hover:border-navy-400 transition-colors">
                  {currentUser.photoURL
                    ? <img src={currentUser.photoURL} alt="" className="w-6 h-6 rounded-full" />
                    : <div className="w-6 h-6 bg-navy-600 rounded-full flex items-center justify-center"><User className="w-3.5 h-3.5 text-navy-300" /></div>
                  }
                  <div className="text-left">
                    <p className="font-sans text-white text-xs font-medium leading-none">{currentUser.displayName?.split(' ')[0]}</p>
                    {roleLabel && <p className={`font-mono text-[10px] leading-none mt-0.5 ${isAdmin ? 'text-gold-400' : 'text-emerald-400'}`}>{roleLabel}</p>}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-navy-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-steel-200 rounded-sm shadow-xl py-1 z-50">
                    <div className="px-4 py-3 border-b border-steel-100">
                      <p className="font-sans text-steel-900 text-sm font-medium truncate">{currentUser.displayName}</p>
                      <p className="font-mono text-steel-400 text-xs truncate mt-0.5">{currentUser.email}</p>
                    </div>
                    <button onClick={signOut} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left font-sans text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="btn-gold text-xs px-4 py-2">
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-navy-300 hover:text-white">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-950 border-t border-navy-800">
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 font-sans text-sm font-medium rounded-sm transition-colors
                   ${isActive ? 'text-white bg-navy-700' : 'text-navy-300 hover:text-white hover:bg-navy-800'}`
                }>
                {link.label}
                {link.protected && <Shield className="w-3.5 h-3.5 opacity-50" />}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-navy-800">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-4 py-2">
                    <p className="font-sans text-white text-sm font-medium">{currentUser.displayName}</p>
                    <p className="font-mono text-navy-400 text-xs">{currentUser.email}</p>
                  </div>
                  <button onClick={signOut} className="w-full flex items-center gap-2 px-4 py-2.5 font-sans text-sm text-red-400">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={signInWithGoogle} className="w-full btn-gold justify-center text-sm">
                  <LogIn className="w-4 h-4" /> Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </header>
  )
}
