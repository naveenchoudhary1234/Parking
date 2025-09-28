import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    apiRequest("/parking-property/search-all", "GET", null, token)
      .then(res => setProperties(res))
      .catch(err => setError(err.message));
  }, [msg, token]);

  const handleApprove = async (id) => {
    setMsg(""); setError("");
    try {
      await apiRequest(`/parking-property/approve/${id}`, "PUT", null, token);
      setMsg("Property approved!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Dashboard</h2>
      <h3>Pending Properties</h3>
      <ul className="slot-list">
        {properties.filter(p => !p.approved).map(p => (
          <li key={p._id}>
            <b>{p.name}</b> - {p.address} | Cars: {p.carSlots} | Bikes: {p.bikeSlots} | ₹{p.pricePerHour}/hr
            <button style={{marginLeft:8}} onClick={() => handleApprove(p._id)}>Approve</button>
          </li>
        ))}
      </ul>
      <h3>All Properties</h3>
      <ul className="slot-list">
        {properties.map(p => (
          <li key={p._id}>
            <b>{p.name}</b> - {p.address} | Cars: {p.carSlots} | Bikes: {p.bikeSlots} | ₹{p.pricePerHour}/hr | {p.approved ? "Approved" : "Pending"}
          </li>
        ))}
      </ul>
      {msg && <div className="success">{msg}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
