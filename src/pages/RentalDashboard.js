import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/dashboard.css";

const RentalDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);

  // Properties & stats (mocked here — replace with real API)
  const [properties, setProperties] = useState([]);
  const [rentalStats, setRentalStats] = useState({
    totalProperties: 0,
    totalSlots: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
  });

  // New property form state
  const [newProperty, setNewProperty] = useState({
    name: "",
    fullAddress: "",
    address: "",
    coordinates: null, // [lng, lat]
    carSlots: 0,
    bikeSlots: 0,
    pricePerHour: 0,
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Address search state (debounced)
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Simple effect to load mock data on mount (replace with real fetch)
  useEffect(() => {
    // TODO: replace this mock with fetch('/api/my-properties') etc.
    const mockProps = [
      {
        _id: "1",
        name: "Downtown Mall Parking",
        address: "123 Main St",
        fullAddress: "123 Main St, City, State",
        approved: true,
        carSlots: 50,
        bikeSlots: 10,
        pricePerHour: 20,
      },
      {
        _id: "2",
        name: "Office Complex A",
        address: "456 Business Ave",
        fullAddress: "456 Business Ave, City, State",
        approved: false,
        carSlots: 80,
        bikeSlots: 12,
        pricePerHour: 15,
      },
    ];
    setProperties(mockProps);
    setRentalStats({
      totalProperties: mockProps.length,
      totalSlots: mockProps.reduce((s, p) => s + (p.carSlots + p.bikeSlots), 0),
      occupancyRate: 72,
      monthlyRevenue: 12450,
    });
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout(); // depends on your AuthContext implementation
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Debounced address search (mocked)
  const searchAddress = (query) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!query || query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      // TODO: Call real geocoding API here (e.g., Nominatim / Mapbox / Google)
      const mockResults = [
        {
          display_name: `${query}, Main Street, City`,
          lat: 28.7041,
          lng: 77.1025,
        },
        {
          display_name: `${query}, Broadway, City`,
          lat: 28.7055,
          lng: 77.1036,
        },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 450);
  };

  const handleAddressChange = (value) => {
    setNewProperty({ ...newProperty, fullAddress: value, coordinates: null });
    searchAddress(value);
  };

  const selectAddress = (result) => {
    setNewProperty({
      ...newProperty,
      fullAddress: result.display_name,
      address: result.display_name.split(",")[0],
      coordinates: [result.lng, result.lat],
    });
    setSearchResults([]);
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    // TODO: upload files to storage and store URLs. For now, store file names.
    setPhotos(files.map((f) => f.name));
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setError("");
    if (!newProperty.coordinates) {
      setError("Please select a valid address from the suggestions.");
      return;
    }
    setLoading(true);

    try {
      // TODO: call your API to add the property, upload photos, etc.
      const fakeId = Date.now().toString();
      const added = {
        _id: fakeId,
        name: newProperty.name,
        address: newProperty.address,
        fullAddress: newProperty.fullAddress,
        coordinates: newProperty.coordinates,
        carSlots: newProperty.carSlots,
        bikeSlots: newProperty.bikeSlots,
        pricePerHour: newProperty.pricePerHour,
        approved: false,
        photos,
      };
      setProperties((prev) => [added, ...prev]);
      setRentalStats((prev) => ({
        ...prev,
        totalProperties: prev.totalProperties + 1,
        totalSlots:
          prev.totalSlots + (newProperty.carSlots || 0) + (newProperty.bikeSlots || 0),
      }));

      // Reset form
      setNewProperty({
        name: "",
        fullAddress: "",
        address: "",
        coordinates: null,
        carSlots: 0,
        bikeSlots: 0,
        pricePerHour: 0,
      });
      setPhotos([]);
      setShowAddForm(false);
      alert("Property added! Waiting for approval.");
    } catch (err) {
      console.error("Add property error:", err);
      setError("Failed to add property. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (approved) =>
    approved ? (
      <span className="status-badge status-approved">✅ Approved</span>
    ) : (
      <span className="status-badge status-pending">⏳ Pending</span>
    );

  // JSX
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">🏢 Rental Portal</h2>
          <p className="sidebar-subtitle">Welcome back, {user?.firstName || "Owner"}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("overview");
            }}
          >
            <span className="nav-icon">📊</span> Overview
          </button>
          <button
            className={`nav-item ${activeTab === "properties" ? "active" : ""}`}
            onClick={() => setActiveTab("properties")}
          >
            <span className="nav-icon">🏢</span> My Properties
          </button>
          <button
            className={`nav-item ${activeTab === "add-property" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("add-property");
              setShowAddForm(true);
            }}
          >
            <span className="nav-icon">➕</span> Add Property
          </button>

          <div className="sidebar-footer">
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {/* Header area */}
        <header className="content-header">
          <h1 className="page-title">
            {activeTab === "overview"
              ? "Dashboard Overview"
              : activeTab === "properties"
              ? "My Properties"
              : "Add New Property"}
          </h1>
          <p className="page-subtitle">
            {activeTab === "overview"
              ? "Monitor your parking properties and earnings"
              : activeTab === "properties"
              ? "Manage your existing parking properties"
              : "Add a new property to start earning"}
          </p>
        </header>

        {/* Content */}
        <section className="dashboard-content">
          {activeTab === "overview" && (
            <div className="section-card">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏢</div>
                  <div className="stat-content">
                    <div className="stat-number">{rentalStats.totalProperties}</div>
                    <p className="stat-label">Total Properties</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🅿️</div>
                  <div className="stat-content">
                    <div className="stat-number">{rentalStats.totalSlots}</div>
                    <p className="stat-label">Total Slots</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-number">{rentalStats.occupancyRate}%</div>
                    <p className="stat-label">Occupancy Rate</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-number">₹{rentalStats.monthlyRevenue}</div>
                    <p className="stat-label">Monthly Revenue</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "properties" && (
            <div className="section-card">
              <h2 className="section-title">Recent Properties</h2>
              {properties.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏢</div>
                  <h3 className="empty-title">No properties yet</h3>
                  <p className="empty-description">
                    Start by adding your first parking property to begin earning.
                  </p>
                </div>
              ) : (
                <div className="properties-grid">
                  {properties.map((property) => (
                    <div key={property._id} className="property-card">
                      <div className="property-card-top">
                        <h3 className="property-name">{property.name}</h3>
                        {getStatusBadge(property.approved)}
                      </div>
                      <p className="property-address">📍 {property.fullAddress || property.address}</p>
                      <div className="property-meta">
                        <span>🚗 {property.carSlots} car</span>
                        <span>🏍️ {property.bikeSlots} bike</span>
                        <span className="price">₹{property.pricePerHour}/hour</span>
                      </div>
                      {!property.approved && (
                        <p className="text-warning">Waiting for owner approval...</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "add-property" && (
            <div className="section-card">
              <h2 className="section-title">Add New Parking Property</h2>
              {error && (
                <div className="error-banner">
                  <strong>Error:</strong> {error}
                </div>
              )}
              <form onSubmit={handleAddProperty} className="property-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Property Name</label>
                    <input
                      type="text"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Full Address (start typing to search)</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={newProperty.fullAddress}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className="form-input"
                        placeholder="e.g., Sector 27, Near Metro Station"
                        required
                      />
                      {isSearching && <div className="search-indicator">Searching...</div>}

                      {searchResults.length > 0 && (
                        <div className="search-results">
                          {searchResults.map((r, idx) => (
                            <div
                              key={idx}
                              className="search-result-item"
                              onClick={() => selectAddress(r)}
                            >
                              <div className="result-name">{r.display_name}</div>
                              <div className="result-coords">
                                📍 {r.lat.toFixed(4)}, {r.lng.toFixed(4)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Property Photos (optional)</label>
                    <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />
                    {photos.length > 0 && (
                      <div className="note">✅ {photos.length} photo(s) selected</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Car Slots</label>
                    <input
                      type="number"
                      min="0"
                      value={newProperty.carSlots}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, carSlots: parseInt(e.target.value) || 0 })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bike Slots</label>
                    <input
                      type="number"
                      min="0"
                      value={newProperty.bikeSlots}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, bikeSlots: parseInt(e.target.value) || 0 })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Price per Hour (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={newProperty.pricePerHour}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          pricePerHour: parseInt(e.target.value) || 0,
                        })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setNewProperty({
                        name: "",
                        fullAddress: "",
                        address: "",
                        coordinates: null,
                        carSlots: 0,
                        bikeSlots: 0,
                        pricePerHour: 0,
                      });
                      setPhotos([]);
                      setSearchResults([]);
                    }}
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Adding Property..." : "Submit for Approval"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default RentalDashboard;
