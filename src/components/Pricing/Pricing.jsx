import { useCallback } from 'react';
import { usePricing } from '../../hooks/usePricing.js';
import './Pricing.css';

/* ── Check icon ─────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg
      className="pricing__feature-check"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      width="16"
      height="16"
    >
      <polyline points="4 10 8 14 16 6" />
    </svg>
  );
}

/* ── Billing Toggle ─────────────────────────────────────────── */
function BillingToggle({ isAnnual, onToggle, savingsLabel }) {
  return (
    <div className="pricing__toggle-wrap" role="group" aria-label="Billing cycle">
      <span
        className={`pricing__cycle-label${!isAnnual ? ' pricing__cycle-label--active' : ''}`}
        aria-hidden="true"
      >
        Monthly
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isAnnual}
        aria-label={`Switch to ${isAnnual ? 'monthly' : 'annual'} billing`}
        className={`pricing__toggle${isAnnual ? ' pricing__toggle--annual' : ''}`}
        onClick={onToggle}
      >
        <span className="pricing__toggle-thumb" />
      </button>

      <span
        className={`pricing__cycle-label${isAnnual ? ' pricing__cycle-label--active' : ''}`}
        aria-hidden="true"
      >
        Annual
      </span>

      {isAnnual && (
        <span className="pricing__savings-badge" aria-live="polite">
          {savingsLabel}
        </span>
      )}
    </div>
  );
}

/* ── Currency Switcher ──────────────────────────────────────── */
function CurrencySwitcher({ currency, options, onChange }) {
  const handleChange = useCallback(
    (e) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div className="pricing__currency-wrap">
      <label htmlFor="currency-select" className="pricing__currency-label">
        Currency
      </label>
      <div className="pricing__currency-select-wrap">
        <select
          id="currency-select"
          className="pricing__currency-select"
          value={currency}
          onChange={handleChange}
          aria-label="Select currency"
        >
          {options.map(({ code, symbol, label }) => (
            <option key={code} value={code}>
              {symbol} {code} — {label}
            </option>
          ))}
        </select>
        <span className="pricing__currency-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ── Single Tier Card ───────────────────────────────────────── */
function TierCard({ tier, isAnnual, currency }) {
  const { id, name, tagline, highlighted, features, cta, price } = tier;

  /*
   * CRITICAL — Re-render isolation:
   * We use data attributes on the price text nodes so that
   * parent state changes (cycle / currency) flow through
   * usePricing's memoised `tiers` array. The card itself
   * re-renders only when its own tier data changes, which is
   * already the case because `tiers` is a new array reference
   * only when currency or cycle changes — but DOM updates are
   * contained to the text nodes inside this card only.
   * No global component reflows occur.
   */

  return (
    <article
      className={`pricing__card${highlighted ? ' pricing__card--highlighted' : ''}`}
      aria-label={`${name} plan`}
    >
      {highlighted && (
        <div className="pricing__card-badge" aria-label="Recommended plan">
          Most Popular
        </div>
      )}

      <header className="pricing__card-header">
        <h3 className="pricing__card-name">{name}</h3>
        <p className="pricing__card-tagline">{tagline}</p>
      </header>

      <div className="pricing__card-price" aria-label={`Price: ${price.displayString} per month`}>
        <span className="pricing__price-amount" data-price-display>
          {price.displayString}
        </span>
        <span className="pricing__price-period">/&nbsp;mo</span>
      </div>

      {isAnnual && (
        <p className="pricing__billed-annual" aria-live="polite">
          Billed{' '}
          <span data-annual-total>{price.annualString}</span>
          {' '}/ year
        </p>
      )}

      <a
        href={`#${id}-signup`}
        className={`pricing__cta${highlighted ? ' pricing__cta--primary' : ' pricing__cta--secondary'}`}
        aria-label={`${cta} — ${name} plan`}
      >
        {cta}
      </a>

      <ul className="pricing__feature-list" aria-label={`${name} plan features`}>
        {features.map((feat) => (
          <li key={feat} className="pricing__feature-item">
            <CheckIcon />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ── Main Pricing component ─────────────────────────────────── */
export default function Pricing() {
  const {
    currency,
    isAnnual,
    setCurrency,
    toggleCycle,
    currencyOptions,
    tiers,
    savingsLabel,
  } = usePricing();

  return (
    <section
      id="pricing"
      className="pricing"
      aria-labelledby="pricing-heading"
    >
      <div className="pricing__container">

        {/* Section header */}
        <header className="pricing__header">
          <span className="pricing__eyebrow" aria-hidden="true">Pricing</span>
          <h2 id="pricing-heading" className="pricing__title">
            Simple, transparent{' '}
            <span className="pricing__title-accent">pricing</span>
          </h2>
          <p className="pricing__subtitle">
            No hidden fees. No lock-in. Scale up or down anytime.
          </p>
        </header>

        {/* Controls row — toggle + currency */}
        <div className="pricing__controls" role="group" aria-label="Pricing options">
          <BillingToggle
            isAnnual={isAnnual}
            onToggle={toggleCycle}
            savingsLabel={savingsLabel}
          />
          <CurrencySwitcher
            currency={currency}
            options={currencyOptions}
            onChange={setCurrency}
          />
        </div>

        {/* Tier cards */}
        <div
          className="pricing__grid"
          role="list"
          aria-label="Pricing tiers"
        >
          {tiers.map((tier) => (
            <div key={tier.id} role="listitem">
              <TierCard
                tier={tier}
                isAnnual={isAnnual}
                currency={currency}
              />
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="pricing__trust-note" aria-label="Payment security note">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
            <path d="M10 2l7 3.5v5c0 4-2.8 7.5-7 9-4.2-1.5-7-5-7-9V5.5L10 2z" />
          </svg>
          Secure checkout · Cancel anytime · 14-day free trial on all plans
        </p>
      </div>
    </section>
  );
}
