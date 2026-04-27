import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HotelMap.css';

function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const HotelMap = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get hotel data from localStorage or URL
    const hotelData = localStorage.getItem(`hotel_${hotelId}`);
    if (hotelData) {
      setHotel(JSON.parse(hotelData));
    } else {
      setError('Hotel data not found');
      setLoading(false);
      return;
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(coords);
          
          // Calculate distance
          const hotelData = JSON.parse(localStorage.getItem(`hotel_${hotelId}`));
          const dist = haversineDistance(
            coords.latitude,
            coords.longitude,
            hotelData.latitude,
            hotelData.longitude
          );
          setDistance(dist);
          setLoading(false);
        },
        () => {
          setError('Unable to access your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, [hotelId]);

  const openFullMap = () => {
    if (!userLocation || !hotel) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${hotel.latitude},${hotel.longitude}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="hotel-map-container loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="hotel-map-container error">
        <div className="error-content">
          <h2>⚠️ Error</h2>
          <p>{error || 'Hotel not found'}</p>
          <button onClick={() => navigate('/hotels')} className="back-btn">
            ← Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-map-container">
      <div className="map-header">
        <button onClick={() => navigate('/hotels')} className="back-btn">
          ← Back to Hotels
        </button>
        <h1>{hotel.name}</h1>
      </div>

      <div className="map-content">
        <div className="map-section">
          <div className="map-box">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.5${Math.random().toString().substr(2, 8)}!2d${hotel.longitude}!3d${hotel.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodeURIComponent(hotel.name)}!2s${encodeURIComponent(hotel.location)}!5e0!3m2!1sen!2sin!4v1234567890`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Location of ${hotel.name}`}
            ></iframe>
          </div>

          <div className="distance-info">
            {distance && (
              <div className="distance-card">
                <div className="distance-header">
                  <h2>📍 Distance from Your Location</h2>
                </div>
                <div className="distance-value">
                  <span className="distance-number">{distance.toFixed(2)}</span>
                  <span className="distance-unit">km</span>
                </div>
                <p className="distance-text">{hotel.name}</p>
                <p className="location-text">{hotel.location}</p>
              </div>
            )}
          </div>

          <button onClick={openFullMap} className="full-map-btn">
            🗺️ Open Full Map in Google Maps
          </button>
        </div>

        <div className="hotel-details">
          <h2>Hotel Details</h2>
          <div className="detail-row">
            <span className="label">Category:</span>
            <span className="value">{hotel.category}</span>
          </div>
          <div className="detail-row">
            <span className="label">Region:</span>
            <span className="value">{hotel.region} Sikkim</span>
          </div>
          <div className="detail-row">
            <span className="label">Price:</span>
            <span className="value price">{hotel.price}</span>
          </div>
          <div className="detail-row">
            <span className="label">Rating:</span>
            <span className="value rating">★ {hotel.rating}</span>
          </div>
          <div className="detail-description">
            <span className="label">Description:</span>
            <p>{hotel.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelMap;
