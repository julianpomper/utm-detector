/**
 * Brand detection patterns for UTM source analysis.
 * Contains patterns for click IDs, source names, mediums, and domain patterns.
 */

export interface BrandPattern {
  name: string;
  displayName: string;
  category: 'social' | 'search' | 'email' | 'affiliate' | 'display' | 'video' | 'messaging' | 'other';
  sourcePatterns: RegExp[];
  mediumPatterns: RegExp[];
  clickIdParams: string[];
  domainPatterns: RegExp[];
  icon: string;
  recommendation: string;
}

export interface ClickIdDefinition {
  param: string;
  platform: string;
  displayName: string;
  confidence: number;
  isPaid: boolean;
}

/**
 * Click ID parameters used by advertising platforms.
 * These provide high-confidence identification of traffic sources.
 *
 * To add a new click ID:
 * 1. Add entry with param name (case-sensitive as used in URLs)
 * 2. Set platform to match a brand name in BRAND_PATTERNS
 * 3. Set confidence (95 for definitive ad platforms, 80-90 for ambiguous)
 * 4. Set isPaid based on whether it indicates paid traffic
 */
export const CLICK_ID_DEFINITIONS: ClickIdDefinition[] = [
  // Google Ads ecosystem
  { param: 'gclid', platform: 'google', displayName: 'Google Ads', confidence: 95, isPaid: true },
  { param: 'gad_source', platform: 'google', displayName: 'Google Ads', confidence: 90, isPaid: true },
  { param: 'gbraid', platform: 'google', displayName: 'Google Ads (iOS App)', confidence: 95, isPaid: true },
  { param: 'wbraid', platform: 'google', displayName: 'Google Ads (iOS Web)', confidence: 95, isPaid: true },
  { param: 'dclid', platform: 'google', displayName: 'Google Display & Video 360', confidence: 95, isPaid: true },

  // Meta (Facebook/Instagram)
  { param: 'fbclid', platform: 'meta', displayName: 'Facebook/Meta', confidence: 85, isPaid: false },

  // Microsoft/Bing
  { param: 'msclkid', platform: 'microsoft', displayName: 'Microsoft Ads', confidence: 95, isPaid: true },

  // TikTok
  { param: 'ttclid', platform: 'tiktok', displayName: 'TikTok Ads', confidence: 95, isPaid: true },

  // LinkedIn
  { param: 'li_fat_id', platform: 'linkedin', displayName: 'LinkedIn Ads', confidence: 95, isPaid: true },

  // Twitter/X
  { param: 'twclid', platform: 'twitter', displayName: 'Twitter/X Ads', confidence: 95, isPaid: true },

  // Snapchat (multiple variations exist)
  { param: 'sccid', platform: 'snapchat', displayName: 'Snapchat Ads', confidence: 95, isPaid: true },
  { param: 'ScCid', platform: 'snapchat', displayName: 'Snapchat Ads', confidence: 95, isPaid: true },

  // Reddit
  { param: 'rdt_cid', platform: 'reddit', displayName: 'Reddit Ads', confidence: 95, isPaid: true },

  // Pinterest
  { param: 'epik', platform: 'pinterest', displayName: 'Pinterest', confidence: 80, isPaid: false },

  // Yahoo/Verizon Media
  { param: 'vmcid', platform: 'yahoo', displayName: 'Yahoo Ads', confidence: 95, isPaid: true },

  // Yandex (multiple click ID variants)
  { param: 'yclid', platform: 'yandex', displayName: 'Yandex Direct', confidence: 95, isPaid: true },
  { param: 'ymclid', platform: 'yandex', displayName: 'Yandex Market', confidence: 95, isPaid: true },

  // Affiliate networks
  { param: 'irclickid', platform: 'impact', displayName: 'Impact Radius Affiliate', confidence: 90, isPaid: true },
  { param: 'aff_id', platform: 'affiliate', displayName: 'Affiliate Network', confidence: 85, isPaid: true },
  { param: 'affiliate_id', platform: 'affiliate', displayName: 'Affiliate Network', confidence: 85, isPaid: true },
  { param: 'clickid', platform: 'affiliate', displayName: 'Affiliate/Tracking', confidence: 80, isPaid: true },
];

