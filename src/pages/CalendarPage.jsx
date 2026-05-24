/**
 * BS 2083 Flying Club Calendar — React component
 * Ported directly from the standalone index.html calendar.
 *
 * TO ADD EVENTS: edit the EVENTS array below.
 *   month: 0=Baisakh 1=Jestha 2=Ashadh 3=Shrawan 4=Bhadra 5=Ashwin
 *          6=Kartik 7=Mangsir 8=Poush 9=Magh 10=Falgun 11=Chaitra
 *   cat: 'competition' | 'project' | 'workshop' | 'outreach' | 'admin'
 */

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ── Data ────────────────────────────────────────────────────
const MONTHS = [
  { name:'Baisakh', days:31, start:2, season:'Spring',  adOffset:0   },
  { name:'Jestha',  days:31, start:5, season:'Summer',  adOffset:31  },
  { name:'Ashadh',  days:32, start:1, season:'Summer',  adOffset:62  },
  { name:'Shrawan', days:32, start:5, season:'Monsoon', adOffset:94  },
  { name:'Bhadra',  days:31, start:2, season:'Monsoon', adOffset:126 },
  { name:'Ashwin',  days:30, start:5, season:'Autumn',  adOffset:157 },
  { name:'Kartik',  days:30, start:0, season:'Autumn',  adOffset:187 },
  { name:'Mangsir', days:29, start:2, season:'Winter',  adOffset:217 },
  { name:'Poush',   days:30, start:3, season:'Winter',  adOffset:246 },
  { name:'Magh',    days:29, start:5, season:'Winter',  adOffset:276 },
  { name:'Falgun',  days:30, start:6, season:'Spring',  adOffset:305 },
  { name:'Chaitra', days:30, start:1, season:'Spring',  adOffset:335 },
]

// BS 2083 Baisakh 1 = April 14, 2026
const EPOCH     = new Date(2026, 3, 14)
const AD_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const WDAYS     = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const WDAYS_S   = ['Su','Mo','Tu','We','Th','Fr','Sa']
const CATS      = ['competition','project','workshop','outreach','admin']

const CC = {
  competition: { dot:'#4DAAFF', bg:'rgba(77,170,255,0.22)',   text:'#A8D4FF' },
  project:     { dot:'#3DD6A0', bg:'rgba(61,214,160,0.22)',   text:'#A0EDD1' },
  workshop:    { dot:'#F5C542', bg:'rgba(245,197,66,0.22)',   text:'#FADE96' },
  outreach:    { dot:'#F06080', bg:'rgba(240,96,128,0.22)',   text:'#F8B0C0' },
  admin:       { dot:'#A090C8', bg:'rgba(160,144,200,0.22)', text:'#C8B8E8' },
}

// ── EVENTS — edit this array to add/change events ──────────
const EVENTS = [
  { id:1,  month:1,  day:10, name:'RC-Plane Workshop Commencement',            cat:'workshop',    notes:'RC-Plane practical workshop.' },
  { id:2,  month:7,  day:6,  name:'IIT Aeromodeling Competition',              cat:'competition', notes:'Starting of techfest IIT Bombay.' },
  { id:3,  month:2,  day:30, name:'Design Build and Fly Competition',          cat:'competition', notes:'Mission Allocation.' },
  { id:4,  month:4,  day:28, name:'Design Build and Fly Competition',          cat:'competition', notes:'Proposal Submission Window Open.' },
  { id:5,  month:5,  day:14, name:'Design Build and Fly Competition',          cat:'competition', notes:'Proposal Submission Window Close.' },
  { id:6,  month:8,  day:18, name:'Design Build and Fly Competition',          cat:'competition', notes:'Final Report Submission Window Open.' },
  { id:7,  month:9,  day:8,  name:'Design Build and Fly Competition',          cat:'competition', notes:'Final Report Submission Window Close.' },
  { id:8,  month:6,  day:15, name:'IIT Aeromodeling Competition',              cat:'competition', notes:'Proposal Submission.' },
  { id:9,  month:3,  day:3,  name:'IIT Aeromodeling Team Selection',           cat:'competition', notes:'Team Selection for IIT.' },
  { id:10, month:1,  day:22, name:'Project Initiation',                        cat:'project',     notes:'Proposal Submission Opens for Flying Club.' },
  { id:11, month:2,  day:11, name:'SRB Seds Flying Club Collaborative Init.', cat:'outreach',    notes:'' },
]

