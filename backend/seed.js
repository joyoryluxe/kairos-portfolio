/**
 * seed.js  –  Populates MongoDB with all existing frontend JSON data.
 * Run once:  node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const SectionData = require('./models/SectionData');

const MONGO_URI = process.env.MONGO_URI

// ─── Landing / Home page data ─────────────────────────────────────────────────
const homeSeeds = [
  {
    page: 'home',
    section: 'hero',
    title: 'Every Love Story Deserves to Be Remembered',
    subtitle: 'We turn your moments into memories.',
    hashtag: '#Weddingshoot',
    banner: '/hero-bg.webp',
    mobileBanner: '/mobile.webp',
  },
  {
    page: 'home',
    section: 'services',
    title: 'Services',
    serviceItems: [
      { id: 1, title: 'Product Photography', image: '/product1.webp' },
      { id: 2, title: 'Baby Photography', image: '/small1.webp' },
      { id: 3, title: 'Birthdays & Events', image: '/birthday.jpg' },
      { id: 4, title: 'Interior Photography', image: '/interior.jpg' },
      { id: 5, title: 'Events Photography', image: '/small1.webp' },
    ],
  },
  {
    page: 'home',
    section: 'best-shots',
    title: 'Some Among Best Shots',
    bestShotItems: [
      { id: 1, image: '/birthday1.jpg' },
      { id: 2, image: '/interior.jpg' },
      { id: 3, image: '/birthday.jpg' },
      { id: 4, image: '/interior1.jpg' },
      { id: 5, image: '/baby1.jpg' },
      { id: 6, image: '/product1.jpg' },
      { id: 7, image: '/product2.jpg' },
      { id: 8, image: '/baby2.jpg' },
      { id: 9, image: '/product3.jpg' },
      { id: 10, image: '/interior2.jpg' },
      { id: 11, image: '/interior3.jpg' },
      { id: 12, image: '/girl.jpg' },
    ],
  },
  {
    page: 'home',
    section: 'why-choose-us',
    title: 'Why Choose Us',
    stats: [
      { id: 1, number: '12+', label: 'Project Completed' },
      { id: 2, number: '100+', label: 'Happy Customers' },
      { id: 3, number: '20+', label: 'Conversion Rate' },
    ],
    about: {
      title1: 'To the Bump Queen',
      text1: 'Embark on one of the most magical journeys of your life, and let us help you cherish every moment! As parents, we know how quickly time flies—the tiny hands that once held yours, the first smiles that filled your heart, and the cozy moments of cuddling you wish could last forever. Let us preserve these precious memories with professional newborn photography and maternity photography that capture your love, joy, and those unforgettable emotions. Whether you\'re looking for baby photography or a maternity photoshoot, we\'re here to make your experience special and timeless.',
      title2: 'MOMENTS DEFINE THE STORIES..',
      text2: 'As a photographer, my goal is simple yet meaningful: to capture the moments that matter. I aim to create timeless images that preserve love, joy, and connection, leaving a lasting legacy for future generations to cherish. Through every shot, I strive to make a positive impact with every memory I capture.',
      image: '/founder.png',
    },
  },
];

// ─── Pricing list page ────────────────────────────────────────────────────────
const pricingListSeed = {
  page: 'pricing',
  section: 'pricing-list',
  title: 'Pricing',
  pricingCards: [
    { id: 'baby-photography', title: 'Baby Photoshoot', cardImage: '/small1.webp' },
    { id: 'maternity-photography', title: 'Maternity Shoot', cardImage: '/mat1.webp' },
    // { id: 'product-photography',  title: 'Product Photography',    cardImage: '/product1.webp'},
    // { id: 'interior-photography', title: 'Interior Photography',   cardImage: '/interior.webp'},
    // { id: 'birthdays-&-events',   title: 'Birthdays & Events',     cardImage: '/birthday.webp'},
  ],
};

// ─── Pricing detail pages ─────────────────────────────────────────────────────
const pricingDetailSeeds = [
  {
    page: 'pricing',
    section: 'baby-photography',
    title: 'Baby Photoshoot',
    subtitle: 'The Art of Newborn Storytelling',
    heroImage: '/small1.webp',
    description: 'Before they grow, before they change, capture the magic of their first few days. At Kairos Studio, we believe your baby\'s first portrait is more than a photo - it is a legacy.',
    packages: [
      { name: 'ESSENTIAL', features: ['1 Unique Setup', '5 High-Resolution Edited Photos', '30 - 45 Minutes Approx Duration'], price: 'Rs 4500' },
      { name: 'CLASSIC', features: ['2 Unique Setup', '8 High-Resolution Edited Photos', '60 - 70 Minutes Approx Duration'], price: 'Rs 6500' },
      { name: 'COLLECTION', features: ['2 Unique Setup', '12 High-Resolution Edited Photos', '60 - 70 Minutes Approx Duration', '8 X 12 Inch Photo Album'], price: 'Rs 9000' },
      { name: 'SIGNATURE', features: ['2 Unique Setup + Family', '15 High-Resolution Edited Photos', '2.5 Hrs Approx Duration', '8 X 12 Inch Photo Album'], price: 'Rs 11500' },
      { name: 'EXCLUSIVE', features: ['3 Unique Setup + Family + Detailed child close up', '20 High-Resolution Edited Photos', '4 Hrs Approx Duration', '10 X 12 Inch Photo Album'], price: 'Rs 14500' },
      { name: 'LEGACY', features: ['3 Unique Setup + Family + Detailed child close up', '1 Lifestyle Setup', '30 High-Resolution Edited Photos', '4 Hrs Approx Duration', '12 X 14 Inch Photo Album'], price: 'Rs 17000' },
    ],
    addOns: [
      { name: 'Cinematic Reel: A 30-second video', price: 'Rs 2500' },
      { name: 'Extra Person Charge: Include more family members in the frame!', price: 'Rs 500 per person' },
      { name: 'Urgent Delivery: Get your photos in 48 hours', price: 'Rs 2,000' },
      { name: 'Additional Setups: Add an extra theme in any package', price: 'Rs 3,000' },
      { name: 'Add a luxurious dress for the mother, there will be an additional charge', price: 'Rs 2000' },
      { name: 'Premium Edited Photos: Additional high-quality edited images', price: 'Rs 500 per image' },
    ],
    notes: [
      'The best time for a newborn session is between 7 to 45 days after birth.',
      'We use hospital-grade sanitization on all props, fabrics, and surfaces before every session.',
      'Our studio is kept at a cozy temperature (24-28°C) to keep your baby comfortable.',
      'We never rush. We allow plenty of time for feeding, diaper changes, and soothing.',
      'We recommend keeping the baby awake for 1-2 hours before the session.',
      'For family portraits, we suggest wearing solid, neutral tones.',
      'A 50% non-refundable advance is required to secure your slot.',
      'Use of personal cameras or professional outside photographers is not permitted.',
    ],
  },
  {
    page: 'pricing',
    section: 'maternity-photography',
    title: 'Maternity Shoot',
    subtitle: 'Maternity Photoshoot',
    heroImage: '/mat4.webp',
    description: 'Capture the magic of motherhood with our professional maternity photoshoot. Our sessions are designed to make you feel comfortable, beautiful, and empowered.',
    packages: [
      { name: 'ESSENTIAL', features: ['1 Unique Setup', '5 High-Resolution Edited Photos', '30 - 45 Minutes Approx Duration'], price: 'Rs 4500' },
      { name: 'CLASSIC', features: ['2 Unique Setup', '8 High-Resolution Edited Photos', '60 - 70 Minutes Approx Duration'], price: 'Rs 6500' },
      { name: 'COLLECTION', features: ['2 Unique Setup', '12 High-Resolution Edited Photos', '60 - 70 Minutes Approx Duration', '8 X 12 Inch Photo Album'], price: 'Rs 9000' },
      { name: 'SIGNATURE', features: ['2 Unique Setup + Family', '15 High-Resolution Edited Photos', '2.5 Hrs Approx Duration', '8 X 12 Inch Photo Album'], price: 'Rs 11500' },
      { name: 'EXCLUSIVE', features: ['3 Unique Setup + Family + Detailed child close up', '20 High-Resolution Edited Photos', '4 Hrs Approx Duration', '10 X 12 Inch Photo Album'], price: 'Rs 14500' },
      { name: 'LEGACY', features: ['3 Unique Setup + Family + Detailed child close up', '1 Lifestyle Setup', '30 High-Resolution Edited Photos', '4 Hrs Approx Duration', '12 X 14 Inch Photo Album'], price: 'Rs 17000' },
    ],
    addOns: [
      { name: 'Cinematic Reel: A 30-second video', price: 'Rs 2500' },
      { name: 'Extra Person Charge: Include more family members in the frame!', price: 'Rs 500 per person' },
      { name: 'Urgent Delivery: Get your photos in 48 hours', price: 'Rs 2,000' },
      { name: 'Additional Setups: Add an extra theme in any package', price: 'Rs 3,000' },
      { name: 'Add a luxurious dress for the mother', price: 'Rs 2000' },
      { name: 'Premium Edited Photos: Additional high-quality edited images', price: 'Rs 500 per image' },
    ],
    notes: [
      'The best time for a maternity session is between 28 to 34 weeks.',
      'We provide a range of beautiful maternity gowns, or you may bring your own.',
      'Professional hair and makeup can be arranged upon request for an additional fee.',
      'Partners and siblings are always welcome in SIGNATURE and higher packages.',
      'A 50% non-refundable advance is required to secure your slot.',
      'For family portraits, we suggest wearing solid, neutral tones.',
      'Use of personal cameras or professional outside photographers is not permitted.',
    ],
  },
];

// ─── Service detail pages ─────────────────────────────────────────────────────
const serviceDetailSeeds = [
  {
    page: 'service',
    section: 'maternity-photography',
    title: 'Maternity Stories',
    heroImage: '/mat4.webp',
    breadcrumb: 'Home / Services / Maternity',
    description: 'The best time to schedule the maternity shoot is between 28-34 weeks.',
    sections: [
      { title: 'Elegant Studio Sessions', images: ['/mat1.webp', '/mat2.webp', '/mat3.webp', '/mat4.webp', '/mat1.webp', '/mat2.webp'] },
      { title: 'Sunlit Outdoor Stories', images: ['/mat4.webp', '/mat2.webp', '/mat3.webp'] },
    ],
  },
  {
    page: 'service',
    section: 'baby-photography',
    title: 'Baby Photoshoot',
    heroImage: '/small1.webp',
    breadcrumb: 'Home / Services / Baby',
    description: 'Capture the first moments of your little one in a safe and comfortable environment.',
    sections: [
      { title: 'Newborn Magic (0-3 Months)', images: ['/small.webp', '/small1.webp', '/small2.webp', '/small3.webp', '/small4.webp', '/small5.webp', '/small.webp', '/small1.webp', '/small2.webp', '/small3.webp', '/small4.webp', '/small5.webp'] },
      { title: 'Little Smiles (3-6 Months)', images: ['/small.webp', '/small1.webp', '/small2.webp'] },
      { title: 'Playful Moments (6+ Months)', images: ['/small3.webp', '/small4.webp', '/small5.webp'] },
    ],
  },
  {
    page: 'service',
    section: 'product-photography',
    title: 'Product Stories',
    heroImage: '/product1.webp',
    breadcrumb: 'Home / Services / Product',
    description: 'Showcase your products with high-quality visuals designed for e-commerce, branding, and marketing.',
    sections: [
      { title: 'Studio Product Sessions', images: ['/product1.webp', '/product2.webp', '/product3.webp', '/product4.webp', '/product2.webp', '/product3.webp'] },
      { title: 'Lifestyle Product Stories', images: ['/product4.webp', '/product2.webp', '/product3.webp'] },
    ],
  },
  {
    page: 'service',
    section: 'interior-photography',
    title: 'Interior Stories',
    heroImage: '/interior.webp',
    breadcrumb: 'Home / Services / Interior',
    description: 'Capture the beauty of your spaces with elegant interior and architectural photography.',
    sections: [
      { title: 'Residential Spaces', images: ['/interior.webp', '/interior2.webp', '/interior3.webp', '/interior.webp', '/interior2.webp', '/interior3.webp'] },
      { title: 'Commercial Spaces', images: ['/interior.webp', '/interior2.webp', '/interior3.webp'] },
    ],
  },
  {
    page: 'service',
    section: 'birthdays-&-events',
    title: 'Birthdays & Events',
    heroImage: '/birthday.webp',
    breadcrumb: 'Home / Services / Events',
    description: 'Aesthetic shots for your social media and personal brand.',
    sections: [
      { title: 'The Big Day Celebration', images: ['/birth1.webp', '/birth2.webp', '/birth3.webp', '/birth1.webp', '/birth2.webp', '/birth3.webp'] },
      { title: 'Joyful & Candid Moments', images: ['/birth1.webp', '/birth2.webp', '/birth3.webp'] },
    ],
  },
];

// ─── About page data ─────────────────────────────────────────────────────────
const aboutSeeds = [
  {
    page: 'about',
    section: 'about-intro',
    title: 'KAIROS Photography — Where Every Moment Becomes Art.',
    subtitle: 'ABOUT KAIROS !',
    description: 'Based in Bangalore with 16 studios across India, we specialize in Portraits, Weddings, Corporate Shoots, Kids, Maternity & Newborn Shoots, Pet Photography, Family Portraits, Event Coverage, and Video Productions. Whether you\'re celebrating love, life, or creativity, our team captures every story with perfection. Explore our studio rental spaces for your next creative project.',
    extra: {
      studioDetail: 'Looking for a professional setup? Our studio rental space in Bangalore offers photographers, content creators, and brands a fully equipped environment to bring their creative visions to life.'
    }
  },
  {
    page: 'about',
    section: 'founder-story',
    title: 'Founder\'s Story',
    heroImage: '/founder.png', // Reusing heroImage field for founder portrait
    description: '“Our journey began with just a camera, a dream, and the courage to start. What began as small weekend shoots slowly grew into something bigger than we imagined. With every challenge, we learned... with every client, we grew... and with every story, our purpose became clearer.\n\nToday, this company stands as the result of that journey—built with passion, patience, and the belief that beautiful memories deserve to be preserved with care.”'
  },
  {
    page: 'about',
    section: 'about-stats',
    stats: [
      { id: 1, number: '12+', label: 'Years of Experience' },
      { id: 2, number: '10k+', label: 'Photoshoots Completed' }
    ]
  },
  {
    page: 'about',
    section: 'about-services',
    serviceItems: [
      { id: 1, title: 'Corporate & Personal Headshots', description: 'Professional photos for work or personal branding.' },
      { id: 2, title: 'Maternity Photography', description: 'Professional photos for work or personal branding.' },
      { id: 3, title: 'Baby Photography', description: 'Professional photos for work or personal branding.' },
      { id: 4, title: 'Interior Photography', description: 'Professional photos for work or personal branding.' },
      { id: 5, title: 'Events & Birthdays', description: 'Professional photos for work or personal branding.' },
      { id: 6, title: 'Product Photography', description: 'Professional photos for work or personal branding.' }
    ]
  }
];

// ─── Connect / Footer data ───────────────────────────────────────────────────
const connectSeed = {
  page: 'home',
  section: 'connect',
  extra: {
    phone: '87809 83966',
    email: 'hello@kairosstudio.in',
    address: 'Jai Maadi Bunglows, 7, Aarohi Club Rd, opp. Aarohi viviana, South Bopal, Ahmedabad, Gujarat 380058'
  }
};


// ─── Seed runner ──────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected.');

  const allSeeds = [
    ...homeSeeds,
    pricingListSeed,
    ...pricingDetailSeeds,
    ...serviceDetailSeeds,
    ...aboutSeeds,
    connectSeed,
  ];

  for (const item of allSeeds) {
    const { page, section, ...rest } = item;
    await SectionData.findOneAndUpdate(
      { page, section },
      { $set: { page, section, ...rest } },
      { upsert: true, new: true }
    );
    console.log(`✓  Seeded  [${page}] → [${section}]`);
  }

  console.log('\nAll sections seeded successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
