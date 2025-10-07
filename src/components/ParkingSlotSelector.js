import React, { useState, useEffect } from 'react';
import { slotStatus, vehicleTypes } from '../data/parkingTemplates';
import '../styles/parking-slot-selector.css';

const ParkingSlotSelector = ({ 
  parkingProperty, 
  layoutData, 
  availableSlots = [], 
  bookedSlots = [], 
  onSlotSelect, 
  selectedSlot,
  vehicleType = 'car'
}) => {
  const [slotStates, setSlotStates] = useState({});
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Initialize slot states based on availability
  useEffect(() => {
    if (layoutData && layoutData.slots) {
      const states = {};
      
      Object.values(layoutData.slots).forEach(slot => {
        // Check if slot is booked
        const isBooked = bookedSlots.some(bookedSlot => 
          bookedSlot.slotNumber === slot.slotNumber
        );
        
        // Check if slot is available for the selected vehicle type
        const isAvailableForVehicleType = slot.vehicleType === vehicleType;
        
        if (isBooked) {
          states[slot.id] = slotStatus.BOOKED;
        } else if (!isAvailableForVehicleType) {
          states[slot.id] = slotStatus.UNAVAILABLE;
        } else if (slot.status === slotStatus.UNAVAILABLE) {
          states[slot.id] = slotStatus.UNAVAILABLE;
        } else {
          states[slot.id] = slotStatus.AVAILABLE;
        }
      });
      
      setSlotStates(states);
    }
  }, [layoutData, bookedSlots, vehicleType]);

  const handleSlotClick = (slot) => {
    if (slotStates[slot.id] === slotStatus.AVAILABLE) {
      onSlotSelect(slot);
    }
  };

  const getSlotClass = (slot) => {
    let classes = ['parking-slot', 'customer-slot'];
    
    // Add status class
    if (selectedSlot && selectedSlot.id === slot.id) {
      classes.push('slot-selected');
    } else {
      classes.push(`slot-${slotStates[slot.id] || slotStatus.AVAILABLE}`);
    }
    
    // Add vehicle type class
    classes.push(`vehicle-${slot.vehicleType}`);
    
    // Add hover class
    if (hoveredSlot === slot.id && slotStates[slot.id] === slotStatus.AVAILABLE) {
      classes.push('slot-hover');
    }
    
    return classes.join(' ');
  };

  const getSlotIcon = (slot) => {
    if (slotStates[slot.id] === slotStatus.BOOKED) {
      return slot.vehicleType === vehicleTypes.CAR ? '🚗' : '🏍️';
    }
    
    if (slotStates[slot.id] === slotStatus.UNAVAILABLE) {
      return '❌';
    }
    
    if (selectedSlot && selectedSlot.id === slot.id) {
      return slot.vehicleType === vehicleTypes.CAR ? '🚗' : '🏍️';
    }
    
    return slot.vehicleType === vehicleTypes.CAR ? '🅿️' : '🅿️';
  };

  const getSlotTooltip = (slot) => {
    const state = slotStates[slot.id];
    let tooltip = `Slot ${slot.slotNumber}`;
    
    switch (state) {
      case slotStatus.AVAILABLE:
        tooltip += ` - Available for ${slot.vehicleType} - ₹${slot.pricePerHour}/hr`;
        break;
      case slotStatus.BOOKED:
        tooltip += ` - Currently Occupied`;
        break;
      case slotStatus.UNAVAILABLE:
        tooltip += ` - Not Available`;
        break;
      default:
        tooltip += ` - ${slot.vehicleType} slot`;
    }
    
    return tooltip;
  };

  if (!layoutData || !layoutData.layout) {
    return (
      <div className="slot-selector-placeholder">
        <p>No parking layout available</p>
      </div>
    );
  }

  const availableSlotsCount = Object.values(slotStates).filter(
    state => state === slotStatus.AVAILABLE
  ).length;

  const bookedSlotsCount = Object.values(slotStates).filter(
    state => state === slotStatus.BOOKED
  ).length;

  return (
    <div className="parking-slot-selector">
      <div className="selector-header">
        <h3>🎯 Select Your Parking Slot</h3>
        <div className="slot-stats">
          <span className="stat available">✅ {availableSlotsCount} Available</span>
          <span className="stat booked">🚗 {bookedSlotsCount} Occupied</span>
        </div>
      </div>

      <div className="legend-bar">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color booked"></div>
          <span>Occupied</span>
        </div>
        <div className="legend-item">
          <div className="legend-color unavailable"></div>
          <span>Unavailable</span>
        </div>
      </div>

      <div className="layout-container">
        <div className="parking-grid customer-view" style={{
          gridTemplateRows: `repeat(${layoutData.layout.length}, 1fr)`,
          gridTemplateColumns: `repeat(${layoutData.layout[0]?.length || 1}, 1fr)`
        }}>
          {layoutData.layout.map((row, rowIndex) => 
            row.map((cell, colIndex) => {
              const slotId = `${rowIndex}-${colIndex}`;
              const slot = layoutData.slots[slotId];
              
              if (cell === 0) {
                // Road/driving space
                return (
                  <div key={slotId} className="road-space">
                    <div className="road-markers">
                      <span className="road-line">━</span>
                      <span className="road-line">━</span>
                    </div>
                  </div>
                );
              } else if (slot) {
                // Parking slot
                return (
                  <div
                    key={slotId}
                    className={getSlotClass(slot)}
                    onClick={() => handleSlotClick(slot)}
                    onMouseEnter={() => setHoveredSlot(slot.id)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    title={getSlotTooltip(slot)}
                  >
                    <div className="slot-number">{slot.slotNumber}</div>
                    <div className="slot-icon">
                      {getSlotIcon(slot)}
                    </div>
                    {slotStates[slot.id] === slotStatus.AVAILABLE && (
                      <div className="slot-price">₹{parkingProperty.pricePerHour || slot.pricePerHour}</div>
                    )}
                    {slotStates[slot.id] === slotStatus.BOOKED && (
                      <div className="slot-status">OCCUPIED</div>
                    )}
                  </div>
                );
              }
              
              return <div key={slotId} className="empty-space"></div>;
            })
          )}
        </div>

        {/* Entry/Exit indicators */}
        <div className="direction-indicators">
          <div className={`direction-marker entry-${layoutData.entryExit.entry}`}>
            <span className="direction-icon">🚪</span>
            <span className="direction-label">ENTRY</span>
          </div>
          <div className={`direction-marker exit-${layoutData.entryExit.exit}`}>
            <span className="direction-icon">🚪</span>
            <span className="direction-label">EXIT</span>
          </div>
        </div>
      </div>

      {selectedSlot && (
        <div className="selected-slot-info">
          <div className="selection-summary">
            <h4>🎯 Selected Slot</h4>
            <div className="selection-details">
              <span className="slot-detail">
                <strong>Slot:</strong> {selectedSlot.slotNumber}
              </span>
              <span className="slot-detail">
                <strong>Type:</strong> {selectedSlot.vehicleType === 'car' ? '🚗 Car' : '🏍️ Bike'}
              </span>
              <span className="slot-detail">
                <strong>Rate:</strong> ₹{selectedSlot.pricePerHour}/hour
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="helpful-tips">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Green slots are available for booking</li>
          <li>Red slots are currently occupied</li>
          <li>Gray slots are not available</li>
          <li>Click on any green slot to select it</li>
        </ul>
      </div>
    </div>
  );
};

export default ParkingSlotSelector;