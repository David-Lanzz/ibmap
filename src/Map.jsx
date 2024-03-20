import React, { useEffect } from "react";
import L from "leaflet";

const Map = () => {
  useEffect(() => {
    // Define bounds for Ibadan
    const ibadanBounds = L.latLngBounds([7.0000, 3.0000], [8.0000, 4.5000]);

    // Initialize the map with Ibadan bounds
    var map = L.map('map', {
      maxBounds: ibadanBounds,
      maxBoundsViscosity: 1.0 // Ensure users can't drag the map outside the bounds
    }).setView([7.3775, 3.9470], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);
    
    // Clean up function
    return () => {
      map.remove(); // Remove the map when component unmounts
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div id="map" style={{ height: "100vh" }}></div>
  );
};

export default Map;
