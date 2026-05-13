const mongoose = require('mongoose');

// ─── Sub-Schemas ─────────────────────────────────────────────────────────────

// A single photo-section inside a service page (e.g. "Indoor Shoot (Studio)")
const photoSectionSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  images: [{ type: String }]
}, { _id: false });

// A pricing package inside a pricing detail page
const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  features: [{ type: String }],
  price: { type: String, default: '' }
}, { _id: false });

// A pricing add-on
const addOnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, default: '' }
}, { _id: false });

// A stat box in the WhyChooseUs / banner section
const statSchema = new mongoose.Schema({
  id: { type: Number },
  number: { type: String, default: '' },
  label: { type: String, default: '' }
}, { _id: false });

// A service card shown on the home page services carousel
const serviceItemSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, default: '' },
  image: { type: String, default: '' }  // URL
}, { _id: false });

// A best-shot item on the home page gallery grid
const bestShotItemSchema = new mongoose.Schema({
  id: { type: Number },
  image: { type: String, default: '' }  // URL
}, { _id: false });

// A pricing card shown on the pricing listing page
const pricingCardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: '' },
  cardImage: { type: String, default: '' }  // URL
}, { _id: false });

// ─── Main Schema ──────────────────────────────────────────────────────────────

const sectionDataSchema = new mongoose.Schema({

  page: {
    type: String,
    required: true,
    enum: ['home', 'pricing', 'service', 'about', 'other'],
  },

  /**
   * section key tells us which section of a page this document describes.
   *
   * HOME PAGE sections:
   *   'hero'           – banner image, title, subtitle, hashtag
   *   'services'       – title + service cards list
   *   'best-shots'     – title + photo URLs
   *   'why-choose-us'  – title, stats, about block (title1/text1/title2/text2/image)
   *
   * PRICING PAGE sections:
   *   'pricing-list'   – list of pricing category cards
   *   '<id>'           – full detail for one pricing category
   *                      e.g. 'baby-photography', 'maternity-photography'
   *
   * SERVICE PAGE sections:
   *   '<id>'           – full detail for one service
   *                      e.g. 'maternity-photography', 'baby-photography'
   */
  section: {
    type: String,
    required: true,
  },

  // ── Universal text fields ─────────────────────────────────────────────────
  title:       { type: String, default: '' },
  subtitle:    { type: String, default: '' },
  description: { type: String, default: '' },

  // ── Banner / Hero image ───────────────────────────────────────────────────
  banner:           { type: String, default: '' },  // desktop banner URL
  mobileBanner:     { type: String, default: '' },  // mobile banner URL
  hashtag:          { type: String, default: '' },  // e.g. #Weddingshoot

  // ── Photos (generic) ─────────────────────────────────────────────────────
  photos: [{ type: String }],   // generic photo URL array

  // ── HOME – services carousel ──────────────────────────────────────────────
  serviceItems: [serviceItemSchema],

  // ── HOME – best shots grid ────────────────────────────────────────────────
  bestShotItems: [bestShotItemSchema],

  // ── HOME – why choose us ──────────────────────────────────────────────────
  stats: [statSchema],
  about: {
    title1: { type: String, default: '' },
    text1:  { type: String, default: '' },
    title2: { type: String, default: '' },
    text2:  { type: String, default: '' },
    image:  { type: String, default: '' }  // founder photo URL
  },

  // ── SERVICE DETAIL ────────────────────────────────────────────────────────
  heroImage:  { type: String, default: '' },
  breadcrumb: { type: String, default: '' },
  sections:   [photoSectionSchema],   // photo sections with title + images

  // ── PRICING LIST ──────────────────────────────────────────────────────────
  pricingCards: [pricingCardSchema],

  // ── PRICING DETAIL ────────────────────────────────────────────────────────
  packages: [packageSchema],
  addOns:   [addOnSchema],
  notes:    [{ type: String }],

  // ── Catch-all extra ───────────────────────────────────────────────────────
  extra: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }

}, { timestamps: true });

// Unique index so each (page + section) pair maps to exactly one document
sectionDataSchema.index({ page: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('SectionData', sectionDataSchema);
