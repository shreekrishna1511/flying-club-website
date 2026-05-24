import React from 'react'
import { NavLink } from 'react-router-dom'
import { Plane, Target, BookOpen, Award, Users, Calendar, ArrowRight, Wind, Compass } from 'lucide-react'

const MILESTONES = [
  { year: '2015', title: 'Foundation', description: 'Flying Club Pulchowk Campus was formally established by a group of passionate aerospace engineering students, with the primary goal of providing hands-on aviation and UAV experience beyond the academic curriculum.' },
  { year: '2017', title: 'First UAV Competition', description: 'The club participated in its inaugural national-level UAV design competition, fielding a fixed-wing prototype developed entirely by student members.' },
  { year: '2019', title: 'Equipment Lab Established', description: 'A dedicated equipment laboratory was inaugurated on campus, housing tools, components, and flight hardware. The facility formalized the club\'s inventory management and safety protocols.' },
  { year: '2021', title: 'Inter-University Collaboration', description: 'The club expanded through collaborative research projects with partner institutions and established formal ties with the Civil Aviation Authority of Nepal (CAAN).' },
  { year: '2023', title: 'Digital Portal Launch', description: 'Introduction of a digital equipment management system enabling real-time inventory tracking, member access control, and formalized borrowing workflows.' },
  { year: '2025', title: 'Continued Excellence', description: 'The club continues to grow with active research in autonomous systems, a thriving membership, and ongoing contributions to Nepal\'s emerging aerospace and drone technology sector.' },
]

const STATS = [
  { value: '10+', label: 'Years Active',        icon: Calendar },
  { value: '150+',label: 'Alumni Members',      icon: Users },
  { value: '20+', label: 'Projects Completed',  icon: Award },
  { value: '5+',  label: 'Competition Awards',  icon: Compass },
]

function StatCard({ value, label, Icon }) {
  return (
    <div className="card-formal p-6 text-center">
      <Icon className="w-6 h-6 text-gold-500 mx-auto mb-3" />
      <p className="font-serif text-3xl font-bold text-navy-900">{value}</p>
      <p className="font-sans text-steel-500 text-sm mt-1">{label}</p>
    </div>
  )
}

