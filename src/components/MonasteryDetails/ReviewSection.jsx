import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { reviewAPI } from '../../services/reviewAPI';
import './ReviewSection.css';
import './additional-review-styles.css';

const ReviewSection = ({ monasteryId, monasteryName }) => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10
            };

            const response = await reviewAPI.getAllReviews(params);
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

    const fetchUserReviews = async () => {
        if (!isAuthenticated) return;
        
        try {
            const params = monasteryId ? { monasteryId } : {};
            const response = await reviewAPI.getUserReviews(params);
            setUserReviews(response.reviews || []);
        } catch (err) {
            console.error('Error fetching user reviews:', err);
            setUserReviews([]);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [currentPage]);

    useEffect(() => {
        fetchUserReviews();
    }, [isAuthenticated, monasteryId]);

    const handleReviewSubmitted = () => {
        setShowForm(false);
        setEditingReview(null);
        fetchReviews();
        fetchUserReviews();
    };

    const handleReviewUpdated = () => {
        setShowForm(false);
        setEditingReview(null);
        fetchReviews();
        fetchUserReviews();
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }
        
        try {
            await reviewAPI.deleteReview(reviewId);
            fetchReviews();
            fetchUserReviews();
        } catch (err) {
            console.error('Error deleting review:', err);
            alert('Failed to delete review. Please try again.');
        }
    };

    const handleWriteNewReview = () => {
        setEditingReview(null);
        setShowForm(true);
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
                                <div className="user-reviews-section">
                                    <div className="user-reviews-header">
                                        <h4>Your Reviews ({userReviews.length})</h4>
                                        <button 
                                            className="btn-compact btn-primary"
                                            onClick={handleWriteNewReview}
                                            disabled={showForm && !editingReview}
                                        >
                                            {showForm && !editingReview ? 'Cancel' : 'Write New Review'}
                                        </button>
                                    </div>
                                    
                                    {userReviews.length > 0 ? (
                                        <div className="user-reviews-list">
                                            {userReviews.slice(0, 3).map((review) => (
                                                <div key={review._id} className="user-review-compact">
                                                    <div className="user-review-preview">
                                                        <div className="review-rating-small">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span 
                                                                    key={star} 
                                                                    className={`star ${star <= review.rating ? 'filled' : ''}`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="review-snippet">
                                                            {review.comment?.substring(0, 50)}
                                                            {review.comment?.length > 50 ? '...' : ''}
                                                        </p>
                                                        <small className="review-date">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </small>
                                                    </div>
                                                    <div className="review-actions">
                                                        <button 
                                                            className="btn-tiny btn-outline"
                                                            onClick={() => handleEditReview(review)}
                                                            disabled={showForm}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="btn-tiny btn-danger"
                                                            onClick={() => handleDeleteReview(review._id)}
                                                            disabled={showForm}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {userReviews.length > 3 && (
                                                <p className="more-reviews-text">
                                                    ...and {userReviews.length - 3} more review{userReviews.length - 3 > 1 ? 's' : ''}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="write-review-prompt">
                                            <p>Share your experience with others!</p>
                                        </div>
                                    )}
                                </div>
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
                            existingReview={editingReview}
                            monasteryId={monasteryId}
                            monasteryName={monasteryName}
                            onClose={() => {
                                setShowForm(false);
                                setEditingReview(null);
                            }}
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