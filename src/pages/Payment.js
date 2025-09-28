import React, { useState } from "react";
import { apiRequest } from "../api";

export default function Payment() {
  const [bookingId, setBookingId] = useState("");
  const [order, setOrder] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [signature, setSignature] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const res = await apiRequest("/payment/create-order", "POST", { bookingId });
      setOrder(res);
      setMsg("Order created. Now verify payment.");
      console.log("[Payment] Order created", res);
    } catch (err) {
      setError(err.message);
      console.error("[Payment] Create order error", err);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const res = await apiRequest("/payment/verify", "POST", {
        razorpay_order_id: order.orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature
      });
      setMsg("Payment verified!");
      console.log("[Payment] Verified", res);
    } catch (err) {
      setError(err.message);
      console.error("[Payment] Verify error", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Payment</h2>
      <form onSubmit={handleCreateOrder}>
        <input type="text" placeholder="Booking ID" value={bookingId} onChange={e => setBookingId(e.target.value)} required />
        <button type="submit">Create Order</button>
      </form>
      {order && (
        <form onSubmit={handleVerify}>
          <input type="text" placeholder="Payment ID" value={paymentId} onChange={e => setPaymentId(e.target.value)} required />
          <input type="text" placeholder="Signature" value={signature} onChange={e => setSignature(e.target.value)} required />
          <button type="submit">Verify Payment</button>
        </form>
      )}
      {msg && <div className="success">{msg}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
