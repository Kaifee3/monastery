import React, { useState, useEffect, useRef } from 'react';
import useMonasteryData from '../hooks/useMonasteryData';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Monasteries.css';

const Monasteries = () => {
    const { monasteries, loading, error } = useMonasteryData();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [filteredMonasteries, setFilteredMonasteries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    // Pagination state
    const location = useLocation();
    // Get page from query string
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get('page')) || 1;
    const [currentPage, setCurrentPage] = useState(initialPage);
    const monasteriesPerPage = 9;

    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Track previous filter/search to only reset page if they actually change
    const prevFilterRef = useRef({ searchTerm, selectedRegion });
    useEffect(() => {
        let filtered = monasteries;
        if (searchTerm) {
            filtered = filtered.filter(monastery =>
                monastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                monastery.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedRegion !== 'All') {
            filtered = filtered.filter(monastery =>
                monastery.location.includes(selectedRegion)
            );
        }
        setFilteredMonasteries(filtered);
        // Only reset to first page if filter/search actually changed
        if (
            prevFilterRef.current.searchTerm !== searchTerm ||
            prevFilterRef.current.selectedRegion !== selectedRegion
        ) {
            setCurrentPage(1);
        }
        prevFilterRef.current = { searchTerm, selectedRegion };
    }, [monasteries, searchTerm, selectedRegion]);

    // Update URL query string when currentPage changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (currentPage > 1) {
            params.set('page', currentPage);
        } else {
            params.delete('page');
        }
        // Only update if different
        if (params.toString() !== location.search.replace(/^\?/, '')) {
            navigate({ search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
        }
    }, [currentPage, navigate, location.search]);

    const handleViewRoutes = (monastery) => {
        navigate(`/directions/${monastery.id}`);
    };

    const handleWeatherUpdate = (monastery) => {
        navigate(`/weather/${monastery.id}`);
    };

    const handleVirtualTour = (monastery) => {
        navigate(`/virtual/${monastery.id}`);
    };

    const regions = ['All', 'East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim'];

    if (!isAuthenticated) {
        return (
            <div className="auth-required-container">
                <div className="auth-prompt">
                    <div className="auth-icon">🏛️</div>
                    <h2>Authentication Required</h2>
                    <p>Please log in to explore the sacred monasteries of Sikkim</p>
                    <div className="auth-benefits">
                        <h3>What you'll get access to:</h3>
                        <ul>
                            <li>🌍 Interactive 3D virtual tours</li>
                            <li>📍 Detailed directions to monasteries</li>
                            <li>🌤️ Real-time weather updates</li>
                            <li>🎧 Audio guides and historical insights</li>
                            <li>📱 Personalized monastery recommendations</li>
                        </ul>
                    </div>
                    <div className="auth-actions">
                        <button 
                            onClick={() => navigate('/login')}
                            className="btn btn-primary auth-btn"
                        >
                            Login to Continue
                        </button>
                        <p className="auth-signup">
                            Don't have an account? 
                            <Link to="/register" className="signup-link"> Sign up here</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <h3>Discovering Sacred Places...</h3>
                <p>Loading Sikkim's ancient monasteries</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>Error loading monasteries: {error.message}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    // Pagination calculations
    const totalPages = Math.ceil(filteredMonasteries.length / monasteriesPerPage);
    const startIdx = (currentPage - 1) * monasteriesPerPage;
    const endIdx = startIdx + monasteriesPerPage;
    const pagedMonasteries = filteredMonasteries.slice(startIdx, endIdx);

    return (
        <div className="monasteries-page">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Sacred Monasteries of Sikkim
                        <span className="subtitle">Discover 200+ Ancient Buddhist Heritage Sites</span>
                    </h1>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">{monasteries.length}</span>
                            <span className="stat-label">Monasteries</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">300+</span>
                            <span className="stat-label">Years of History</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">4</span>
                            <span className="stat-label">Regions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="controls-section">
                <div className="filter-controls">
                    <div className="region-filter">
                        <label>Region:</label>
                        <select 
                            value={selectedRegion} 
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="region-select"
                        >
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    <div className="search-container">
                        <div className="search-box">
                            <i className="search-icon">🔍</i>
                            <input
                                type="text"
                                placeholder="Search monasteries by name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    <div className="view-toggle">
                        <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <i>⊞</i> Grid
                        </button>
                        <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <i>☰</i> List
                        </button>
                    </div>
                </div>
            </div>

            <div className={`monasteries-container ${viewMode}-view`}>
                {filteredMonasteries.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-icon">🏛️</div>
                        <h3>No monasteries found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className={`monastery-${viewMode}`}>
                        {pagedMonasteries.map((monastery, index) => (
                            <div 
                                key={monastery.id} 
                                className={`monastery-card ${viewMode}-card`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                                data-monastery-id={monastery.id}
                            >
                                <div className="monastery-image">
                                    <Link to={`/monasteries/${monastery.id}`}>
                                        <img 
                                            src={`/images/${monastery.imageName || 'default-monastery.jpg'}`} 
                                            alt={monastery.name}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = '/images/default-monastery.jpg';
                                            }}
                                        />
                                        <div className="image-overlay">
                                            <div className="established-badge">
                                                Est. {monastery.established}
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                                <div className="monastery-content">
                                    <div className="monastery-header">
                                        <h2 className="monastery-name">{monastery.name}</h2>
                                        <div className="monastery-meta">
                                            <span className="location">
                                                <i>📍</i> {monastery.location}
                                            </span>
                                            <span className="established">
                                                <i>🏛️</i> {monastery.established}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="monastery-history">{monastery.history}</p>

                                    <div className="monastery-features">
                                        <span 
                                            className="feature-tag virtual-tour-tag"
                                            onClick={() => handleVirtualTour(monastery)}
                                            title="View in 3D on Google Earth"
                                        >
                                            🌍 3D Tour
                                        </span>
                                        <span className="feature-tag">🎧 Audio</span>
                                        <span 
                                            className="feature-tag virtual-tour-tag"
                                            onClick={() => handleVirtualTour(monastery)}
                                            title="View in 3D on Google Earth"
                                        >
                                            � 360° View
                                        </span>
                                    </div>

                                    <div className="monastery-actions">
                                        <Link 
                                            to={`/monasteries/${monastery.id}`} 
                                            className="btn btn-primary"
                                        >
                                            <i>👁️</i> Explore
                                        </Link>
                                        <button 
                                            onClick={() => handleViewRoutes(monastery)}
                                            className="btn btn-secondary"
                                        >
                                            <i>🗺️</i> Get Directions
                                        </button>
                                        <button 
                                            className="btn btn-outline monastery-weather-btn"
                                            onClick={() => handleWeatherUpdate(monastery)}
                                        >
                                            <i>🌤️</i> Weather update
                                        </button>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <div className="rating">
                                        <span className="stars">⭐⭐⭐⭐⭐</span>
                                        <span className="rating-text">4.8 (127 reviews)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Bar */}
            {filteredMonasteries.length > monasteriesPerPage && (
                <div className="pagination-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2rem 0' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ marginRight: '2rem', minWidth: '40px', padding: '10px 6px', fontSize: '0.95rem' }}
                    >
                        Prev
                    </button>
                    <span style={{ fontWeight: 'bold', margin: '0 2rem' }}>
                        Page {currentPage} out of {totalPages}
                    </span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{ marginLeft: '2rem', minWidth: '40px', padding: '10px 6px', fontSize: '0.95rem' }}
                    >
                        Next
                    </button>
                </div>
            )}

            <div className="cta-section">
                <div className="cta-content">
                    <h2>Plan Your Spiritual Journey</h2>
                    <p>Discover the ancient wisdom and breathtaking architecture of Sikkim's monasteries</p>
                    <div className="cta-buttons">
                        <button className="btn btn-cta">Download Mobile App</button>
                        <button className="btn btn-outline-cta">Book Guided Tour</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Monasteries;