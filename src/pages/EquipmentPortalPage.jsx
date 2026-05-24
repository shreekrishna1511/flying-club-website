import React, { useState, useEffect, useRef } from 'react'
import {
  Package, Plus, Upload, Edit3, Trash2, CheckCircle, Clock,
  AlertCircle, Wrench, Search, X, Download, Image as ImageIcon,
  Loader2, ChevronDown, Send, Shield,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  subscribeToEquipment, addEquipmentItem, updateEquipmentStatus,
  updateEquipmentItem, deleteEquipmentItem, submitCheckoutRequest,
} from '../supabase/equipmentService'

const STATUSES   = ['Available','In Use','To Be Returned','Under Maintenance']
const CATEGORIES = [
  'Fixed-Wing Aircraft','Rotary-Wing Aircraft','Avionics & Electronics',
  'Propulsion Systems','Ground Support Equipment','Tools & Workshop',
  'Safety Equipment','Simulation & Software','Other',
]

function StatusBadge({ status }) {
  const cfg = {
    'Available':         { cls:'status-available',   icon:CheckCircle },
    'In Use':            { cls:'status-in-use',      icon:Clock },
    'To Be Returned':    { cls:'status-return',      icon:Download },
    'Under Maintenance': { cls:'status-maintenance', icon:Wrench },
  }[status] || { cls:'status-available', icon:CheckCircle }
  const Icon = cfg.icon
  return <span className={cfg.cls}><Icon className="w-3 h-3" />{status}</span>
}

