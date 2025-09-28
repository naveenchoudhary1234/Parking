import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Parking() {
  const [slots, setSlots] = useState([]);
  const [location, setLocation] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/parking/available")
      .then(res => {
        setSlots(res);
        console.log("[Parking] Available slots loaded", res);
      })
      .catch(err => {
        setError(err.message);
        console.error("[Parking] Error", err);
      });
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await apiRequest("/parking/add", "POST", { location, slotNumber, pricePerHour }, token);
      setMsg("Slot added!");
      setSlots([...slots, res.slot]);
      setLocation(""); setSlotNumber(""); setPricePerHour("");
      console.log("[Parking] Slot added", res);
    } catch (err) {
      setError(err.message);
      console.error("[Parking] Add Slot Error", err);
    }
  };

  return (
    <div className="parking-container">
      <h2>Available Parking Slots</h2>
      <ul className="slot-list">
        {slots.map(slot => (
          <li key={slot._id}>
            <b>{slot.location}</b> - Slot: {slot.slotNumber} - ₹{slot.pricePerHour}/hr - {slot.isBooked ? "Booked" : "Available"}
          </li>
        ))}
      </ul>
      <h3>Add Parking Slot</h3>
      <form onSubmit={handleAddSlot} className="form-inline">
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
        <input type="text" placeholder="Slot Number" value={slotNumber} onChange={e => setSlotNumber(e.target.value)} required />
        <input type="number" placeholder="Price/Hour" value={pricePerHour} onChange={e => setPricePerHour(e.target.value)} required />
        <button type="submit">Add Slot</button>
      </form>
      {msg && <div className="success">{msg}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