function MilestoneItem({ year, title, description, isLast }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-10 h-10 bg-navy-700 border-2 border-navy-500 rounded-sm flex items-center justify-center z-10">
          <span className="font-mono text-gold-400 text-xs font-bold">{year}</span>
        </div>
        {!isLast && <div className="w-px flex-1 bg-navy-200 mt-2" />}
      </div>
      <div className="pb-8">
        <h4 className="font-serif text-lg font-semibold text-navy-900 mt-2">{title}</h4>
        <p className="font-sans text-steel-600 text-sm leading-relaxed mt-2">{description}</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(to right,#7e99cf 1px,transparent 1px),linear-gradient(to bottom,#7e99cf 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-12 right-12 opacity-5"><Plane className="w-64 h-64 text-white rotate-12" /></div>

        <div className="relative section-wrapper py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-navy-800 border border-navy-600 rounded-sm mb-8">
              <span className="font-mono text-gold-400 text-xs tracking-widest uppercase">IOE · Tribhuvan University</span>
            </div>

            {/* Logo placeholder — replace with: <img src="/logo.png" alt="Flying Club Logo" className="w-24 h-24 mb-8" /> */}
            <div className="w-24 h-24 bg-navy-800 border-2 border-dashed border-navy-500 rounded-sm flex flex-col items-center justify-center mb-8 hover:border-gold-500 transition-colors group">
              <Plane className="w-8 h-8 text-navy-400 group-hover:text-gold-400 transition-colors" />
              <span className="font-mono text-navy-500 text-[10px] mt-1.5 group-hover:text-gold-500">LOGO</span>
            </div>

            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white leading-tight">
              Flying Club<br />
              <span className="text-gold-400">Pulchowk Campus</span>
            </h1>

            <div className="flex items-center gap-4 mt-6 mb-8">
              <div className="w-20 h-px bg-gold-500" />
              <span className="font-mono text-navy-400 text-xs tracking-widest uppercase">Est. 2015</span>
              <div className="w-20 h-px bg-gold-500" />
            </div>

            <p className="font-sans text-navy-300 text-lg leading-relaxed max-w-xl">
              Nepal's premier student-run aviation and aerospace engineering club, dedicated to bridging
              theoretical knowledge with practical flight systems development.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <NavLink to="/committee" className="btn-gold">
                Meet the Committee <ArrowRight className="w-4 h-4" />
              </NavLink>
              <NavLink to="/calendar" className="btn-secondary border-navy-400 text-navy-300 hover:bg-navy-700 hover:text-white hover:border-navy-700">
                View Calendar <ArrowRight className="w-4 h-4" />
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-steel-200">
        <div className="section-wrapper py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <StatCard key={label} value={value} label={label} Icon={Icon} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="section-wrapper">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-navy-50 border border-navy-200 rounded-sm flex items-center justify-center">
                  <Target className="w-5 h-5 text-navy-600" />
                </div>
                <div>
                  <h2 className="section-title text-2xl">Our Mission</h2>
                  <div className="section-rule" />
                </div>
              </div>
              <p className="font-sans text-steel-700 text-base leading-relaxed mb-4">
                Flying Club Pulchowk Campus exists to cultivate the next generation of aerospace engineers
                and aviation professionals in Nepal. We provide a structured, safety-first environment where
                students can apply theoretical principles to the design, construction, testing, and operation
                of unmanned aerial systems.
              </p>
              <p className="font-sans text-steel-700 text-base leading-relaxed">
                We are committed to rigorous engineering practice, collaborative problem-solving, and the
                advancement of indigenous aerospace capability within Nepal's higher education ecosystem.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold-50 border border-gold-200 rounded-sm flex items-center justify-center">
                  <Wind className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h2 className="section-title text-2xl">Our Vision</h2>
                  <div className="w-16 h-0.5 bg-gold-500 mt-3 mb-6" />
                </div>
              </div>
              <p className="font-sans text-steel-700 text-base leading-relaxed mb-4">
                We envision Flying Club Pulchowk Campus as a nationally recognised centre of excellence for
                student-led aerospace innovation — a launchpad from which Nepal's future aviation engineers,
                researchers, and entrepreneurs emerge fully equipped to compete on the global stage.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {['Precision Engineering', 'Safety First', 'Collaboration', 'Innovation'].map(v => (
                  <div key={v} className="flex items-center gap-2 p-3 bg-white border border-steel-200 rounded-sm">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                    <span className="font-sans text-steel-700 text-sm font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white border-t border-steel-200">
        <div className="section-wrapper">
          <div className="max-w-2xl mb-14">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-navy-600" />
              <h2 className="section-title">History & Milestones</h2>
            </div>
            <div className="section-rule" />
            <p className="font-sans text-steel-600 text-base leading-relaxed">
              From a small group of aviation enthusiasts to a formally constituted engineering club —
              a decade of growth, achievement, and aeronautical discovery.
            </p>
          </div>
          <div className="max-w-2xl">
            {MILESTONES.map((m, i) => (
              <MilestoneItem key={m.year} {...m} isLast={i === MILESTONES.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy-900 border-t border-navy-800">
        <div className="section-wrapper text-center">
          <h3 className="font-serif text-3xl font-bold text-white mb-4">Interested in Joining?</h3>
          <p className="font-sans text-navy-300 text-base max-w-xl mx-auto mb-8">
            Flying Club Pulchowk Campus welcomes all students of IOE with a passion for aerospace,
            aviation, and engineering innovation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <NavLink to="/committee" className="btn-gold">
              View Committee Members <ArrowRight className="w-4 h-4" />
            </NavLink>
            <a href="mailto:flyingclub@pcampus.edu.np"
               className="btn-secondary border-navy-500 text-navy-300 hover:bg-navy-700 hover:text-white hover:border-navy-700">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
