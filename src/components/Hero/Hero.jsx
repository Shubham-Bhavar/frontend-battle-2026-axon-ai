import './Hero.css';

/* ── Static pipeline data — local to Hero, not shared state ─ */
const PIPELINES = [
  { id: 'p1', icon: 'AI',  iconClass: 'yellow', name: 'LLM Enrichment Pipeline',  width: '82%', status: 'Running', badgeClass: 'running' },
  { id: 'p2', icon: 'DB',  iconClass: 'teal',   name: 'CRM Sync — Salesforce',    width: '61%', status: 'Queued',  badgeClass: 'queued', barClass: 'teal-bar' },
  { id: 'p3', icon: 'OK',  iconClass: 'green',  name: 'Invoice Classifier v2',    width: '100%',status: 'Done',    badgeClass: 'done',   barClass: 'green-bar' },
];

const METRICS = [
  { value: '2.4M',  label: 'API Calls',     trend: '↑ 18%', accent: false },
  { value: '99.9%', label: 'Uptime SLA',    trend: null,    accent: true  },
  { value: '140ms', label: 'Avg Latency',   trend: '↓ 12ms',accent: false },
];

const PROOF_AVATARS = ['AK', 'RJ', 'ML', 'S+'];

/* ── Dashboard mockup — pure semantic HTML, no canvas/SVG ── */
function DashboardMockup() {
  return (
    <figure className="hero__dashboard" aria-label="Axon AI platform dashboard preview">

      {/* Top bar */}
      <div className="hero__dashboard-topbar" aria-hidden="true">
        <div className="hero__dashboard-dots">
          <span className="hero__dashboard-dot" />
          <span className="hero__dashboard-dot" />
          <span className="hero__dashboard-dot" />
        </div>
        <span className="hero__dashboard-title">axon.ai / workspace</span>
        <div className="hero__dashboard-status">
          <span className="hero__dashboard-status-dot" />
          <span className="hero__dashboard-status-text">Live</span>
        </div>
      </div>

      {/* Metric tiles */}
      <div className="hero__metrics" role="list" aria-label="Platform metrics">
        {METRICS.map(m => (
          <div key={m.label} className="hero__metric" role="listitem">
            <span className={`hero__metric-value${m.accent ? ' accent' : ''}`}>
              {m.value}
            </span>
            <span className="hero__metric-label">{m.label}</span>
            {m.trend && (
              <span className="hero__metric-trend" aria-label={`Trend: ${m.trend}`}>
                {m.trend}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Pipeline trace */}
      <div className="hero__pipeline" aria-label="Active pipeline runs">
        <p className="hero__pipeline-label" aria-hidden="true">Active Pipelines</p>
        {PIPELINES.map(p => (
          <div key={p.id} className="hero__pipeline-row">
            <span className={`hero__pipeline-icon ${p.iconClass}`} aria-hidden="true">
              {p.icon}
            </span>
            <span className="hero__pipeline-name">{p.name}</span>
            <div className="hero__pipeline-bar-wrap" role="progressbar" aria-label={`${p.name} progress`} aria-valuenow={parseInt(p.width)} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`hero__pipeline-bar${p.barClass ? ` ${p.barClass}` : ''}`}
                style={{ width: p.width }}
              />
            </div>
            <span className={`hero__pipeline-badge ${p.badgeClass}`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>

    </figure>
  );
}

/* ── Main Hero component ─────────────────────────────────── */
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">

      {/* Background layers — decorative */}
      <div className="hero__bg-glow"  aria-hidden="true" />
      <div className="hero__bg-grid"  aria-hidden="true" />
      <div className="hero__bg-fade"  aria-hidden="true" />

      <div className="hero__container">

        {/* ── Left: Text content ───────────────────────────── */}
        <div className="hero__content">

          {/* Eyebrow */}
          <div className="hero__eyebrow" aria-label="New: GPT-4o pipelines are now live">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            <span className="hero__eyebrow-text">GPT-4o Pipelines — Now Live</span>
          </div>

          {/* H1 */}
          <h1 id="hero-heading" className="hero__heading">
            <span className="hero__heading-line">Automate</span>
            <span className="hero__heading-line">
              every workflow
            </span>
            <span className="hero__heading-line">
              with{' '}
              <span className="hero__heading-accent">AI precision</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="hero__subheadline">
            Axon connects your data, models, and tools into self-healing pipelines —
            so your team ships intelligent automation in hours, not quarters.
          </p>

          {/* CTA buttons */}
          <nav className="hero__cta" aria-label="Get started actions">
            <a href="#signup" className="hero__cta-primary">
              Start Building Free
              <span className="hero__cta-primary-icon" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
            <a href="#demo" className="hero__cta-secondary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5.5 4.5l4 2.5-4 2.5V4.5z" fill="currentColor"/>
              </svg>
              Watch Demo
            </a>
          </nav>

          {/* Social proof */}
          <div className="hero__proof">
            <div className="hero__proof-avatars" aria-hidden="true">
              {PROOF_AVATARS.map((initials, i) => (
                <span key={i} className="hero__proof-avatar">{initials}</span>
              ))}
            </div>
            <div className="hero__proof-text">
              <span className="hero__proof-count">12,000+</span>
              <span className="hero__proof-label">engineers shipping faster</span>
            </div>
            <div className="hero__proof-rating" aria-label="Rated 4.9 out of 5 stars">
              <div className="hero__proof-stars" aria-hidden="true">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="hero__proof-star">★</span>
                ))}
              </div>
              <span className="hero__proof-rating-text">4.9</span>
            </div>
          </div>

        </div>

        {/* ── Right: Dashboard visual ───────────────────────── */}
        <div className="hero__visual">

          {/* Floating badge — top right */}
          <div className="hero__float-badge" aria-hidden="true">
            <span className="hero__float-badge-icon">⚡</span>
            <span className="hero__float-badge-text">2,847 runs today</span>
          </div>

          <DashboardMockup />

          {/* Floating badge — bottom left */}
          <div className="hero__float-badge-2" aria-hidden="true">
            <div className="hero__float-badge-2-icon">🤖</div>
            <div className="hero__float-badge-2-text">
              <span className="hero__float-badge-2-title">AI step added</span>
              <span className="hero__float-badge-2-sub">Invoice Classifier · 2s ago</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
