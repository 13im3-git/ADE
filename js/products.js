// ============================================
// ADE NATURAL CEREALS - PRODUCTS DATA
// Complete product catalog with all categories
// ============================================

const PRODUCTS = [
  // --- WEIGHT GAIN ---
  {
    id: 'wg-1',
    name: 'Protein Powder (Small)',
    category: 'Weight Gain',
    categorySlug: 'weight-gain',
    originalPrice: 6000,
    salePrice: 5000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.5,
    reviews: 128,
    badge: 'sale',
    description: 'Our premium protein powder formulated for healthy weight gain. Packed with essential nutrients and vitamins to support your weight gain journey naturally.',
    features: ['Natural ingredients', 'Rich in protein', 'Easy to digest', 'No artificial additives']
  },
  {
    id: 'wg-2',
    name: 'Protein Powder (Big)',
    category: 'Weight Gain',
    categorySlug: 'weight-gain',
    originalPrice: 10000,
    salePrice: 8500,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.7,
    reviews: 95,
    badge: 'best-seller',
    description: 'Large size premium protein powder for sustained weight gain results. Perfect for long-term use.',
    features: ['Extended supply', 'Better value', 'Premium formula', 'Max results']
  },
  {
    id: 'wg-3',
    name: 'Weight Gain Syrup',
    category: 'Weight Gain',
    categorySlug: 'weight-gain',
    originalPrice: 10000,
    salePrice: 8000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.6,
    reviews: 210,
    badge: 'sale',
    description: 'Delicious weight gain syrup that helps you add healthy pounds. Easy to take and fast-acting.',
    features: ['Great taste', 'Fast absorption', 'Natural formula', 'Energy boosting']
  },
  {
    id: 'wg-4',
    name: 'Weight Gain Pills',
    category: 'Weight Gain',
    categorySlug: 'weight-gain',
    originalPrice: 5000,
    salePrice: 4000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.3,
    reviews: 67,
    badge: 'sale',
    description: 'Convenient weight gain pills for those on the go. Easy to incorporate into your daily routine.',
    features: ['Easy to swallow', 'Portable', 'Consistent dosage', 'Natural ingredients']
  },

  // --- HIPS AND BUTT ---
  {
    id: 'hb-1',
    name: 'Butt and Hips Syrup',
    category: 'Hips and Butt',
    categorySlug: 'hips-and-butt',
    originalPrice: 10000,
    salePrice: 8000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.8,
    reviews: 345,
    badge: 'best-seller',
    description: 'Our most popular product! Specially formulated to enhance your curves naturally.',
    features: ['Natural enhancement', 'Visible results', 'Safe formula', 'Curve boosting']
  },
  {
    id: 'hb-2',
    name: 'Butt and Hips Powder (Small)',
    category: 'Hips and Butt',
    categorySlug: 'hips-and-butt',
    originalPrice: 6000,
    salePrice: 5000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.4,
    reviews: 89,
    badge: 'sale',
    description: 'Premium powder formula for hip and butt enhancement. Start your transformation today.',
    features: ['Easy mix', 'Quick results', 'Natural', 'Affordable']
  },
  {
    id: 'hb-3',
    name: 'Butt and Hips Powder (Big)',
    category: 'Hips and Butt',
    categorySlug: 'hips-and-butt',
    originalPrice: 10000,
    salePrice: 8500,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.6,
    reviews: 156,
    badge: 'sale',
    description: 'Large size butt and hips powder for complete transformation. Our best value option.',
    features: ['Extended use', 'Best value', 'Proven formula', 'Maximum results']
  },
  {
    id: 'hb-4',
    name: 'Butt and Hips Oil',
    category: 'Hips and Butt',
    categorySlug: 'hips-and-butt',
    originalPrice: 7000,
    salePrice: 5000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.5,
    reviews: 178,
    badge: 'sale',
    description: 'Nourishing oil for hip and butt enhancement. Massage daily for best results.',
    features: ['Deep penetration', 'Skin nourishing', 'Natural oils', 'Firming']
  },
  {
    id: 'hb-5',
    name: 'Butt and Hips Pills',
    category: 'Hips and Butt',
    categorySlug: 'hips-and-butt',
    originalPrice: 5000,
    salePrice: 4000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.2,
    reviews: 54,
    badge: 'sale',
    description: 'Convenient pills for hip and butt enhancement on the go.',
    features: ['Easy to take', 'Portable', 'Natural formula', 'Consistent']
  },
  {
    id: 'hb-6',
    name: 'Booty Filler Cream (50g)',
    category: 'Hips and Butt',
    categorySlug: 'hips-and-butt',
    originalPrice: 6000,
    salePrice: 4500,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.7,
    reviews: 267,
    badge: 'best-seller',
    description: 'Premium booty filler cream for targeted enhancement. Visible results in weeks.',
    features: ['Targeted action', 'Quick results', 'Premium formula', 'Easy application']
  },
  {
    id: 'hb-7',
    name: 'Booty Filler Cream (100g)',
    category: 'Hips and Butt',
    categorySlug: 'hips-and-butt',
    originalPrice: 9000,
    salePrice: 7000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.8,
    reviews: 198,
    badge: 'sale',
    description: 'Medium size booty filler cream for complete treatment. Our most popular size.',
    features: ['Best value', 'Premium quality', 'Long lasting', 'Proven results']
  },
  {
    id: 'hb-8',
    name: 'Booty Filler Cream (500ml)',
    category: 'Hips and Butt',
    categorySlug: 'hips-and-butt',
    originalPrice: 20000,
    salePrice: 17500,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.9,
    reviews: 312,
    badge: 'best-seller',
    description: 'Large 500ml booty filler cream for maximum enhancement. Professional size.',
    features: ['Professional size', 'Maximum value', 'Intensive formula', 'Guaranteed results']
  },
  {
    id: 'hb-9',
    name: 'Booty Filler Cream (1 Litre)',
    category: 'Hips and Butt',
    categorySlug: 'hips-and-butt',
    originalPrice: 35000,
    salePrice: 30000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.9,
    reviews: 445,
    badge: 'best-seller',
    description: 'Ultimate 1 litre booty filler cream. Our largest size for complete transformation.',
    features: ['Ultimate value', 'Full treatment', 'Professional grade', 'Best results']
  },

  // --- SLIMTHICK ---
  {
    id: 'st-1',
    name: 'Slimthick Syrup',
    category: 'Slimthick',
    categorySlug: 'slimthick',
    originalPrice: 10000,
    salePrice: 8000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.7,
    reviews: 234,
    badge: 'best-seller',
    description: 'Achieve the perfect slimthick body with our premium formula. Slim waist, enhanced curves.',
    features: ['Waist slimming', 'Curve enhancing', 'Natural formula', 'Fast acting']
  },
  {
    id: 'st-2',
    name: 'Slimthick Pills',
    category: 'Slimthick',
    categorySlug: 'slimthick',
    originalPrice: 5000,
    salePrice: 4000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.4,
    reviews: 87,
    badge: 'sale',
    description: 'Convenient slimthick pills for your body transformation journey.',
    features: ['Easy to take', 'Portable', 'Effective', 'Natural']
  },

  // --- FLAT TUMMY ---
  {
    id: 'ft-1',
    name: 'Flat Tummy Powder',
    category: 'Flat Tummy',
    categorySlug: 'flat-tummy',
    originalPrice: 8000,
    salePrice: 6500,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.5,
    reviews: 145,
    badge: 'sale',
    description: 'Achieve a flatter tummy with our specially formulated powder. Reduces bloating naturally.',
    features: ['Belly fat reduction', 'Natural ingredients', 'Easy to use', 'Quick results']
  },
  {
    id: 'ft-2',
    name: 'Flat Tummy Drink',
    category: 'Flat Tummy',
    categorySlug: 'flat-tummy',
    originalPrice: 7000,
    salePrice: 6000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.3,
    reviews: 98,
    badge: 'sale',
    description: 'Refreshing flat tummy drink for daily detox and belly slimming.',
    features: ['Detoxifying', 'Refreshing taste', 'Belly slimming', 'Daily wellness']
  },
  {
    id: 'ft-3',
    name: 'Flat Tummy Oil',
    category: 'Flat Tummy',
    categorySlug: 'flat-tummy',
    originalPrice: 8000,
    salePrice: 6500,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.4,
    reviews: 112,
    badge: 'sale',
    description: 'Targeted tummy oil for spot reduction and firming. Massage daily.',
    features: ['Spot reduction', 'Skin firming', 'Natural oils', 'Warm massage']
  },
  {
    id: 'ft-4',
    name: 'Tummy Wrap',
    category: 'Flat Tummy',
    categorySlug: 'flat-tummy',
    originalPrice: 9000,
    salePrice: 9000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.2,
    reviews: 76,
    badge: 'new',
    description: 'Professional tummy wrap for instant slimming and detox.',
    features: ['Instant results', 'Detoxifying', 'Easy to use', 'Reusable']
  },
  {
    id: 'ft-5',
    name: 'Weight Loss Powder',
    category: 'Flat Tummy',
    categorySlug: 'flat-tummy',
    originalPrice: 8000,
    salePrice: 7000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.3,
    reviews: 89,
    badge: 'sale',
    description: 'Effective weight loss powder to support your fitness goals.',
    features: ['Weight management', 'Metabolism boost', 'Natural formula', 'Energy support']
  },

  // --- BREAST KIT ---
  {
    id: 'bk-1',
    name: 'Breast Enlargement Syrup',
    category: 'Breast Kit',
    categorySlug: 'breast-kit',
    originalPrice: 10000,
    salePrice: 8000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.6,
    reviews: 234,
    badge: 'best-seller',
    description: 'Natural breast enlargement syrup for fuller, firmer breasts. Visible results in weeks.',
    features: ['Natural enhancement', 'Fuller breasts', 'Firmer bust', 'Safe formula']
  },
  {
    id: 'bk-2',
    name: 'Breast Enlargement Powder',
    category: 'Breast Kit',
    categorySlug: 'breast-kit',
    originalPrice: 6000,
    salePrice: 5000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.4,
    reviews: 87,
    badge: 'sale',
    description: 'Premium breast enlargement powder for natural bust enhancement.',
    features: ['Easy mix', 'Natural results', 'Affordable', 'Safe']
  },
  {
    id: 'bk-3',
    name: 'Breast Enlargement Oil',
    category: 'Breast Kit',
    categorySlug: 'breast-kit',
    originalPrice: 6000,
    salePrice: 5000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.5,
    reviews: 167,
    badge: 'sale',
    description: 'Nourishing oil for breast enlargement. Massage daily for best results.',
    features: ['Deep penetration', 'Natural oils', 'Skin firming', 'Quick absorption']
  },
  {
    id: 'bk-4',
    name: 'Breast Firming Oil',
    category: 'Breast Kit',
    categorySlug: 'breast-kit',
    originalPrice: 7000,
    salePrice: 6000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.3,
    reviews: 92,
    badge: 'sale',
    description: 'Firming oil that lifts and tones your bust naturally.',
    features: ['Lifting effect', 'Toning', 'Natural firmness', 'Youthful look']
  },
  {
    id: 'bk-5',
    name: 'Breast Firming Powder',
    category: 'Breast Kit',
    categorySlug: 'breast-kit',
    originalPrice: 6000,
    salePrice: 5000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.2,
    reviews: 64,
    badge: 'sale',
    description: 'Powder formula for breast firming and lifting.',
    features: ['Natural lift', 'Easy to use', 'Firming', 'Safe']
  },

  // --- OTHER PRODUCTS ---
  {
    id: 'op-1',
    name: 'Tiny Leg Oil',
    category: 'Other Products',
    categorySlug: 'other-products',
    originalPrice: 8000,
    salePrice: 6500,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.1,
    reviews: 45,
    badge: 'new',
    description: 'Special oil for slimming legs naturally. Targeted formula.',
    features: ['Leg slimming', 'Natural formula', 'Quick results', 'Easy application']
  },
  {
    id: 'op-2',
    name: 'Infection Herbs Detox',
    category: 'Other Products',
    categorySlug: 'other-products',
    originalPrice: 5000,
    salePrice: 3500,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.6,
    reviews: 198,
    badge: 'best-seller',
    description: 'Powerful herbal detox for internal cleansing and infection treatment.',
    features: ['Detoxifying', 'Natural herbs', 'Internal cleansing', 'Immune support']
  },
  {
    id: 'op-3',
    name: 'Yoni Oil',
    category: 'Other Products',
    categorySlug: 'other-products',
    originalPrice: 4000,
    salePrice: 3000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.5,
    reviews: 134,
    badge: 'sale',
    description: 'Natural yoni oil for feminine wellness and intimate care.',
    features: ['Feminine care', 'Natural ingredients', 'Gentle formula', 'Wellness']
  },
  {
    id: 'op-4',
    name: 'Hair Growth Oil',
    category: 'Other Products',
    categorySlug: 'other-products',
    originalPrice: 5000,
    salePrice: 4000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.4,
    reviews: 212,
    badge: 'best-seller',
    description: 'Premium hair growth oil for longer, thicker, healthier hair.',
    features: ['Hair growth', 'Thicker hair', 'Natural oils', 'Scalp health']
  },

  // --- COMPLETE SETS ---
  {
    id: 'cs-1',
    name: 'Student Weight Gain Kit',
    category: 'Complete Sets',
    categorySlug: 'complete-sets',
    originalPrice: 22000,
    salePrice: 19000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.7,
    reviews: 178,
    badge: 'sale',
    description: 'Complete weight gain kit for students. Everything you need in one package.',
    features: ['Complete kit', 'Student friendly', 'Best value', 'All-in-one']
  },
  {
    id: 'cs-2',
    name: 'Curve Booster Set',
    category: 'Complete Sets',
    categorySlug: 'complete-sets',
    originalPrice: 39000,
    salePrice: 33000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.8,
    reviews: 267,
    badge: 'best-seller',
    description: 'Ultimate curve booster set for complete body transformation.',
    features: ['Full transformation', 'Premium products', 'Maximum results', 'Best seller']
  },
  {
    id: 'cs-3',
    name: 'Weight Gain Set',
    category: 'Complete Sets',
    categorySlug: 'complete-sets',
    originalPrice: 44000,
    salePrice: 34500,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.6,
    reviews: 145,
    badge: 'sale',
    description: 'Complete weight gain set for serious results. Our best weight gain package.',
    features: ['Serious results', 'Complete package', 'Great value', 'All products']
  },
  {
    id: 'cs-4',
    name: 'Slimthick Set',
    category: 'Complete Sets',
    categorySlug: 'complete-sets',
    originalPrice: 60000,
    salePrice: 49000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.9,
    reviews: 389,
    badge: 'best-seller',
    description: 'Premium slimthick set for achieving the perfect hourglass figure.',
    features: ['Hourglass figure', 'Premium set', 'Best value', 'Proven results']
  },
  {
    id: 'cs-5',
    name: 'Breast Enlargement Set',
    category: 'Complete Sets',
    categorySlug: 'complete-sets',
    originalPrice: 22000,
    salePrice: 18000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.5,
    reviews: 98,
    badge: 'sale',
    description: 'Complete breast enlargement set for natural bust enhancement.',
    features: ['Bust enhancement', 'Complete set', 'Natural results', 'Great value']
  },
  {
    id: 'cs-6',
    name: 'Breast Firming Set',
    category: 'Complete Sets',
    categorySlug: 'complete-sets',
    originalPrice: 13000,
    salePrice: 11000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.3,
    reviews: 67,
    badge: 'sale',
    description: 'Breast firming set for lifted, toned, and youthful bust.',
    features: ['Lifting', 'Firming', 'Toning', 'Natural']
  },
  {
    id: 'cs-7',
    name: 'Flat Tummy Set',
    category: 'Complete Sets',
    categorySlug: 'complete-sets',
    originalPrice: 23000,
    salePrice: 19000,
    image: 'images/products/product-placeholder.svg',
    images: ['images/products/product-placeholder.svg'],
    featuredImage: 'images/products/product-placeholder.svg',
    saleStart: '',
    saleEnd: '',
    rating: 4.4,
    reviews: 123,
    badge: 'sale',
    description: 'Complete flat tummy set for belly fat reduction and core toning.',
    features: ['Belly reduction', 'Core toning', 'Complete set', 'Effective']
  }
];

