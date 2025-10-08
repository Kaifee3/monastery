import React, { useState, useEffect, useCallback } from 'react';
import './ImageSlideshow.css';

const ImageSlideshow = ({ monasteryName, imageName }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [images, setImages] = useState([]);
    const [imageLoadError, setImageLoadError] = useState({});

    // Function to generate slide image names based on monastery name
    const generateSlideImages = useCallback(() => {
        let baseName = '';
        
        // Map monastery names to their slide image base names
        const nameMapping = {
            'Rumtek Monastery': 'Rumtek-Monastery-',
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

        baseName = nameMapping[monasteryName] || monasteryName;

        // Generate 4 slide images for each monastery
        const slideImages = [];
        for (let i = 1; i <= 4; i++) {
            // Handle special case for Rumtek Monastery which has different naming pattern
            let imagePath;
            if (monasteryName === 'Rumtek Monastery') {
                imagePath = `/images/slide/Rumtek-Monastery-${i}.jpg`;
            } else {
                imagePath = `/images/slide/${baseName}${i}.jpg`;
            }
            
            slideImages.push({
                src: imagePath,
                alt: `${monasteryName} - Image ${i}`,
                fallback: `/images/${imageName}` // Fallback to main image
            });
        }

        return slideImages;
    }, [monasteryName, imageName]);

    useEffect(() => {
        const slideImages = generateSlideImages();
        setImages(slideImages);
        setCurrentSlide(0);
    }, [generateSlideImages]);

    // Auto-play functionality with smoother transitions
    useEffect(() => {
        if (isPlaying && images.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => {
                    const nextSlide = (prev + 1) % images.length;
                    return nextSlide;
                });
            }, 5000); // Change slide every 5 seconds for smoother experience

            return () => clearInterval(interval);
        }
    }, [isPlaying, images.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleImageError = (index) => {
        setImageLoadError(prev => ({ ...prev, [index]: true }));
    };

    const handleImageLoad = (index) => {
        setImageLoadError(prev => ({ ...prev, [index]: false }));
    };

    if (images.length === 0) {
        return (
            <div className="slideshow-loading">
                <div className="loading-spinner"></div>
                <p>Loading images...</p>
            </div>
        );
    }

    return (
        <div className="image-slideshow">
            <div className="slideshow-container">
                {/* Main Image Display */}
                <div className="slide-display">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            <img
                                src={imageLoadError[index] ? image.fallback : image.src}
                                alt={image.alt}
                                onError={() => handleImageError(index)}
                                onLoad={() => handleImageLoad(index)}
                            />
                            {/* Image Overlay */}
                            <div className="slide-overlay">
                                <h1 className="monastery-title">{monasteryName}</h1>
                                <div className="slide-info">
                                    <span className="slide-counter">
                                        {currentSlide + 1} / {images.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button className="nav-btn prev-btn" onClick={goToPrevious}>
                    <i className="nav-icon">❮</i>
                </button>
                <button className="nav-btn next-btn" onClick={goToNext}>
                    <i className="nav-icon">❯</i>
                </button>

                {/* Play/Pause Button */}
                <button className="play-pause-btn" onClick={togglePlayPause}>
                    <i className="play-icon">
                        {isPlaying ? '⏸️' : '▶️'}
                    </i>
                </button>

                {/* Slide Indicators */}
                <div className="slide-indicators">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>

                {/* Thumbnail Navigation */}
                <div className="thumbnail-navigation">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        >
                            <img
                                src={imageLoadError[index] ? image.fallback : image.src}
                                alt={`Thumbnail ${index + 1}`}
                                onError={() => handleImageError(index)}
                                onLoad={() => handleImageLoad(index)}
                            />
                            <div className="thumbnail-overlay">
                                <span>{index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slideshow Controls */}
            <div className="slideshow-controls">
                <div className="control-group">
                    <button 
                        className={`control-btn ${!isPlaying ? 'active' : ''}`} 
                        onClick={togglePlayPause}
                    >
                        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                    </button>
                    <div className="slide-progress">
                        <div 
                            className="progress-bar" 
                            style={{ 
                                width: `${((currentSlide + 1) / images.length) * 100}%` 
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageSlideshow;