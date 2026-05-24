/**
 * All Firestore operations — now powered by Supabase.
 * The Equipment Portal page imports from here unchanged.
 *
 * ─── SQL TO RUN IN SUPABASE → SQL EDITOR (once) ─────────────
 *
 * -- Equipment table
 * create table public.equipment (
 *   id            uuid primary key default gen_random_uuid(),
 *   name          text not null,
 *   category      text not null default 'Other',
 *   description   text,
 *   quantity      integer not null default 1,
 *   status        text not null default 'Available',
 *   location      text,
 *   serial_number text,
 *   image_url     text,
 *   added_by      text,
 *   added_by_name text,
 *   created_at    timestamptz default now(),
 *   updated_at    timestamptz default now()
 * );
 * alter table public.equipment enable row level security;
 * create policy "members read" on public.equipment for select using (auth.role()='authenticated');
 * create policy "admins write" on public.equipment for all using (exists(select 1 from public.admins where user_id=auth.uid()));
 *
 * -- Requests table
 * create table public.requests (
 *   id           uuid primary key default gen_random_uuid(),
 *   item_id      uuid references public.equipment(id) on delete set null,
 *   item_name    text not null,
 *   member_id    uuid not null,
 *   member_name  text,
 *   member_email text,
 *   purpose      text not null,
 *   return_date  date not null,
 *   status       text not null default 'Pending',
 *   requested_at timestamptz default now(),
 *   resolved_at  timestamptz,
 *   resolved_by  uuid
 * );
 * alter table public.requests enable row level security;
 * create policy "members create" on public.requests for insert with check (auth.uid()=member_id);
 * create policy "members/admins read" on public.requests for select using (auth.uid()=member_id or exists(select 1 from public.admins where user_id=auth.uid()));
 * create policy "admins update" on public.requests for update using (exists(select 1 from public.admins where user_id=auth.uid()));
 *
 * -- Admins table
 * create table public.admins (
 *   id         uuid primary key default gen_random_uuid(),
 *   user_id    uuid not null unique references auth.users(id) on delete cascade,
 *   granted_at timestamptz default now()
 * );
 * alter table public.admins enable row level security;
 * create policy "admins read" on public.admins for select using (exists(select 1 from public.admins a where a.user_id=auth.uid()));
 * create policy "no api writes" on public.admins for insert with check (false);
 *
 * -- Storage bucket (also create via Dashboard → Storage → New bucket → name: equipment-images, Public: ON)
 * ─────────────────────────────────────────────────────────────
 */

import { supabase } from './config'

const BUCKET = 'equipment-images'

// ── Equipment ─────────────────────────────────────────────

export async function getAllEquipment() {
  const { data, error } = await supabase.from('equipment').select('*').order('name')
  if (error) { console.error(error); return [] }
  // Map snake_case DB columns → camelCase for the UI components
  return data.map(row => ({
    id:           row.id,
    name:         row.name,
    category:     row.category,
    description:  row.description,
    quantity:     row.quantity,
    status:       row.status,
    location:     row.location,
    serialNumber: row.serial_number,
    imageUrl:     row.image_url,
    addedBy:      row.added_by,
    addedByName:  row.added_by_name,
    createdAt:    row.created_at,
  }))
}

export function subscribeToEquipment(callback) {
  getAllEquipment().then(callback)

  const sub = supabase
    .channel('equipment-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, async () => {
      callback(await getAllEquipment())
    })
    .subscribe()

  return sub
}

export async function addEquipmentItem(itemData, imageFile = null, onProgress = null) {
  let imageUrl = null
  if (imageFile) imageUrl = await uploadEquipmentImage(imageFile, onProgress)

  const { data, error } = await supabase.from('equipment').insert([{
    name:          itemData.name,
    category:      itemData.category,
    description:   itemData.description,
    quantity:      Number(itemData.quantity) || 1,
    status:        itemData.status || 'Available',
    location:      itemData.location || '',
    serial_number: itemData.serialNumber || '',
    image_url:     imageUrl,
    added_by:      itemData.addedBy,
    added_by_name: itemData.addedByName,
  }]).select().single()

  if (error) { console.error(error); return null }
  return data.id
}

export async function updateEquipmentItem(itemId, updates) {
  const db = {}
  if (updates.name         !== undefined) db.name          = updates.name
  if (updates.category     !== undefined) db.category      = updates.category
  if (updates.description  !== undefined) db.description   = updates.description
  if (updates.quantity     !== undefined) db.quantity      = Number(updates.quantity)
  if (updates.status       !== undefined) db.status        = updates.status
  if (updates.location     !== undefined) db.location      = updates.location
  if (updates.serialNumber !== undefined) db.serial_number = updates.serialNumber
  if (updates.imageUrl     !== undefined) db.image_url     = updates.imageUrl
  db.updated_at = new Date().toISOString()

  const { error } = await supabase.from('equipment').update(db).eq('id', itemId)
  if (error) console.error(error)
}

export async function updateEquipmentStatus(itemId, status) {
  return updateEquipmentItem(itemId, { status })
}

export async function deleteEquipmentItem(itemId, imageUrl = null) {
  if (imageUrl) {
    try {
      const path = imageUrl.split(`/${BUCKET}/`)[1]
      if (path) await supabase.storage.from(BUCKET).remove([path])
    } catch (e) { console.warn(e) }
  }
  const { error } = await supabase.from('equipment').delete().eq('id', itemId)
  if (error) console.error(error)
}

// ── Images ────────────────────────────────────────────────

export function uploadEquipmentImage(file, onProgress = null) {
  return new Promise(async (resolve) => {
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`

    // Simulate progress (Supabase storage doesn't give granular events)
    let p = 0
    const tick = setInterval(() => { p = Math.min(p + 12, 85); if (onProgress) onProgress(p) }, 200)

    const { data, error } = await supabase.storage.from(BUCKET).upload(fileName, file)
    clearInterval(tick)
    if (onProgress) onProgress(100)

    if (error) { console.error(error); resolve(null); return }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    resolve(urlData.publicUrl)
  })
}

// ── Requests ──────────────────────────────────────────────

export async function submitCheckoutRequest(requestData) {
  const { data, error } = await supabase.from('requests').insert([{
    item_id:      requestData.itemId,
    item_name:    requestData.itemName,
    member_id:    requestData.memberId,
    member_name:  requestData.memberName,
    member_email: requestData.memberEmail,
    purpose:      requestData.purpose,
    return_date:  requestData.returnDate,
    status:       'Pending',
  }]).select().single()

  if (error) { console.error(error); return null }
  return data.id
}

export function subscribeToRequests(callback) {
  supabase.from('requests').select('*').order('requested_at', { ascending: false })
    .then(({ data }) => callback(data || []))

  const sub = supabase
    .channel('requests-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, async () => {
      const { data } = await supabase.from('requests').select('*').order('requested_at', { ascending: false })
      callback(data || [])
    })
    .subscribe()

  return sub
}

export async function updateRequestStatus(requestId, status, resolvedByUid) {
  const { error } = await supabase.from('requests').update({
    status, resolved_at: new Date().toISOString(), resolved_by: resolvedByUid,
  }).eq('id', requestId)
  if (error) console.error(error)
}
