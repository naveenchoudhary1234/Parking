import React, { useState, useEffect } from 'react';
import { 
  generateAllTemplates, 
  parkingTemplateCategories,
  slotStatus, 
  vehicleTypes 
} from '../data/parkingTemplates';
import '../styles/parking-layout-designer.css';

const ParkingLayoutDesigner = ({ property, onSave, onCancel, isNewProperty = false }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [layoutData, setLayoutData] = useState([]);
  const [slotConfiguration, setSlotConfiguration] = useState({});
  const [step, setStep] = useState(1); // 1: Template Selection, 2: Slot Configuration, 3: Preview
  const [entryExit, setEntryExit] = useState({ entry: 'bottom', exit: 'bottom' });
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');

  // Get slot numbers from property
  const carSlots = property?.carSlots || 0;
  const bikeSlots = property?.bikeSlots || 0;
  const pricePerHour = property?.pricePerHour || 20; // Use property's price or default to 20

  // Generate dynamic templates when component loads
  useEffect(() => {
    if (carSlots === 0 && bikeSlots === 0) return; // Skip generation if no slots
    
    const generateTemplates = async () => {
      setIsLoading(true);
      try {
        console.log(`🎯 Generating templates for ${carSlots} car slots and ${bikeSlots} bike slots at ₹${pricePerHour}/hour`);
        const templates = generateAllTemplates(carSlots, bikeSlots, pricePerHour);
        console.log(`✅ Generated ${templates.length} templates`, templates.map(t => ({ id: t.id, name: t.name, totalSlots: t.totalSlots })));
        setAvailableTemplates(templates);
      } catch (error) {
        console.error('❌ Error generating templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateTemplates();
  }, [carSlots, bikeSlots, pricePerHour]);

  // Initialize layout when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const template = availableTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        console.log(`🎯 Selected template:`, template);
        setLayoutData(template.layout);
        setEntryExit(template.entryExit);
        setSlotConfiguration(template.slots);
      }
    }
  }, [selectedTemplate, availableTemplates]);

  // Check if we have valid slot numbers
  if (carSlots === 0 && bikeSlots === 0) {
    return (
      <div className="parking-layout-designer">
        <div className="designer-header">
          <h2>⚠️ No Parking Slots Specified</h2>
          <p>Please go back and specify the number of car and bike slots for your parking space.</p>
        </div>
        <div className="error-container">
          <div className="error-message">
            <p>🚗 Car Slots: {carSlots}</p>
            <p>🏍️ Bike Slots: {bikeSlots}</p>
            <p>You need at least one type of parking slot to design a layout.</p>
          </div>
          <div className="form-actions">
            <button className="btn btn-outline" onClick={onCancel}>
              ← Go Back to Enter Slot Numbers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleTemplateSelect = (templateId) => {
    console.log("🎯 Template selected:", templateId);
    console.log("🔍 Available templates:", availableTemplates.map(t => ({ id: t.id, name: t.name })));
    setSelectedTemplate(templateId);
    setStep(2);
  };

  const toggleSlotStatus = (slotId) => {
    setSlotConfiguration(prev => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        status: prev[slotId].status === slotStatus.AVAILABLE 
          ? slotStatus.UNAVAILABLE 
          : slotStatus.AVAILABLE
      }
    }));
  };

  const toggleSlotVehicleType = (slotId) => {
    setSlotConfiguration(prev => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        vehicleType: prev[slotId].vehicleType === vehicleTypes.CAR 
          ? vehicleTypes.BIKE 
          : vehicleTypes.CAR
      }
    }));
  };

  const handleSaveLayout = () => {
    const template = availableTemplates.find(t => t.id === selectedTemplate);
    const layoutConfig = {
      templateId: selectedTemplate,
      templateName: template.name,
      layout: layoutData,
      slots: slotConfiguration,
      entryExit: entryExit,
      dimensions: template.dimensions,
      totalSlots: Object.keys(slotConfiguration).length,
      availableSlots: Object.values(slotConfiguration).filter(s => s.status === slotStatus.AVAILABLE).length,
      carSlots: Object.values(slotConfiguration).filter(s => s.vehicleType === vehicleTypes.CAR).length,
      bikeSlots: Object.values(slotConfiguration).filter(s => s.vehicleType === vehicleTypes.BIKE).length
    };
    
    console.log("💾 Saving layout config:", layoutConfig);
    onSave(layoutConfig);
  };

  const getSlotClass = (slot) => {
    let classes = ['parking-slot'];
    classes.push(`slot-${slot.status}`);
    classes.push(`vehicle-${slot.vehicleType}`);
    return classes.join(' ');
  };

  const filteredSlots = Object.values(slotConfiguration).filter(slot => {
    if (vehicleTypeFilter === 'all') return true;
    return slot.vehicleType === vehicleTypeFilter;
  });

  if (isLoading) {
    return (
      <div className="parking-layout-designer">
        <div className="designer-header">
          <h2>🚀 Generating Custom Layouts</h2>
          <p>Creating optimized layouts for {carSlots} car slots and {bikeSlots} bike slots...</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Please wait while we generate the best layouts for your space</p>
        </div>
      </div>
    );
  }

  if (step === 1) {
    // Template Selection Step
    return (
      <div className="parking-layout-designer">
        <div className="designer-header">
          <h2>🎯 Choose Your Parking Layout</h2>
          <p>Select from custom layouts designed for <strong>{carSlots} car slots</strong> and <strong>{bikeSlots} bike slots</strong></p>
        </div>

        <div className="template-categories">
          {parkingTemplateCategories.map((category) => {
            const template = availableTemplates.find(t => t.id === category.id);
            if (!template) return null;

            return (
              <div
                key={category.id}
                className="template-category"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="category-header">
                  <span className="category-icon">{category.icon}</span>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                    <span className="best-for">Best for: {category.bestFor}</span>
                  </div>
                </div>
                
                <div className="template-preview">
                  <div 
                    className="parking-grid-preview"
                    style={{
                      gridTemplateRows: `repeat(${template.dimensions.rows}, 1fr)`,
                      gridTemplateColumns: `repeat(${template.dimensions.cols}, 1fr)`,
                      aspectRatio: `${template.dimensions.cols}/${template.dimensions.rows}`
                    }}
                  >
                    {template.layout.map((row, rowIndex) =>
                      row.map((cell, colIndex) => {
                        const slotId = `${rowIndex}-${colIndex}`;
                        const slotData = template.slots[slotId];
                        
                        if (cell === 1 && slotData) {
                          // Parking slot - Use property's price in title
                          return (
                            <div 
                              key={slotId}
                              className={`slot-preview ${slotData.vehicleType}`}
                              title={`${slotData.slotNumber} - ${slotData.vehicleType === vehicleTypes.CAR ? 'Car' : 'Bike'} Slot - ₹${pricePerHour}/hr`}
                            >
                              {slotData.vehicleType === vehicleTypes.CAR ? '🚗' : '🏍️'}
                            </div>
                          );
                        } else if (cell === 2) {
                          // Entry road (green)
                          return (
                            <div 
                              key={slotId} 
                              className="entry-road-preview"
                              title="Entry Road"
                            />
                          );
                        } else if (cell === 3) {
                          // Exit road (red)
                          return (
                            <div 
                              key={slotId} 
                              className="exit-road-preview"
                              title="Exit Road"
                            />
                          );
                        } else if (cell === 4) {
                          // Separation zone (yellow)
                          return (
                            <div 
                              key={slotId} 
                              className="separation-zone-preview"
                              title="Separation Zone"
                            />
                          );
                        } else if (cell === 0) {
                          // Driving lane
                          return (
                            <div 
                              key={slotId} 
                              className="driving-lane-preview"
                              title="Driving Lane"
                            />
                          );
                        } else {
                          // Empty space
                          return (
                            <div 
                              key={slotId} 
                              className="empty-space-preview"
                            />
                          );
                        }
                      })
                    )}
                  </div>
                </div>
                
                <div className="template-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">{template.totalSlots}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Cars:</span>
                    <span className="stat-value">{template.carSlots}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Bikes:</span>
                    <span className="stat-value">{template.bikeSlots}</span>
                  </div>
                </div>
                
                <div className="template-features">
                  <span className="entry-exit">Entry: {template.entryExit.entry}</span>
                  <span className="entry-exit">Exit: {template.entryExit.exit}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="designer-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    // Slot Configuration Step
    return (
      <div className="parking-layout-designer">
        <div className="designer-header">
          <h2>🔧 Configure Your Parking Slots</h2>
          <p>Click slots to toggle availability, right-click to change vehicle type</p>
        </div>

        <div className="configuration-panel">
          <div className="config-controls">
            <div className="filter-controls">
              <label>Show:</label>
              <select 
                value={vehicleTypeFilter} 
                onChange={(e) => setVehicleTypeFilter(e.target.value)}
              >
                <option value="all">All Slots</option>
                <option value="car">Car Slots Only</option>
                <option value="bike">Bike Slots Only</option>
              </select>
            </div>
            
            <div className="legend">
              <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-color unavailable"></div>
                <span>Unavailable</span>
              </div>
              <div className="legend-item">
                <div className="legend-color car"></div>
                <span>Car Slot</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bike"></div>
                <span>Bike Slot</span>
              </div>
            </div>
          </div>

          <div className="layout-preview">
            <div className="parking-grid" style={{
              gridTemplateRows: `repeat(${layoutData.length}, 1fr)`,
              gridTemplateColumns: `repeat(${layoutData[0]?.length || 1}, 1fr)`
            }}>
              {layoutData.map((row, rowIndex) => 
                row.map((cell, colIndex) => {
                  const slotId = `${rowIndex}-${colIndex}`;
                  const slot = slotConfiguration[slotId];
                  
                  if (cell === 0) {
                    // Road/driving space
                    return (
                      <div 
                        key={slotId} 
                        className="road-space"
                      >
                        <span className="road-marker">🛣️</span>
                      </div>
                    );
                  } else if (slot) {
                    // Parking slot - Use property's price
                    return (
                      <div
                        key={slotId}
                        className={getSlotClass(slot)}
                        onClick={() => toggleSlotStatus(slotId)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          toggleSlotVehicleType(slotId);
                        }}
                        title={`Slot ${slot.slotNumber} - ${slot.vehicleType} - ₹${pricePerHour}/hr`}
                      >
                        <div className="slot-number">{slot.slotNumber}</div>
                        <div className="slot-icon">
                          {slot.vehicleType === vehicleTypes.CAR ? '🚗' : '🏍️'}
                        </div>
                        <div className="slot-price">₹{pricePerHour}/hr</div>
                      </div>
                    );
                  }
                  
                  return <div key={slotId} className="empty-space"></div>;
                })
              )}
            </div>
          </div>

          <div className="slot-summary">
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-number">{Object.keys(slotConfiguration).length}</span>
                <span className="stat-label">Total Slots</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{Object.values(slotConfiguration).filter(s => s.status === slotStatus.AVAILABLE).length}</span>
                <span className="stat-label">Available</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{Object.values(slotConfiguration).filter(s => s.vehicleType === vehicleTypes.CAR).length}</span>
                <span className="stat-label">Car Slots</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{Object.values(slotConfiguration).filter(s => s.vehicleType === vehicleTypes.BIKE).length}</span>
                <span className="stat-label">Bike Slots</span>
              </div>
            </div>
          </div>
        </div>

        <div className="designer-actions">
          <button className="btn-secondary" onClick={() => setStep(1)}>
            ← Back to Templates
          </button>
          <button className="btn-primary" onClick={() => setStep(3)}>
            Preview Layout →
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    // Preview Step
    const template = availableTemplates.find(t => t.id === selectedTemplate);
    
    return (
      <div className="parking-layout-designer">
        <div className="designer-header">
          <h2>👀 Preview Your Parking Layout</h2>
          <p>This is how customers will see your parking layout</p>
        </div>

        <div className="preview-panel">
          <div className="preview-info">
            <h3>{template.name}</h3>
            <p>{template.description}</p>
          </div>

          <div className="layout-preview customer-view">
            <div className="parking-grid" style={{
              gridTemplateRows: `repeat(${layoutData.length}, 1fr)`,
              gridTemplateColumns: `repeat(${layoutData[0]?.length || 1}, 1fr)`
            }}>
              {layoutData.map((row, rowIndex) => 
                row.map((cell, colIndex) => {
                  const slotId = `${rowIndex}-${colIndex}`;
                  const slot = slotConfiguration[slotId];
                  
                  if (cell === 0) {
                    return (
                      <div key={slotId} className="road-space">
                        <span className="road-marker">🛣️</span>
                      </div>
                    );
                  } else if (slot) {
                    // Preview - Use property's price
                    return (
                      <div
                        key={slotId}
                        className={`${getSlotClass(slot)} customer-slot`}
                        title={`Slot ${slot.slotNumber} - ${slot.vehicleType} - ₹${pricePerHour}/hr`}
                      >
                        <div className="slot-number">{slot.slotNumber}</div>
                        <div className="slot-icon">
                          {slot.vehicleType === vehicleTypes.CAR ? '🚗' : '🏍️'}
                        </div>
                        {slot.status === slotStatus.AVAILABLE && (
                          <div className="slot-price">₹{pricePerHour}</div>
                        )}
                      </div>
                    );
                  }
                  
                  return <div key={slotId} className="empty-space"></div>;
                })
              )}
            </div>
          </div>

          <div className="entry-exit-info">
            <div className="direction-info">
              <span className="entry-marker">🚪 Entry: {entryExit.entry}</span>
              <span className="exit-marker">🚪 Exit: {entryExit.exit}</span>
            </div>
          </div>
        </div>

        <div className="designer-actions">
          <button className="btn-secondary" onClick={() => setStep(2)}>
            ← Back to Configure
          </button>
          <button className="btn-success" onClick={handleSaveLayout}>
            💾 {isNewProperty ? 'Select This Layout' : 'Save Layout'}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ParkingLayoutDesigner;