// Categories data
const CATEGORIES = [
  { name: 'Weight Gain', slug: 'weight-gain', icon: 'fa-weight-scale', count: 0 },
  { name: 'Hips and Butt', slug: 'hips-and-butt', icon: 'fa-heart', count: 0 },
  { name: 'Slimthick', slug: 'slimthick', icon: 'fa-hourglass', count: 0 },
  { name: 'Flat Tummy', slug: 'flat-tummy', icon: 'fa-hand', count: 0 },
  { name: 'Breast Kit', slug: 'breast-kit', icon: 'fa-venus', count: 0 },
  { name: 'Other Products', slug: 'other-products', icon: 'fa-cube', count: 0 },
  { name: 'Complete Sets', slug: 'complete-sets', icon: 'fa-gem', count: 0 }
];

// Update category counts
CATEGORIES.forEach(cat => {
  cat.count = PRODUCTS.filter(p => p.categorySlug === cat.slug).length;
});

// Testimonials data
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Chioma O.',
    avatar: 'CO',
    text: 'I\'ve been using the Slimthick Set for 3 months and the results are incredible! I\'ve gained curves in all the right places. ADE Natural Cereals changed my life!',
    rating: 5,
    role: 'Verified Buyer'
  },
  {
    id: 2,
    name: 'Blessing A.',
    avatar: 'BA',
    text: 'The Booty Filler Cream is amazing! I saw visible results in just 2 weeks. My husband can\'t stop complimenting me. Thank you ADE!',
    rating: 5,
    role: 'Verified Buyer'
  },
  {
    id: 3,
    name: 'Amara K.',
    avatar: 'AK',
    text: 'I was skeptical at first but the Weight Gain Set really works! I gained 10kg in 2 months and I feel more confident than ever.',
    rating: 5,
    role: 'Verified Buyer'
  },
  {
    id: 4,
    name: 'Ifeoma N.',
    avatar: 'IN',
    text: 'The Flat Tummy Set helped me lose belly fat after my pregnancy. I feel like my old self again. Highly recommended!',
    rating: 5,
    role: 'Verified Buyer'
  },
  {
    id: 5,
    name: 'Temitope F.',
    avatar: 'TF',
    text: 'Customer service is outstanding! The WhatsApp support is so helpful. My order arrived quickly and the results are amazing!',
    rating: 5,
    role: 'Verified Buyer'
  }
];

