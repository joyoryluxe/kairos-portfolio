// src/lib/api.ts  – All API calls to the Express backend

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // In production/remote environments, use the Render production backend URL
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('192.168.')) {
      return 'https://kairos-portfolio-xsdp.onrender.com';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

export const API_URL = getApiUrl();

export interface SectionDoc {
  _id?: string;
  page: string;
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  banner?: string;
  mobileBanner?: string;
  hashtag?: string;
  heroImage?: string;
  breadcrumb?: string;
  photos?: string[];
  serviceItems?: { id: number; title: string; image: string; description?: string }[];
  bestShotItems?: { id: number; image: string }[];
  stats?: { id: number; number: string; label: string }[];
  about?: { title1: string; text1: string; title2: string; text2: string; image: string };
  pricingCards?: { id: string; title: string; cardImage: string }[];
  packages?: { name: string; features: string[]; price: string }[];
  addOns?: { name: string; price: string }[];
  notes?: string[];
  sections?: { title: string; images: string[] }[];
  extra?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export async function getPages(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/sections/pages`);
  const json = await res.json();
  return json.data as string[];
}

export async function getPageSections(page: string): Promise<SectionDoc[]> {
  const res = await fetch(`${API_URL}/api/sections/${page}`);
  const json = await res.json();
  return json.data as SectionDoc[];
}

export async function getSection(page: string, section: string): Promise<SectionDoc> {
  const res = await fetch(`${API_URL}/api/sections/${page}/${section}`);
  if (!res.ok) throw new Error('Section not found');
  const json = await res.json();
  return json.data as SectionDoc;
}

export async function updateSection(page: string, section: string, data: Partial<SectionDoc>): Promise<SectionDoc> {
  const res = await fetch(`${API_URL}/api/sections/${page}/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  const json = await res.json();
  return json.data as SectionDoc;
}

export async function deleteSection(page: string, section: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/sections/${page}/${section}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// ─── Cloudinary Usage ────────────────────────────────────────────────────────

export interface CloudinaryStorageStat {
  usedBytes: number;
  limitBytes: number;
  usedGB: number;
  limitGB: number | null;   // null on Free plan (no hard limit)
  creditsUsage?: number;
  percentage: number;
}

export interface CloudinaryUsage {
  plan: string;
  storage: CloudinaryStorageStat;
  bandwidth: CloudinaryStorageStat;
  transformations: {
    used: number;
    limit: number;
    creditsUsage?: number;
    percentage: number;
  };
  objects: number;
  resources?: number;
  derived?: number;
  requests: number;
  impressions?: number;
  credits: { used: number; limit: number; percent: number };
  fetchedAt: string;
}

/**
 * Fetches real Cloudinary usage data from the backend Admin API route.
 * The API secret is NEVER exposed to the browser — this is backend-only.
 */
export async function getCloudinaryUsage(): Promise<CloudinaryUsage> {
  const res = await fetch(`${API_URL}/api/admin/cloudinary/usage`);
  if (!res.ok) throw new Error('Failed to fetch Cloudinary usage');
  const json = await res.json();
  return json.data as CloudinaryUsage;
}