// ── Helpers ────────────────────────────────────────────────
function adLabel(monthIdx, bsDay) {
  const d = new Date(EPOCH)
  d.setDate(d.getDate() + MONTHS[monthIdx].adOffset + (bsDay - 1))
  return `${d.getDate()} ${AD_MONTHS[d.getMonth()]}`
}
function dowOf(monthIdx, bsDay) {
  return (MONTHS[monthIdx].start + bsDay - 1) % 7
}

// ── Shared inline style shortcuts ─────────────────────────
const glass      = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }
const glassDark  = { background:'rgba(10,18,32,0.88)',    border:'1px solid rgba(255,255,255,0.12)' }
const borderSub  = '1px solid rgba(255,255,255,0.05)'

// ── Main component ─────────────────────────────────────────
export default function CalendarPage() {
  const [curMonth, setCurMonth] = useState(0)
  const [selDay,   setSelDay]   = useState(null)

  // Keyboard navigation
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') setCurMonth(m => Math.min(m + 1, 11))
      if (e.key === 'ArrowLeft')  setCurMonth(m => Math.max(m - 1, 0))
      if (e.key === 'Escape')     setSelDay(null)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  useEffect(() => { setSelDay(null) }, [curMonth])

  const m          = MONTHS[curMonth]
  const monthEvs   = EVENTS.filter(e => e.month === curMonth).sort((a,b) => a.day - b.day)
  const displayEvs = selDay ? EVENTS.filter(e => e.month === curMonth && e.day === selDay) : monthEvs

  // Build cell array
  const cells = []
  for (let i = 0; i < m.start; i++) cells.push(null)
  for (let d = 1; d <= m.days; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="pt-16 min-h-screen" style={{ background:'#0A1628', color:'#F0F4FA', fontFamily:"'DM Sans',sans-serif" }}>

      {/* Radial background */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
                    background:'radial-gradient(ellipse 80% 60% at 50% 0%,#1A3A6B 0%,#0A1628 60%)' }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:'1060px', margin:'0 auto', padding:'16px' }}>

        {/* ── Top control bar ─────────────────────────── */}
        <div style={{ ...glass, borderRadius:'12px', padding:'14px 20px', marginBottom:'12px',
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      flexWrap:'wrap', gap:'12px', backdropFilter:'blur(20px)' }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'22px', letterSpacing:'3px' }}>
              Flying Club — Events Calendar
            </div>
            <div style={{ fontSize:'11px', color:'#7A90B0', letterSpacing:'1px', marginTop:'2px' }}>
              BIKRAM SAMBAT 2083 · PULCHOWK CAMPUS
            </div>
          </div>

          {/* Month switcher */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <button onClick={() => setCurMonth(m => Math.max(m-1,0))} disabled={curMonth===0}
              style={{ ...glass, color:'#F0F4FA', borderRadius:'8px', padding:'6px 14px', cursor:'pointer',
                       fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', gap:'4px',
                       opacity: curMonth===0 ? 0.3 : 1, fontFamily:"'DM Sans',sans-serif" }}>
              <ChevronLeft size={14} /> Prev
            </button>

            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'20px', letterSpacing:'3px',
                          minWidth:'110px', textAlign:'center' }}>
              {m.name}
              <div style={{ fontSize:'11px', color:'#7A90B0', fontFamily:"'DM Sans',sans-serif",
                            letterSpacing:0, fontWeight:400 }}>{m.season}</div>
            </div>

            <button onClick={() => setCurMonth(m => Math.min(m+1,11))} disabled={curMonth===11}
              style={{ ...glass, color:'#F0F4FA', borderRadius:'8px', padding:'6px 14px', cursor:'pointer',
                       fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', gap:'4px',
                       opacity: curMonth===11 ? 0.3 : 1, fontFamily:"'DM Sans',sans-serif" }}>
              Next <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'18px', color:'#E8A830', letterSpacing:'3px' }}>
            BS 2083
          </div>
        </div>

        {/* ── Month header strip ───────────────────────── */}
        <div style={{ background:'linear-gradient(100deg,rgba(26,63,107,0.7),rgba(10,22,40,0.5))',
                      border:'1px solid rgba(255,255,255,0.12)', borderRadius:'14px',
                      padding:'12px 18px', marginBottom:'8px', backdropFilter:'blur(12px)',
                      position:'relative', overflow:'hidden',
                      display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px',
                        background:'linear-gradient(90deg,transparent,#4DAAFF,#E8A830,transparent)' }} />
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'36px', letterSpacing:'4px', lineHeight:1 }}>
            {m.name}
          </span>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'10px', color:'#7A90B0', letterSpacing:'1px', textTransform:'uppercase' }}>
              {m.season} · {m.days} days
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'20px', color:'#E8A830', letterSpacing:'2px' }}>
              BS 2083
            </div>
            <div style={{ fontSize:'10px', color:'#7A90B0', marginTop:'2px' }}>
              {adLabel(curMonth,1)} – {adLabel(curMonth,m.days)} AD
            </div>
            {monthEvs.length > 0 && (
              <span style={{ display:'inline-block', fontSize:'10px', padding:'2px 9px', borderRadius:'99px',
                             background:'rgba(77,170,255,0.2)', color:'#4DAAFF', fontWeight:600, marginTop:'3px' }}>
                {monthEvs.length} event{monthEvs.length!==1?'s':''}
              </span>
            )}
          </div>
        </div>

        {/* ── Calendar grid ─────────────────────────────── */}
        <div style={{ ...glass, borderRadius:'14px', padding:'16px', marginBottom:'8px', backdropFilter:'blur(10px)' }}>

          {/* Day headers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)',
                        borderBottom:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.03)' }}>
            {WDAYS_S.map((d,i) => (
              <div key={d} style={{ textAlign:'center', fontSize:'11px', fontWeight:600, padding:'8px 0',
                                    letterSpacing:'1px', textTransform:'uppercase',
                                    color: (i===0||i===6) ? '#F06080' : '#7A90B0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ paddingTop:'4px' }}>
            {Array.from({ length: cells.length/7 }, (_,row) => (
              <div key={row} style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
                {cells.slice(row*7, row*7+7).map((day, col) => {
                  if (!day) return <div key={col} style={{ padding:'4px 2px 3px' }} />
                  const dow     = dowOf(curMonth, day)
                  const isWE    = dow===0||dow===6
                  const cellEvs = EVENTS.filter(e => e.month===curMonth && e.day===day)
                  const isSel   = selDay===day

                  return (
                    <div key={col} onClick={() => setSelDay(p => p===day ? null : day)}
                      style={{ padding:'4px 2px 4px', cursor:'pointer', borderRadius:'6px',
                               display:'flex', flexDirection:'column', alignItems:'center', gap:'1px',
                               background: isSel ? 'rgba(77,170,255,0.2)' : 'transparent',
                               outline: isSel ? '1px solid rgba(77,170,255,0.5)' : 'none', transition:'background 0.12s' }}
                      onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background='rgba(255,255,255,0.09)' }}
                      onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background='transparent' }}>
                      <span style={{ fontSize:'14px', lineHeight:1.3, fontFamily:"'JetBrains Mono',monospace",
                                     fontWeight: cellEvs.length>0 ? 700 : 500,
                                     color: isWE ? '#F06080' : cellEvs.length>0 ? '#4DAAFF' : '#F0F4FA' }}>
                        {day}
                      </span>
                      <span style={{ fontSize:'9px', lineHeight:1, fontFamily:"'JetBrains Mono',monospace",
                                     color: isWE ? 'rgba(240,96,128,0.65)' : '#7A90B0', opacity:0.75 }}>
                        {adLabel(curMonth,day)}
                      </span>
                      {cellEvs.length>0 && (
                        <div style={{ display:'flex', gap:'2px', flexWrap:'wrap', justifyContent:'center', marginTop:'1px' }}>
                          {cellEvs.slice(0,3).map((ev,i) => (
                            <span key={i} style={{ width:'5px', height:'5px', borderRadius:'50%',
                                                   background:CC[ev.cat].dot, flexShrink:0 }} />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── Event panel ──────────────────────────────── */}
        <div style={{ ...glassDark, borderRadius:'14px', overflow:'hidden', backdropFilter:'blur(16px)' }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                        padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.12)',
                        background:'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize:'10px', textTransform:'uppercase', letterSpacing:'1.5px',
                          color:'#7A90B0', fontWeight:600, display:'flex', alignItems:'center', gap:'7px' }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#4DAAFF',
                             boxShadow:'0 0 7px #4DAAFF', display:'inline-block' }} />
              {selDay
                ? `Events on ${selDay} ${m.name} 2083 — ${adLabel(curMonth,selDay)} AD`
                : `All Events — ${m.name} 2083`}
            </div>
            {selDay && (
              <button onClick={() => setSelDay(null)}
                style={{ ...glass, color:'#7A90B0', borderRadius:'6px', padding:'3px 10px',
                         cursor:'pointer', fontSize:'11px', fontFamily:"'DM Sans',sans-serif" }}>
                ✕ Show all
              </button>
            )}
          </div>

          {/* Event list */}
          <div style={{ maxHeight:'280px', overflowY:'auto' }}>
            {displayEvs.length===0 ? (
              <div style={{ padding:'24px', textAlign:'center', color:'#7A90B0', fontSize:'13px' }}>
                {selDay ? `No events on ${selDay} ${m.name}.` : 'No events this month.'}
              </div>
            ) : displayEvs.map(ev => {
              const c   = CC[ev.cat]
              const dow = WDAYS[dowOf(curMonth,ev.day)]
              const ad  = adLabel(curMonth,ev.day)
              const hi  = selDay===ev.day
              return (
                <div key={ev.id}
                  onClick={() => setSelDay(p => p===ev.day ? null : ev.day)}
                  style={{ background: hi ? 'rgba(77,170,255,0.12)' : 'transparent',
                           borderBottom: borderSub, cursor:'pointer',
                           display:'grid', gridTemplateColumns:'52px 1fr 4px',
                           alignItems:'stretch', gap:'10px', padding:'10px 16px',
                           transition:'background 0.15s' }}
                  onMouseEnter={e=>{ if(!hi) e.currentTarget.style.background='rgba(255,255,255,0.04)' }}
                  onMouseLeave={e=>{ if(!hi) e.currentTarget.style.background='transparent' }}>
                  <div style={{ textAlign:'center', paddingTop:'2px' }}>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'22px', color:c.dot, lineHeight:1 }}>{ev.day}</div>
                    <div style={{ fontSize:'10px', color:'#7A90B0', letterSpacing:'1px', textTransform:'uppercase' }}>{dow}</div>
                    <div style={{ fontSize:'9px', color:'#7A90B0', marginTop:'2px' }}>{ad}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:500, color:'#F0F4FA', marginBottom:'3px' }}>{ev.name}</div>
                    {ev.notes && <div style={{ fontSize:'11px', color:'#7A90B0', lineHeight:1.4 }}>{ev.notes}</div>}
                    <span style={{ display:'inline-block', marginTop:'5px', fontSize:'10px', padding:'2px 8px',
                                   borderRadius:'99px', background:c.bg, color:c.text, fontWeight:600 }}>
                      {ev.cat}
                    </span>
                  </div>
                  <div style={{ background:c.dot, opacity:0.7, borderRadius:'2px' }} />
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', padding:'10px 16px',
                        borderTop:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)' }}>
            {CATS.map(c => (
              <div key={c} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'#7A90B0' }}>
                <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:CC[c].dot, flexShrink:0 }} />
                {c.charAt(0).toUpperCase()+c.slice(1)}
              </div>
            ))}
            <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'#7A90B0' }}>
              <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#F06080', flexShrink:0 }} />
              Sat/Sun
            </div>
          </div>
        </div>

        <p style={{ textAlign:'center', fontSize:'11px', color:'rgba(122,144,176,0.5)',
                    marginTop:'12px', fontFamily:'monospace' }}>
          ← → Arrow keys to navigate months · Click a date to filter events
        </p>
      </div>
    </div>
  )
}
