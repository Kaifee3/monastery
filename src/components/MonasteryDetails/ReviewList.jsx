import React from 'react';
import './ReviewList.css';

const ReviewList = ({ reviews, currentPage, onPageChange }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text, maxLength = 200) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="no-reviews">
                <div className="no-reviews-icon">💭</div>
                <h3>No reviews yet</h3>
                <p>Be the first to share your experience at this monastery!</p>
            </div>
        );
    }

    return (
        <div className="review-list">
            <div className="reviews-grid">
                {reviews.map((review) => (
                    <div key={review._id} className="review-card">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">
                                    {review.userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="reviewer-details">
                                    <h4 className="reviewer-name">{review.userName}</h4>
                                    <div className="review-metadata">
                                        <span className="review-date">{formatDate(review.createdAt)}</span>
                                        <span className={`difficulty-badge ${review.difficulty}`}>
                                            {review.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="review-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span 
                                        key={star} 
                                        className={`star ${star <= review.rating ? 'filled' : ''}`}
                                    >
                                        ⭐
                                    </span>
                                ))}
                                <span className="rating-number">({review.rating})</span>
                            </div>
                        </div>

                        <div className="review-content">
                            <p className="review-comment">{review.comment}</p>
                        </div>

                        <div className="review-footer">
                            <div className="review-actions">
                                <button className="helpful-btn">
                                    👍 Helpful
                                </button>
                                <button className="report-btn">
                                    🚩 Report
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination would be implemented here if needed */}
            {/* For now, we'll show a simple load more concept */}
            <div className="reviews-footer">
                <div className="review-count">
                    Showing {reviews.length} reviews
                </div>
                {reviews.length >= 10 && (
                    <button 
                        className="btn btn-outline load-more-btn"
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        Load More Reviews
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReviewList;