import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { apiRequest } from "../api";
import "../styles/modern.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await apiRequest("/booking/my-bookings");
      setBookings(response);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "user") return <Navigate to="/" />;

  const handleNavigate = (property) => {
    if (property.coordinates && property.coordinates.length === 2) {
      const [lng, lat] = property.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    } else if (property.fullAddress) {
      // Fallback to address-based navigation
      const encodedAddress = encodeURIComponent(property.fullAddress);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
    } else {
      alert("Navigation information not available for this booking.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        await apiRequest(`/booking/cancel/${bookingId}`, 'DELETE');
        alert('Booking cancelled successfully!');
        fetchMyBookings(); // Refresh the list
      } catch (error) {
        alert('Error cancelling booking: ' + error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'success', icon: '✅', text: 'Confirmed' },
      pending: { color: 'warning', icon: '⏳', text: 'Pending' },
      cancelled: { color: 'error', icon: '❌', text: 'Cancelled' }
    };
    return statusConfig[status] || { color: 'text-light', icon: '📋', text: 'Unknown' };
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center p-4">
          <div className="loading"></div>
          <p className="mt-2 text-light">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 fade-in">
      <div className="mb-4">
        <h1 className="text-center mb-2" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-dark)' }}>
          My Bookings
        </h1>
        <p className="text-center text-light">Manage and track your parking reservations</p>
      </div>
      
      {error && (
        <div className="error mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="card text-center">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🅿️</div>
          <h3>No bookings found</h3>
          <p className="text-light">You haven't made any parking reservations yet.</p>
          <a href="/parking" className="btn btn-primary mt-3">
            Find Parking Spots
          </a>
        </div>
      ) : (
        <div className="grid" style={{ gap: '1.5rem' }}>
          {bookings.map((booking) => {
            const statusConfig = getStatusBadge(booking.status);
            return (
              <div key={booking._id} className="card">
                <div className="card-header">
                  <div className="flex justify-between items-center">
                    <h3 className="card-title">
                      {booking.property?.name || booking.propertyName || 'Unknown Property'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-weight-600 text-${statusConfig.color}`}
                          style={{ 
                            backgroundColor: `var(--${statusConfig.color === 'success' ? 'success' : 
                                                      statusConfig.color === 'warning' ? 'warning' : 'error'}-color)`,
                            color: 'white',
                            fontSize: '0.8rem'
                          }}>
                      {statusConfig.icon} {statusConfig.text}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '1.1rem' }}>📍</span>
                    <span><strong>Address:</strong> {booking.property?.fullAddress || booking.propertyAddress || 'Address not available'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '1.1rem' }}>🅿️</span>
                    <span><strong>Slot:</strong> {booking.slotNumber || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '1.1rem' }}>⏱️</span>
                    <span><strong>Duration:</strong> {booking.hours} hour{booking.hours > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '1.1rem' }}>💰</span>
                    <span><strong>Total Amount:</strong> ₹{booking.totalAmount}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '1.1rem' }}>🕐</span>
                    <span><strong>Start:</strong> {formatDate(booking.startTime)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '1.1rem' }}>🕐</span>
                    <span><strong>End:</strong> {formatDate(booking.endTime)}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={() => handleNavigate(booking.property || booking)}
                    className="btn btn-success"
                    title="Get directions to your parking spot"
                  >
                    🗺️ Get Directions
                  </button>
                  
                  {booking.status === 'confirmed' && (
                    <button 
                      onClick={() => handleCancelBooking(booking._id)}
                      className="btn btn-outline"
                      style={{ 
                        borderColor: 'var(--error-color)', 
                        color: 'var(--error-color)',
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--error-color)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--error-color)';
                      }}
                      title="Cancel this booking"
                    >
                      ❌ Cancel Booking
                    </button>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <button 
                      onClick={() => {
                        // Share booking details
                        if (navigator.share) {
                          navigator.share({
                            title: 'My Parking Booking',
                            text: `Parking at ${booking.property?.name || 'Unknown Location'}\nStart: ${formatDate(booking.startTime)}\nDuration: ${booking.hours} hours`,
                          });
                        } else {
                          // Fallback: copy to clipboard
                          const text = `Parking Booking\nLocation: ${booking.property?.name || 'Unknown Location'}\nAddress: ${booking.property?.fullAddress || 'N/A'}\nStart: ${formatDate(booking.startTime)}\nDuration: ${booking.hours} hours\nAmount: ₹${booking.totalAmount}`;
                          navigator.clipboard.writeText(text);
                          alert('Booking details copied to clipboard!');
                        }
                      }}
                      className="btn btn-outline"
                      title="Share booking details"
                    >
                      📤 Share
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
