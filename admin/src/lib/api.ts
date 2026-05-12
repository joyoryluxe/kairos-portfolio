// src/lib/api.ts  – All API calls to the Express backend

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
  serviceItems?: { id: number; title: string; image: string }[];
  bestShotItems?: { id: number; image: string }[];
  stats?: { id: number; number: string; label: string }[];
  about?: { title1: string; text1: string; title2: string; text2: string; image: string };
  pricingCards?: { id: string; title: string; cardImage: string }[];
  packages?: { name: string; features: string[]; price: string }[];
  addOns?: { name: string; price: string }[];
  notes?: string[];
  sections?: { title: string; images: string[] }[];
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
