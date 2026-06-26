import Navbar   from './components/Navbar/Navbar.jsx';
import Hero     from './components/Hero/Hero.jsx';
import Features from './components/Features/Features.jsx';
import Pricing  from './components/Pricing/Pricing.jsx';
import Footer   from './components/Footer/Footer.jsx';

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <Features />
        <Pricing />
      </main>

      <Footer />
    </>
  );
}