/**
 * Brand patterns for source detection.
 * Each brand includes patterns for UTM source, medium, and domain matching.
 *
 * To add a new brand:
 * 1. Add entry with unique name (lowercase, used internally)
 * 2. Set displayName for user-friendly output
 * 3. Set category for grouping
 * 4. Add sourcePatterns (RegExp array) for utm_source matching
 * 5. Add mediumPatterns (RegExp array) for utm_medium matching
 * 6. Add clickIdParams (string array) referencing CLICK_ID_DEFINITIONS
 * 7. Add domainPatterns (RegExp array) for referrer domain matching
 * 8. Set icon (emoji) and recommendation text
 *
 * Order matters: More specific brands should come before generic ones.
 * E.g., Instagram before Meta, as Instagram URLs may contain fbclid.
 */
export const BRAND_PATTERNS: BrandPattern[] = [
  // Social Media Platforms
  {
    name: 'facebook',
    displayName: 'Facebook',
    category: 'social',
    sourcePatterns: [/^facebook$/i, /^fb$/i, /^facebook\.com$/i, /^m\.facebook\.com$/i, /^l\.facebook\.com$/i],
    mediumPatterns: [/social/i, /paid[-_]?social/i, /cpc/i, /cpm/i, /paid/i],
    clickIdParams: ['fbclid'],
    domainPatterns: [/facebook\.com/i, /fb\.com/i, /fb\.me/i],
    icon: '📘',
    recommendation: 'Facebook',
  },
  {
    name: 'instagram',
    displayName: 'Instagram',
    category: 'social',
    sourcePatterns: [/^instagram$/i, /^ig$/i, /^instagram\.com$/i],
    mediumPatterns: [/social/i, /paid[-_]?social/i, /cpc/i, /cpm/i],
    clickIdParams: ['fbclid'],
    domainPatterns: [/instagram\.com/i, /instagr\.am/i],
    icon: '📷',
    recommendation: 'Instagram',
  },
  {
    name: 'meta',
    displayName: 'Meta (Facebook/Instagram)',
    category: 'social',
    sourcePatterns: [/^meta$/i, /^meta\.com$/i],
    mediumPatterns: [/social/i, /paid[-_]?social/i, /cpc/i, /cpm/i],
    clickIdParams: ['fbclid'],
    domainPatterns: [/meta\.com/i],
    icon: '🔵',
    recommendation: 'Meta (Facebook or Instagram)',
  },
  {
    name: 'tiktok',
    displayName: 'TikTok',
    category: 'social',
    sourcePatterns: [/^tiktok$/i, /^tiktok\.com$/i, /^tt$/i],
    mediumPatterns: [/social/i, /paid[-_]?social/i, /cpc/i, /cpm/i, /video/i],
    clickIdParams: ['ttclid'],
    domainPatterns: [/tiktok\.com/i, /vm\.tiktok\.com/i],
    icon: '🎵',
    recommendation: 'TikTok',
  },
  {
    name: 'linkedin',
    displayName: 'LinkedIn',
    category: 'social',
    sourcePatterns: [/^linkedin$/i, /^linkedin\.com$/i, /^lnkd\.in$/i],
    mediumPatterns: [/social/i, /paid[-_]?social/i, /cpc/i, /cpm/i],
    clickIdParams: ['li_fat_id'],
    domainPatterns: [/linkedin\.com/i, /lnkd\.in/i],
    icon: '💼',
    recommendation: 'LinkedIn',
  },
  {
    name: 'twitter',
    displayName: 'Twitter/X',
    category: 'social',
    sourcePatterns: [/^twitter$/i, /^x$/i, /^twitter\.com$/i, /^x\.com$/i, /^t\.co$/i],
    mediumPatterns: [/social/i, /paid[-_]?social/i, /cpc/i, /cpm/i],
    clickIdParams: ['twclid'],
    domainPatterns: [/twitter\.com/i, /x\.com/i, /t\.co/i],
    icon: '🐦',
    recommendation: 'Twitter/X',
  },
  {
    name: 'pinterest',
    displayName: 'Pinterest',
    category: 'social',
    sourcePatterns: [/^pinterest$/i, /^pinterest\.com$/i, /^pin$/i],
    mediumPatterns: [/social/i, /paid[-_]?social/i, /cpc/i, /cpm/i],
    clickIdParams: ['epik'],
    domainPatterns: [/pinterest\.com/i, /pin\.it/i],
    icon: '📌',
    recommendation: 'Pinterest',
  },
  {
    name: 'snapchat',
    displayName: 'Snapchat',
    category: 'social',
    sourcePatterns: [/^snapchat$/i, /^snap$/i, /^snapchat\.com$/i],
    mediumPatterns: [/social/i, /paid[-_]?social/i, /cpc/i, /cpm/i],
    clickIdParams: ['sccid', 'ScCid'],
    domainPatterns: [/snapchat\.com/i],
    icon: '👻',
    recommendation: 'Snapchat',
  },
  {
    name: 'reddit',
    displayName: 'Reddit',
    category: 'social',
    sourcePatterns: [/^reddit$/i, /^reddit\.com$/i],
    mediumPatterns: [/social/i, /paid[-_]?social/i, /cpc/i, /cpm/i, /referral/i],
    clickIdParams: ['rdt_cid'],
    domainPatterns: [/reddit\.com/i, /redd\.it/i],
    icon: '🤖',
    recommendation: 'Reddit',
  },
  {
    name: 'youtube',
    displayName: 'YouTube',
    category: 'video',
    sourcePatterns: [/^youtube$/i, /^youtube\.com$/i, /^yt$/i, /^youtu\.be$/i],
    mediumPatterns: [/video/i, /social/i, /cpc/i, /cpm/i, /referral/i],
    clickIdParams: ['gclid'],
    domainPatterns: [/youtube\.com/i, /youtu\.be/i],
    icon: '▶️',
    recommendation: 'YouTube',
  },

  // Search Engines
  {
    name: 'google',
    displayName: 'Google',
    category: 'search',
    sourcePatterns: [/^google$/i, /^google\.com$/i, /^google\.[a-z]{2,}$/i],
    mediumPatterns: [/organic/i, /cpc/i, /ppc/i, /paid/i, /search/i],
    clickIdParams: ['gclid', 'gad_source', 'gbraid', 'wbraid', 'dclid'],
    domainPatterns: [/google\./i],
    icon: '🔍',
    recommendation: 'Google',
  },
  {
    name: 'bing',
    displayName: 'Bing/Microsoft',
    category: 'search',
    sourcePatterns: [/^bing$/i, /^bing\.com$/i, /^microsoft$/i],
    mediumPatterns: [/organic/i, /cpc/i, /ppc/i, /paid/i, /search/i],
    clickIdParams: ['msclkid'],
    domainPatterns: [/bing\.com/i],
    icon: '🔎',
    recommendation: 'Bing',
  },
  {
    name: 'yahoo',
    displayName: 'Yahoo',
    category: 'search',
    sourcePatterns: [/^yahoo$/i, /^yahoo\.com$/i, /^verizon$/i],
    mediumPatterns: [/organic/i, /cpc/i, /search/i, /native/i],
    clickIdParams: ['vmcid'],
    domainPatterns: [/yahoo\.com/i, /search\.yahoo/i],
    icon: '🟣',
    recommendation: 'Yahoo',
  },
  {
    name: 'duckduckgo',
    displayName: 'DuckDuckGo',
    category: 'search',
    sourcePatterns: [/^duckduckgo$/i, /^ddg$/i, /^duckduckgo\.com$/i],
    mediumPatterns: [/organic/i, /search/i],
    clickIdParams: [],
    domainPatterns: [/duckduckgo\.com/i],
    icon: '🦆',
    recommendation: 'DuckDuckGo',
  },
  {
    name: 'yandex',
    displayName: 'Yandex',
    category: 'search',
    sourcePatterns: [/^yandex$/i, /^yandex\.com$/i, /^yandex\.ru$/i],
    mediumPatterns: [/organic/i, /cpc/i, /search/i],
    clickIdParams: ['yclid'],
    domainPatterns: [/yandex\./i],
    icon: '🔴',
    recommendation: 'Yandex',
  },

  // Email Platforms
  {
    name: 'mailchimp',
    displayName: 'Mailchimp',
    category: 'email',
    sourcePatterns: [/^mailchimp$/i, /^mc$/i],
    mediumPatterns: [/email/i, /newsletter/i],
    clickIdParams: [],
    domainPatterns: [/mailchimp\.com/i, /list-manage\.com/i],
    icon: '📧',
    recommendation: 'Email (Mailchimp)',
  },
  {
    name: 'hubspot',
    displayName: 'HubSpot',
    category: 'email',
    sourcePatterns: [/^hubspot$/i, /^hs$/i],
    mediumPatterns: [/email/i, /newsletter/i, /marketing/i],
    clickIdParams: [],
    domainPatterns: [/hubspot\.com/i, /hs-analytics/i],
    icon: '🧡',
    recommendation: 'Email (HubSpot)',
  },
  {
    name: 'klaviyo',
    displayName: 'Klaviyo',
    category: 'email',
    sourcePatterns: [/^klaviyo$/i],
    mediumPatterns: [/email/i, /newsletter/i],
    clickIdParams: [],
    domainPatterns: [/klaviyo\.com/i],
    icon: '💚',
    recommendation: 'Email (Klaviyo)',
  },
  {
    name: 'sendgrid',
    displayName: 'SendGrid',
    category: 'email',
    sourcePatterns: [/^sendgrid$/i],
    mediumPatterns: [/email/i, /newsletter/i, /transactional/i],
    clickIdParams: [],
    domainPatterns: [/sendgrid\.net/i],
    icon: '📨',
    recommendation: 'Email (SendGrid)',
  },
  {
    name: 'email_generic',
    displayName: 'Email',
    category: 'email',
    sourcePatterns: [/email/i, /newsletter/i, /mail$/i, /^e[-_]?mail$/i],
    mediumPatterns: [/email/i, /newsletter/i, /e[-_]?mail/i],
    clickIdParams: [],
    domainPatterns: [],
    icon: '✉️',
    recommendation: 'Email',
  },

  // Messaging Platforms
  {
    name: 'whatsapp',
    displayName: 'WhatsApp',
    category: 'messaging',
    sourcePatterns: [/^whatsapp$/i, /^wa$/i],
    mediumPatterns: [/social/i, /messaging/i, /chat/i],
    clickIdParams: [],
    domainPatterns: [/whatsapp\.com/i, /wa\.me/i],
    icon: '💬',
    recommendation: 'WhatsApp',
  },
  {
    name: 'telegram',
    displayName: 'Telegram',
    category: 'messaging',
    sourcePatterns: [/^telegram$/i, /^tg$/i],
    mediumPatterns: [/social/i, /messaging/i, /chat/i],
    clickIdParams: [],
    domainPatterns: [/telegram\.org/i, /t\.me/i],
    icon: '📱',
    recommendation: 'Telegram',
  },

  // Affiliate/Referral
  {
    name: 'affiliate_generic',
    displayName: 'Affiliate',
    category: 'affiliate',
    sourcePatterns: [/affiliate/i, /partner/i, /referral/i],
    mediumPatterns: [/affiliate/i, /partner/i, /referral/i, /cpa/i],
    clickIdParams: ['irclickid', 'aff_id', 'affiliate_id'],
    domainPatterns: [],
    icon: '🤝',
    recommendation: 'Affiliate/Partner',
  },

  // Display Advertising
  {
    name: 'display_generic',
    displayName: 'Display Advertising',
    category: 'display',
    sourcePatterns: [/display/i, /banner/i, /programmatic/i],
    mediumPatterns: [/display/i, /banner/i, /cpm/i, /programmatic/i],
    clickIdParams: ['dclid'],
    domainPatterns: [],
    icon: '🖼️',
    recommendation: 'Display Advertising',
  },
];

