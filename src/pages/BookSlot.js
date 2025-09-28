import React, { useState, useEffect } from "react";
import { apiRequest } from "../api";

export default function BookSlot() {
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState("");
  const [hours, setHours] = useState(1);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/parking/available")
      .then(res => {
        setSlots(res);
        console.log("[BookSlot] Available slots loaded", res);
      })
      .catch(err => {
        setError(err.message);
        console.error("[BookSlot] Error", err);
      });
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await apiRequest("/booking/create", "POST", { parkingId: selected, hours }, token);
      setMsg("Booking successful!");
      console.log("[BookSlot] Booking success", res);
    } catch (err) {
      setError(err.message);
      console.error("[BookSlot] Booking error", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Book a Parking Slot</h2>
      <form onSubmit={handleBook}>
        <select value={selected} onChange={e => setSelected(e.target.value)} required>
          <option value="">Select Slot</option>
          {slots.map(slot => (
            <option key={slot._id} value={slot._id}>
              {slot.location} - {slot.slotNumber} - ₹{slot.pricePerHour}/hr
            </option>
          ))}
        </select>
        <input type="number" min="1" value={hours} onChange={e => setHours(e.target.value)} required />
        <button type="submit">Book</button>
      </form>
      {msg && <div className="success">{msg}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
