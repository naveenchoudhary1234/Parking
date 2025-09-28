import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/home.css';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find Perfect <span className="gradient-text">Parking</span> 
              <br />Anytime, Anywhere
            </h1>
            <p className="hero-description">
              Connect with property owners and secure your parking spot with just a few clicks. 
              Smart, convenient, and reliable parking solutions for the modern world. Experience 
              hassle-free parking with real-time availability and instant booking.
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <>
                  {user?.role === 'user' && (
                    <Link to="/parking" className="btn btn-primary btn-large">
                      🚗 Find Parking Now
                    </Link>
                  )}
                  {user?.role === 'rental' && (
                    <Link to="/rental-dashboard" className="btn btn-primary btn-large">
                      📋 Rental Dashboard
                    </Link>
                  )}
                  {user?.role === 'owner' && (
                    <Link to="/owner-dashboard" className="btn btn-primary btn-large">
                      🏢 Owner Dashboard
                    </Link>
                  )}
                  <Link to="/about" className="btn btn-outline btn-large">
                    Learn More
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    🚀 Get Started Free
                  </Link>
                  <Link to="/parking" className="btn btn-outline btn-large">
                    Browse Parking
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <div className="card-icon">🅿️</div>
              <h4>Smart Booking</h4>
              <p>Book instantly with real-time availability and GPS navigation to your spot</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">💳</div>
              <h4>Secure Payment</h4>
              <p>Safe transactions with Razorpay integration and instant confirmation</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📍</div>
              <h4>Easy Navigation</h4>
              <p>Get turn-by-turn directions to your reserved parking spot</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose ParkEasy?</h2>
            <p className="section-description">
              Experience the future of parking with our innovative platform designed for modern urban mobility. 
              We combine cutting-edge technology with user-friendly design to solve your parking challenges.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find parking spots near your destination with our intelligent search system powered by real-time data and advanced algorithms</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Booking</h3>
              <p>Reserve your spot in seconds with our streamlined booking process. No waiting, no hassle - just quick and easy reservations</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Compare prices from multiple providers and get the best deals. Transparent pricing with no hidden fees or surprise charges</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure & Safe</h3>
              <p>Your data and payments are protected with enterprise-grade security. Bank-level encryption ensures your information stays safe</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access from any device with our responsive, mobile-optimized design. Perfect experience on desktop, tablet, and mobile</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>GPS Navigation</h3>
              <p>Get turn-by-turn directions to your reserved parking spot with integrated GPS navigation and real-time traffic updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Simple steps to secure your perfect parking spot. Our streamlined process makes parking 
              reservation as easy as ordering your favorite coffee.
            </p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Search Location</h3>
                <p>Enter your destination and find available parking spots nearby. Our smart algorithm shows you the best options based on price, distance, and availability.</p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Choose & Book</h3>
                <p>Select your preferred spot and book instantly with secure payment. Choose your duration, review details, and confirm your reservation in just a few clicks.</p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Park & Go</h3>
                <p>Navigate to your spot and enjoy hassle-free parking. Get directions, find your exact spot, and start your day without parking stress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div class="section-header">
            <h2 class="section-title" style={{color: 'white', marginBottom: '3rem'}}>Trusted by Thousands</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">15K+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">Parking Spots</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-description">
              Don't just take our word for it. Here's what real users have to say about their ParkEasy experience.
            </p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "ParkEasy has completely transformed my daily commute. No more circling around looking for parking. 
                I can book a spot before I even leave home!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <h4>Sarah Mitchell</h4>
                  <p>Marketing Manager</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">
                "As a property owner, ParkEasy has helped me monetize my unused parking spaces. 
                The platform is easy to use and the support team is fantastic."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">RJ</div>
                <div className="author-info">
                  <h4>Robert Johnson</h4>
                  <p>Property Owner</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">
                "The mobile app is incredibly user-friendly. I love how I can see real-time availability 
                and get directions right to my parking spot. Highly recommended!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">EL</div>
                <div className="author-info">
                  <h4>Emily Lopez</h4>
                  <p>Software Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="section-title">Stay Updated</h2>
            <p className="section-description">
              Get the latest updates on new parking locations, special offers, and platform improvements. 
              Join our newsletter for exclusive deals and parking tips.
            </p>
            <form className="newsletter-form">
              <input 
                type="email" 
                className="newsletter-input" 
                placeholder="Enter your email address"
                required
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Parking Experience?</h2>
            <p>
              Join thousands of satisfied users and never worry about parking again. 
              Start your journey with ParkEasy today and discover the future of urban mobility.
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-large">
                Start Your Journey Today
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}