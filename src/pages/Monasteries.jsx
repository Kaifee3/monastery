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
    const [viewMode, setViewMode] = useState('list');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get('page')) || 1;
    const [currentPage, setCurrentPage] = useState(initialPage);
    const monasteriesPerPage = 9;

    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
        if (
            prevFilterRef.current.searchTerm !== searchTerm ||
            prevFilterRef.current.selectedRegion !== selectedRegion
        ) {
            setCurrentPage(1);
        }
        prevFilterRef.current = { searchTerm, selectedRegion };
    }, [monasteries, searchTerm, selectedRegion]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (currentPage > 1) {
            params.set('page', currentPage);
        } else {
            params.delete('page');
        }
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
        <div className="monasteries-page" style={{ padding: '0', margin: '0' }}>
            <div className="hero-section" style={{
                background: `
                    radial-gradient(ellipse at top left, rgba(38, 159, 44, 0.4) 0%, transparent 50%),
                    radial-gradient(ellipse at top right, rgba(25, 31, 19, 0.3) 0%, transparent 50%),
                    radial-gradient(ellipse at bottom center, rgba(76, 175, 80, 0.3) 0%, transparent 70%),
                    linear-gradient(135deg, 
                        #2e7d32 0%, 
                        #8bc34a 50%,
                        #4caf50 100%
                    )
                `,
                position: 'relative',
                overflow: 'hidden',
                color: 'white',
                padding: '40px 20px',
                textAlign: 'center',
                borderRadius: '0 0 20px 20px',
                boxShadow: '0 8px 25px rgba(46, 125, 50, 0.2)',
                marginBottom: '20px'
            }}>
                {/* Enhanced warm pattern overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px),
                        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px, 40px 40px',
                    opacity: 0.6,
                    pointerEvents: 'none'
                }}></div>

                {/* Warm glow effects */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '40%',
                    height: '80%',
                    background: 'radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-10%',
                    width: '40%',
                    height: '80%',
                    background: 'radial-gradient(circle, rgba(255, 69, 0, 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                }}></div>

                <div className="hero-content" style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                    <h1 className="hero-title" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        fontWeight: '700',
                        marginBottom: '15px',
                        lineHeight: '1.2',
                        color: '#fff',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                        Sacred Monasteries of Sikkim
                        <span className="subtitle" style={{
                            display: 'block',
                            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                            fontWeight: '400',
                            marginTop: '10px',
                            color: 'rgba(255, 255, 255, 0.95)',
                            opacity: '0.9'
                        }}>
                            Discover 200+ Ancient Buddhist Heritage Sites
                        </span>
                    </h1>
                    
                    <div className="hero-stats" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        marginTop: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div className="stat" style={{
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            minWidth: '120px'
                        }}>
                            <span className="stat-number" style={{
                                display: 'block',
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#fff',
                                textShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>{monasteries.length}</span>
                            <span className="stat-label" style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: '500'
                            }}>Monasteries</span>
                        </div>
                        <div className="stat" style={{
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            minWidth: '120px'
                        }}>
                            <span className="stat-number" style={{
                                display: 'block',
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#fff',
                                textShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>300+</span>
                            <span className="stat-label" style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: '500'
                            }}>Years of History</span>
                        </div>
                        <div className="stat" style={{
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            minWidth: '120px'
                        }}>
                            <span className="stat-number" style={{
                                display: 'block',
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#fff',
                                textShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>4</span>
                            <span className="stat-label" style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: '500'
                            }}>Regions</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="controls-section" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '15px 20px',
                borderRadius: '15px',
                margin: '0 20px 20px 20px',
                boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="filter-controls" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    flexWrap: 'wrap',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div className="region-filter" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        minWidth: '200px'
                    }}>
                        <label style={{
                            fontWeight: '600',
                            color: '#2e7d32',
                            fontSize: '1rem',
                            whiteSpace: 'nowrap'
                        }}>Region:</label>
                        <select 
                            value={selectedRegion} 
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="region-select"
                            style={{
                                padding: '10px 15px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '25px',
                                fontSize: '1rem',
                                background: 'white',
                                color: '#2e7d32',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                minWidth: '150px',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#4caf50';
                                e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="search-container" style={{
                        flex: '1',
                        maxWidth: '400px',
                        minWidth: '250px'
                    }}>
                        <div className="search-box" style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <i className="search-icon" style={{
                                position: 'absolute',
                                left: '15px',
                                fontSize: '1.2rem',
                                color: '#4caf50',
                                zIndex: 1
                            }}>🔍</i>
                            <input
                                type="text"
                                placeholder="Search monasteries by name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                style={{
                                    width: '100%',
                                    padding: '12px 20px 12px 50px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '25px',
                                    fontSize: '1rem',
                                    background: 'white',
                                    color: '#333',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4caf50';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <div className="view-toggle" style={{
                        display: 'flex',
                        gap: '5px',
                        background: '#f5f5f5',
                        borderRadius: '25px',
                        padding: '5px',
                        minWidth: '160px'
                    }}>
                        <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: viewMode === 'grid' ? 'linear-gradient(135deg, #2e7d32, #4caf50)' : 'transparent',
                                color: viewMode === 'grid' ? 'white' : '#666',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                            onMouseEnter={(e) => {
                                if (viewMode !== 'grid') {
                                    e.target.style.background = '#e8f5e8';
                                    e.target.style.color = '#2e7d32';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (viewMode !== 'grid') {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#666';
                                }
                            }}
                        >
                            <i>⊞</i> Grid
                        </button>
                        <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: viewMode === 'list' ? 'linear-gradient(135deg, #2e7d32, #4caf50)' : 'transparent',
                                color: viewMode === 'list' ? 'white' : '#666',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                            onMouseEnter={(e) => {
                                if (viewMode !== 'list') {
                                    e.target.style.background = '#e8f5e8';
                                    e.target.style.color = '#2e7d32';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (viewMode !== 'list') {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#666';
                                }
                            }}
                        >
                            <i>☰</i> List
                        </button>
                    </div>
                </div>
            </div>

            <div className={`monasteries-container ${viewMode}-view`} style={{
                padding: '0 20px',
                margin: '0 auto',
                maxWidth: '1200px'
            }}>
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
                                    <div className="monastery-header" style={{
                                        marginBottom: '8px'
                                    }}>
                                        <h2 className="monastery-name" style={{
                                            marginBottom: '6px'
                                        }}>{monastery.name}</h2>
                                        <div className="monastery-meta" style={{
                                            gap: '12px'
                                        }}>
                                            <span className="location">
                                                <i>📍</i> {monastery.location}
                                            </span>
                                            <span className="established">
                                                <i>🏛️</i> {monastery.established}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="monastery-history" style={{
                                        marginBottom: '10px',
                                        lineHeight: '1.4',
                                        marginTop: '0'
                                    }}>{monastery.history}</p>

                                    <div className="monastery-features" style={{
                                        marginBottom: '12px',
                                        gap: '8px'
                                    }}>
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

                                    <div className="monastery-actions" style={{
                                        display: 'flex',
                                        gap: '8px',
                                        flexWrap: 'nowrap',
                                        justifyContent: 'space-between',
                                        margin: '0',
                                        alignItems: 'center',
                                        padding: '0',
                                        width: '100%'
                                    }}>
                                        <Link 
                                            to={`/monasteries/${monastery.id}`} 
                                            className="btn btn-primary"
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '8px 6px',
                                                whiteSpace: 'nowrap',
                                                flex: '1 1 0',
                                                textAlign: 'center',
                                                textDecoration: 'none',
                                                background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                height: '36px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '0',
                                                maxWidth: 'none'
                                            }}
                                        >
                                            <i>👁️</i> Explore
                                        </Link>
                                        <button 
                                            onClick={() => handleViewRoutes(monastery)}
                                            className="btn btn-secondary"
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '8px 6px',
                                                whiteSpace: 'nowrap',
                                                flex: '1 1 0',
                                                background: 'transparent',
                                                color: '#2e7d32',
                                                border: '1px solid #2e7d32',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                height: '36px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '0',
                                                maxWidth: 'none'
                                            }}
                                        >
                                            <i>🗺️</i> Directions
                                        </button>
                                        <button 
                                            className="btn btn-outline monastery-weather-btn"
                                            onClick={() => handleWeatherUpdate(monastery)}
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '8px 6px',
                                                whiteSpace: 'nowrap',
                                                flex: '1 1 0',
                                                background: 'transparent',
                                                color: '#2e7d32',
                                                border: '1px solid #2e7d32',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                height: '36px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '0',
                                                maxWidth: 'none'
                                            }}
                                        >
                                            <i>🌤️</i> Weather
                                        </button>
                                    </div>
                                </div>

                                <div className="card-footer" style={{
                                    marginTop: '12px',
                                    paddingTop: '12px',
                                    borderTop: '1px solid rgba(0,0,0,0.1)'
                                }}>
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

            {filteredMonasteries.length > monasteriesPerPage && (
                <div className="pagination-bar" style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    margin: '20px 0',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '15px',
                    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ 
                            marginRight: '1rem', 
                            minWidth: '100px', 
                            padding: '12px 20px', 
                            fontSize: '0.95rem',
                            background: currentPage === 1 ? '#95a5a6' : 'linear-gradient(135deg, #2e7d32, #4caf50)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: currentPage === 1 ? 'none' : '0 6px 20px rgba(46, 125, 50, 0.4)',
                            transform: 'translateY(0)'
                        }}
                        onMouseEnter={(e) => {
                            if (currentPage !== 1) {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(46, 125, 50, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== 1) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 6px 20px rgba(46, 125, 50, 0.4)';
                            }
                        }}
                    >
                        ← Previous
                    </button>
                    <span style={{ 
                        fontWeight: 'bold', 
                        margin: '0 1.5rem',
                        background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontSize: '1rem',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)'
                    }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{ 
                            marginLeft: '1rem', 
                            minWidth: '100px', 
                            padding: '12px 20px', 
                            fontSize: '0.95rem',
                            background: currentPage === totalPages ? '#95a5a6' : 'linear-gradient(135deg, #2e7d32, #4caf50)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: currentPage === totalPages ? 'none' : '0 6px 20px rgba(46, 125, 50, 0.4)',
                            transform: 'translateY(0)'
                        }}
                        onMouseEnter={(e) => {
                            if (currentPage !== totalPages) {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(46, 125, 50, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== totalPages) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 6px 20px rgba(46, 125, 50, 0.4)';
                            }
                        }}
                    >
                        Next →
                    </button>
                </div>
            )}

            <div 
                className="cta-section"
                style={{
                    background: 'linear-gradient(135deg, #7e8dcd 0%, #9778b6 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '60px 20px',
                    margin: '40px 0 0 0'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'rgba(255,255,255,0.05)',
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                    backgroundSize: '30px 30px',
                    pointerEvents: 'none'
                }}></div>
                
                <div 
                    className="cta-content"
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}
                >
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '20px',
                        letterSpacing: '0.5px'
                    }}>
                        Plan Your Spiritual Journey
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '40px',
                        lineHeight: '1.6',
                        fontWeight: '400'
                    }}>
                        Discover the ancient wisdom and breathtaking architecture of Sikkim's monasteries
                    </p>
                    
                    <div 
                        className="cta-buttons"
                        style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginBottom: '30px'
                        }}
                    >
                        <button 
                            className="btn btn-cta"
                            style={{
                                background: '#ffffff',
                                color: '#667eea',
                                padding: '15px 35px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                minWidth: '200px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                                e.target.style.background = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                                e.target.style.background = '#ffffff';
                            }}
                        >
                            📱 Download Mobile App
                        </button>
                        <button 
                            className="btn btn-outline-cta"
                            style={{
                                background: 'transparent',
                                color: 'white',
                                padding: '15px 35px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                border: '2px solid white',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                minWidth: '200px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'white';
                                e.target.style.color = '#667eea';
                                e.target.style.transform = 'translateY(-3px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            🎯 Book Guided Tour
                        </button>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '30px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>⭐</span>
                            4.9/5 Rating
                        </div>
                        <div style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>📲</span>
                            100k+ Downloads
                        </div>
                        <div style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>🎧</span>
                            Audio Guides
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Monasteries;