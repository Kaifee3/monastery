import React, { useState, useEffect, useRef } from 'react';
import './VirtualTour.css';

const VirtualTour = () => {
    const [loading, setLoading] = useState(true);
    const [playingVideo, setPlayingVideo] = useState(null);
    const videoRefs = useRef([]);

    // Video data for the two videos
    const videoData = [
        {
            id: 1,
            title: "Sikkim Monasteries - Journey Through Time",
            description: "Explore the ancient monasteries of Sikkim, their rich history, and spiritual significance. Discover the architectural marvels and cultural heritage preserved through centuries.",
            src: "/videos/sikkimVideo1.mp4",
            tags: ["Heritage", "Culture", "Spirituality", "Architecture"]
        },
        {
            id: 2,
            title: "Sacred Landscapes of Sikkim",
            description: "Immerse yourself in the breathtaking landscapes surrounding Sikkim's monasteries. Experience the serene beauty and peaceful atmosphere of these sacred places.",
            src: "/videos/sikkimVideo2.mp4",
            tags: ["Nature", "Landscape", "Peace", "Sacred Sites"]
        }
    ];

    useEffect(() => {
        // Simulate loading time for better UX
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleVideoPlay = (videoId) => {
        // Pause other videos when one starts playing
        videoRefs.current.forEach((ref, index) => {
            if (ref && videoData[index].id !== videoId) {
                ref.pause();
            }
        });
        setPlayingVideo(videoId);
    };

    const handleVideoClick = (videoId) => {
        const videoIndex = videoData.findIndex(video => video.id === videoId);
        const videoElement = videoRefs.current[videoIndex];
        
        if (videoElement) {
            if (videoElement.paused) {
                videoElement.play();
                setPlayingVideo(videoId);
            } else {
                videoElement.pause();
                setPlayingVideo(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="virtual-tour">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading Virtual Tour...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="virtual-tour">
            <div className="tour-header">
                <h1 className="tour-title">Virtual Tour</h1>
            </div>

            <div className="video-container">
                {videoData.map((video, index) => (
                    <div key={video.id} className="video-card">
                        <div className="video-wrapper">
                            <video
                                ref={el => videoRefs.current[index] = el}
                                className="tour-video"
                                src={video.src}
                                onPlay={() => handleVideoPlay(video.id)}
                                onPause={() => setPlayingVideo(null)}
                                controls
                                preload="metadata"
                                poster={`/images/Home${index + 1}.jpg`}
                            >
                                Your browser does not support the video tag.
                            </video>
                            
                            {playingVideo !== video.id && (
                                <div className="video-overlay" onClick={() => handleVideoClick(video.id)}>
                                    <div className="play-button">
                                        <div className="play-icon"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="video-info">
                            <h3 className="video-title">{video.title}</h3>
                            <p className="video-description">{video.description}</p>
                            <div className="video-tags">
                                {video.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className="video-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VirtualTour;