// ── Add/Edit Modal ─────────────────────────────────────────
function EquipmentFormModal({ isOpen, onClose, onSave, editItem }) {
  const [form, setForm]       = useState({ name:'', category:CATEGORIES[0], description:'', quantity:1, status:'Available', location:'', serialNumber:'' })
  const [imageFile, setImageFile] = useState(null)
  const [preview,  setPreview]   = useState(null)
  const [uploading,setUploading] = useState(false)
  const [progress, setProgress]  = useState(0)
  const fileRef = useRef()

  useEffect(() => {
    if (editItem) {
      setForm({ name:editItem.name||'', category:editItem.category||CATEGORIES[0], description:editItem.description||'',
                quantity:editItem.quantity||1, status:editItem.status||'Available',
                location:editItem.location||'', serialNumber:editItem.serialNumber||'' })
      setPreview(editItem.imageUrl||null)
      setImageFile(null)
    } else {
      setForm({ name:'', category:CATEGORIES[0], description:'', quantity:1, status:'Available', location:'', serialNumber:'' })
      setPreview(null); setImageFile(null)
    }
  }, [editItem, isOpen])

  const handleImg = (e) => {
    const f = e.target.files[0]; if(!f) return
    setImageFile(f); setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    setUploading(true)
    try { await onSave(form, imageFile, setProgress, editItem?.id); onClose() }
    finally { setUploading(false); setProgress(0) }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-sm border border-steel-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-formal">
        <div className="flex items-center justify-between px-6 py-4 border-b border-steel-200 bg-navy-50 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-navy-100 border border-navy-200 rounded-sm flex items-center justify-center">
              {editItem ? <Edit3 className="w-4 h-4 text-navy-600" /> : <Plus className="w-4 h-4 text-navy-600" />}
            </div>
            <h3 className="font-serif text-lg font-bold text-navy-900">{editItem ? 'Edit Equipment' : 'Add New Equipment'}</h3>
          </div>
          <button onClick={onClose} className="text-steel-400 hover:text-steel-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Equipment Name *</label>
              <input className="input-formal" placeholder="e.g. DJI Matrice 300 RTK" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            </div>
            <div>
              <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Category</label>
              <select className="input-formal" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Status</label>
              <select className="input-formal" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Quantity</label>
              <input type="number" min="1" className="input-formal" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
            </div>
            <div>
              <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Serial / Asset No.</label>
              <input className="input-formal" placeholder="e.g. FC-2024-001" value={form.serialNumber} onChange={e=>setForm({...form,serialNumber:e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Storage Location</label>
              <input className="input-formal" placeholder="e.g. Equipment Lab — Shelf B3" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Description</label>
              <textarea rows={3} className="input-formal resize-none" placeholder="Specifications, usage notes…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Equipment Photo</label>
              <div onClick={()=>fileRef.current?.click()}
                className={`border-2 border-dashed rounded-sm cursor-pointer overflow-hidden transition-colors
                            ${preview ? 'border-navy-300 bg-navy-50' : 'border-steel-300 hover:border-navy-400 bg-steel-50'}`}>
                {preview
                  ? <div className="relative"><img src={preview} alt="" className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-navy-900/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="font-sans text-white text-sm font-medium">Change Photo</span>
                      </div>
                    </div>
                  : <div className="py-8 flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 text-steel-300" />
                      <p className="font-sans text-steel-400 text-sm">Click to upload photo</p>
                      <p className="font-mono text-steel-300 text-xs">JPG, PNG, WEBP · Max 5 MB</p>
                    </div>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
            </div>
          </div>
          {uploading && progress>0 && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-mono text-xs text-steel-500">Uploading…</span>
                <span className="font-mono text-xs text-navy-600">{progress}%</span>
              </div>
              <div className="h-1.5 bg-steel-200 rounded-full overflow-hidden">
                <div className="h-full bg-navy-600 transition-all duration-300" style={{width:`${progress}%`}} />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-steel-200 bg-steel-50">
          <button onClick={onClose} className="btn-secondary text-sm px-4 py-2">Cancel</button>
          <button onClick={handleSubmit} disabled={uploading||!form.name.trim()}
            className="btn-primary text-sm px-5 py-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin"/>Saving…</> : <><Upload className="w-4 h-4"/>{editItem?'Save Changes':'Add Equipment'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Checkout Modal ─────────────────────────────────────────
function CheckoutModal({ isOpen, onClose, item, currentUser }) {
  const [purpose, setPurpose]       = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [submitting,setSubmitting]  = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  const handleSubmit = async () => {
    if (!purpose.trim()||!returnDate) return
    setSubmitting(true)
    try {
      await submitCheckoutRequest({ itemId:item.id, itemName:item.name,
        memberId:currentUser.uid, memberName:currentUser.displayName,
        memberEmail:currentUser.email, purpose, returnDate })
      setSubmitted(true)
    } finally { setSubmitting(false) }
  }

  const handleClose = () => { setSubmitted(false); setPurpose(''); setReturnDate(''); onClose() }
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-sm border border-steel-200 shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-steel-200 bg-navy-50">
          <h3 className="font-serif text-lg font-bold text-navy-900">Request Equipment</h3>
          <button onClick={handleClose} className="text-steel-400 hover:text-steel-700"><X className="w-5 h-5" /></button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-serif text-xl font-bold text-navy-900">Request Submitted</h4>
            <p className="font-sans text-steel-600 text-sm">Your request for <strong>{item?.name}</strong> has been submitted. An administrator will review it shortly.</p>
            <button onClick={handleClose} className="btn-primary mx-auto">Done</button>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-navy-50 border border-navy-200 rounded-sm">
                <p className="font-sans text-xs text-navy-500 mb-0.5">Requesting</p>
                <p className="font-serif text-navy-900 font-semibold">{item?.name}</p>
                <p className="font-mono text-xs text-navy-500 mt-0.5">{item?.category}</p>
              </div>
              <div>
                <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Purpose / Project *</label>
                <textarea rows={3} className="input-formal resize-none" placeholder="Describe your project or reason…" value={purpose} onChange={e=>setPurpose(e.target.value)} />
              </div>
              <div>
                <label className="block font-sans text-xs font-semibold text-steel-600 uppercase tracking-wide mb-1.5">Expected Return Date *</label>
                <input type="date" className="input-formal" value={returnDate} min={new Date().toISOString().split('T')[0]} onChange={e=>setReturnDate(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 border-t border-steel-200 bg-steel-50">
              <button onClick={handleClose} className="btn-secondary text-sm px-4 py-2">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting||!purpose.trim()||!returnDate}
                className="btn-primary text-sm px-5 py-2 disabled:opacity-60">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin"/>Submitting…</> : <><Send className="w-4 h-4"/>Submit Request</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Equipment Card ─────────────────────────────────────────
function EquipmentCard({ item, isAdmin, onEdit, onDelete, onStatusChange, onRequest }) {
  const [showStatus, setShowStatus] = useState(false)
  return (
    <article className="card-formal overflow-hidden flex flex-col">
      <div className="h-44 bg-gradient-to-br from-steel-100 to-steel-200 flex items-center justify-center border-b border-steel-200 relative overflow-hidden">
        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-12 h-12 text-steel-300" />}
        <div className="absolute top-3 left-3"><StatusBadge status={item.status} /></div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="font-mono text-xs text-steel-400 mb-1">{item.category}</p>
          <h3 className="font-serif text-base font-bold text-navy-900 leading-snug">{item.name}</h3>
          {item.serialNumber && <p className="font-mono text-xs text-steel-400 mt-1">S/N: {item.serialNumber}</p>}
          {item.description  && <p className="font-sans text-steel-600 text-xs leading-relaxed mt-2 line-clamp-2">{item.description}</p>}
          {item.location     && <p className="font-sans text-xs text-steel-400 mt-2">📍 {item.location}</p>}
          <p className="font-mono text-xs text-steel-500 mt-3">Qty: <strong className="text-steel-700">{item.quantity}</strong></p>
        </div>

        <div className="mt-4 pt-3 border-t border-steel-100 flex gap-2">
          {isAdmin ? (
            <>
              <div className="relative flex-1">
                <button onClick={()=>setShowStatus(!showStatus)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-sans font-medium border border-steel-300 rounded-sm hover:border-navy-400 transition-colors">
                  Status <ChevronDown className="w-3 h-3" />
                </button>
                {showStatus && (
                  <>
                    <div className="absolute left-0 bottom-full mb-1 w-48 bg-white border border-steel-200 rounded-sm shadow-lg z-20 py-1">
                      {STATUSES.map(s=>(
                        <button key={s} onClick={()=>{onStatusChange(item.id,s);setShowStatus(false)}}
                          className={`w-full text-left px-3 py-2 font-sans text-xs hover:bg-steel-50 transition-colors ${item.status===s?'text-navy-700 font-semibold':'text-steel-700'}`}>
                          {s} {item.status===s&&'✓'}
                        </button>
                      ))}
                    </div>
                    <div className="fixed inset-0 z-10" onClick={()=>setShowStatus(false)} />
                  </>
                )}
              </div>
              <button onClick={()=>onEdit(item)} className="px-3 py-1.5 text-xs border border-steel-300 rounded-sm hover:border-navy-400 hover:text-navy-700 transition-colors" title="Edit">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={()=>onDelete(item)} className="px-3 py-1.5 text-xs border border-red-200 text-red-400 rounded-sm hover:border-red-400 hover:text-red-600 transition-colors" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button onClick={()=>item.status==='Available'&&onRequest(item)} disabled={item.status!=='Available'}
              className={`w-full py-2 text-xs font-sans font-semibold rounded-sm border transition-all
                          ${item.status==='Available'?'bg-navy-700 text-white border-navy-700 hover:bg-navy-800':'bg-steel-100 text-steel-400 border-steel-200 cursor-not-allowed'}`}>
              {item.status==='Available'?'Request Item':'Unavailable'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function EquipmentPortalPage() {
  const { currentUser, isAdmin } = useAuth()
  const [equipment,    setEquipment]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterCat,    setFilterCat]    = useState('All')
  const [showAdd,      setShowAdd]      = useState(false)
  const [editItem,     setEditItem]     = useState(null)
  const [checkoutItem, setCheckoutItem] = useState(null)
  const [delConfirm,   setDelConfirm]   = useState(null)

  useEffect(() => {
    const sub = subscribeToEquipment(items => { setEquipment(items); setLoading(false) })
    return () => { try { sub?.unsubscribe() } catch(e){} }
  }, [])

  const filtered = equipment.filter(item => {
    const ms = item.name.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase())
    const mst = filterStatus==='All' || item.status===filterStatus
    const mct = filterCat==='All'    || item.category===filterCat
    return ms && mst && mct
  })

  const handleSave = async (formData, imageFile, onProgress, itemId) => {
    const payload = { ...formData, addedBy:currentUser.uid, addedByName:currentUser.displayName }
    if (itemId) await updateEquipmentItem(itemId, payload)
    else        await addEquipmentItem(payload, imageFile, onProgress)
  }

  const counts = {
    total:       equipment.length,
    available:   equipment.filter(i=>i.status==='Available').length,
    inUse:       equipment.filter(i=>i.status==='In Use').length,
    maintenance: equipment.filter(i=>i.status==='Under Maintenance').length,
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 border-b border-navy-800">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="section-wrapper py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-navy-800 border border-navy-600 rounded-sm flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-navy-400 text-xs tracking-widest uppercase">Members Portal</p>
                  <span className={`px-2 py-0.5 rounded-sm text-xs font-mono ${isAdmin?'bg-gold-500/20 text-gold-300 border border-gold-500/30':'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                    <Shield className="inline w-2.5 h-2.5 mr-1" />{isAdmin?'Administrator':'Member'}
                  </span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-white">Equipment Portal</h1>
                <p className="font-sans text-navy-400 text-sm mt-1">
                  {isAdmin ? 'Manage the club equipment inventory — add items, update status, approve requests.' : 'Browse the catalog and submit checkout requests for your projects.'}
                </p>
              </div>
            </div>
            {isAdmin && (
              <button onClick={()=>{setEditItem(null);setShowAdd(true)}} className="btn-gold flex-shrink-0">
                <Plus className="w-4 h-4" /> Add Equipment
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="section-wrapper py-8 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {label:'Total Items',  value:counts.total,       icon:Package,      color:'navy'},
            {label:'Available',    value:counts.available,   icon:CheckCircle,  color:'emerald'},
            {label:'In Use',       value:counts.inUse,       icon:Clock,        color:'blue'},
            {label:'Maintenance',  value:counts.maintenance, icon:Wrench,       color:'red'},
          ].map(({label,value,icon:Icon,color})=>(
            <div key={label} className="card-formal p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 bg-${color}-50 border border-${color}-200`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-navy-900">{value}</p>
                <p className="font-sans text-steel-500 text-xs">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
            <input className="input-formal pl-9" placeholder="Search equipment…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select className="input-formal sm:w-44" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select className="input-formal sm:w-56" value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-navy-500" />
            <p className="font-sans text-steel-400 text-sm">Loading equipment catalog…</p>
          </div>
        ) : filtered.length===0 ? (
          <div className="py-20 text-center">
            <Package className="w-12 h-12 text-steel-300 mx-auto mb-4" />
            <p className="font-serif text-xl text-steel-500 mb-2">
              {equipment.length===0 ? 'No equipment added yet.' : 'No items match your filters.'}
            </p>
            {isAdmin && equipment.length===0 && <p className="font-sans text-steel-400 text-sm">Click "Add Equipment" to add the first item.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item=>(
              <EquipmentCard key={item.id} item={item} isAdmin={isAdmin}
                onEdit={i=>{setEditItem(i);setShowAdd(true)}}
                onDelete={i=>setDelConfirm(i)}
                onStatusChange={updateEquipmentStatus}
                onRequest={i=>setCheckoutItem(i)} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <EquipmentFormModal isOpen={showAdd} onClose={()=>{setShowAdd(false);setEditItem(null)}} onSave={handleSave} editItem={editItem} />
      <CheckoutModal isOpen={!!checkoutItem} onClose={()=>setCheckoutItem(null)} item={checkoutItem} currentUser={currentUser} />

      {delConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-sm border border-steel-200 shadow-2xl max-w-sm w-full p-6 space-y-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-lg font-bold text-navy-900">Confirm Deletion</h4>
                <p className="font-sans text-steel-600 text-sm mt-1">Permanently delete <strong>{delConfirm.name}</strong>? This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={()=>setDelConfirm(null)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
              <button onClick={async()=>{await deleteEquipmentItem(delConfirm.id,delConfirm.imageUrl);setDelConfirm(null)}}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-sm hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
