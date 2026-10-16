/**
 * announcementsStorage.js
 * Persists campus announcements in localStorage.
 * Admin writes → students read.
 */

const STORAGE_KEY = 'nextcampus_announcements';
export const ANNOUNCEMENT_UPDATE_EVENT = 'nextcampus_announcements_updated';

function notifyUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ANNOUNCEMENT_UPDATE_EVENT));
  }
}

const SEED_ANNOUNCEMENTS = [
  {
    id: 'ann-seed-1',
    title: 'Mid-Semester Examinations — Official Schedule Released',
    body: 'The mid-semester examination timetable for all B.Tech, M.Tech, and BCA departments has been published. Hall tickets and seating allotments will be accessible on your student portal 48 hours prior to each session. Ensure university RFID badges are presented at entrance points.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    type: 'pinned',
    expiresAt: null,
    pinned: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Academic Controller Office',
    category: 'academic',
  },
  {
    id: 'ann-seed-2',
    title: 'Campus High-Speed Wi-Fi Upgrade — Scheduled Maintenance Tonight',
    body: 'Network Infrastructure team is upgrading the primary Wi-Fi 7 backbone and core switches across Block A, B, and the Central Library tonight from 11:30 PM to 3:30 AM. Expect temporary 10-15 minute connectivity interruptions during router reconfiguration.',
    imageUrl: null,
    type: 'timed',
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    pinned: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdBy: 'IT Infrastructure Division',
    category: 'facility',
  },
  {
    id: 'ann-seed-3',
    title: 'Annual Tech & Cultural Conclave 2026 — Project Submissions Open',
    body: 'Registrations and project proposals are now open for the Annual University Innovation Hackathon and Cultural Fest. Teams can register up to 4 members. Over ₹2.5 Lakhs in seed grants and fellowship prizes await top prototypes.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    type: 'permanent',
    expiresAt: null,
    pinned: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Dean of Student Affairs',
    category: 'event',
  },
];

export function getAnnouncements(includeExpired = false) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ANNOUNCEMENTS));
      return SEED_ANNOUNCEMENTS;
    }
    const all = JSON.parse(raw);
    const now = new Date();
    const filtered = includeExpired
      ? all
      : all.filter((a) => {
          if (a.type === 'timed' && a.expiresAt) {
            return new Date(a.expiresAt) > now;
          }
          return true;
        });

    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } catch {
    return SEED_ANNOUNCEMENTS;
  }
}

export function saveAnnouncement(announcement) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : SEED_ANNOUNCEMENTS;
    const existsIndex = all.findIndex((a) => a.id === announcement.id);
    let updated;
    if (existsIndex >= 0) {
      updated = [...all];
      updated[existsIndex] = announcement;
    } else {
      updated = [announcement, ...all];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyUpdate();
    return updated;
  } catch {
    return [];
  }
}

export function deleteAnnouncement(id) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : SEED_ANNOUNCEMENTS;
    const updated = all.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyUpdate();
    return updated;
  } catch {
    return [];
  }
}

export function togglePinAnnouncement(id) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : SEED_ANNOUNCEMENTS;
    const updated = all.map((a) =>
      a.id === id ? { ...a, pinned: !a.pinned } : a
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyUpdate();
    return updated;
  } catch {
    return [];
  }
}

export function generateAnnouncementId() {
  return 'ann-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}
