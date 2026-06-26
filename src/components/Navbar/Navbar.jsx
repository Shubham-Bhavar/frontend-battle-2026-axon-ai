import { useState, useEffect, useCallback } from 'react';
import { navLinks, navCTA } from '../../data/index.js';
import './Navbar.css';

/* ── Logo mark SVG — inline, no external assets ─────────── */
function LogoMark() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M3 9 L9 3 L15 9 L9 15 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="9" cy="9" r="2" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [activeSection, setActiveSection] = useState('');

  /* ── Scroll detection ──────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active section via IntersectionObserver ───────────── */
  useEffect(() => {
    const sectionIds = navLinks.map(l => l.href.replace('#', ''));
    const targets    = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, []);

  /* ── Close menu on outside click / resize ──────────────── */
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onResize = () => { if (window.innerWidth >= 1024) closeMenu(); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [isMenuOpen, closeMenu]);

  /* ── Prevent body scroll while menu open ───────────────── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <>
      <header
        className={`navbar${isScrolled ? ' is-scrolled' : ''}`}
        role="banner"
      >
        <div className="navbar__inner">

          {/* Logo */}
          <a href="#" className="navbar__logo" aria-label="Axon AI — home">
            <span className="navbar__logo-mark" aria-hidden="true">
              <LogoMark />
            </span>
            <span className="navbar__logo-text">
              axon<span>.</span>ai
            </span>
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Primary navigation">
            <ul className="navbar__nav" role="list">
              {navLinks.map(link => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className={`navbar__nav-link${activeSection === link.href ? ' is-active' : ''}`}
                    aria-current={activeSection === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <div className="navbar__cta">
            <a href={navCTA.secondary.href} className="navbar__cta-signin">
              {navCTA.secondary.label}
            </a>
            <a href={navCTA.primary.href} className="navbar__cta-primary">
              {navCTA.primary.label}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Hamburger */}
          <button
            className={`navbar__hamburger${isMenuOpen ? ' is-open' : ''}`}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className="navbar__hamburger-line" aria-hidden="true" />
            <span className="navbar__hamburger-line" aria-hidden="true" />
            <span className="navbar__hamburger-line" aria-hidden="true" />
          </button>

        </div>
      </header>

      {/* Mobile drawer */}
      <nav
        id="mobile-menu"
        className={`navbar__mobile-menu${isMenuOpen ? ' is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className="navbar__mobile-inner">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={link.href}
              className="navbar__mobile-link"
              onClick={closeMenu}
              aria-current={activeSection === link.href ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}

          <div className="navbar__mobile-divider" role="separator" />

          <div className="navbar__mobile-cta">
            <a href={navCTA.secondary.href} className="navbar__mobile-signin" onClick={closeMenu}>
              {navCTA.secondary.label}
            </a>
            <a href={navCTA.primary.href} className="navbar__mobile-primary" onClick={closeMenu}>
              {navCTA.primary.label}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
