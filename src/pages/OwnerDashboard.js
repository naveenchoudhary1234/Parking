import React, { useState, useEffect } from "react";
import { apiRequest } from "../api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationPicker({ onPick }) {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onPick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return position ? <Marker position={position} /> : null;
}


export default function OwnerDashboard() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [carSlots, setCarSlots] = useState("");
  const [bikeSlots, setBikeSlots] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [latlng, setLatlng] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [properties, setProperties] = useState([]);
  const [showBookings, setShowBookings] = useState(null);
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch all properties, then filter by owner (since /search expects lat/lng for user search)
    apiRequest("/parking-property/search-all", "GET", null, token)
      .then(res => {
        const user = JSON.parse(localStorage.getItem("user"));
        setProperties(res.filter(p => {
          const ownerId = p.owner && (p.owner._id || p.owner.id || p.owner);
          return ownerId === user.id || ownerId === user._id;
        }));
      })
      .catch(() => {});
  }, [msg, token]);

  const handleViewBookings = async (propertyId) => {
    setShowBookings(propertyId);
    setBookings([]);
    try {
      const res = await apiRequest(`/parking-property/${propertyId}/bookings`, "GET", null, token);
      setBookings(res);
    } catch (err) {
      setBookings([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setError("");
    if (!latlng) { setError("Please pick a location on the map"); return; }
    try {
      await apiRequest("/parking-property/add", "POST", {
        name, address, carSlots, bikeSlots, pricePerHour,
        lat: latlng[0], lng: latlng[1],
        owner: JSON.parse(localStorage.getItem("user")).id
      }, token);
      setMsg("Property submitted for approval!");
      setName(""); setAddress(""); setCarSlots(""); setBikeSlots(""); setPricePerHour(""); setLatlng(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Owner Dashboard</h2>
      <h3>Add Parking Property</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Property Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
        <input type="number" placeholder="Car Slots" value={carSlots} onChange={e => setCarSlots(e.target.value)} required />
        <input type="number" placeholder="Bike Slots" value={bikeSlots} onChange={e => setBikeSlots(e.target.value)} required />
        <input type="number" placeholder="Price Per Hour" value={pricePerHour} onChange={e => setPricePerHour(e.target.value)} required />
        <div style={{marginBottom:8}}>
          <b>Pick Location:</b>
          <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: "200px", width: "100%", marginTop:8 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker onPick={setLatlng} />
          </MapContainer>
        </div>
        <button type="submit">Add Property</button>
        {msg && <div className="success">{msg}</div>}
        {error && <div className="error">{error}</div>}
      </form>
      <h3>Your Properties</h3>
      <ul className="slot-list">
        {properties.map(p => (
          <li key={p._id}>
            <b>{p.name}</b> - {p.address} | Cars: {p.carSlots} | Bikes: {p.bikeSlots} | ₹{p.pricePerHour}/hr | {p.approved ? "Approved" : "Pending"}
            <button style={{marginLeft:8}} onClick={() => handleViewBookings(p._id)}>View Bookings</button>
            {showBookings === p._id && (
              <ul className="booking-list" style={{marginTop:8}}>
                {bookings.length === 0 && <li>No bookings yet.</li>}
                {bookings.map(b => (
                  <li key={b._id}>
                    User: {b.user?.name || b.user?.email || "-"} | Slot: {b.slotNumber || "-"} | Hours: {b.hours} | ₹{b.totalPrice}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
