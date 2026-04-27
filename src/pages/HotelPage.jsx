import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hotels from '../data/hotel.json';
import './HotelPage.css';

const getImagePath = (image) => `/images/${image}`;

const HotelCard = ({ hotel, navigate }) => {
	const handleShowMap = () => {
		// Store hotel data in localStorage
		localStorage.setItem(`hotel_${hotel.id}`, JSON.stringify(hotel));
		// Navigate to the hotel map page
		navigate(`/hotel-map/${hotel.id}`);
	};
	return (
		<div className="hotel-card">
			<img
				className="hotel-image"
				src={getImagePath(hotel.image)}
				alt={hotel.name}
				onError={e => (e.target.src = '/images/East Comman image.jpg')}
				onClick={handleShowMap}
				style={{ cursor: 'pointer' }}
			/>
			<div className="hotel-info">
				<div className="hotel-title" onClick={handleShowMap} style={{ cursor: 'pointer' }}>
					{hotel.name}
				</div>
				<div className="hotel-location">{hotel.location}</div>
				<div className="hotel-category">{hotel.category} • {hotel.region} Sikkim</div>
				<div className="hotel-description">{hotel.description}</div>
				<div className="hotel-details">
					<span className="hotel-price">{hotel.price}</span>
					<span className="hotel-rating">★ <span>{hotel.rating}</span></span>
				</div>
				<button
					style={{marginTop: '10px', padding: '7px 12px', borderRadius: '7px', background: '#f59e42', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600}}
					onClick={handleShowMap}
				>
					Show Distance in Map
				</button>
			</div>
		</div>
	);
};

const HotelPage = () => {
	const navigate = useNavigate();
	const [selectedRegion, setSelectedRegion] = useState('All');

	const filteredHotels = selectedRegion === 'All'
		? hotels
		: hotels.filter((hotel) => hotel.region === selectedRegion);

	return (
		<div className="hotel-page-container">
			<h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#4b5563' }}>Hotels in Sikkim</h1>
			<div className="hotel-filter-wrap">
				<label htmlFor="regionFilter" className="hotel-filter-label">Select Region</label>
				<select
					id="regionFilter"
					className="hotel-filter-select"
					value={selectedRegion}
					onChange={(e) => setSelectedRegion(e.target.value)}
				>
					<option value="All">All ({hotels.length})</option>
					<option value="East">East</option>
					<option value="North">North</option>
					<option value="South">South</option>
				</select>
			</div>
			<div className="hotel-list">
				{filteredHotels.map(hotel => (
					<HotelCard
						key={hotel.id}
						hotel={hotel}
						navigate={navigate}
					/>
				))}
			</div>
		</div>
	);
};

export default HotelPage;
