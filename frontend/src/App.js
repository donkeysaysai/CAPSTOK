import { useEffect, useState, useRef, useCallback } from "react";
import "@/App.css";

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const keySequenceRef = useRef('');
  const keyTimerRef = useRef(null);
  const adminCode = '1990';

  // Show toast notification
  const displayToast = useCallback((message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  }, []);

  // Key sequence detection for admin mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only listen for number keys
      if (!/^[0-9]$/.test(e.key)) {
        keySequenceRef.current = '';
        return;
      }

      // Clear previous timer
      if (keyTimerRef.current) {
        clearTimeout(keyTimerRef.current);
      }

      // Add key to sequence
      keySequenceRef.current += e.key;

      // Set timer to reset sequence after 2 seconds
      keyTimerRef.current = setTimeout(() => {
        keySequenceRef.current = '';
      }, 2000);

      // Check if sequence matches admin code
      if (keySequenceRef.current === adminCode) {
        setIsAdminMode(prev => {
          const newMode = !prev;
          if (newMode) {
            displayToast('Bewerkingsmodus geactiveerd! Klik op tekst om te bewerken.', 'info');
          } else {
            displayToast('Bewerkingsmodus afgesloten.', 'info');
          }
          return newMode;
        });
        keySequenceRef.current = '';
      }

      // Trim sequence if it gets too long
      if (keySequenceRef.current.length > adminCode.length) {
        keySequenceRef.current = keySequenceRef.current.slice(-adminCode.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [displayToast]);

  // Copy HTML to clipboard
  const copyHtmlToClipboard = async () => {
    try {
      const fullHtml = document.documentElement.outerHTML;
      await navigator.clipboard.writeText(fullHtml);
      displayToast('HTML succesvol gekopieerd naar klembord! Plak dit in je GitHub repository.', 'success');
    } catch (err) {
      displayToast('Kopiëren mislukt. Probeer het opnieuw.', 'error');
    }
  };

  // Smooth scroll handler
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  // Editable text component
  const EditableText = ({ children, className, as: Tag = 'p', testId }) => {
    return (
      <Tag 
        className={`${className} ${isAdminMode ? 'editable-text' : ''}`}
        contentEditable={isAdminMode}
        suppressContentEditableWarning={true}
        data-testid={testId}
      >
        {children}
      </Tag>
    );
  };

  return (
    <div className={`capstok-app ${isAdminMode ? 'admin-mode' : ''}`}>
      {/* Admin Mode Banner */}
      {isAdminMode && (
        <div className="admin-banner" data-testid="admin-banner">
          <i className="fas fa-edit"></i>
          <span>BEWERKINGSMODUS ACTIEF - Klik op tekst om te bewerken</span>
          <button 
            onClick={() => { setIsAdminMode(false); displayToast('Bewerkingsmodus afgesloten.', 'info'); }}
            className="exit-admin-btn"
            data-testid="exit-admin-btn"
          >
            Afsluiten
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`navbar ${isAdminMode ? 'with-banner' : ''}`} data-testid="navbar">
        <div className="nav-container">
          <a href="#" className="logo-link" data-testid="logo-link">
            <img 
              src="https://customer-assets.emergentagent.com/job_capstok-preview/artifacts/l5ta1mn4_Capstok%20wit%20onder%20slogan.png" 
              alt="Capstok Logo" 
              className="logo"
            />
          </a>
          
          {/* Desktop Navigation */}
          <div className="nav-links desktop">
            <a href="#waarom" onClick={(e) => handleSmoothScroll(e, '#waarom')} data-testid="nav-waarom">Waarom Capstok</a>
            <a href="#producten" onClick={(e) => handleSmoothScroll(e, '#producten')} data-testid="nav-producten">Producten</a>
            <a href="#over-ons" onClick={(e) => handleSmoothScroll(e, '#over-ons')} data-testid="nav-over-ons">Over Ons</a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} data-testid="nav-contact">Contact</a>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu" data-testid="mobile-menu">
            <a href="#waarom" onClick={(e) => handleSmoothScroll(e, '#waarom')} data-testid="mobile-nav-waarom">Waarom Capstok</a>
            <a href="#producten" onClick={(e) => handleSmoothScroll(e, '#producten')} data-testid="mobile-nav-producten">Producten</a>
            <a href="#over-ons" onClick={(e) => handleSmoothScroll(e, '#over-ons')} data-testid="mobile-nav-over-ons">Over Ons</a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} data-testid="mobile-nav-contact">Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section" data-testid="hero-section">
        <div className="hero-background">
          <img 
            src="https://customer-assets.emergentagent.com/job_capstok-preview/artifacts/9hn6dlvw_home_Met_logo_2.jpg" 
            alt="Industrial Safety Background" 
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <EditableText as="h1" className="hero-title" testId="hero-title">Welcome to a safer future</EditableText>
          <EditableText className="hero-subtitle" testId="hero-subtitle">Het verantwoord opbergen van je helm verlaagt risico's op de werkvloer. Orde en netheid zijn tekenen van goed vakmanschap.</EditableText>
          <div className="hero-buttons">
            <a href="#producten" onClick={(e) => handleSmoothScroll(e, '#producten')} className="btn-primary" data-testid="hero-cta-products">
              Bekijk Producten
            </a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="btn-secondary" data-testid="hero-cta-contact">
              Neem Contact Op
            </a>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* Waarom Capstok Section */}
      <section id="waarom" className="section section-dark" data-testid="waarom-section">
        <div className="container">
          <div className="section-header">
            <EditableText className="section-label" testId="why-label">Waarom Kiezen</EditableText>
            <EditableText as="h2" className="section-title" testId="why-title">Waarom CAPSTOK</EditableText>
          </div>
          
          <div className="features-grid">
            {/* Feature 1: Veiligheid */}
            <div className="feature-card" data-testid="feature-safety">
              <div className="feature-icon">
                <i className="fas fa-shield-halved"></i>
              </div>
              <EditableText as="h3" className="feature-title">Veiligheid Voorop</EditableText>
              <EditableText className="feature-text">Het verantwoord opbergen van je helm verlaagt risico's op de werkvloer. Geen helm meer op de grond of op onveilige plekken.</EditableText>
            </div>
            
            {/* Feature 2: Orde */}
            <div className="feature-card" data-testid="feature-order">
              <div className="feature-icon">
                <i className="fas fa-layer-group"></i>
              </div>
              <EditableText as="h3" className="feature-title">Orde & Netheid</EditableText>
              <EditableText className="feature-text">Orde en netheid zijn tekenen van goed vakmanschap. Met CAPSTOK laat je zien dat je professioneel te werk gaat.</EditableText>
            </div>
            
            {/* Feature 3: Vakmanschap */}
            <div className="feature-card" data-testid="feature-craftsmanship">
              <div className="feature-icon">
                <i className="fas fa-hard-hat"></i>
              </div>
              <EditableText as="h3" className="feature-title">Vakmanschap</EditableText>
              <EditableText className="feature-text">Laat uw helm niet meer slingeren. Met Uw CAPSTOK toont u respect voor uw gereedschap en uw vak.</EditableText>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="producten" className="section section-surface" data-testid="producten-section">
        <div className="container">
          <div className="section-header">
            <EditableText className="section-label" testId="products-label">Onze Producten</EditableText>
            <EditableText as="h2" className="section-title" testId="products-title">Uw CAPSTOK</EditableText>
          </div>
          
          <div className="products-grid">
            {/* Product 1: White */}
            <div className="product-card" data-testid="product-white">
              <div className="product-image">
                <img 
                  src="https://customer-assets.emergentagent.com/job_capstok-preview/artifacts/7a8x3p3v_Capstok_Wit-transformed.jpg" 
                  alt="CAPSTOK Wit" 
                />
              </div>
              <div className="product-info">
                <EditableText as="h3" className="product-title">CAPSTOK Wit</EditableText>
                <EditableText className="product-description">De perfecte helmhouder in stijlvol wit. Past bij elke werkplaats of kantoor.</EditableText>
                <div className="product-footer">
                  <EditableText className="product-price" testId="price-white">€16,99</EditableText>
                  <a href="mailto:info@capstok.nl?subject=Bestelling CAPSTOK Wit" className="order-link" data-testid="order-white">
                    Bestel Nu <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Product 2: Black */}
            <div className="product-card" data-testid="product-black">
              <div className="product-image">
                <img 
                  src="https://customer-assets.emergentagent.com/job_capstok-preview/artifacts/ipnnh8am_Capstok_Zwart-transformed.jpg" 
                  alt="CAPSTOK Zwart" 
                />
              </div>
              <div className="product-info">
                <EditableText as="h3" className="product-title">CAPSTOK Zwart</EditableText>
                <EditableText className="product-description">De perfecte helmhouder in elegant zwart. Tijdloos en professioneel.</EditableText>
                <div className="product-footer">
                  <EditableText className="product-price" testId="price-black">€16,99</EditableText>
                  <a href="mailto:info@capstok.nl?subject=Bestelling CAPSTOK Zwart" className="order-link" data-testid="order-black">
                    Bestel Nu <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* USPs removed */}
        </div>
      </section>

      {/* Over Ons Section */}
      <section id="over-ons" className="section section-dark" data-testid="over-ons-section">
        <div className="container">
          <div className="about-grid">
            {/* Image */}
            <div className="about-image">
              <img 
                src="https://customer-assets.emergentagent.com/job_capstok-preview/artifacts/49kaiftr_Capstok_op_achtergrond.png" 
                alt="Industrial Worker" 
              />
            </div>
            
            {/* Content */}
            <div className="about-content">
              <EditableText className="section-label" testId="about-label">Ons Verhaal</EditableText>
              <EditableText as="h2" className="section-title left-aligned" testId="about-title">Over CAPSTOK</EditableText>
              <div className="about-text">
                <EditableText testId="about-text-1">CAPSTOK is ontstaan uit een simpele observatie: op veel werkplekken slingeren helmen rond, wat leidt tot onveilige situaties en een rommelige uitstraling.</EditableText>
                <EditableText testId="about-text-2">Wij geloven dat veiligheid en professionaliteit hand in hand gaan. Met onze slimme helmhouder bieden we een praktische oplossing die past bij elke werkplaats - van bouwplaatsen tot fabrieken.</EditableText>
                <EditableText testId="about-text-3">Onze missie is simpel: bijdragen aan een veiligere en meer georganiseerde werkomgeving, één helm tegelijk.</EditableText>
              </div>
              <div className="stats">
                <div className="stat" data-testid="stat-customers">
                  <EditableText className="stat-number">500+</EditableText>
                  <EditableText className="stat-label">Tevreden klanten</EditableText>
                </div>
                <div className="stat" data-testid="stat-workplaces">
                  <EditableText className="stat-number">100+</EditableText>
                  <EditableText className="stat-label">Werkplaatsen</EditableText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section section-surface" data-testid="contact-section">
        <div className="container">
          <div className="section-header">
            <EditableText className="section-label" testId="contact-label">Neem Contact Op</EditableText>
            <EditableText as="h2" className="section-title" testId="contact-title">Contact</EditableText>
          </div>
          
          <div className="contact-grid single">
            {/* Email */}
            <a href="mailto:info@capstok.nl" className="contact-card" data-testid="contact-email-link">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-info">
                <span className="contact-label">E-mail</span>
                <EditableText className="contact-value">info@capstok.nl</EditableText>
              </div>
            </a>
          </div>
          
          <EditableText className="contact-cta" testId="contact-cta">Heeft u vragen over onze producten of wilt u een bestelling plaatsen? Neem gerust contact met ons op!</EditableText>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <div className="container footer-container">
          <img 
            src="https://customer-assets.emergentagent.com/job_capstok-preview/artifacts/l5ta1mn4_Capstok%20wit%20onder%20slogan.png" 
            alt="Capstok Logo" 
            className="footer-logo"
          />
          
          <div className="footer-links">
            <a href="#waarom" onClick={(e) => handleSmoothScroll(e, '#waarom')} data-testid="footer-link-waarom">Waarom Capstok</a>
            <a href="#producten" onClick={(e) => handleSmoothScroll(e, '#producten')} data-testid="footer-link-producten">Producten</a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} data-testid="footer-link-contact">Contact</a>
          </div>
          
          <EditableText className="footer-copyright" testId="footer-copyright">© 2024 Capstok. Alle rechten voorbehouden.</EditableText>
        </div>
      </footer>

      {/* Admin Mode Floating Button */}
      {isAdminMode && (
        <div className="admin-controls" data-testid="admin-controls">
          <button onClick={copyHtmlToClipboard} className="copy-html-btn" data-testid="copy-html-btn">
            <i className="fas fa-copy"></i>
            <span>Wijzigingen Opslaan (Kopieer HTML)</span>
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast toast-${toastType}`} data-testid="toast">
          <i className={`fas ${toastType === 'success' ? 'fa-check-circle' : toastType === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
