'use client';

import { useState, useCallback } from 'react';
import { SectionDoc, updateSection, deleteSection } from '@/lib/api';
import { useToast } from './Toast';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';

interface Props {
  data: SectionDoc;
  page: string;
  section: string;
}

// ─── Small reusable atoms ─────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

// ─── Multi-image uploader ─────────────────────────────────────────────────────
function MultiImageUploader({
  images, onChange, folder,
}: { images: string[]; onChange: (imgs: string[]) => void; folder?: string }) {
  const addBlank = () => onChange([...images, '']);
  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));
  const update = (i: number, url: string) => {
    const next = [...images]; next[i] = url; onChange(next);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {images.map((img, i) => (
        <div key={i} style={{ position: 'relative' }}>
          <ImageUploader value={img} onChange={(url) => update(i, url)} folder={folder} />
          <button
            className="btn btn-danger btn-sm btn-icon"
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
            onClick={() => remove(i)}
          >✕</button>
        </div>
      ))}
      <button className="add-btn" onClick={addBlank}>+ Add Image Asset</button>
    </div>
  );
}

// ─── Array editors ───────────────────────────────────────────────────────────
function ServiceItemEditor({
  items, onChange,
}: {
  items: { id: number; title: string; image: string }[];
  onChange: (items: { id: number; title: string; image: string }[]) => void;
}) {
  const add = () => onChange([...items, { id: Date.now(), title: '', image: '' }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: string) => {
    const next = [...items];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };
  return (
    <div className="card">
      <div className="card-title">Service Carousel Items</div>
      <div className="visual-grid">
        {items.map((item, i) => (
          <div key={i} className="nested-card visual-grid-item">
            <div className="nested-card-header">
              <span>Item {i + 1}: {item.title || 'Untitled'}</span>
              <button className="btn btn-danger btn-sm" onClick={() => remove(i)}>✕</button>
            </div>
            <TextInput label="Service Title" value={item.title} onChange={(val) => update(i, 'title', val)} />
            <ImageUploader label="Service Image" value={item.image} onChange={(url) => update(i, 'image', url)} folder="kairos/services" />
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={add}>+ Add Service Entry</button>
    </div>
  );
}

function BestShotEditor({
  items, onChange,
}: {
  items: { id: number; image: string }[];
  onChange: (items: { id: number; image: string }[]) => void;
}) {
  const add = () => onChange([...items, { id: Date.now(), image: '' }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) => {
    const next = [...items];
    next[i] = { ...next[i], image: val };
    onChange(next);
  };
  return (
    <div className="card">
      <div className="card-title">Gallery Collection</div>
      <div className="visual-grid">
        {items.map((item, i) => (
          <div key={i} style={{ position: 'relative' }} className="visual-grid-item">
            <ImageUploader label={`Photo Asset ${i + 1}`} value={item.image} onChange={(url) => update(i, url)} folder="kairos/best-shots" />
            <button
              className="btn btn-danger btn-sm btn-icon"
              style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
              onClick={() => remove(i)}
            >✕</button>
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={add}>+ Add Photo to Gallery</button>
    </div>
  );
}

function StatsEditor({
  stats, onChange,
}: {
  stats: { id: number; number: string; label: string }[];
  onChange: (s: { id: number; number: string; label: string }[]) => void;
}) {
  const add = () => onChange([...stats, { id: Date.now(), number: '', label: '' }]);
  const remove = (i: number) => onChange(stats.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: string) => {
    const next = [...stats];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };
  return (
    <div className="card">
      <div className="card-title">Success Indicators (Stats)</div>
      <div className="array-editor">
        {stats.map((s, i) => (
          <div key={i} className="array-item">
            <div className="array-item-num">{i + 1}</div>
            <div className="array-item-fields">
              <input 
                placeholder="Value (e.g. 200+)" 
                value={s.number} 
                onChange={(e) => update(i, 'number', e.target.value)} 
              />
              <input 
                placeholder="Description / Label" 
                value={s.label} 
                onChange={(e) => update(i, 'label', e.target.value)} 
              />
            </div>
            <button className="btn btn-danger btn-icon btn-sm" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={add}>
        <span>+</span> Add Success Indicator Card
      </button>
    </div>
  );
}

function PricingCardsEditor({
  cards, onChange,
}: {
  cards: { id: string; title: string; cardImage: string }[];
  onChange: (c: { id: string; title: string; cardImage: string }[]) => void;
}) {
  const add = () => onChange([...cards, { id: '', title: '', cardImage: '' }]);
  const remove = (i: number) => onChange(cards.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: string) => {
    const next = [...cards];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };
  return (
    <div className="card">
      <div className="card-title">Category Navigation Cards</div>
      <div className="visual-grid">
        {cards.map((c, i) => (
          <div key={i} className="nested-card visual-grid-item">
            <div className="nested-card-header">
              <span>Card {i + 1}: {c.title || 'New Category'}</span>
              <button className="btn btn-danger btn-sm" onClick={() => remove(i)}>✕</button>
            </div>
            <div className="field-grid">
              <TextInput label="Slug / ID" value={c.id} onChange={(v) => update(i, 'id', v)} />
              <TextInput label="Display Title" value={c.title} onChange={(v) => update(i, 'title', v)} />
            </div>
            <ImageUploader label="Preview Image" value={c.cardImage} onChange={(url) => update(i, 'cardImage', url)} folder="kairos/pricing" />
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={add}>+ Add New Category</button>
    </div>
  );
}

function PackagesEditor({
  packages, onChange,
}: {
  packages: { name: string; features: string[]; price: string }[];
  onChange: (p: { name: string; features: string[]; price: string }[]) => void;
}) {
  const add = () => onChange([...packages, { name: '', features: [], price: '' }]);
  const remove = (i: number) => onChange(packages.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: string | string[]) => {
    const next = [...packages];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };
  return (
    <div className="card">
      <div className="card-title">Available Packages</div>
      <div className="visual-grid">
        {packages.map((pkg, i) => (
          <div key={i} className="nested-card visual-grid-item">
            <div className="nested-card-header">
              <span>Package {i + 1}: {pkg.name || 'Unnamed'}</span>
              <button className="btn btn-danger btn-sm" onClick={() => remove(i)}>✕</button>
            </div>
            <div className="field-grid">
              <TextInput label="Name" value={pkg.name} onChange={(v) => update(i, 'name', v)} />
              <TextInput label="Price" value={pkg.price} onChange={(v) => update(i, 'price', v)} />
            </div>
            <TextArea label="Features (New line for each)" value={pkg.features.join('\n')} onChange={(v) => update(i, 'features', v.split('\n').filter(Boolean))} />
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={add}>+ Add Service Package</button>
    </div>
  );
}

function AddOnsEditor({
  addOns, onChange,
}: {
  addOns: { name: string; price: string }[];
  onChange: (a: { name: string; price: string }[]) => void;
}) {
  const add = () => onChange([...addOns, { name: '', price: '' }]);
  const remove = (i: number) => onChange(addOns.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: string) => {
    const next = [...addOns];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };
  return (
    <div className="card">
      <div className="card-title">Add-Ons & Supplements</div>
      <div className="array-editor">
        {addOns.map((a, i) => (
          <div key={i} className="array-item">
            <span className="array-item-num">{i + 1}</span>
            <div className="array-item-fields">
              <input 
                placeholder="Service Option Title" 
                value={a.name} 
                onChange={(e) => update(i, 'name', e.target.value)} 
              />
              <input 
                placeholder="Price (e.g. ₹2,000)" 
                value={a.price} 
                onChange={(e) => update(i, 'price', e.target.value)} 
              />
            </div>
            <button className="btn btn-danger btn-icon btn-sm" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={add}>
        <span>+</span> Add Supplemental Option
      </button>
    </div>
  );
}

function NotesEditor({ notes, onChange }: { notes: string[]; onChange: (n: string[]) => void }) {
  const add = () => onChange([...notes, '']);
  const remove = (i: number) => onChange(notes.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) => {
    const next = [...notes];
    next[i] = val;
    onChange(next);
  };
  return (
    <div className="card">
      <div className="card-title">Important Guidelines & Notes</div>
      <div className="array-editor">
        {notes.map((n, i) => (
          <div key={i} className="array-item">
            <span className="array-item-num">{i + 1}</span>
            <div className="array-item-fields" style={{ gridTemplateColumns: '1fr' }}>
              <textarea 
                rows={2} 
                placeholder="Enter guideline or descriptive note..."
                value={n} 
                onChange={(e) => update(i, e.target.value)} 
              />
            </div>
            <button className="btn btn-danger btn-icon btn-sm" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={add}>
        <span>+</span> Add New Guideline
      </button>
    </div>
  );
}

function PhotoSectionsEditorWithUpload({
  sections, onChange,
}: {
  sections: { title: string; images: string[] }[];
  onChange: (s: { title: string; images: string[] }[]) => void;
}) {
  const add = () => onChange([...sections, { title: '', images: [] }]);
  const remove = (i: number) => onChange(sections.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: string | string[]) => {
    const next = [...sections];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };
  return (
    <div className="card">
      <div className="card-title">Content Sections / Galleries</div>
      <div className="visual-grid">
        {sections.map((sec, i) => (
          <div key={i} className="nested-card visual-grid-item">
            <div className="nested-card-header">
              <span>Gallery {i + 1}: {sec.title || 'New Section'}</span>
              <button className="btn btn-danger btn-sm" onClick={() => remove(i)}>✕</button>
            </div>
            <TextInput label="Galleries Title" value={sec.title} onChange={(v) => update(i, 'title', v)} />
            <div className="field">
              <label>Gallery Assets ({sec.images.length} photos)</label>
              <MultiImageUploader
                images={sec.images}
                onChange={(imgs) => update(i, 'images', imgs)}
                folder="kairos/gallery"
              />
            </div>
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={add}>+ Add New Gallery Section</button>
    </div>
  );
}

// ─── MAIN EDITOR ──────────────────────────────────────────────────────────────
export default function SectionEditor({ data: initial, page, section }: Props) {
  const [data, setData] = useState<SectionDoc>(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const set = useCallback(<K extends keyof SectionDoc>(key: K, val: SectionDoc[K]) => {
    setData((prev) => ({ ...prev, [key]: val }));
  }, []);

  const setAbout = useCallback((key: string, val: string) => {
    setData((prev) => ({
      ...prev,
      about: { title1: '', text1: '', title2: '', text2: '', image: '', ...prev.about, [key]: val },
    }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, page: _p, section: _s, createdAt, updatedAt, __v, ...payload } = data as SectionDoc & { __v?: number };
      const updated = await updateSection(page, section, payload);
      setData(updated);
      toast('✨ Changes synchronized successfully!', 'success');
    } catch (e) {
      toast(`❌ Synchronization failed: ${(e as Error).message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently remove section "${section}" from page "${page}"?`)) return;
    setDeleting(true);
    try {
      await deleteSection(page, section);
      toast('🗑 Section removed.', 'success');
      router.push('/');
    } catch (e) {
      toast(`❌ Removal failed: ${(e as Error).message}`, 'error');
      setDeleting(false);
    }
  };

  return (
    <div className="editor-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h2>{decodeURIComponent(section).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h2>
          <div className="breadcrumb">
            <span>Admin</span>
            <span className="sep">/</span>
            <span>{page}</span>
            <span className="sep">/</span>
            <span className="active">{decodeURIComponent(section)}</span>
          </div>
        </div>

        {data.updatedAt && (
          <div className="meta" suppressHydrationWarning>
            Sync: {new Date(data.updatedAt).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        )}
      </div>

      {/* ── BASIC INFO ───────────────────────────────── */}
      <div className="card">
        <div className="card-title">Core Content</div>
        <TextInput label="Main Title" value={data.title || ''} onChange={(v) => set('title', v)} />
        {(section === 'hero' || (page === 'pricing' && section !== 'pricing-list')) && (
          <TextInput label="Sub-heading" value={data.subtitle || ''} onChange={(v) => set('subtitle', v)} />
        )}
        {((page === 'pricing' && section !== 'pricing-list') || page === 'service') && (
          <TextArea label="Long Description" value={data.description || ''} onChange={(v) => set('description', v)} />
        )}
        {section === 'hero' && (
          <TextInput label="Social Tagline / Hashtag" value={data.hashtag || ''} onChange={(v) => set('hashtag', v)} />
        )}
      </div>

      {/* ── BANNER / HERO ─────────────────────────────── */}
      {(section === 'hero' || (page === 'pricing' && section !== 'pricing-list') || page === 'service') && (
        <div className="card">
          <div className="card-title">Media Assets</div>
          {section === 'hero' && (
            <div className="field-grid">
              <ImageUploader label="Desktop Banner" value={data.banner || ''} onChange={(v) => set('banner', v)} folder="kairos/banners" />
              <ImageUploader label="Mobile Responsive Banner" value={data.mobileBanner || ''} onChange={(v) => set('mobileBanner', v)} folder="kairos/banners" />
            </div>
          )}
          {((page === 'pricing' && section !== 'pricing-list') || page === 'service') && (
            <ImageUploader label="Featured Hero Image" value={data.heroImage || ''} onChange={(v) => set('heroImage', v)} folder="kairos/heroes" />
          )}
          {page === 'service' && (
            <TextInput label="Custom Breadcrumb Label" value={data.breadcrumb || ''} onChange={(v) => set('breadcrumb', v)} />
          )}
        </div>
      )}

      {/* ── SERVICE ITEMS ─────────────────────────────── */}
      {section === 'services' && (
        <ServiceItemEditor items={data.serviceItems || []} onChange={(v) => set('serviceItems', v)} />
      )}

      {/* ── BEST SHOT ITEMS ───────────────────────────── */}
      {section === 'best-shots' && (
        <BestShotEditor items={data.bestShotItems || []} onChange={(v) => set('bestShotItems', v)} />
      )}

      {/* ── STATS ─────────────────────────────────────── */}
      {section === 'why-choose-us' && (
        <StatsEditor stats={data.stats || []} onChange={(v) => set('stats', v)} />
      )}

      {/* ── ABOUT ─────────────────────────────────────── */}
      {section === 'why-choose-us' && (
        <div className="card">
          <div className="card-title">Detailed About Content</div>
          <div className="field-grid">
            <TextInput label="Primary Heading" value={data.about?.title1 || ''} onChange={(v) => setAbout('title1', v)} />
            <TextInput label="Secondary Heading" value={data.about?.title2 || ''} onChange={(v) => setAbout('title2', v)} />
          </div>
          <TextArea label="Primary Narrative" value={data.about?.text1 || ''} onChange={(v) => setAbout('text1', v)} />
          <TextArea label="Secondary Narrative" value={data.about?.text2 || ''} onChange={(v) => setAbout('text2', v)} />
          <ImageUploader label="Identity Profile Photo" value={data.about?.image || ''} onChange={(v) => setAbout('image', v)} folder="kairos/about" />
        </div>
      )}

      {/* ── PRICING CARDS ────────────────────────────── */}
      {section === 'pricing-list' && (
        <PricingCardsEditor cards={data.pricingCards || []} onChange={(v) => set('pricingCards', v)} />
      )}

      {/* ── PACKAGES ──────────────────────────────────── */}
      {page === 'pricing' && section !== 'pricing-list' && (
        <PackagesEditor packages={data.packages || []} onChange={(v) => set('packages', v)} />
      )}

      {/* ── ADD-ONS ───────────────────────────────────── */}
      {page === 'pricing' && section !== 'pricing-list' && (
        <AddOnsEditor addOns={data.addOns || []} onChange={(v) => set('addOns', v)} />
      )}

      {/* ── NOTES ─────────────────────────────────────── */}
      {page === 'pricing' && section !== 'pricing-list' && (
        <NotesEditor notes={data.notes || []} onChange={(v) => set('notes', v)} />
      )}

      {/* ── PHOTO SECTIONS ────────────────────────────── */}
      {page === 'service' && (
        <PhotoSectionsEditorWithUpload sections={data.sections || []} onChange={(v) => set('sections', v)} />
      )}

      {/* ── ACTIONS ───────────────────────────────────── */}
      <div className="actions-bar">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? '⏳ Synchronizing...' : '🚀 Push Changes'}
        </button>
        <button className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={handleDelete} disabled={deleting}>
          {deleting ? '⏳ Removing...' : '🗑 Remove Section'}
        </button>
      </div>
    </div>
  );
}
