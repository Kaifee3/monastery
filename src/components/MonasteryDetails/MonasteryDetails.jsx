import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useMonasteryData from '../../hooks/useMonasteryData';
import ImageSlideshow from './ImageSlideshow';
import './MonasteryDetails.css';

const MonasteryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { monasteries, loading, error } = useMonasteryData();
    const [monastery, setMonastery] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (monasteries.length > 0) {
            const foundMonastery = monasteries.find(m => m.id === parseInt(id));
            if (foundMonastery) {
                setMonastery(foundMonastery);
            }
        }
    }, [id, monasteries]);

    // Scroll to top when component mounts or when monastery changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [id, monastery]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <h3>Loading monastery details...</h3>
            </div>
        );
    }

    if (!monastery) {
        return (
            <div className="error-container">
                <h3>Monastery not found</h3>
                <Link to="/monasteries" className="btn btn-primary">Back to Monasteries</Link>
            </div>
        );
    }

    const handleGetDirections = () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(monastery.name + ', ' + monastery.location)}`;
        window.open(googleMapsUrl, '_blank');
    };

    const handleBookTour = () => {
        alert('Booking feature coming soon! Please contact us at +91-9876543210');
    };

    const handleWeatherUpdate = (monastery) => {
        navigate(`/weather/${monastery.id}`);
    };

    // Mock detailed data - in real app, this would come from API
    const detailedInfo = {
        significance: monastery.name === "Rumtek Monastery" ? 
            "Rumtek Monastery holds immense significance as the seat-in-exile of the Gyalwang Karmapa, the head of the Karma Kagyu school. It houses precious relics including the Black Crown, sacred scriptures, and thankas. The monastery is considered the most important Karma Kagyu monastery outside Tibet." :
            monastery.name === "Pemayangtse Monastery" ?
            "Pemayangtse means 'Perfect Sublime Lotus' and is one of the premier monasteries of Sikkim. Only pure-blooded Bhutias can become monks here. It houses the famous seven-tiered wooden sculpture depicting Guru Rinpoche's celestial palace called 'Sanghthokpalri'." :
            `${monastery.name} is a sacred center of Buddhist learning and meditation, preserving ancient traditions and serving as a spiritual beacon for devotees and visitors from around the world.`,
        
        architecture: monastery.name === "Rumtek Monastery" ?
            "The monastery showcases traditional Tibetan architecture with intricate wood carvings, golden roofs, and colorful murals. The main temple features a three-story structure with assembly hall, shrines, and meditation rooms." :
            "Built in traditional Sikkimese-Tibetan architectural style with wooden structures, sloping roofs, and ornate decorations. The monastery features prayer halls, meditation chambers, and residential quarters for monks.",
        
        festivals: monastery.name === "Rumtek Monastery" ?
            ["Losar (Tibetan New Year) - February/March", "Buddha Jayanti - May", "Kagyu Monlam - Winter", "Cham Dance Festival - Various dates"] :
            monastery.name === "Pemayangtse Monastery" ?
            ["Chaang Lo (Sikkimese New Year) - December", "Buddha Purnima - May", "Bumchu Festival - February/March", "Pang Lhabsol - August/September"] :
            ["Buddha Jayanti - May", "Losar Festival - February/March", "Dukpa Tse-Shi - June", "Local monastery celebrations"],
        
        timings: "Daily: 6:00 AM - 6:00 PM\nPrayer Times: 6:00 AM, 12:00 PM, 6:00 PM\nVisiting Hours: 9:00 AM - 5:00 PM",
        
        entryFee: "Indians: ₹20\nForeigners: ₹50\nCamera: ₹30\nVideo: ₹100\nGuided Tour: ₹200",
        
        bestTime: {
            season: "October to March (Peak Season)\nApril to June (Pleasant Weather)\nJuly to September (Monsoon - Limited Access)",
            timing: "Early Morning (6:00-9:00 AM) for prayers\nLate Afternoon (4:00-6:00 PM) for golden hour photography"
        },
        
        routes: [
            {
                from: "Gangtok",
                distance: monastery.location.includes("East Sikkim") ? "24 km" : "45-70 km",
                duration: monastery.location.includes("East Sikkim") ? "45 minutes" : "1.5-2 hours",
                mode: "Taxi/Car",
                cost: monastery.location.includes("East Sikkim") ? "₹800-1200" : "₹1500-2500",
                route: monastery.location.includes("East Sikkim") ? 
                    "Gangtok → MG Marg → Rumtek Road → Monastery" :
                    "Gangtok → Singtam → Legship → Pelling → Monastery"
            },
            {
                from: "Siliguri/NJP",
                distance: "120-150 km",
                duration: "4-5 hours",
                mode: "Taxi/Bus",
                cost: "₹3000-5000 (Taxi), ₹200-400 (Bus)",
                route: "Siliguri → Rangpo → Gangtok → Monastery"
            },
            {
                from: "Bagdogra Airport",
                distance: "125-155 km",
                duration: "4.5-5.5 hours",
                mode: "Taxi/Helicopter",
                cost: "₹3500-6000 (Taxi), ₹15000+ (Helicopter)",
                route: "Airport → Siliguri → Rangpo → Gangtok → Monastery"
            }
        ],
        
        nearbyAttractions: monastery.location.includes("East Sikkim") ? 
            ["Gangtok City", "Tsomgo Lake", "Baba Mandir", "Nathula Pass", "Hanuman Tok"] :
            ["Pelling Skywalk", "Khecheopalri Lake", "Kanchenjunga Falls", "Sangachoeling Monastery", "Yuksom"],
        
        accommodation: [
            { type: "Luxury Hotels", range: "₹3000-8000/night", examples: ["Mayfair Spa Resort", "The Elgin Mount Pandim"] },
            { type: "Mid-Range Hotels", range: "₹1500-3000/night", examples: ["Hotel Sonam Delek", "Summit Newa Regency"] },
            { type: "Budget Options", range: "₹500-1500/night", examples: ["Zostel", "Local Homestays"] },
            { type: "Monastery Stay", range: "₹300-800/night", examples: ["Guest rooms (if available)"] }
        ]
    };

    // Remove the old images array as we'll use the slideshow component

    return (
        <div className="monastery-details">
            {/* Navigation Bar */}
            <div className="detail-nav">
                <div className="nav-links">
                    <Link to="/monasteries" className="nav-link">All Monasteries</Link>
                </div>
            </div>

            {/* Hero Section with Image Slideshow */}
            <div className="detail-hero">
                <ImageSlideshow 
                    monasteryName={monastery.name} 
                    imageName={monastery.imageName} 
                />
            </div>

            {/* Quick Info Bar */}
            <div className="quick-info">
                <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">📍 {monastery.location}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Established</span>
                    <span className="info-value">{monastery.established}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Best Time</span>
                    <span className="info-value">Oct - Mar</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Entry Fee</span>
                    <span className="info-value">₹20-50</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Duration</span>
                    <span className="info-value">2-3 hours</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button onClick={handleGetDirections} className="btn btn-primary">
                    <i>🗺️</i> Get Directions
                </button>
                <button onClick={handleBookTour} className="btn btn-secondary">
                    <i>📅</i> Book Guided Tour
                </button>
                <button 
                    className="btn btn-outline"
                    onClick={() => handleWeatherUpdate(monastery)}
                >
                <i>🌤️</i> Weather update
                </button>
                <button className="btn btn-outline">
                    <i>📸</i> Virtual Tour
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button 
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    History & Significance
                </button>
                <button 
                    className={`tab ${activeTab === 'visit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('visit')}
                >
                    Plan Your Visit
                </button>
                <button 
                    className={`tab ${activeTab === 'routes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('routes')}
                >
                    Routes & Transport
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-content">
                        <div className="content-grid">
                            <div className="main-content">
                                <section className="section">
                                    <h2>About {monastery.name}</h2>
                                    <p>{monastery.history}</p>
                                </section>

                                <section className="section">
                                    <h2>Why Visit?</h2>
                                    <p>{detailedInfo.significance}</p>
                                </section>

                                <section className="section">
                                    <h2>Architecture & Art</h2>
                                    <p>{detailedInfo.architecture}</p>
                                </section>

                                <section className="section">
                                    <h2>Festivals & Events</h2>
                                    <ul className="festival-list">
                                        {detailedInfo.festivals.map((festival, index) => (
                                            <li key={index}>{festival}</li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            <div className="sidebar-content">
                                <div className="info-card">
                                    <h3>Quick Facts</h3>
                                    <div className="fact-item">
                                        <strong>Founded:</strong> {monastery.established}
                                    </div>
                                    <div className="fact-item">
                                        <strong>Location:</strong> {monastery.location}
                                    </div>
                                    <div className="fact-item">
                                        <strong>Sect:</strong> Kagyu/Nyingma Buddhism
                                    </div>
                                    <div className="fact-item">
                                        <strong>Altitude:</strong> 1,500-2,500m
                                    </div>
                                </div>

                                <div className="info-card">
                                    <h3>Nearby Attractions</h3>
                                    <ul className="attraction-list">
                                        {detailedInfo.nearbyAttractions.map((attraction, index) => (
                                            <li key={index}>{attraction}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="history-content">
                        <section className="section">
                            <h2>Historical Background</h2>
                            <p>{monastery.history}</p>
                        </section>

                        <section className="section">
                            <h2>Spiritual Significance</h2>
                            <p>{detailedInfo.significance}</p>
                        </section>

                        <section className="section">
                            <h2>Cultural Importance</h2>
                            <p>This monastery plays a crucial role in preserving Tibetan Buddhist culture and traditions in Sikkim. It serves as a center for religious studies, meditation practices, and cultural festivals that attract devotees and scholars from around the world.</p>
                        </section>

                        <section className="section">
                            <h2>Notable Features</h2>
                            <ul>
                                <li>Ancient Buddhist scriptures and manuscripts</li>
                                <li>Traditional Tibetan architectural elements</li>
                                <li>Sacred relics and religious artifacts</li>
                                <li>Meditation halls and prayer wheels</li>
                                <li>Monks' residential quarters and study areas</li>
                            </ul>
                        </section>
                    </div>
                )}

                {activeTab === 'visit' && (
                    <div className="visit-content">
                        <div className="content-grid">
                            <div className="main-content">
                                <section className="section">
                                    <h2>Opening Hours & Timings</h2>
                                    <pre className="timing-info">{detailedInfo.timings}</pre>
                                </section>

                                <section className="section">
                                    <h2>Entry Fees</h2>
                                    <pre className="fee-info">{detailedInfo.entryFee}</pre>
                                </section>

                                <section className="section">
                                    <h2>Best Time to Visit</h2>
                                    <div className="best-time">
                                        <h4>Seasonal Guide:</h4>
                                        <pre>{detailedInfo.bestTime.season}</pre>
                                        
                                        <h4>Best Timing During Day:</h4>
                                        <pre>{detailedInfo.bestTime.timing}</pre>
                                    </div>
                                </section>

                                <section className="section">
                                    <h2>What to Expect</h2>
                                    <ul>
                                        <li>Guided tours available in English and Hindi</li>
                                        <li>Photography allowed in most areas (additional fee)</li>
                                        <li>Peaceful meditation sessions</li>
                                        <li>Traditional butter tea and local snacks</li>
                                        <li>Souvenir shop with Buddhist artifacts</li>
                                    </ul>
                                </section>
                            </div>

                            <div className="sidebar-content">
                                <div className="info-card">
                                    <h3>Visitor Guidelines</h3>
                                    <ul>
                                        <li>Dress modestly</li>
                                        <li>Maintain silence in prayer halls</li>
                                        <li>Remove shoes before entering temples</li>
                                        <li>Don't touch religious artifacts</li>
                                        <li>Follow photography rules</li>
                                    </ul>
                                </div>

                                <div className="info-card">
                                    <h3>What to Bring</h3>
                                    <ul>
                                        <li>Comfortable walking shoes</li>
                                        <li>Light jacket (high altitude)</li>
                                        <li>Water bottle</li>
                                        <li>Camera (with extra fee)</li>
                                        <li>Cash for donations</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'routes' && (
                    <div className="routes-content">
                        <section className="section">
                            <h2>How to Reach</h2>
                            <div className="routes-grid">
                                {detailedInfo.routes.map((route, index) => (
                                    <div key={index} className="route-card">
                                        <h3>From {route.from}</h3>
                                        <div className="route-details">
                                            <div className="route-info">
                                                <span className="label">Distance:</span>
                                                <span className="value">{route.distance}</span>
                                            </div>
                                            <div className="route-info">
                                                <span className="label">Duration:</span>
                                                <span className="value">{route.duration}</span>
                                            </div>
                                            <div className="route-info">
                                                <span className="label">Mode:</span>
                                                <span className="value">{route.mode}</span>
                                            </div>
                                            <div className="route-info">
                                                <span className="label">Cost:</span>
                                                <span className="value">{route.cost}</span>
                                            </div>
                                            <div className="route-path">
                                                <span className="label">Route:</span>
                                                <span className="value">{route.route}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="section">
                            <h2>Accommodation Options</h2>
                            <div className="accommodation-grid">
                                {detailedInfo.accommodation.map((acc, index) => (
                                    <div key={index} className="accommodation-card">
                                        <h4>{acc.type}</h4>
                                        <div className="price-range">{acc.range}</div>
                                        <div className="examples">
                                            {acc.examples.map((example, i) => (
                                                <span key={i} className="example">{example}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="section">
                            <h2>Travel Tips</h2>
                            <ul>
                                <li>Book permits in advance for restricted areas</li>
                                <li>Carry valid ID proof (mandatory)</li>
                                <li>Check weather conditions before traveling</li>
                                <li>Book accommodation in advance during peak season</li>
                                <li>Keep emergency contacts handy</li>
                                <li>Respect local customs and traditions</li>
                            </ul>
                        </section>
                    </div>
                )}
            </div>

            {/* Gallery Section */}
            <div className="gallery-section">
                <div className="gallery-header">
                    <h2 className="gallery-title">
                        <span className="gallery-icon">📸</span>
                        Photo Gallery
                    </h2>
                    <p className="gallery-description">
                        Explore the serene beauty and architectural magnificence of {monastery.name} through our curated collection of images
                    </p>
                </div>
                <div className="image-gallery-cards">
                    {[1, 2, 3, 4].map((imageNum) => {
                        let imagePath;
                        if (monastery.name === 'Rumtek Monastery') {
                            imagePath = `/images/slide/Rumtek-Monastery-${imageNum}.jpg`;
                        } else {
                            const nameMapping = {
                                'Pemayangtse Monastery': 'Pemangytse',
                                'Tashiding Monastery': 'Tashiding-Monastery',
                                'Enchey Monastery': 'Enchey Monastery',
                                'Dubdi Monastery': 'Dubdi Monastery',
                                'Phodong Monastery': 'Phodong-Monastery',
                                'Ralang Monastery': 'Ralang-Monastery',
                                'Tsuklakhang Gonpa': 'Tsuklakhang-Gonpa',
                                'Kathog Lake Monastery': 'Kathog',
                                'Lingdum Zurmang Monastery': 'Lingdum-Zurmang'
                            };
                            const baseName = nameMapping[monastery.name] || monastery.name;
                            imagePath = `/images/slide/${baseName}${imageNum}.jpg`;
                        }
                        
                        return (
                            <div key={imageNum} className="gallery-card">
                                <div className="gallery-card-image">
                                    <img
                                        src={imagePath}
                                        alt={`${monastery.name} - View ${imageNum}`}
                                        onError={(e) => {
                                            e.target.src = `/images/${monastery.imageName}`;
                                        }}
                                    />
                                    <div className="gallery-card-overlay">
                                        <div className="gallery-card-info">
                                            <h4>{monastery.name}</h4>
                                            <p>View {imageNum}</p>
                                        </div>
                                        <button className="gallery-card-view-btn">
                                            <span>🔍</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="gallery-card-content">
                                    <h5>{monastery.name}</h5>
                                    <p>Architectural View {imageNum}</p>
                                    <div className="gallery-card-tags">
                                        <span className="tag">Architecture</span>
                                        <span className="tag">Sacred</span>
                                        <span className="tag">Heritage</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Call to Action */}
            <div className="cta-section">
                <h2>Ready to Visit {monastery.name}?</h2>
                <p>Plan your spiritual journey to this sacred monastery</p>
                <div className="cta-buttons">
                    <button onClick={handleBookTour} className="btn btn-cta">
                        Book Guided Tour
                    </button>
                    <button onClick={handleGetDirections} className="btn btn-outline-cta">
                        Get Directions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MonasteryDetails;