/**
 * api.ts  –  Lightweight fetch wrappers for the Kairos backend.
 *
 * BASE_URL is read from the Vite env variable VITE_API_URL.
 * Set it in .env:  VITE_API_URL=http://localhost:5000
 * Falls back to localhost:5000 for local dev.
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

export interface SectionData {
  _id?: string;
  page: string;
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  banner?: string;
  mobileBanner?: string;
  hashtag?: string;
  photos?: string[];
  serviceItems?: { id: number; title: string; image: string }[];
  bestShotItems?: { id: number; image: string }[];
  stats?: { id: number; number: string; label: string }[];
  about?: { title1: string; text1: string; title2: string; text2: string; image: string };
  heroImage?: string;
  breadcrumb?: string;
  sections?: { title: string; images: string[] }[];
  pricingCards?: { id: string; title: string; cardImage: string }[];
  packages?: { name: string; features: string[]; price: string }[];
  addOns?: { name: string; price: string }[];
  notes?: string[];
  extra?: Record<string, unknown>;
}

/** Fetch all sections for a given page */
export async function getPageSections(page: string): Promise<SectionData[]> {
  const res = await fetch(`${BASE_URL}/api/sections/${page}`);
  if (!res.ok) throw new Error(`Failed to fetch page: ${page}`);
  const json = await res.json();
  return json.data as SectionData[];
}

/** Fetch one section for a given page */
export async function getSection(page: string, section: string): Promise<SectionData> {
  const res = await fetch(`${BASE_URL}/api/sections/${page}/${section}`);
  if (!res.ok) throw new Error(`Section not found: ${page}/${section}`);
  const json = await res.json();
  return json.data as SectionData;
}

/** Create or update a section */
export async function upsertSection(data: SectionData): Promise<SectionData> {
  const res = await fetch(`${BASE_URL}/api/sections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save section');
  const json = await res.json();
  return json.data as SectionData;
}
