import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/home.css';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');

    const handleScroll = () => {
      const elements = document.querySelectorAll('.feature-card, .testimonial-card');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) el.classList.add('animate-slide-up');
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    { quote: 'ParkSmart has improved how I manage parking spaces.', author: 'Sarah Johnson', role: 'Owner', avatar: 'SJ' },
    { quote: 'Booking is simple and reliable.', author: 'Michael Chen', role: 'Consultant', avatar: 'MC' },
    { quote: 'Great dashboard and analytics for owners.', author: 'Emma Rodriguez', role: 'Manager', avatar: 'ER' }
  ];

  const features = [
    { title: 'Smart Location Matching', description: 'Find the best spots using real-time availability.' },
    { title: 'Instant Booking', description: 'Reserve a spot in seconds with instant confirmation.' },
    { title: 'Secure Payments', description: 'Multiple payment options with enterprise-grade security.' }
  ];

  return (
    <div className={`home-container ${animationClass}`}>
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">The Future of <span className="gradient-text">Smart Parking</span> is Here</h1>
            <p className="hero-subtitle">Experience seamless parking solutions powered by advanced technology.</p>

            <div className="hero-buttons">
              {isAuthenticated ? (
                <>
                  {user?.role === 'user' && <Link to="/parking" className="hero-btn hero-btn-primary">Discover Parking Spots</Link>}
                  {user?.role === 'rental' && <Link to="/rental-dashboard" className="hero-btn hero-btn-primary">Access Dashboard</Link>}
                  {user?.role === 'owner' && <Link to="/owner-dashboard" className="hero-btn hero-btn-primary">Manage Properties</Link>}
                  <Link to="/about" className="hero-btn hero-btn-secondary">Learn More</Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="hero-btn hero-btn-primary">Start Free Trial</Link>
                  <Link to="/login" className="hero-btn hero-btn-secondary">Sign In</Link>
                </>
              )}
            </div>

            <div className="hero-stats">
              <div className="stat-item"><span className="stat-number">2,500+</span><span className="stat-label">Active Properties</span></div>
              <div className="stat-item"><span className="stat-number">15,000+</span><span className="stat-label">Happy Users</span></div>
              <div className="stat-item"><span className="stat-number">99.8%</span><span className="stat-label">Uptime Guarantee</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-card"><div className="floating-card-icon">🚗</div><h4>Quick Booking</h4><p>Reserve premium spots in under 30 seconds</p></div>
              <div className="floating-card"><div className="floating-card-icon">📍</div><h4>Premium Locations</h4><p>Access exclusive parking in prime areas</p></div>
              <div className="floating-card"><div className="floating-card-icon">🔒</div><h4>Secure & Safe</h4><p>End-to-end encryption with verified properties</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose ParkSmart?</h2>
            <p className="section-subtitle">Experience the next generation of parking solutions with cutting-edge technology and unmatched convenience.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card hover-lift"><div className="feature-icon">•</div><h3>{f.title}</h3><p>{f.description}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="features-container">
          <div className="section-header"><h2 className="section-title">How ParkSmart Works</h2><p className="section-subtitle">Three simple steps to find, reserve, and enjoy hassle-free parking.</p></div>
          <div className="how-grid">
            <div className="how-step"><div className="step-number">1</div><h3>Search Nearby</h3><p>Enter your destination or use our map to discover available parking spots with live availability and pricing.</p></div>
            <div className="how-step"><div className="step-number">2</div><h3>Reserve & Pay</h3><p>Reserve your spot in seconds with multiple secure payment options and instant confirmation.</p></div>
            <div className="how-step"><div className="step-number">3</div><h3>Access & Go</h3><p>Use your QR or code to access the property and enjoy a seamless parking experience backed by support.</p></div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header"><h2 className="section-title">What Our Users Say</h2><p className="section-description">Don't just take our word for it. Here's what real users say about ParkSmart.</p></div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card"><p className="testimonial-text">{t.quote}</p><div className="testimonial-author"><div className="author-avatar">{t.avatar}</div><div className="author-info"><h4>{t.author}</h4><p>{t.role}</p></div></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="features-container">
          <div className="section-header"><h2 className="section-title">Plans Built for Every Need</h2><p className="section-subtitle">Whether you're an individual driver or managing a fleet, choose a plan that scales with your needs.</p></div>
          <div className="features-grid">
            <div className="feature-card hover-lift"><div className="feature-icon">🚗</div><h3>Starter</h3><p>Free plan for individual users. Reserve spots, manage your bookings and enjoy secure payments.</p><div className="mt-4"><Link to="/register" className="btn btn-primary btn-small">Get Started — Free</Link></div></div>
            <div className="feature-card hover-lift"><div className="feature-icon">🏢</div><h3>Owner</h3><p>Advanced tools for property owners: listings, dynamic pricing and analytics to grow revenue.</p><div className="mt-4"><Link to="/register" className="btn btn-primary btn-small">Create Account</Link></div></div>
            <div className="feature-card hover-lift"><div className="feature-icon">👥</div><h3>Business</h3><p>A custom plan for enterprises and fleets — priority support, SLA and tailored onboarding.</p><div className="mt-4"><Link to="/contact" className="btn btn-secondary btn-small">Contact Sales</Link></div></div>
          </div>
        </div>
      </section>

      <section className="cta-section"><div className="cta-container"><h2 className="cta-title">Ready to Transform Your Parking Experience?</h2><p className="cta-description">Join over 15,000 satisfied users who have revolutionized their approach to parking.</p>{!isAuthenticated && (<Link to="/register" className="cta-button hover-glow">Start Your Free Trial</Link>)}</div></section>
    </div>
  );
}