import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

export function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [waypoints, setWaypoints] = useState<L.LatLng[]>([
    L.latLng(0, 0), // Origen
    L.latLng(2, 2), // Destino
  ]);

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    console.log(`Clicked on: ${lat}, ${lng}`);
  };

  const handleRouting = () => {
    L.Routing.control({
      waypoints: waypoints,
    }).addTo(map!);
  };

  const addWaypoint = () => {
    const newWaypoint = L.latLng(1, 1); // Coordenadas del nuevo punto intermedio
    setWaypoints((prevWaypoints) => [...prevWaypoints, newWaypoint]);
  };

  const editWaypoint = (index: number, newLatLng: L.LatLng) => {
    setWaypoints((prevWaypoints) => {
      const updatedWaypoints = [...prevWaypoints];
      updatedWaypoints[index] = newLatLng;
      return updatedWaypoints;
    });
  };

  const removeWaypoint = (index: number) => {
    setWaypoints((prevWaypoints) => {
      const updatedWaypoints = [...prevWaypoints];
      updatedWaypoints.splice(index, 1);
      return updatedWaypoints;
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      const leafletMap = L.map(mapRef.current).setView([0, 0], 13);
      setMap(leafletMap);
    }
  }, []);

  useEffect(() => {
    if (map) {
      map.on('click', handleMapClick);
    }
  }, [map]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map?.setView([latitude, longitude], 13);
      });
    }
  }, [map]);  

  return (
    <div className="map-container" ref={mapRef}>
      <button onClick={handleRouting}>Generate Route</button>
      <button onClick={addWaypoint}>Add Waypoint</button>
      {waypoints.map((waypoint, index) => (
        <div key={index}>
          <span>Waypoint {index + 1}: </span>
          <input
            type="number"
            value={waypoint.lat}
            onChange={(e) =>
              editWaypoint(index, L.latLng(+e.target.value, waypoint.lng))
            }
          />
          <input
            type="number"
            value={waypoint.lng}
            onChange={(e) =>
              editWaypoint(index, L.latLng(waypoint.lat, +e.target.value))
            }
          />
          <button onClick={() => removeWaypoint(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
