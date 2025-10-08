import React, { useState, useEffect } from 'react';
import './Home.css';
import VirtualTour from '../components/VirtualTour/VirtualTour';
import InteractiveMap from '../components/InteractiveMap/InteractiveMap';
// import CulturalCalendar from '../components/CulturalCalendar/CulturalCalendar';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        '/images/Home1.jpg',
        '/images/Home2.jpg',
        '/images/Home3.jpg',
        '/images/Home4.jpg',
        '/images/Home5.jpg'
    ];

    // Scroll to top on component mount (page refresh or navigation)
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'  // Use 'instant' for immediate scroll on refresh
        });
    }, []);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(slideInterval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="home-container">
            {/* Hero Slideshow Section */}
            <div className="hero-slideshow">
                <div className="slideshow-container">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${slide})` }}
                        >
                            {index === 0 && (
                                <div className="slide-overlay">
                                    <h1>Welcome to Monastery360</h1>
                                    <p>Explore the rich heritage of Sikkim's monasteries.</p>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Navigation Arrows */}
                    <button className="slide-nav prev" onClick={prevSlide}>
                        &#8249;
                    </button>
                    <button className="slide-nav next" onClick={nextSlide}>
                        &#8250;
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="dots-container">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="section-wrapper">
                <div className="section-card">
                    <VirtualTour />
                </div>
              
                {/* <div className="section-card">
                    <CulturalCalendar />
                </div> */}
            </div>
        </div>
    );
};

export default Home;
