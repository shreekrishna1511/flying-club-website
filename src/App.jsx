import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }       from './context/AuthContext'
import ProtectedRoute         from './components/auth/ProtectedRoute'
import Navbar                 from './components/layout/Navbar'
import Footer                 from './components/layout/Footer'
import HomePage               from './pages/HomePage'
import CommitteePage          from './pages/CommitteePage'
import CalendarPage           from './pages/CalendarPage'
import EquipmentPortalPage    from './pages/EquipmentPortalPage'

function NotFoundPage() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md px-6">
        <p className="font-mono text-7xl font-bold text-steel-200 mb-4">404</p>
        <h1 className="font-serif text-2xl font-bold text-navy-900 mb-3">Page Not Found</h1>
        <div className="section-rule mx-auto" />
        <p className="font-sans text-steel-600 text-sm mb-8">The page you are looking for does not exist.</p>
        <a href="/" className="btn-primary">Return to Home</a>
      </div>
    </div>
  )
}

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/committee" element={<CommitteePage />} />
            <Route path="/calendar"  element={<CalendarPage />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute requiredRole="member">
                  <EquipmentPortalPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
