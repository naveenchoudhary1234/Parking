import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    apiRequest("/booking/my-bookings", "GET", null, token)
      .then(res => {
        setBookings(res);
        console.log("[Bookings] Loaded", res);
      })
      .catch(err => {
        setError(err.message);
        console.error("[Bookings] Error", err);
      });
  }, []);

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <ul className="booking-list">
        {bookings.map(b => (
          <li key={b._id}>
            Slot: {b.parking?.slotNumber || "-"} at {b.parking?.location || "-"} for {b.hours} hours - ₹{b.totalPrice}
          </li>
        ))}
      </ul>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