/**
 * Medium type mappings for consistent categorization.
 *
 * To add a new medium:
 * 1. Add the lowercase key (mediums are normalized to lowercase)
 * 2. Set displayName for user-friendly output
 * 3. Set isPaid to indicate paid vs organic traffic
 */
export const MEDIUM_CATEGORIES: Record<string, { displayName: string; isPaid: boolean }> = {
  // Paid Search mediums (recommended: paidsearch)
  paidsearch: { displayName: 'Paid Search', isPaid: true },
  cpc: { displayName: 'Paid Search (CPC)', isPaid: true },
  ppc: { displayName: 'Paid Search (PPC)', isPaid: true },
  search: { displayName: 'Search', isPaid: false }, // Could be organic or paid

  // Paid Social mediums (recommended: paidsocial)
  paidsocial: { displayName: 'Paid Social', isPaid: true },
  'paid-social': { displayName: 'Paid Social', isPaid: true },
  'paid_social': { displayName: 'Paid Social', isPaid: true },

  // Paid Display mediums
  display: { displayName: 'Display Advertising', isPaid: true },
  cpm: { displayName: 'Paid Display (CPM)', isPaid: true },
  banner: { displayName: 'Banner Advertising', isPaid: true },
  programmatic: { displayName: 'Programmatic Display', isPaid: true },

  // Video advertising
  video: { displayName: 'Video Advertising', isPaid: true },
  'paid-video': { displayName: 'Paid Video', isPaid: true },
  'paid_video': { displayName: 'Paid Video', isPaid: true },

  // Retargeting/Remarketing
  retargeting: { displayName: 'Retargeting', isPaid: true },
  remarketing: { displayName: 'Remarketing', isPaid: true },

  // Affiliate
  affiliate: { displayName: 'Affiliate', isPaid: true },
  cpa: { displayName: 'Affiliate (CPA)', isPaid: true },
  partner: { displayName: 'Partner', isPaid: true },

  // Generic paid
  paid: { displayName: 'Paid', isPaid: true },

  // Organic mediums
  organic: { displayName: 'Organic Search', isPaid: false },
  social: { displayName: 'Organic Social', isPaid: false },

  // Email mediums
  email: { displayName: 'Email', isPaid: false },
  newsletter: { displayName: 'Newsletter', isPaid: false },
  'email-marketing': { displayName: 'Email Marketing', isPaid: false },
  'email_marketing': { displayName: 'Email Marketing', isPaid: false },

  // Referral/Direct
  referral: { displayName: 'Referral', isPaid: false },
  direct: { displayName: 'Direct', isPaid: false },
  none: { displayName: 'Direct/None', isPaid: false },
  '(none)': { displayName: 'Direct', isPaid: false },
  '(not set)': { displayName: 'Not Set', isPaid: false },

  // Content marketing
  content: { displayName: 'Content Marketing', isPaid: false },
  blog: { displayName: 'Blog', isPaid: false },
  pr: { displayName: 'Public Relations', isPaid: false },
};

