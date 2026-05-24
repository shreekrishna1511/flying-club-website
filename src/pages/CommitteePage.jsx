import React from 'react'
import { User, Mail, Users } from 'lucide-react'
import { COMMITTEE_MEMBERS, getMembersByCategory } from '../data/committeeMembers'

function MemberCard({ member }) {
  return (
    <article className="card-formal overflow-hidden">
      <div className="relative bg-gradient-to-br from-navy-50 to-steel-100 border-b border-steel-200 h-52 flex items-center justify-center">
        {member.photo
          ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
          : <div className="w-24 h-24 bg-white border-2 border-steel-200 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-10 h-10 text-steel-300" />
            </div>
        }
        <div className="absolute top-3 left-3 px-2 py-1 bg-navy-900/80 backdrop-blur-sm rounded-sm border border-navy-700">
          <span className="font-mono text-[10px] text-navy-300 tracking-wider">{member.category.toUpperCase()}</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-serif text-base font-bold text-navy-900 leading-snug">{member.name}</h3>
          <p className="font-sans text-gold-600 text-sm font-semibold mt-0.5">{member.role}</p>
        </div>
        <div className="w-8 h-px bg-gold-400" />
        <div className="space-y-1">
          <p className="font-sans text-steel-600 text-xs">{member.department}</p>
          <p className="font-mono text-steel-400 text-xs">{member.year}</p>
        </div>
        {member.email && (
          <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 font-mono text-xs text-navy-500 hover:text-navy-700 transition-colors">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{member.email}</span>
          </a>
        )}
      </div>
    </article>
  )
}

function CategorySection({ title, members }) {
  return (
    <section className="mb-14">
      <div className="flex items-center gap-4 mb-7">
        <h3 className="font-serif text-xl font-semibold text-navy-900">{title}</h3>
        <div className="flex-1 h-px bg-steel-200" />
        <span className="font-mono text-xs text-steel-400">{members.length} member{members.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {members.map(m => <MemberCard key={m.id} member={m} />)}
      </div>
    </section>
  )
}

export default function CommitteePage() {
  const byCategory = getMembersByCategory()
  const ORDER = ['Faculty Advisors', 'Executive Board', 'Technical Division', 'Operations']

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-navy-900 border-b border-navy-800">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="section-wrapper py-14">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-navy-800 border border-navy-600 rounded-sm flex items-center justify-center flex-shrink-0 mt-1">
              <Users className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <p className="font-mono text-navy-400 text-xs tracking-widest uppercase mb-2">Academic Year 2081–82 B.S.</p>
              <h1 className="font-serif text-4xl font-bold text-white">Committee Members</h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-16 h-0.5 bg-gold-500" />
                <span className="font-mono text-navy-400 text-sm">{COMMITTEE_MEMBERS.length} Members Listed</span>
              </div>
              <p className="font-sans text-navy-300 text-sm leading-relaxed mt-4 max-w-xl">
                The current executive committee and advisory board responsible for the administration,
                technical direction, and day-to-day operations of the club.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-wrapper py-14">
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-sm mb-10">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
          <p className="font-sans text-amber-800 text-sm leading-relaxed">
            <strong>Note:</strong> Replace placeholder names, photos, and emails in{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">src/data/committeeMembers.js</code>.
            Place photos in <code className="font-mono bg-amber-100 px-1 rounded">/public/committee/</code>.
          </p>
        </div>

        {ORDER.map(cat => byCategory[cat]
          ? <CategorySection key={cat} title={cat} members={byCategory[cat]} />
          : null
        )}
      </div>
    </div>
  )
}
