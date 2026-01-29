/**
 * UTM Source Detection Engine
 * Analyzes URLs and UTM parameters to identify traffic sources with confidence scoring.
 */

import {
  BRAND_PATTERNS,
  CLICK_ID_DEFINITIONS,
  MEDIUM_CATEGORIES,
  SOURCE_NORMALIZATIONS,
  type BrandPattern,
  type ClickIdDefinition,
} from '../data/brand-patterns';

export interface UTMParameters {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

export interface DetectedClickId {
  param: string;
  value: string;
  definition: ClickIdDefinition;
}

export interface DetectionResult {
  source: string;
  sourceDisplayName: string;
  medium: string;
  mediumDisplayName: string;
  isPaid: boolean;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  icon: string;
  recommendation: string;
  matchedBrand: BrandPattern | null;
  detectedClickIds: DetectedClickId[];
  signals: DetectionSignal[];
  rawUtmParams: Partial<UTMParameters>;
}

export interface DetectionSignal {
  type: 'click_id' | 'utm_source' | 'utm_medium' | 'domain' | 'pattern';
  description: string;
  weight: number;
}

export interface ParsedURL {
  url: string;
  hostname: string;
  pathname: string;
  params: Map<string, string>;
  utmParams: Partial<UTMParameters>;
  clickIds: DetectedClickId[];
}

/**
 * Parse a URL and extract all relevant parameters.
 */
export function parseURL(urlString: string): ParsedURL | null {
  try {
    // Ensure URL has a protocol
    let normalizedUrl = urlString.trim();
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const url = new URL(normalizedUrl);
    const params = new Map<string, string>();

    url.searchParams.forEach((value, key) => {
      params.set(key.toLowerCase(), value);
    });

    const utmParams: Partial<UTMParameters> = {};
    const utmKeys: (keyof UTMParameters)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    for (const key of utmKeys) {
      const value = params.get(key);
      if (value) {
        utmParams[key] = value;
      }
    }

    const clickIds = detectClickIds(params);

    return {
      url: url.href,
      hostname: url.hostname,
      pathname: url.pathname,
      params,
      utmParams,
      clickIds,
    };
  } catch {
    return null;
  }
}

/**
 * Detect click IDs from URL parameters.
 */
function detectClickIds(params: Map<string, string>): DetectedClickId[] {
  const detected: DetectedClickId[] = [];

  for (const definition of CLICK_ID_DEFINITIONS) {
    const value = params.get(definition.param.toLowerCase());
    if (value) {
      detected.push({
        param: definition.param,
        value,
        definition,
      });
    }
  }

  return detected;
}

/**
 * Match a source string against brand patterns.
 */
function matchBrandBySource(source: string): BrandPattern | null {
  const normalizedSource = source.toLowerCase().trim();

  for (const brand of BRAND_PATTERNS) {
    for (const pattern of brand.sourcePatterns) {
      if (pattern.test(normalizedSource)) {
        return brand;
      }
    }
  }

  return null;
}

/**
 * Match a domain against brand patterns.
 */
function matchBrandByDomain(hostname: string): BrandPattern | null {
  const normalizedHostname = hostname.toLowerCase();

  for (const brand of BRAND_PATTERNS) {
    for (const pattern of brand.domainPatterns) {
      if (pattern.test(normalizedHostname)) {
        return brand;
      }
    }
  }

  return null;
}

/**
 * Match by click ID.
 */
function matchBrandByClickId(clickIds: DetectedClickId[]): BrandPattern | null {
  if (clickIds.length === 0) return null;

  const primaryClickId = clickIds[0];

  for (const brand of BRAND_PATTERNS) {
    if (brand.clickIdParams.includes(primaryClickId.param)) {
      return brand;
    }
  }

  return null;
}

/**
 * Determine if the traffic is paid based on various signals.
 */
function determinePaidStatus(
  medium: string,
  clickIds: DetectedClickId[],
  matchedBrand: BrandPattern | null
): boolean {
  // Check click IDs first - most reliable
  for (const clickId of clickIds) {
    if (clickId.definition.isPaid) {
      return true;
    }
  }

  // Check medium
  const normalizedMedium = medium.toLowerCase().replace(/[-_]/g, '');
  const mediumInfo = MEDIUM_CATEGORIES[normalizedMedium] || MEDIUM_CATEGORIES[medium.toLowerCase()];
  if (mediumInfo?.isPaid) {
    return true;
  }

  // Check for paid indicators in medium
  const paidMediumPatterns = [/cpc/i, /ppc/i, /cpm/i, /paid/i, /cpa/i, /display/i, /retarget/i, /remarketing/i];
  for (const pattern of paidMediumPatterns) {
    if (pattern.test(medium)) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate confidence score based on available signals.
 */
function calculateConfidence(signals: DetectionSignal[]): number {
  if (signals.length === 0) return 0;

  let totalWeight = 0;
  let maxPossibleWeight = 100;

  for (const signal of signals) {
    totalWeight += signal.weight;
  }

  // Normalize to 0-100 range
  const confidence = Math.min(100, Math.round((totalWeight / maxPossibleWeight) * 100));
  return Math.max(0, confidence);
}

/**
 * Get confidence level label.
 */
function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 80) return 'high';
  if (confidence >= 50) return 'medium';
  return 'low';
}

/**
 * Get display name for medium.
 */
function getMediumDisplayName(medium: string, isPaid: boolean): string {
  const normalizedMedium = medium.toLowerCase().replace(/[-_]/g, '');
  const mediumInfo = MEDIUM_CATEGORIES[normalizedMedium] || MEDIUM_CATEGORIES[medium.toLowerCase()];

  if (mediumInfo) {
    return mediumInfo.displayName;
  }

  // Generate a readable name
  const formatted = medium
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return isPaid ? `Paid (${formatted})` : formatted;
}

/**
 * Normalize and get display name for source.
 */
function getSourceDisplayName(source: string, matchedBrand: BrandPattern | null): string {
  if (matchedBrand) {
    return matchedBrand.displayName;
  }

  const normalizedKey = source.toLowerCase();
  if (SOURCE_NORMALIZATIONS[normalizedKey]) {
    return SOURCE_NORMALIZATIONS[normalizedKey];
  }

  // Capitalize first letter of each word
  return source
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generate recommendation text for the user.
 */
function generateRecommendation(
  matchedBrand: BrandPattern | null,
  source: string,
  medium: string,
  isPaid: boolean,
  confidence: number
): string {
  const parts: string[] = [];

  // Source recommendation
  if (matchedBrand) {
    parts.push(matchedBrand.recommendation);
  } else if (source) {
    parts.push(getSourceDisplayName(source, null));
  } else {
    parts.push('Unknown Source');
  }

  // Add medium context
  if (isPaid) {
    parts.push('(Paid)');
  } else if (medium && medium.toLowerCase() !== 'none' && medium !== '(none)') {
    const mediumDisplay = getMediumDisplayName(medium, isPaid);
    if (!mediumDisplay.toLowerCase().includes('direct')) {
      parts.push(`(${mediumDisplay})`);
    }
  }

  return parts.join(' ');
}

/**
 * Main detection function - analyzes URL and/or UTM parameters.
 */
export function detectSource(
  urlString?: string,
  manualUtmParams?: Partial<UTMParameters>
): DetectionResult {
  const signals: DetectionSignal[] = [];
  let matchedBrand: BrandPattern | null = null;
  let utmParams: Partial<UTMParameters> = manualUtmParams || {};
  let clickIds: DetectedClickId[] = [];
  let hostname = '';

  // Parse URL if provided
  if (urlString && urlString.trim()) {
    const parsed = parseURL(urlString);
    if (parsed) {
      hostname = parsed.hostname;
      clickIds = parsed.clickIds;

      // Merge URL params with manual params (manual takes precedence)
      utmParams = {
        ...parsed.utmParams,
        ...manualUtmParams,
      };

      // Remove empty values from manual params
      for (const key of Object.keys(utmParams) as (keyof UTMParameters)[]) {
        if (!utmParams[key]?.trim()) {
          delete utmParams[key];
        }
      }
    }
  }

  // Gather signals and match brands
  // Priority: UTM source > Click ID > Domain (UTM source is explicit, most reliable for brand)

  // 1. UTM Source signal (highest priority for brand matching)
  if (utmParams.utm_source) {
    const sourceBrand = matchBrandBySource(utmParams.utm_source);
    if (sourceBrand) {
      signals.push({
        type: 'utm_source',
        description: `UTM source matches ${sourceBrand.displayName}`,
        weight: 35,
      });
      matchedBrand = sourceBrand;
    } else {
      signals.push({
        type: 'utm_source',
        description: `UTM source present: ${utmParams.utm_source}`,
        weight: 20,
      });
    }
  }

  // 2. Click ID signals (adds confidence, may set brand if not already set)
  for (const clickId of clickIds) {
    signals.push({
      type: 'click_id',
      description: `${clickId.definition.displayName} click ID detected (${clickId.param})`,
      weight: clickId.definition.confidence * 0.4,
    });
  }

  if (clickIds.length > 0 && !matchedBrand) {
    matchedBrand = matchBrandByClickId(clickIds);
  }

  // 3. UTM Medium signal
  if (utmParams.utm_medium) {
    signals.push({
      type: 'utm_medium',
      description: `UTM medium present: ${utmParams.utm_medium}`,
      weight: 15,
    });
  }

  // 4. Domain signal (for referrer detection, lowest priority)
  if (hostname && !matchedBrand) {
    const domainBrand = matchBrandByDomain(hostname);
    if (domainBrand) {
      signals.push({
        type: 'domain',
        description: `Domain matches ${domainBrand.displayName}`,
        weight: 25,
      });
      matchedBrand = domainBrand;
    }
  }

  // Determine values
  const source = utmParams.utm_source || (matchedBrand?.name) || '';
  const medium = utmParams.utm_medium || '';
  const isPaid = determinePaidStatus(medium, clickIds, matchedBrand);
  const confidence = calculateConfidence(signals);
  const confidenceLevel = getConfidenceLevel(confidence);

  // Handle case with no signals
  if (signals.length === 0) {
    return {
      source: '',
      sourceDisplayName: 'Unknown',
      medium: '',
      mediumDisplayName: 'Unknown',
      isPaid: false,
      confidence: 0,
      confidenceLevel: 'low',
      icon: '❓',
      recommendation: 'Unable to detect source. Please provide a URL or UTM parameters.',
      matchedBrand: null,
      detectedClickIds: [],
      signals: [],
      rawUtmParams: utmParams,
    };
  }

  return {
    source,
    sourceDisplayName: getSourceDisplayName(source, matchedBrand),
    medium,
    mediumDisplayName: medium ? getMediumDisplayName(medium, isPaid) : (isPaid ? 'Paid' : 'Unknown'),
    isPaid,
    confidence,
    confidenceLevel,
    icon: matchedBrand?.icon || (isPaid ? '💰' : '🔗'),
    recommendation: generateRecommendation(matchedBrand, source, medium, isPaid, confidence),
    matchedBrand,
    detectedClickIds: clickIds,
    signals,
    rawUtmParams: utmParams,
  };
}

/**
 * Format confidence as a percentage string.
 */
export function formatConfidence(confidence: number): string {
  return `${confidence}%`;
}

/**
 * Get CSS class for confidence level.
 */
export function getConfidenceClass(level: 'high' | 'medium' | 'low'): string {
  const classes: Record<string, string> = {
    high: 'confidence-high',
    medium: 'confidence-medium',
    low: 'confidence-low',
  };
  return classes[level] || classes.low;
}
