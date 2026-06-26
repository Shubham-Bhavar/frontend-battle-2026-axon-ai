/* ============================================================
   DATA LAYER — data/index.js
   Single source of truth for all static + computed config.
   No hardcoded UI values. All pricing derived from matrix.
   ============================================================ */


/* ── 1. PRICING MATRIX ───────────────────────────────────────
   Structure: pricingMatrix[tier][currency]
   Fields:
     baseMonthly   → raw monthly rate in that currency
     tariffFactor  → regional tariff multiplier (1.0 = no tariff)
   Computed at runtime (in usePricing):
     monthly  = baseMonthly × tariffFactor
     annual   = monthly × 12 × (1 − ANNUAL_DISCOUNT)
   ─────────────────────────────────────────────────────────── */

export const ANNUAL_DISCOUNT = 0.20; // 20% flat discount on annual billing

export const CURRENCY_CONFIG = {
  INR: { symbol: '₹', code: 'INR', label: 'Indian Rupee',   locale: 'en-IN' },
  USD: { symbol: '$', code: 'USD', label: 'US Dollar',       locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', label: 'Euro',            locale: 'de-DE' },
};

export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  ANNUAL:  'annual',
};

/**
 * Multi-dimensional pricing matrix.
 * tariffFactor encodes regional pricing differences:
 *   INR → 1.00 (base market)
 *   USD → 1.00 (base market)
 *   EUR → 1.05 (EU VAT / regional tariff)
 */
export const pricingMatrix = {
  starter: {
    id:          'starter',
    name:        'Starter',
    tagline:     'For individuals and small teams getting started.',
    highlighted: false,
    features: [
      '5 Automation Pipelines',
      '10,000 API Calls / mo',
      '1 Workspace',
      'Community Support',
      'Basic Analytics',
    ],
    cta: 'Start Free Trial',
    INR: { baseMonthly: 999,   tariffFactor: 1.00 },
    USD: { baseMonthly: 12,    tariffFactor: 1.00 },
    EUR: { baseMonthly: 11,    tariffFactor: 1.05 },
  },

  pro: {
    id:          'pro',
    name:        'Pro',
    tagline:     'For growing teams running production workloads.',
    highlighted: true, // featured / recommended tier
    features: [
      '50 Automation Pipelines',
      '500,000 API Calls / mo',
      '5 Workspaces',
      'Priority Email Support',
      'Advanced Analytics',
      'Custom Webhooks',
      'Role-Based Access',
    ],
    cta: 'Get Started',
    INR: { baseMonthly: 3999,  tariffFactor: 1.00 },
    USD: { baseMonthly: 49,    tariffFactor: 1.00 },
    EUR: { baseMonthly: 45,    tariffFactor: 1.05 },
  },

  enterprise: {
    id:          'enterprise',
    name:        'Enterprise',
    tagline:     'For organisations that demand scale and compliance.',
    highlighted: false,
    features: [
      'Unlimited Pipelines',
      'Unlimited API Calls',
      'Unlimited Workspaces',
      'Dedicated SLA Support',
      'AI Model Fine-tuning',
      'SSO / SAML',
      'Audit Logs',
      'Custom Data Residency',
    ],
    cta: 'Contact Sales',
    INR: { baseMonthly: 12999, tariffFactor: 1.00 },
    USD: { baseMonthly: 159,   tariffFactor: 1.00 },
    EUR: { baseMonthly: 149,   tariffFactor: 1.05 },
  },
};

/** Ordered array of tier ids for consistent render order */
export const TIER_ORDER = ['starter', 'pro', 'enterprise'];


/* ── 2. FEATURES DATA ────────────────────────────────────────
   Used by both BentoGrid (desktop) and Accordion (mobile).
   Each node carries layout hints (span) for the bento grid.
   ─────────────────────────────────────────────────────────── */

