import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './AdminUserView.css';

// Define marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Sample user data with location coordinates
const users = [
  { user_id: 1, name: 'User A', location: 'Colombo', coordinates: [6.9271, 79.8612] },
  { user_id: 2, name: 'User B', location: 'Kandy', coordinates: [7.2906, 80.6337] },
  { user_id: 3, name: 'User C', location: 'Galle', coordinates: [6.0535, 80.2210] },
  { user_id: 4, name: 'User D', location: 'Jaffna', coordinates: [9.6615, 80.0255] },
];

const AdminUserView = () => {
  const [hoveredUser, setHoveredUser] = useState(null);

  // Define bounds for Sri Lanka (approximate coordinates)
  const sriLankaBounds = [
    [5.8, 79.5], // Southwest corner
    [10.0, 82.0], // Northeast corner
  ];

  // Map component to update view on hover
  const MapView = () => {
    const map = useMap();

    if (hoveredUser) {
      const { coordinates } = hoveredUser;
      map.setView(coordinates, 8);
    }

    return null;
  };

  return (
    <div className="admin-user-view">
      {/* Left Section: User List */}
      <div className="user-list">
        <h3>Registered Users</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.user_id}
              className={hoveredUser?.user_id === user.user_id ? 'user-item hovered' : 'user-item'}
              onMouseEnter={() => setHoveredUser(user)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              {user.name} ({user.location})
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section: Map */}
      <div className="map-container">
        <MapContainer
          center={[7.8731, 80.7718]} // Center of Sri Lanka
          zoom={7.5}
          minZoom={7} // Minimum zoom level to prevent zooming out too much
          maxZoom={9} // Maximum zoom level for detailed view
          maxBounds={sriLankaBounds} // Restrict map bounds to Sri Lanka
          maxBoundsViscosity={1.0} // Prevents panning outside the bounds
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapView />
          {/* Render markers for all users */}
          {users.map((user) => (
            <Marker
              key={user.user_id}
              position={user.coordinates}
              icon={markerIcon}
            >
              <Popup>
                <strong>{user.name}</strong>
                <br />
                Location: {user.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AdminUserView;