// Reviews data
const REVIEWS = [
  { id: 1, name: 'Chioma O.', avatar: 'CO', rating: 5, text: 'Absolutely love the products! The Slimthick Set has transformed my body. I get compliments everywhere I go.', date: '2026-05-15' },
  { id: 2, name: 'Blessing A.', avatar: 'BA', rating: 5, text: 'Booty Filler Cream is a game changer! So happy with my results. Will definitely order again.', date: '2026-05-10' },
  { id: 3, name: 'Amara K.', avatar: 'AK', rating: 5, text: 'The Weight Gain kit worked perfectly for me. Gained weight in all the right places. Thank you ADE!', date: '2026-05-08' },
  { id: 4, name: 'Ifeoma N.', avatar: 'IN', rating: 4, text: 'Good products with visible results. The Flat Tummy drink tastes great and helps with bloating.', date: '2026-05-05' },
  { id: 5, name: 'Temitope F.', avatar: 'TF', rating: 5, text: 'Fast delivery and excellent customer service. The products are top quality. Highly recommended!', date: '2026-05-01' },
  { id: 6, name: 'Ngozi E.', avatar: 'NE', rating: 5, text: 'I\'ve tried many brands but ADE is the best. The Breast Enlargement Syrup is working wonders!', date: '2026-04-28' },
  { id: 7, name: 'Funmi D.', avatar: 'FD', rating: 4, text: 'Great results from the Hips and Butt Powder. I will be ordering more soon.', date: '2026-04-20' },
  { id: 8, name: 'Esther J.', avatar: 'EJ', rating: 5, text: 'The Complete Sets are such good value! Got the Curve Booster Set and I\'m loving my new shape.', date: '2026-04-15' }
];

