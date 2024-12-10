import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
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

// Define larger marker icon for hover state
const hoverMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [30, 50], // Slightly larger icon
  iconAnchor: [15, 50],
  popupAnchor: [1, -34],
});

const AdminUserView = () => {

  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://64.227.152.179:8080/weighingSystem-1/user/all');
        const result = await response.json();

        if (response.ok) {
          // Filter users where shw === 1 and latitude/longitude are not null
          const filteredUsers = result.filter(
            (user) => user.shw === 1 && user.latitude && user.longitude
          );
          setUsers(filteredUsers);
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Define bounds for Sri Lanka (approximate coordinates)
  const sriLankaBounds = [
    [5.6, 81.4], // Southwest corner
    [10.3, 81.7], // Northeast corner
  ];

  // Map component to update view on hover
  const MapView = () => {
    const map = useMap();    
    if (hoveredUser) {
      map.setView([hoveredUser.latitude, hoveredUser.longitude], 8);
    }
    return null;
  };

  const handleUserClick = (user) => {
    navigate(`/dashboard/${user.id}`); // Redirect to the user's dashboard
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage items
    navigate('/'); // Redirect to login page
  };



  return (
    <div className="admin-user-view">
      <button onClick={handleLogout} className="admin-logout-button">
        Logout
      </button>

      {/* Loading and Error Handling */}
      {loading && <p>Loading users...</p>}
      {error && <p>Error: {error}</p>}

      {/* Left Section: User List */}
      {!loading && !error && (
        <div className="user-list">
          <h3>Registered Users</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((user) => (
              <li
                key={user.id}
                className={hoveredUser?.id === user.id ? 'user-item hovered' : 'user-item'}
                onMouseEnter={() => setHoveredUser(user)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                {user.username} ({user.location})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Right Section: Map */}
      <div className="map-container">
        <MapContainer
          center={[7.8731, 80.7718]} // Center of Sri Lanka
          zoom={7.5}
          minZoom={7.4} // Minimum zoom level to prevent zooming out too much
          maxZoom={7.7} // Maximum zoom level for detailed view
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
              key={user.id}
              position={[parseFloat(user.latitude), parseFloat(user.longitude)]}
              icon={hoveredUser?.id === user.id ? hoverMarkerIcon : markerIcon} // Change icon on hover
              eventHandlers={{
                click: () => handleUserClick(user), // Redirect on marker click
                mouseover: () => setHoveredUser(user), // Set hovered user on marker hover
                mouseout: () => setHoveredUser(null), // Clear hovered user when mouse leaves
              }}
            >
              <Popup>
                <strong>{user.username}</strong>
                <br />
                Location: {user.location}
              </Popup>
              {hoveredUser?.id === user.id && (
                <Tooltip permanent direction="top" offset={[0, -20]} className="custom-tooltip">
                  <strong>{user.username}</strong>
                  <br />
                  Location: {user.location}
                </Tooltip>
              )}
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AdminUserView;