/**
 * Common source name normalizations.
 * Maps abbreviated or alternate source names to their canonical display names.
 *
 * To add a new normalization:
 * 1. Add the lowercase key (sources are normalized to lowercase)
 * 2. Set the value to the canonical display name
 */
export const SOURCE_NORMALIZATIONS: Record<string, string> = {
  // Social media
  fb: 'Facebook',
  facebook: 'Facebook',
  ig: 'Instagram',
  instagram: 'Instagram',
  tt: 'TikTok',
  tiktok: 'TikTok',
  tw: 'Twitter/X',
  twitter: 'Twitter/X',
  x: 'Twitter/X',
  li: 'LinkedIn',
  linkedin: 'LinkedIn',
  pin: 'Pinterest',
  pinterest: 'Pinterest',
  snap: 'Snapchat',
  snapchat: 'Snapchat',
  reddit: 'Reddit',

  // Video
  yt: 'YouTube',
  youtube: 'YouTube',

  // Search engines
  ggl: 'Google',
  google: 'Google',
  bing: 'Bing',
  msn: 'Bing/Microsoft',
  ddg: 'DuckDuckGo',
  duckduckgo: 'DuckDuckGo',
  yahoo: 'Yahoo',
  yandex: 'Yandex',

  // Messaging
  wa: 'WhatsApp',
  whatsapp: 'WhatsApp',
  tg: 'Telegram',
  telegram: 'Telegram',

  // Email
  mc: 'Mailchimp',
  mailchimp: 'Mailchimp',
  hs: 'HubSpot',
  hubspot: 'HubSpot',
  klaviyo: 'Klaviyo',
  sendgrid: 'SendGrid',
};
