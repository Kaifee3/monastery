// Weather API service for fetching live weather data
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// For demo purposes, we'll use mock data. In production, replace with actual API calls
const MOCK_WEATHER_DATA = {
    main: {
        temp: 18,
        feels_like: 16,
        temp_min: 12,
        temp_max: 24,
        pressure: 1013,
        humidity: 65
    },
    weather: [
        {
            main: 'Clouds',
            description: 'few clouds',
            icon: '02d'
        }
    ],
    clouds: {
        all: 20
    },
    wind: {
        speed: 3.2
    },
    visibility: 10000,
    sys: {
        sunrise: Date.now() / 1000 - 3600, // 1 hour ago
        sunset: Date.now() / 1000 + 7200   // 2 hours from now
    },
    rain: null
};

/**
 * Get weather data for a specific location
 * @param {string} location - The location name (e.g., "Gangtok, Sikkim")
 * @returns {Promise} Weather data object
 */
export const getWeatherData = async (location) => {
    try {
        // For demo purposes, return mock data with slight variations
        // In production, uncomment the real API call below
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Add some randomness to mock data for demo
        const mockData = {
            ...MOCK_WEATHER_DATA,
            main: {
                ...MOCK_WEATHER_DATA.main,
                temp: MOCK_WEATHER_DATA.main.temp + (Math.random() - 0.5) * 10,
                temp_max: MOCK_WEATHER_DATA.main.temp_max + (Math.random() - 0.5) * 5,
                temp_min: MOCK_WEATHER_DATA.main.temp_min + (Math.random() - 0.5) * 5,
                humidity: Math.floor(Math.random() * 40) + 40
            },
            clouds: {
                all: Math.floor(Math.random() * 80) + 10
            },
            wind: {
                speed: Math.random() * 5 + 1
            }
        };
        
        return mockData;
        
        /* 
        // REAL API CALL - Uncomment this for production use
        // You'll need to get an API key from https://openweathermap.org/api
        
        const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        */
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data. Please try again later.');
    }
};

/**
 * Get weather forecast for the next few days
 * @param {string} location - The location name
 * @returns {Promise} Forecast data object
 */
export const getWeatherForecast = async (location) => {
    try {
        // Mock forecast data for demo
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const forecastData = {
            list: Array.from({ length: 5 }, (_, i) => ({
                dt: Date.now() / 1000 + (i * 24 * 3600),
                main: {
                    temp: 15 + Math.random() * 15,
                    temp_max: 20 + Math.random() * 10,
                    temp_min: 10 + Math.random() * 10
                },
                weather: [
                    {
                        main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
                        description: ['clear sky', 'few clouds', 'light rain'][Math.floor(Math.random() * 3)]
                    }
                ]
            }))
        };
        
        return forecastData;
        
        /*
        // REAL API CALL for forecast
        const response = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        */
        
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        throw new Error('Failed to fetch weather forecast.');
    }
};

/**
 * Get coordinates for a location name
 * @param {string} location - The location name
 * @returns {Promise} Coordinates object with lat and lon
 */
export const getLocationCoordinates = async (location) => {
    try {
        // Mock coordinates for Sikkim locations
        const sikkimLocations = {
            'gangtok': { lat: 27.3389, lon: 88.6065 },
            'namchi': { lat: 27.1666, lon: 88.3639 },
            'gyalshing': { lat: 27.2833, lon: 88.2667 },
            'mangan': { lat: 27.5167, lon: 88.5333 },
            'east sikkim': { lat: 27.3389, lon: 88.6065 },
            'west sikkim': { lat: 27.2833, lon: 88.2667 },
            'north sikkim': { lat: 27.7333, lon: 88.6167 },
            'south sikkim': { lat: 27.1666, lon: 88.3639 }
        };
        
        const locationKey = location.toLowerCase();
        for (const key in sikkimLocations) {
            if (locationKey.includes(key)) {
                return sikkimLocations[key];
            }
        }
        
        // Default to Gangtok coordinates
        return sikkimLocations['gangtok'];
        
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return { lat: 27.3389, lon: 88.6065 }; // Default Gangtok coordinates
    }
};

export default {
    getWeatherData,
    getWeatherForecast,
    getLocationCoordinates
};