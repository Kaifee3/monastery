import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ImageSlideshow.css';

const ImageSlideshow = ({ monasteryName, imageName }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const generateSlideImages = useCallback(() => {
        let baseName = '';
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
            'Lingdum Zurmang Monastery': 'Lingdum-Zurmang',
            'Bumtar Namdroling Monastery': 'Bumtar Namdroling Monastery',
            'Doling Monastery': 'Doling-Monastery',
            'Karma Raptenling Monastery': 'Karma-Raptenling-Monastery',
            'Ngadag Monastery': 'Ngadag-Monastery',
            'Aden Wolung Monastery': 'ADEN WOLUNG',
            'Chakung Monastery': 'CHAKUNG',
            'Dodak Tamu Monastery': 'DODAK TAMU',
            'Druk Monastery': 'Druk',
            'Hungri Monastery': 'HUNGRI',
            'Khachoedpalri Monastery': 'KHACHOEDPALRI',
            'Lhuntse Monastery': 'LHUNTSE',
            'Melli-Atsing Monastery': 'MELLI-ATSING',
            'Nubling Monastery': 'NUBLING',
            'Okhery Monastery': 'OKHERY',
            'Pegmantysse Monastery': 'pegmantysse',
            'Rinchen Choling Monastery': 'RINCHEN CHOLING',
            'Rinchenpung Monastery': 'RINCHENPUNG',
            'Sinon Monastery': 'Sinon',
            'Sri Badam Monastery': 'SRI BADAM',
            'Tashi Samboling Monastery': 'TASHI SAMBOLING'
        };
        baseName = nameMapping[monasteryName] || monasteryName;

        if (monasteryName === 'Bumtar Namdroling Monastery') {
            return [1,2,3].map(i => ({
                src: `/images/Bumtar Namdroling Monastery${i}.jpg`,
                srcset: `/images/Bumtar Namdroling Monastery${i}.jpg 1x, /images/Bumtar Namdroling Monastery${i}.jpg 2x`,
                alt: `${monasteryName} - Image ${i}`,
                fallback: `/images/${imageName}`
            }));
        }

        if (["Doling Monastery", "Karma Raptenling Monastery", "Ngadag Monastery"].includes(monasteryName)) {
            const availableImages = [];
            for (let i = 1; i <= 3; i++) {
                availableImages.push({
                    src: `/images/${baseName}${i}.jpg`,
                    srcset: `/images/${baseName}${i}.jpg 1x, /images/${baseName}${i}.jpg 2x`,
                    alt: `${monasteryName} - Image ${i}`,
                    fallback: `/images/${imageName}`
                });
            }
            return availableImages;
        }

        const westRegionMonasteries = [
            'Aden Wolung Monastery', 'Dodak Tamu Monastery', 
            'Lhuntse Monastery', 'Rinchen Choling Monastery', 'Tashi Samboling Monastery'
        ];
        
        const mixedExtensionMonasteries = [
            'Hungri Monastery', 'Khachoedpalri Monastery', 'Nubling Monastery',
            'Okhery Monastery', 'Pegmantysse Monastery', 'Rinchenpung Monastery',
            'Sri Badam Monastery', 'Chakung Monastery', 'Druk Monastery', 'Melli-Atsing Monastery'
        ];

        if (westRegionMonasteries.includes(monasteryName)) {
            return [
                {
                    src: `/images/${baseName}.jfif`,
                    srcset: `/images/${baseName}.jfif 1x, /images/${baseName}.jfif 2x`,
                    alt: `${monasteryName} - Image 1`,
                    fallback: `/images/${imageName}`
                },
                {
                    src: `/images/${baseName}1.jfif`,
                    srcset: `/images/${baseName}1.jfif 1x, /images/${baseName}1.jfif 2x`,
                    alt: `${monasteryName} - Image 2`,
                    fallback: `/images/${imageName}`
                },
                {
                    src: `/images/${baseName}2.jfif`,
                    srcset: `/images/${baseName}2.jfif 1x, /images/${baseName}2.jfif 2x`,
                    alt: `${monasteryName} - Image 3`,
                    fallback: `/images/${imageName}`
                }
            ];
        }

        if (mixedExtensionMonasteries.includes(monasteryName)) {
            const extensions = {
                'Hungri Monastery': ['.jpg', '1.jpg', '2.jpg'],
                'Khachoedpalri Monastery': ['.jpg', '1.JPG', '2.jpg'],
                'Nubling Monastery': ['.jpg', '1.jfif', '2.jpg'],
                'Okhery Monastery': ['.jpg', '1.jfif', '2.jfif'],
                'Pegmantysse Monastery': ['.jpg', '1.jfif', '2.jpg'],
                'Rinchenpung Monastery': ['.jpg', '1.jfif', '2.jpg'],
                'Sri Badam Monastery': ['.jpg', '1.jpg', '2.png'],
                'Chakung Monastery': ['.jfif', ' 1.jfif', ' 2.jpg'],
                'Druk Monastery': ['.jfif', '1.jfif', '2.jpg'],
                'Melli-Atsing Monastery': ['.jfif', '1.jfif', '2.jpg']
            };
            
            const exts = extensions[monasteryName];
            return exts ? exts.map((ext, index) => ({
                src: `/images/${baseName}${ext}`,
                srcset: `/images/${baseName}${ext} 1x, /images/${baseName}${ext} 2x`,
                alt: `${monasteryName} - Image ${index + 1}`,
                fallback: `/images/${imageName}`
            })) : [];
        }

        if (monasteryName === 'Sinon Monastery') {
            return [
                {
                    src: `/images/Sinon.png`,
                    srcset: `/images/Sinon.png 1x, /images/Sinon.png 2x`,
                    alt: `${monasteryName} - Image 1`,
                    fallback: `/images/${imageName}`
                },
                {
                    src: `/images/Sinon1.png`,
                    srcset: `/images/Sinon1.png 1x, /images/Sinon1.png 2x`,
                    alt: `${monasteryName} - Image 2`,
                    fallback: `/images/${imageName}`
                },
                {
                    src: `/images/Sinon2.png`,
                    srcset: `/images/Sinon2.png 1x, /images/Sinon2.png 2x`,
                    alt: `${monasteryName} - Image 3`,
                    fallback: `/images/${imageName}`
                }
            ];
        }
        
        return [1,2,3].map(i => ({
            src: monasteryName === 'Rumtek Monastery'
                ? `/images/slide/Rumtek-Monastery-${i}.jpg`
                : `/images/slide/${baseName}${i}.jpg`,
            srcset: monasteryName === 'Rumtek Monastery'
                ? `/images/slide/Rumtek-Monastery-${i}.jpg 1x, /images/slide/Rumtek-Monastery-${i}.jpg 2x`
                : `/images/slide/${baseName}${i}.jpg 1x, /images/slide/${baseName}${i}.jpg 2x`,
            alt: `${monasteryName} - Image ${i}`,
            fallback: `/images/${imageName}`
        }));
    }, [monasteryName, imageName]);

    const images = useMemo(() => generateSlideImages(), [generateSlideImages]);
    const [imageLoadError, setImageLoadError] = useState({});

    useEffect(() => {
        setCurrentSlide(0);
    }, [monasteryName]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const handleImageError = (index) => {
        setImageLoadError(prev => ({ ...prev, [index]: true }));
    };

    const handleImageLoad = (index) => {
        setImageLoadError(prev => ({ ...prev, [index]: false }));
    };

    const validImages = images.filter((img, idx) => !imageLoadError[idx]);
    const hasAtLeastOneImage = validImages.length > 0;
    if (images.length === 0 || !hasAtLeastOneImage) {
        return (
            <div className="slideshow-loading">
                <div className="loading-spinner"></div>
                <p style={{color:'red'}}>No images available for this monastery.</p>
            </div>
        );
    }

    const allImagesFailed = images.every((_, idx) => imageLoadError[idx]);
    if (allImagesFailed) {
        console.error('All images failed to load for', monasteryName, images.map(img => img.src));
        return (
            <div className="slideshow-loading">
                <div className="loading-spinner"></div>
                <p style={{color:'red'}}>No images available for this monastery.</p>
            </div>
        );
    }

    return (
        <div className="image-slideshow">
            <div className="slideshow-container">
                <div className="slide-display">
                    {images.length > 0 && (
                        <div className={`slide active${images.length === 1 ? ' single' : ''}`}> 
                            <img
                                src={imageLoadError[currentSlide] ? images[currentSlide].fallback : images[currentSlide].src}
                                srcSet={!imageLoadError[currentSlide] && images[currentSlide].srcset ? images[currentSlide].srcset : undefined}
                                alt={images[currentSlide].alt}
                                loading="eager"
                                decoding="async"
                                onError={() => handleImageError(currentSlide)}
                                onLoad={() => handleImageLoad(currentSlide)}
                            />
                            {imageLoadError[currentSlide] && (
                                <div className="image-error-message">
                                    <span style={{color: 'red', fontWeight: 'bold'}}>Image not found:</span>
                                    <div>{images[currentSlide].src}</div>
                                    <div>Showing fallback image.</div>
                                </div>
                            )}
                            <div className="slide-overlay">
                                {currentSlide === 0 && (
                                    <h1 className="monastery-title">{monasteryName}</h1>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="slideshow-nav-btns">
                    <button className="nav-btn prev-btn" onClick={goToPrevious}>
                        <i className="nav-icon">❮</i>
                    </button>
                    <button className="nav-btn next-btn" onClick={goToNext}>
                        <i className="nav-icon">❯</i>
                    </button>
                </div>
                <div className="slide-indicators">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
                <div className="thumbnail-navigation">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`thumbnail${index === currentSlide ? ' active' : ''}`}
                            style={{ minWidth: '60px', minHeight: '40px' }}
                            onClick={() => goToSlide(index)}
                        >
                            <img
                                src={imageLoadError[index] ? image.fallback : image.src}
                                srcSet={!imageLoadError[index] && image.srcset ? image.srcset : undefined}
                                alt={`Thumbnail ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                loading="lazy"
                                decoding="async"
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

        </div>
    );
};

export default ImageSlideshow;