export const featuresData = [
  {
    id:       'pipeline-engine',
    index:    0,
    eyebrow:  'Core Engine',
    title:    'Visual Pipeline Builder',
    body:     'Drag-and-drop automation canvas with conditional branching, retry logic, and real-time step tracing — no code required.',
    icon:     'pipeline',   // maps to SVG id in the asset pack
    // Bento grid layout hints (12-col system)
    colSpan:  6,
    rowSpan:  2,
    accent:   'forsythia',
  },
  {
    id:       'ai-inference',
    index:    1,
    eyebrow:  'Intelligence Layer',
    title:    'On-Device AI Inference',
    body:     'Run LLM calls, embeddings, and classifiers directly inside pipeline steps. Supports OpenAI, Anthropic, and self-hosted models.',
    icon:     'ai-inference',
    colSpan:  6,
    rowSpan:  1,
    accent:   'saffron',
  },
  {
    id:       'realtime-sync',
    index:    2,
    eyebrow:  'Data Fabric',
    title:    'Real-Time Data Sync',
    body:     'Bi-directional connectors to 200+ SaaS APIs with sub-second event propagation and schema-aware conflict resolution.',
    icon:     'sync',
    colSpan:  4,
    rowSpan:  1,
    accent:   'teal',
  },
  {
    id:       'observability',
    index:    3,
    eyebrow:  'Monitoring',
    title:    'Full-Stack Observability',
    body:     'Execution traces, latency histograms, error heat-maps, and anomaly alerts — all inside a single unified dashboard.',
    icon:     'observability',
    colSpan:  4,
    rowSpan:  1,
    accent:   'teal',
  },
  {
    id:       'security',
    index:    4,
    eyebrow:  'Compliance',
    title:    'Enterprise-Grade Security',
    body:     'SOC 2 Type II, end-to-end encryption, RBAC, and data residency controls built into every tier — not bolted on.',
    icon:     'security',
    colSpan:  4,
    rowSpan:  1,
    accent:   'forsythia',
  },
  {
    id:       'sdk',
    index:    5,
    eyebrow:  'Developer Experience',
    title:    'TypeScript SDK + CLI',
    body:     'First-class TypeScript types, a local dev runtime, and a Git-native deploy workflow so your team ships automations like code.',
    icon:     'sdk',
    colSpan:  6,
    rowSpan:  1,
    accent:   'saffron',
  },
];


/* ── 3. NAVIGATION ───────────────────────────────────────────*/

export const navLinks = [
  { id: 'product',  label: 'Product',  href: '#features' },
  { id: 'pricing',  label: 'Pricing',  href: '#pricing'  },
  { id: 'docs',     label: 'Docs',     href: '#docs'     },
  { id: 'blog',     label: 'Blog',     href: '#blog'     },
];

export const navCTA = {
  secondary: { label: 'Sign In',       href: '#signin'  },
  primary:   { label: 'Start for Free', href: '#signup'  },
};


/* ── 4. SOCIAL LINKS ─────────────────────────────────────────*/

export const socialLinks = [
  { id: 'github',   label: 'GitHub',   href: 'https://github.com',   icon: 'github'   },
  { id: 'twitter',  label: 'Twitter',  href: 'https://twitter.com',  icon: 'twitter'  },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { id: 'discord',  label: 'Discord',  href: 'https://discord.com',  icon: 'discord'  },
];

export const footerLinks = [
  {
    heading: 'Product',
    links: [
      { label: 'Features',    href: '#features'   },
      { label: 'Pricing',     href: '#pricing'    },
      { label: 'Changelog',   href: '#changelog'  },
      { label: 'Roadmap',     href: '#roadmap'    },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'Docs',        href: '#docs'       },
      { label: 'API Ref',     href: '#api'        },
      { label: 'SDK',         href: '#sdk'        },
      { label: 'Status',      href: '#status'     },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',       href: '#about'      },
      { label: 'Blog',        href: '#blog'       },
      { label: 'Careers',     href: '#careers'    },
      { label: 'Contact',     href: '#contact'    },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy',     href: '#privacy'    },
      { label: 'Terms',       href: '#terms'      },
      { label: 'Security',    href: '#security'   },
      { label: 'Cookie Policy', href: '#cookies'  },
    ],
  },
];
