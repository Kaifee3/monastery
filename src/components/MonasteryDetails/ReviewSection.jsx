import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { reviewAPI } from '../../services/reviewAPI';
import './ReviewSection.css';

const ReviewSection = ({ monasteryId, monasteryName }) => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10
            };

            const response = await reviewAPI.getAllApprovedReviews(params);
            setReviews(response.reviews);
            setStats(response.stats);
            setError(null);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Failed to load reviews. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReview = async () => {
        if (!isAuthenticated) return;
        
        try {
            const response = await reviewAPI.getUserReviews();
            if (response.reviews && response.reviews.length > 0) {
                setUserReview(response.reviews[0]);
            }
        } catch (err) {
            console.error('Error fetching user review:', err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [currentPage]);

    useEffect(() => {
        fetchUserReview();
    }, [isAuthenticated]);

    const handleReviewSubmitted = () => {
        setShowForm(false);
        fetchReviews();
        fetchUserReview();
    };

    const handleReviewUpdated = () => {
        fetchReviews();
        fetchUserReview();
    };



    return (
        <div className="review-section-container">
            <div className="review-section">
                <div className="review-header-compact">
                    <h3>Reviews & Experiences</h3>
                    <p>Share and discover spiritual journeys at {monasteryName}</p>
                </div>

                <div className="review-grid">
                    {stats && (
                        <div className="stats-panel">
                            <div className="stats-summary">
                                <div className="rating-summary">
                                    <div className="rating-score">{stats.averageRating?.toFixed(1) || 'N/A'}</div>
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star} 
                                                className={`star ${star <= (stats.averageRating || 0) ? 'filled' : ''}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <div className="rating-count">{stats.totalReviews || 0} review(s)</div>
                                </div>
                            </div>
                            
                            {stats.difficultyBreakdown && (
                                <div className="difficulty-summary">
                                    <h4>Difficulty</h4>
                                    <div className="difficulty-compact">
                                        <div className="diff-item">
                                            <span className="diff-label">Easy</span>
                                            <span className="diff-count">{stats.difficultyBreakdown.easy || 0}</span>
                                        </div>
                                        <div className="diff-item">
                                            <span className="diff-label">Moderate</span>
                                            <span className="diff-count">{stats.difficultyBreakdown.moderate || 0}</span>
                                        </div>
                                        <div className="diff-item">
                                            <span className="diff-label">Hard</span>
                                            <span className="diff-count">{stats.difficultyBreakdown.hard || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="action-panel">
                        {isAuthenticated ? (
                            <div className="user-section">
                                {userReview ? (
                                    <div className="user-review-compact">
                                        <div className="user-review-header">
                                            <h4>Your Review</h4>
                                            <span className={`status-badge ${userReview.status}`}>
                                                {userReview.status}
                                            </span>
                                        </div>
                                        <div className="user-review-preview">
                                            <div className="review-rating-small">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span 
                                                        key={star} 
                                                        className={`star ${star <= userReview.rating ? 'filled' : ''}`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="review-snippet">
                                                {userReview.comment?.substring(0, 60)}
                                                {userReview.comment?.length > 60 ? '...' : ''}
                                            </p>
                                        </div>
                                        <button 
                                            className="btn-compact btn-outline"
                                            onClick={() => setShowForm(!showForm)}
                                        >
                                            {showForm ? 'Cancel' : 'Edit'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="write-review-prompt">
                                        <h4>Share Your Experience</h4>
                                        <p>Tell others about your visit!</p>
                                        <button 
                                            className="btn-compact btn-primary"
                                            onClick={() => setShowForm(!showForm)}
                                        >
                                            {showForm ? 'Cancel' : 'Write Review'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="auth-required">
                                <h4>Join the Community</h4>
                                <p>Login to share your experience</p>
                                <div className="auth-buttons-compact">
                                    <Link to="/login" className="btn-compact btn-primary">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn-compact btn-outline">
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {showForm && isAuthenticated && (
                    <div className="review-form-container">
                        <ReviewForm
                            existingReview={userReview}
                            monasteryId={monasteryId}
                            monasteryName={monasteryName}
                            onClose={() => setShowForm(false)}
                            onReviewSubmitted={handleReviewSubmitted}
                            onReviewUpdated={handleReviewUpdated}
                            isInline={true}
                        />
                    </div>
                )}

                <div className="reviews-display">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <span>Loading reviews...</span>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button 
                                className="btn-compact btn-outline"
                                onClick={fetchReviews}
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="reviews-list-compact">
                            <div className="reviews-header">
                                <h4>Recent Reviews</h4>
                                {reviews.length > 0 && (
                                    <span className="reviews-showing">
                                        Showing {reviews.length} of {stats?.totalReviews || 0}
                                    </span>
                                )}
                            </div>
                            <ReviewList 
                                reviews={reviews} 
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;