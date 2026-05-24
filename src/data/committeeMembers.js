/**
 * Committee member data.
 * Replace placeholder names/roles with real information.
 * Place photos in /public/committee/ and set photo: '/committee/name.jpg'
 */

export const COMMITTEE_MEMBERS = [
  // ── Faculty Advisors ─────────────────────────────────────
  {
    id: 'cm-011', name: 'Prof. Dr. [Faculty Advisor Name]', role: 'Faculty Advisor',
    department: 'Department of Aerospace Engineering', year: 'Associate Professor',
    email: null, photo: null, category: 'Faculty Advisors',
  },
  {
    id: 'cm-012', name: 'Asst. Prof. [Faculty Name]', role: 'Technical Faculty Mentor',
    department: 'Department of Electronics Engineering', year: 'Assistant Professor',
    email: null, photo: null, category: 'Faculty Advisors',
  },

  // ── Executive Board ───────────────────────────────────────
  {
    id: 'cm-001', name: 'Er. [President Name]', role: 'President',
    department: 'Aerospace Engineering', year: 'IV Year',
    email: 'president@pcampus.edu.np', photo: null, category: 'Executive Board',
  },
  {
    id: 'cm-002', name: 'Er. [Vice President Name]', role: 'Vice President',
    department: 'Aerospace Engineering', year: 'IV Year',
    email: 'vicepresident@pcampus.edu.np', photo: null, category: 'Executive Board',
  },
  {
    id: 'cm-003', name: 'Er. [Secretary Name]', role: 'General Secretary',
    department: 'Electronics Engineering', year: 'III Year',
    email: null, photo: null, category: 'Executive Board',
  },
  {
    id: 'cm-004', name: 'Er. [Treasurer Name]', role: 'Treasurer',
    department: 'Aerospace Engineering', year: 'III Year',
    email: null, photo: null, category: 'Executive Board',
  },

  // ── Technical Division ────────────────────────────────────
  {
    id: 'cm-005', name: 'Er. [Tech Lead Name]', role: 'Technical Lead — Fixed Wing',
    department: 'Aerospace Engineering', year: 'IV Year',
    email: null, photo: null, category: 'Technical Division',
  },
  {
    id: 'cm-006', name: 'Er. [Tech Lead Name]', role: 'Technical Lead — Rotary Wing',
    department: 'Mechanical Engineering', year: 'III Year',
    email: null, photo: null, category: 'Technical Division',
  },
  {
    id: 'cm-007', name: 'Er. [Avionics Name]', role: 'Avionics & Systems Lead',
    department: 'Electronics Engineering', year: 'III Year',
    email: null, photo: null, category: 'Technical Division',
  },

  // ── Operations ────────────────────────────────────────────
  {
    id: 'cm-008', name: 'Er. [Equipment Manager Name]', role: 'Equipment & Inventory Manager',
    department: 'Aerospace Engineering', year: 'III Year',
    email: 'equipment.manager@pcampus.edu.np', photo: null, category: 'Operations',
  },
  {
    id: 'cm-009', name: 'Er. [Safety Officer Name]', role: 'Safety & Compliance Officer',
    department: 'Aerospace Engineering', year: 'IV Year',
    email: null, photo: null, category: 'Operations',
  },
  {
    id: 'cm-010', name: 'Er. [Events Coordinator Name]', role: 'Events & Outreach Coordinator',
    department: 'Civil Engineering', year: 'II Year',
    email: null, photo: null, category: 'Operations',
  },
]

export function getMembersByCategory() {
  return COMMITTEE_MEMBERS.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = []
    acc[m.category].push(m)
    return acc
  }, {})
}
