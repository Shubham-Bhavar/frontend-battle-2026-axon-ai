import { useBentoAccordion } from '../../hooks/useBentoAccordion.js';
import { featuresData }      from '../../data/index.js';
import './Features.css';

/* ── Icon glyphs — inline SVG paths keyed by feature icon id ─ */
const ICON_PATHS = {
  pipeline:      'M3 6h18M3 12h18M3 18h18M9 3v18M15 3v18',
  'ai-inference':'M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5 5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 14c-5 0-9 2-9 4h18c0-2-4-4-9-4z',
  sync:          'M4 12v-2a8 8 0 0 1 16 0v2M20 12v2a8 8 0 0 1-16 0v-2M12 8v8M8 12l4-4 4 4',
  observability: 'M3 3h18v18H3zM9 9h6v6H9z M12 3v6M12 15v6M3 12h6M15 12h6',
  security:      'M12 2l8 4v6c0 5-3.5 9.7-8 11-4.5-1.3-8-6-8-11V6l8-4z',
  sdk:           'M8 9l-4 3 4 3M16 9l4 3-4 3M12 5l-2 14',
};

function FeatureIcon({ icon, label }) {
  const d = ICON_PATHS[icon] || ICON_PATHS.sdk;
  return (
    <svg
      className="feature__icon-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d.split('M').filter(Boolean).map((seg, i) => (
        <path key={i} d={`M${seg}`} />
      ))}
    </svg>
  );
}

/* ── Single bento card ─────────────────────────────────────── */
function BentoCard({ feature, isActive, onMouseEnter, onMouseLeave }) {
  const { id, eyebrow, title, body, icon, accent } = feature;

  return (
    <article
      className={`bento__card bento__card--accent-${accent}${isActive ? ' bento__card--active' : ''}`}
      style={{
        '--col-span': feature.colSpan,
        '--row-span': feature.rowSpan,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={title}
    >
      <div className="bento__card-inner">
        <div className="bento__card-icon" aria-hidden="true">
          <FeatureIcon icon={icon} />
        </div>
        <span className="bento__card-eyebrow">{eyebrow}</span>
        <h3 className="bento__card-title">{title}</h3>
        <p className="bento__card-body">{body}</p>
      </div>
      <div className="bento__card-glow" aria-hidden="true" />
    </article>
  );
}

/* ── Single accordion item ─────────────────────────────────── */
function AccordionItem({ feature, isOpen, onToggle }) {
  const { id, eyebrow, title, body, icon, index } = feature;
  const panelId  = `accordion-panel-${id}`;
  const headerId = `accordion-header-${id}`;

  return (
    <div
      className={`accordion__item${isOpen ? ' accordion__item--open' : ''}`}
    >
      <h3 className="accordion__heading">
        <button
          id={headerId}
          className="accordion__trigger"
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(index)}
        >
          <span className="accordion__trigger-icon" aria-hidden="true">
            <FeatureIcon icon={icon} />
          </span>
          <span className="accordion__trigger-text">
            <span className="accordion__eyebrow">{eyebrow}</span>
            <span className="accordion__title">{title}</span>
          </span>
          <span className="accordion__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="accordion__panel"
        hidden={!isOpen}
      >
        <p className="accordion__body">{body}</p>
      </div>
    </div>
  );
}

/* ── Main Features component ───────────────────────────────── */
export default function Features() {
  const {
    activeIndex,
    isDesktop,
    onBentoEnter,
    onBentoLeave,
    onAccordionToggle,
    isActive,
    isOpen,
  } = useBentoAccordion({ defaultIndex: 0 });

  return (
    <section
      id="features"
      className="features"
      aria-labelledby="features-heading"
    >
      <div className="features__container">
        {/* Section header */}
        <header className="features__header">
          <span className="features__eyebrow" aria-hidden="true">Platform Capabilities</span>
          <h2 id="features-heading" className="features__title">
            Everything your team needs<br />
            <span className="features__title-accent">to automate at scale</span>
          </h2>
          <p className="features__subtitle">
            From visual pipeline design to enterprise compliance — every tool built
            for production from day one.
          </p>
        </header>

        {/* Desktop: Bento Grid */}
        {isDesktop ? (
          <div
            className="bento__grid"
            role="list"
            aria-label="Platform features"
          >
            {featuresData.map((feature) => (
              <div
                key={feature.id}
                role="listitem"
                className="bento__cell"
                style={{
                  gridColumn: `span ${feature.colSpan}`,
                  gridRow:    `span ${feature.rowSpan}`,
                }}
              >
                <BentoCard
                  feature={feature}
                  isActive={isActive(feature.index)}
                  onMouseEnter={() => onBentoEnter(feature.index)}
                  onMouseLeave={() => onBentoLeave(feature.index)}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Mobile / Tablet: Accordion */
          <div
            className="accordion"
            role="list"
            aria-label="Platform features"
          >
            {featuresData.map((feature) => (
              <div key={feature.id} role="listitem">
                <AccordionItem
                  feature={feature}
                  isOpen={isOpen(feature.index)}
                  onToggle={onAccordionToggle}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
