import React, { useState } from 'react';
import '../styles/contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <h1 className="contact-title">Get in <span className="gradient-text">Touch</span></h1>
            <p className="contact-subtitle">
              Have questions or feedback? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email Us</h3>
                <p>support@parkeasy.com</p>
                <p className="contact-description">
                  Send us an email anytime and we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
                <p className="contact-description">
                  Speak directly with our support team Monday through Friday, 9am-6pm EST.
                </p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <h3>Visit Us</h3>
                <p>123 Parking Street<br />Tech City, TC 12345</p>
                <p className="contact-description">
                  Stop by our office for an in-person consultation or meeting.
                </p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Available 24/7</p>
                <p className="contact-description">
                  Get instant help through our live chat support on the website.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="6"
                    required
                    placeholder="Enter your message here..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {submitMessage && (
                  <div className="success fade-in">
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">
              Find answers to common questions about ParkEasy
            </p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I book a parking spot?</h3>
              <p>
                Simply search for your destination, browse available parking spots, 
                select your preferred option, and complete the booking with secure payment.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I cancel my booking?</h3>
              <p>
                Yes, you can cancel your booking up to 2 hours before your reserved time 
                for a full refund. Check our cancellation policy for more details.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do I become a parking space owner?</h3>
              <p>
                Register as an owner, submit your property details for approval, 
                and start earning by renting out your parking spaces to verified users.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is my payment information secure?</h3>
              <p>
                Absolutely! We use industry-standard encryption and partner with 
                trusted payment processors like Razorpay to ensure your information is safe.
              </p>
            </div>

            <div className="faq-item">
              <h3>What if I can't find my booked parking spot?</h3>
              <p>
                Our app provides GPS navigation to your exact parking location. 
                If you still need help, our 24/7 support team is ready to assist.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do you offer customer support?</h3>
              <p>
                Yes! We provide 24/7 customer support via live chat, email, and phone. 
                Our team is always ready to help with any questions or issues.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}