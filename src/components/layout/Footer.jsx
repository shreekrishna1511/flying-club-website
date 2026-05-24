import React from 'react'
import { NavLink } from 'react-router-dom'
import { Mail, Github, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-navy-950 text-navy-300 border-t border-navy-800">
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-navy-800 border border-navy-600 rounded-sm flex items-center justify-center">
                <span className="font-mono text-gold-400 text-xs font-bold">FC</span>
              </div>
              <div>
                <p className="font-serif text-white font-semibold text-sm">Flying Club</p>
                <p className="font-mono text-navy-500 text-xs">PULCHOWK CAMPUS</p>
              </div>
            </div>
            <p className="font-sans text-navy-400 text-sm leading-relaxed">
              Advancing aerospace engineering through hands-on learning, research,
              and inter-disciplinary collaboration at IOE Pulchowk Campus, Tribhuvan University.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-xs text-navy-500 uppercase tracking-[0.15em]">Navigation</h4>
            <ul className="space-y-2">
              {[['Home','/'],[' Committee','/committee'],['Calendar','/calendar'],['Equipment Portal','/portal']].map(([l,t]) => (
                <li key={t}>
                  <NavLink to={t} className="font-sans text-sm text-navy-400 hover:text-white transition-colors">{l}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-xs text-navy-500 uppercase tracking-[0.15em]">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-navy-500 mt-0.5 flex-shrink-0" />
                <span className="font-sans text-navy-400 text-sm leading-snug">IOE Pulchowk Campus, Lalitpur, Bagmati Province, Nepal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-navy-500 flex-shrink-0" />
                <a href="mailto:flyingclub@pcampus.edu.np" className="font-mono text-sm text-navy-400 hover:text-white transition-colors">
                  flyingclub@pcampus.edu.np
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Github className="w-4 h-4 text-navy-500 flex-shrink-0" />
                <a href="https://github.com/flying-club-pulchowk" target="_blank" rel="noopener noreferrer"
                   className="font-mono text-sm text-navy-400 hover:text-white transition-colors flex items-center gap-1">
                  GitHub Repository <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-navy-600 text-xs">© {year} Flying Club, Pulchowk Campus. All rights reserved.</p>
          <p className="font-mono text-navy-600 text-xs">Institute of Engineering · Tribhuvan University</p>
        </div>
      </div>
    </footer>
  )
}
