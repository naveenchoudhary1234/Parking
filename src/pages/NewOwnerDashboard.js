import React, { useState, useEffect } from "react";
import { apiRequest } from "../api";

export default function OwnerDashboard() {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [approvedProperties, setApprovedProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingProperties();
    fetchApprovedProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      const response = await apiRequest('/parking-property/pending');
      setPendingProperties(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchApprovedProperties = async () => {
    try {
      const response = await apiRequest('/parking-property/approved');
      const userId = localStorage.getItem('userId');
      // Filter properties approved by this owner
      const myApproved = response.filter(prop => prop.owner === userId);
      setApprovedProperties(myApproved);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      setLoading(true);
      await apiRequest(`/parking-property/approve/${propertyId}`, 'PUT');
      
      // Refresh both lists
      fetchPendingProperties();
      fetchApprovedProperties();
      
      alert("Property approved successfully! Slots have been created.");
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Pending Approvals */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pending Property Approvals</h2>
        
        {pendingProperties.length === 0 ? (
          <p className="text-gray-500">No pending properties for approval.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingProperties.map((property) => (
              <div key={property._id} className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
                <h3 className="font-semibold text-lg">{property.name}</h3>
                <p className="text-gray-600 text-sm mb-2">📍 {property.address}</p>
                <p className="text-sm text-blue-600 mb-2">
                  Submitted by: {property.rental ? property.rental.name : 'Unknown Rental'}
                </p>
                <div className="text-sm space-y-1 mb-3">
                  <p>🚗 Car Slots: {property.carSlots}</p>
                  <p>🏍️ Bike Slots: {property.bikeSlots}</p>
                  <p className="font-semibold text-green-600">₹{property.pricePerHour}/hour</p>
                </div>
                
                <button
                  onClick={() => handleApprove(property._id)}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 w-full"
                >
                  {loading ? "Approving..." : "✅ Approve Property"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Properties */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Approved Properties</h2>
        
        {approvedProperties.length === 0 ? (
          <p className="text-gray-500">No approved properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedProperties.map((property) => (
              <div key={property._id} className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{property.name}</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    ✅ Active
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">📍 {property.address}</p>
                <div className="text-sm space-y-1">
                  <p>🚗 Car Slots: {property.carSlots}</p>
                  <p>🏍️ Bike Slots: {property.bikeSlots}</p>
                  <p className="font-semibold text-green-600">₹{property.pricePerHour}/hour</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}