/**
 * Access control list.
 * Add emails here to grant access without needing the Supabase admins table.
 * ALLOWED_DOMAIN gives every @pcampus.edu.np email member-level access automatically.
 */

export const ADMIN_EMAILS = [
  'president@pcampus.edu.np',
  'vicepresident@pcampus.edu.np',
  'equipment.manager@pcampus.edu.np',
  // Add more admin emails here
]

export const MEMBER_EMAILS = [
  // Add individual member emails here (non-campus domain)
]

// Every email from this domain automatically gets member access
export const ALLOWED_DOMAIN = 'pcampus.edu.np'

export function resolveUserRole(email) {
  if (!email) return 'denied'
  const e = email.trim().toLowerCase()
  if (ADMIN_EMAILS.map(x => x.toLowerCase()).includes(e)) return 'admin'
  if (MEMBER_EMAILS.map(x => x.toLowerCase()).includes(e)) return 'member'
  if (ALLOWED_DOMAIN && e.endsWith(`@${ALLOWED_DOMAIN}`)) return 'member'
  return 'denied'
}
