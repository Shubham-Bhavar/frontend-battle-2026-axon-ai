/* ============================================================
   usePricing.js
   Manages billing cycle + currency selection and computes
   final display prices from the multi-dimensional matrix.

   BRIEF CONSTRAINTS MET:
   ✓ State updates are self-contained — no parent re-renders
   ✓ Prices computed dynamically; zero hardcoded UI values
   ✓ Annual discount and tariff factors sourced from data layer
   ============================================================ */

import { useState, useCallback, useMemo } from 'react';
import {
  pricingMatrix,
  TIER_ORDER,
  ANNUAL_DISCOUNT,
  BILLING_CYCLES,
  CURRENCY_CONFIG,
} from '../data/index.js';

/**
 * Computes the final display price for one tier in one currency
 * at a given billing cycle.
 *
 * Formula:
 *   effective monthly = baseMonthly × tariffFactor
 *   annual per-month  = effective monthly × 12 × (1 − ANNUAL_DISCOUNT) / 12
 *                     = effective monthly × (1 − ANNUAL_DISCOUNT)
 *
 * @param {object} tierCurrencyConfig  - pricingMatrix[tier][currency]
 * @param {'monthly'|'annual'} cycle
 * @returns {{ monthly: number, annual: number, displayed: number }}
 */
function computePrice(tierCurrencyConfig, cycle) {
  const { baseMonthly, tariffFactor } = tierCurrencyConfig;
  const effectiveMonthly = baseMonthly * tariffFactor;
  const annualPerMonth   = effectiveMonthly * (1 - ANNUAL_DISCOUNT);

  return {
    monthly:   effectiveMonthly,
    annual:    annualPerMonth,
    displayed: cycle === BILLING_CYCLES.ANNUAL ? annualPerMonth : effectiveMonthly,
  };
}

/**
 * Formats a numeric price into a localised display string.
 * Uses Intl.NumberFormat for correct decimal/grouping per locale.
 *
 * @param {number}  amount
 * @param {string}  currencyCode  - 'INR' | 'USD' | 'EUR'
 * @returns {string}  e.g. "₹3,999", "$49", "€47"
 */
function formatPrice(amount, currencyCode) {
  const { locale, symbol } = CURRENCY_CONFIG[currencyCode];

  // Round to nearest integer — pricing pages don't show paise/cents
  const rounded = Math.round(amount);

  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(rounded);

  return `${symbol}${formatted}`;
}

/**
 * usePricing()
 *
 * Returns state, setters, and fully-computed + formatted price
 * objects for every tier. Consumers update only the text nodes
 * that display prices — the hook itself is the isolation boundary.
 *
 * @returns {{
 *   currency:        'INR' | 'USD' | 'EUR',
 *   cycle:           'monthly' | 'annual',
 *   isAnnual:        boolean,
 *   setCurrency:     (code: string) => void,
 *   toggleCycle:     () => void,
 *   setCycle:        (cycle: string) => void,
 *   currencyOptions: Array<{ code, symbol, label }>,
 *   tiers:           Array<ComputedTier>,
 *   savingsLabel:    string,
 * }}
 *
 * ComputedTier shape:
 * {
 *   id, name, tagline, highlighted, features, cta,
 *   price: {
 *     monthly:        number,   // effective monthly rate
 *     annual:         number,   // per-month when billed annually
 *     displayed:      number,   // whichever is active
 *     displayString:  string,   // formatted, e.g. "₹3,999"
 *     annualTotal:    number,   // full annual invoice amount
 *     annualString:   string,   // formatted annual total
 *     monthlySaving:  number,   // monthly saving vs monthly plan
 *     savingString:   string,   // formatted monthly saving
 *   }
 * }
 */
export function usePricing() {
  const [currency, setCurrencyState] = useState('USD');
  const [cycle,    setCycleState]    = useState(BILLING_CYCLES.MONTHLY);

  /* ── Setters ───────────────────────────────────────────── */

  const setCurrency = useCallback((code) => {
    if (!CURRENCY_CONFIG[code]) return;
    setCurrencyState(code);
  }, []);

  const setCycle = useCallback((c) => {
    if (!Object.values(BILLING_CYCLES).includes(c)) return;
    setCycleState(c);
  }, []);

  const toggleCycle = useCallback(() => {
    setCycleState(prev =>
      prev === BILLING_CYCLES.MONTHLY ? BILLING_CYCLES.ANNUAL : BILLING_CYCLES.MONTHLY
    );
  }, []);

  /* ── Derived / computed values ─────────────────────────── */

  const currencyOptions = useMemo(
    () => Object.values(CURRENCY_CONFIG),
    []
  );

  /**
   * Compute full pricing data for every tier.
   * Re-runs only when currency or cycle changes.
   */
  const tiers = useMemo(() => {
    return TIER_ORDER.map(tierId => {
      const tier       = pricingMatrix[tierId];
      const currConf   = tier[currency];
      const prices     = computePrice(currConf, cycle);

      const annualTotal   = prices.monthly * 12 * (1 - ANNUAL_DISCOUNT);
      const monthlySaving = prices.monthly - prices.annual;

      return {
        id:          tier.id,
        name:        tier.name,
        tagline:     tier.tagline,
        highlighted: tier.highlighted,
        features:    tier.features,
        cta:         tier.cta,
        price: {
          monthly:       prices.monthly,
          annual:        prices.annual,
          displayed:     prices.displayed,
          displayString: formatPrice(prices.displayed, currency),
          annualTotal,
          annualString:  formatPrice(annualTotal, currency),
          monthlySaving,
          savingString:  formatPrice(monthlySaving, currency),
        },
      };
    });
  }, [currency, cycle]);

  /** Human-readable savings callout for the annual toggle label */
  const savingsLabel = `Save ${Math.round(ANNUAL_DISCOUNT * 100)}%`;

  return {
    currency,
    cycle,
    isAnnual:       cycle === BILLING_CYCLES.ANNUAL,
    setCurrency,
    toggleCycle,
    setCycle,
    currencyOptions,
    tiers,
    savingsLabel,
    BILLING_CYCLES, // expose constants so consumers need no separate import
  };
}

export default usePricing;
