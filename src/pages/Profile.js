import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    apiRequest("/auth/profile", "GET", null, token)
      .then(res => {
        setUser(res.user);
        // Store both id and _id for compatibility
        const user = { ...res.user, _id: res.user._id || res.user.id, id: res.user.id || res.user._id };
        localStorage.setItem("user", JSON.stringify(user));
        console.log("[Profile] Loaded", res.user);
      })
      .catch(err => {
        setError(err.message);
        console.error("[Profile] Error", err);
      });
  }, []);

  if (!user) return <div className="form-container">{error || "Loading..."}</div>;
  return (
    <div className="form-container">
      <h2>Profile</h2>
      <div><b>Name:</b> {user.name}</div>
      <div><b>Email:</b> {user.email}</div>
      <div><b>Role:</b> {user.role}</div>
    </div>
  );
}