// Before/After data
const BEFORE_AFTER = [
  { id: 1, name: 'Chioma', result: 'Slimthick transformation in 3 months' },
  { id: 2, name: 'Blessing', result: 'Booty enhancement in 2 months' },
  { id: 3, name: 'Amara', result: 'Weight gain journey - 10kg in 2 months' },
  { id: 4, name: 'Ifeoma', result: 'Post-pregnancy flat tummy in 2 months' },
  { id: 5, name: 'Ngozi', result: 'Breast enlargement results in 8 weeks' },
  { id: 6, name: 'Fatima', result: 'Hips growth journey - 3 months' },
  { id: 7, name: 'Chidinma', result: 'Complete Curve Booster Set results' },
  { id: 8, name: 'Aisha', result: 'Weight gain from 48kg to 58kg' }
];

// FAQ data
const FAQS = [
  {
    q: 'How long does it take to see results?',
    a: 'Results vary by individual and product. Most customers see visible results within 2-4 weeks of consistent use. For best results, follow the recommended dosage and usage instructions provided with each product.'
  },
  {
    q: 'Are your products safe?',
    a: 'Yes! All our products are made with natural ingredients and are formulated under strict quality control standards. We prioritize your health and safety above everything.'
  },
  {
    q: 'How do I place an order?',
    a: 'Simply browse our shop, add products to your cart, and proceed to checkout. You\'ll receive our bank details for payment transfer. Once payment is confirmed, we\'ll process your order immediately.'
  },
  {
    q: 'Do you deliver nationwide?',
    a: 'Yes, we deliver to all states in Nigeria. Delivery typically takes 2-5 business days depending on your location.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bank transfers to our provided account details. Once payment is made, upload your transfer screenshot for confirmation.'
  },
  {
    q: 'Can I track my order?',
    a: 'Yes! Once your order is processed and shipped, you will receive tracking information via WhatsApp. You can also check your order status in your account.'
  },
  {
    q: 'What is your return policy?',
    a: 'Due to the nature of our products, we do not accept returns. However, if you receive a damaged or incorrect item, please contact us within 24 hours for a resolution.'
  },
  {
    q: 'How do I contact customer support?',
    a: 'You can reach us via WhatsApp, email, or through our contact form. Our support team is available Monday to Saturday, 9 AM to 6 PM.'
  }
];

// ============================================
// SWIPER CAROUSELS + 3D PRODUCT CARDS
// ============================================

(function enhanceProductUI() {
  if (typeof Swiper === 'undefined') return;

  function initTestimonialSwiper() {
    const el = document.getElementById('testimonials-swiper');
    if (!el) return;
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  function initBeforeAfterSwiper() {
    const el = document.getElementById('before-after-swiper');
    if (!el) return;
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 2 },
      },
    });
  }

  function initProductTilt() {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTestimonialSwiper();
      initBeforeAfterSwiper();
      initProductTilt();
    });
  } else {
    initTestimonialSwiper();
    initBeforeAfterSwiper();
    initProductTilt();
  }
})();