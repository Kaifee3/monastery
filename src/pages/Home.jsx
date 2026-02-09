import React, { useState, useEffect } from 'react';
import './Home.css';
import VirtualTour from '../components/VirtualTour/VirtualTour';
import InteractiveMap from '../components/InteractiveMap/InteractiveMap';
import CulturalCalendar from '../components/CulturalCalendar/CulturalCalendar';
import ChatBot from '../components/ChatBot/ChatBot';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        '/images/Home1.jpg',
        '/images/Home2.jpg',
        '/images/Home3.jpg',
        '/images/Home4.jpg',
        '/images/Home5.jpg'
    ];

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            if (!isPaused) setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(slideInterval);
    }, [slides.length, isPaused]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

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
           
            <div className="hero-slideshow" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                <div className="slideshow-container">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${slide})` }}
                        >
                            {index === 0 && (
                                <div className="slide-overlay">
                                    <h1 style={{ color: 'yellow' }}>Welcome to Monastery360</h1>
                                    <p style={{ color: 'yellow' }}>Explore the rich heritage of Sikkim's monasteries.</p>
                                    <div className="slide-cta">
                                        <button className="cta-button" onClick={() => window.location.href = '/monasteries'}>Explore Monasteries</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <div className="dots-container">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            ></span>
                        ))}
                    </div>

                    <div className="slideshow-progress">
                        <div className="progress-bar" style={{ animationDuration: `${isPaused ? 0 : 4}s` }} data-active={currentSlide}></div>
                    </div>
                </div>
            </div>

            <hr className="slideshow-divider" />

            <div className="section-wrapper">
                <div className="section-card">
                    <VirtualTour />
                </div>
                
            </div>
                <ChatBot />
        </div>
    );
};

export default Home;
