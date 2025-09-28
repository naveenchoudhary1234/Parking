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
              Smart, convenient, and reliable parking solutions for the modern world.
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
                    🚀 Get Started
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
              <p>Book instantly with real-time availability</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">💳</div>
              <h4>Secure Payment</h4>
              <p>Safe transactions with Razorpay integration</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📍</div>
              <h4>Easy Navigation</h4>
              <p>Get directions to your parking spot</p>
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
              Experience the future of parking with our innovative platform
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find parking spots near your destination with our intelligent search system</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Booking</h3>
              <p>Reserve your spot in seconds with our streamlined booking process</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Compare prices from multiple providers and get the best deals</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure & Safe</h3>
              <p>Your data and payments are protected with enterprise-grade security</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access from any device with our responsive, mobile-optimized design</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>GPS Navigation</h3>
              <p>Get turn-by-turn directions to your reserved parking spot</p>
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
              Simple steps to secure your perfect parking spot
            </p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Search Location</h3>
                <p>Enter your destination and find available parking spots nearby</p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Choose & Book</h3>
                <p>Select your preferred spot and book instantly with secure payment</p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Park & Go</h3>
                <p>Navigate to your spot and enjoy hassle-free parking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Parking Spots</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Parking Experience?</h2>
            <p>Join thousands of satisfied users and never worry about parking again</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-large">
                Start Your Journey
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}