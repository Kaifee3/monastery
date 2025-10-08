import monasteriesData from '../data/monasteries.json';
import festivalsData from '../data/festivals.json';
import { getWeatherData } from './weatherApi';

export class ChatbotKnowledgeBase {
    constructor() {
        this.monasteries = monasteriesData;
        this.festivals = festivalsData;
        this.generalInfo = {
            website: {
                name: "Monastery360",
                purpose: "Explore the rich heritage of Sikkim's monasteries",
                features: [
                    "Virtual Tours of monasteries",
                    "Interactive maps with locations",
                    "Cultural calendar with festivals",
                    "Weather information",
                    "Directions and travel guidance",
                    "Historical information about each monastery"
                ]
            },
            sikkim: {
                overview: "Sikkim is a northeastern state of India, known for its Buddhist monasteries, alpine landscapes, and rich cultural heritage.",
                districts: ["East Sikkim", "West Sikkim", "North Sikkim", "South Sikkim"],
                capital: "Gangtok",
                languages: ["Nepali", "Sikkimese", "Lepcha", "Bhutia", "Hindi", "English"],
                religion: "Buddhism is predominant, along with Hinduism",
                climate: "Temperate in most areas, alpine in higher regions",
                bestTimeToVisit: "March to May and October to December"
            },
            travel: {
                nearestAirport: "Bagdogra Airport, West Bengal (124 km from Gangtok)",
                nearestRailway: "New Jalpaiguri Railway Station (148 km from Gangtok)",
                permits: "Inner Line Permit required for certain areas, especially North Sikkim",
                currency: "Indian Rupee (INR)",
                timeZone: "IST (UTC+5:30)"
            }
        };
    }

    async processQuery(query) {
        const normalizedQuery = query.toLowerCase().trim();
        
        if (this.isWeatherQuery(normalizedQuery)) {
            return await this.handleWeatherQuery(normalizedQuery);
        }
        
        if (this.isMonasteryQuery(normalizedQuery)) {
            return this.handleMonasteryQuery(normalizedQuery);
        }
        
        if (this.isFestivalQuery(normalizedQuery)) {
            return this.handleFestivalQuery(normalizedQuery);
        }
        
        if (this.isTravelQuery(normalizedQuery)) {
            return this.handleTravelQuery(normalizedQuery);
        }
        
        if (this.isGeneralInfoQuery(normalizedQuery)) {
            return this.handleGeneralInfoQuery(normalizedQuery);
        }
        
        return this.getDefaultResponse();
    }

    isWeatherQuery(query) {
        const weatherKeywords = ['weather', 'temperature', 'rain', 'cloud', 'sunny', 'climate', 'forecast'];
        return weatherKeywords.some(keyword => query.includes(keyword));
    }

    async handleWeatherQuery(query) {
        try {
            let location = 'Gangtok, Sikkim';
            
            for (const monastery of this.monasteries) {
                const monasteryName = monastery.name.toLowerCase();
                const monasteryLocation = monastery.location.toLowerCase();
                
                if (query.includes(monasteryName) || query.includes(monasteryLocation)) {
                    location = monastery.location;
                    break;
                }
            }

            const weatherData = await getWeatherData(location);
            
            return {
                type: 'weather',
                message: `🌤️ **Weather in ${location}:**\n\n` +
                        `🌡️ **Temperature:** ${Math.round(weatherData.main.temp)}°C (feels like ${Math.round(weatherData.main.feels_like)}°C)\n` +
                        `📊 **Condition:** ${weatherData.weather[0].description}\n` +
                        `💧 **Humidity:** ${weatherData.main.humidity}%\n` +
                        `💨 **Wind Speed:** ${weatherData.wind.speed} m/s\n` +
                        `🌡️ **Min/Max:** ${Math.round(weatherData.main.temp_min)}°C / ${Math.round(weatherData.main.temp_max)}°C\n\n` +
                        `Perfect for monastery visits! Don't forget to carry warm clothes for higher altitude monasteries.`,
                data: weatherData
            };
        } catch (error) {
            return {
                type: 'error',
                message: 'Sorry, I couldn\'t fetch the weather information right now. Please try again later.',
                error: error.message
            };
        }
    }

    isMonasteryQuery(query) {
        const monasteryKeywords = ['monastery', 'temple', 'gompa', 'buddha', 'monk', 'prayer', 'meditation'];
        const hasMonasteryKeyword = monasteryKeywords.some(keyword => query.includes(keyword));
        
        
        const hasMonasteryName = this.monasteries.some(monastery => 
            query.includes(monastery.name.toLowerCase()) || 
            query.includes(monastery.location.toLowerCase().split(',')[0])
        );
        
        return hasMonasteryKeyword || hasMonasteryName;
    }

    /**
     * Handle monastery-related queries
     */
    handleMonasteryQuery(query) {
        
        const specificMonastery = this.monasteries.find(monastery =>
            query.includes(monastery.name.toLowerCase()) ||
            query.includes(monastery.location.toLowerCase().split(',')[0])
        );

        if (specificMonastery) {
            return {
                type: 'monastery_specific',
                message: `🏛️ **${specificMonastery.name}**\n\n` +
                        `📍 **Location:** ${specificMonastery.location}\n` +
                        `📅 **Established:** ${specificMonastery.established}\n` +
                        `🗺️ **Coordinates:** ${specificMonastery.latitude}, ${specificMonastery.longitude}\n\n` +
                        `**History:**\n${specificMonastery.history}\n\n` +
                        `Would you like to know about directions to reach here or the weather conditions?`,
                data: specificMonastery
            };
        }

        
        if (query.includes('all') || query.includes('list') || query.includes('how many')) {
            const monasteryList = this.monasteries.map((m, index) => 
                `${index + 1}. **${m.name}** - ${m.location} (${m.established})`
            ).join('\n');
            
            return {
                type: 'monastery_list',
                message: `🏛️ **Sikkim has ${this.monasteries.length} major monasteries featured on Monastery360:**\n\n${monasteryList}\n\n` +
                        `Each monastery has its unique history and significance. Would you like to know more about any specific monastery?`,
                data: this.monasteries
            };
        }

        
        if (query.includes('oldest')) {
            const oldest = this.monasteries.reduce((prev, current) => 
                (parseInt(prev.established) < parseInt(current.established)) ? prev : current
            );
            
            return {
                type: 'monastery_info',
                message: `🏛️ **${oldest.name}** is the oldest monastery in our collection, established in **${oldest.established}**.\n\n` +
                        `📍 Located in ${oldest.location}\n\n${oldest.history}`,
                data: oldest
            };
        }

        if (query.includes('newest') || query.includes('latest') || query.includes('recent')) {
            const newest = this.monasteries.reduce((prev, current) => 
                (parseInt(prev.established) > parseInt(current.established)) ? prev : current
            );
            
            return {
                type: 'monastery_info',
                message: `🏛️ **${newest.name}** is the most recently established monastery in our collection, built in **${newest.established}**.\n\n` +
                        `📍 Located in ${newest.location}\n\n${newest.history}`,
                data: newest
            };
        }

        return {
            type: 'monastery_general',
            message: `🏛️ **About Sikkim's Monasteries:**\n\n` +
                    `Sikkim is home to numerous Buddhist monasteries, each with unique architecture and spiritual significance. ` +
                    `Our website features ${this.monasteries.length} major monasteries across all four districts.\n\n` +
                    `**Popular monasteries include:**\n` +
                    `• Rumtek Monastery - Seat of the Karmapa\n` +
                    `• Pemayangtse Monastery - One of the oldest (1705)\n` +
                    `• Tashiding Monastery - Famous for Bhumchu festival\n\n` +
                    `Would you like information about a specific monastery or directions to visit them?`,
            data: this.monasteries.slice(0, 5)
        };
    }

    /**
     * Check if query is about festivals
     */
    isFestivalQuery(query) {
        const festivalKeywords = ['festival', 'celebration', 'event', 'losar', 'saga dawa', 'pang lhabsol', 'bhumchu', 'chaam'];
        return festivalKeywords.some(keyword => query.includes(keyword));
    }

    /**
     * Handle festival-related queries
     */
    handleFestivalQuery(query) {
        
        const specificFestival = this.festivals.find(festival =>
            query.includes(festival.name.toLowerCase())
        );

        if (specificFestival) {
            const monasteryList = specificFestival.monasteries.join(', ');
            const activityList = specificFestival.activities.join(', ');
            
            return {
                type: 'festival_specific',
                message: `🎭 **${specificFestival.name}**\n\n` +
                        `📅 **Date:** ${specificFestival.date}\n` +
                        `⏰ **Duration:** ${specificFestival.timing}\n` +
                        `🏛️ **Celebrated at:** ${monasteryList}\n\n` +
                        `**Description:** ${specificFestival.description}\n\n` +
                        `**Significance:** ${specificFestival.significance}\n\n` +
                        `**Activities:** ${activityList}\n\n` +
                        `**Visitor Information:**\n` +
                        `• Best time: ${specificFestival.visitorInfo.bestTime}\n` +
                        `• Dress code: ${specificFestival.visitorInfo.dress}\n` +
                        `• Photography: ${specificFestival.visitorInfo.photography}\n` +
                        `• Entry: ${specificFestival.visitorInfo.fee}`,
                data: specificFestival
            };
        }

        
        if (query.includes('upcoming') || query.includes('next') || query.includes('when')) {
            const upcomingFestivals = this.festivals
                .filter(f => new Date(f.date) > new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3);
            
            if (upcomingFestivals.length > 0) {
                const festivalList = upcomingFestivals.map(f => 
                    `• **${f.name}** - ${f.date} at ${f.monasteries[0]}`
                ).join('\n');
                
                return {
                    type: 'festivals_upcoming',
                    message: `🎭 **Upcoming Festivals:**\n\n${festivalList}\n\n` +
                            `Visit our Cultural Calendar for complete festival schedule and details!`,
                    data: upcomingFestivals
                };
            }
        }

        
        if (query.includes('all') || query.includes('list')) {
            const festivalList = this.festivals.map((f, index) => 
                `${index + 1}. **${f.name}** - ${f.type}`
            ).join('\n');
            
            return {
                type: 'festivals_all',
                message: `🎭 **Sikkim Cultural Festivals:**\n\n${festivalList}\n\n` +
                        `These festivals showcase the rich Buddhist and local culture of Sikkim. ` +
                        `Each festival has its unique significance and celebrations.`,
                data: this.festivals
            };
        }

        return {
            type: 'festivals_general',
            message: `🎭 **Sikkim's Cultural Festivals:**\n\n` +
                    `Sikkim celebrates numerous Buddhist and cultural festivals throughout the year. ` +
                    `Major festivals include Losar (Tibetan New Year), Saga Dawa, Pang Lhabsol, and Bhumchu.\n\n` +
                    `**Festival Highlights:**\n` +
                    `• Traditional masked dances (Chaam)\n` +
                    `• Religious ceremonies and prayers\n` +
                    `• Cultural performances and local cuisine\n` +
                    `• Community gatherings and celebrations\n\n` +
                    `Would you like to know about specific festivals or upcoming celebrations?`,
            data: this.festivals.slice(0, 5)
        };
    }

    /**
     * Check if query is about travel/directions
     */
    isTravelQuery(query) {
        const travelKeywords = ['direction', 'how to reach', 'distance', 'travel', 'route', 'transport', 'bus', 'taxi', 'permit'];
        return travelKeywords.some(keyword => query.includes(keyword));
    }

    /**
     * Handle travel-related queries
     */
    handleTravelQuery(query) {
        
        const specificMonastery = this.monasteries.find(monastery =>
            query.includes(monastery.name.toLowerCase()) ||
            query.includes(monastery.location.toLowerCase().split(',')[0])
        );

        if (specificMonastery) {
            return {
                type: 'directions_specific',
                message: `🗺️ **Directions to ${specificMonastery.name}:**\n\n` +
                        `📍 **Location:** ${specificMonastery.location}\n` +
                        `🗺️ **Coordinates:** ${specificMonastery.latitude}, ${specificMonastery.longitude}\n\n` +
                        `**General Travel Information:**\n` +
                        `• Use our Interactive Map feature for detailed directions\n` +
                        `• Local taxis and shared jeeps are available\n` +
                        `• Roads may be narrow and winding in hill areas\n` +
                        `• Check weather conditions before traveling\n\n` +
                        `**Tips:**\n` +
                        `• Start early to avoid afternoon clouds\n` +
                        `• Carry warm clothes for higher altitudes\n` +
                        `• Respect monastery timings and dress codes`,
                data: specificMonastery
            };
        }

        
        return {
            type: 'travel_general',
            message: `🚗 **Travel Information for Sikkim:**\n\n` +
                    `**Getting to Sikkim:**\n` +
                    `✈️ **Nearest Airport:** Bagdogra (124 km from Gangtok)\n` +
                    `🚂 **Nearest Railway:** New Jalpaiguri (148 km from Gangtok)\n` +
                    `🛣️ **By Road:** Well connected via NH10\n\n` +
                    `**Important Requirements:**\n` +
                    `📋 **Permits:** Inner Line Permit required for North Sikkim\n` +
                    `🆔 **ID Required:** Valid photo ID for Indian citizens\n` +
                    `🌐 **Foreigners:** Protected Area Permit required\n\n` +
                    `**Local Transport:**\n` +
                    `• Shared taxis and jeeps\n` +
                    `• Private car rentals available\n` +
                    `• Local buses for main routes\n\n` +
                    `Use our Interactive Map for specific monastery directions!`,
            data: this.generalInfo.travel
        };
    }

    /**
     * Check if query is general information
     */
    isGeneralInfoQuery(query) {
        const generalKeywords = ['about', 'sikkim', 'website', 'monastery360', 'features', 'help', 'information'];
        return generalKeywords.some(keyword => query.includes(keyword));
    }

    /**
     * Handle general information queries
     */
    handleGeneralInfoQuery(query) {
        if (query.includes('website') || query.includes('monastery360') || query.includes('features')) {
            const featureList = this.generalInfo.website.features.map(f => `• ${f}`).join('\n');
            
            return {
                type: 'website_info',
                message: `🏛️ **Welcome to Monastery360!**\n\n` +
                        `${this.generalInfo.website.purpose}\n\n` +
                        `**Our Features:**\n${featureList}\n\n` +
                        `Monastery360 is your comprehensive guide to exploring Sikkim's rich Buddhist heritage. ` +
                        `We provide detailed information about ${this.monasteries.length} monasteries and ${this.festivals.length} cultural festivals.`,
                data: this.generalInfo.website
            };
        }

        if (query.includes('sikkim')) {
            return {
                type: 'sikkim_info',
                message: `🏔️ **About Sikkim:**\n\n` +
                        `${this.generalInfo.sikkim.overview}\n\n` +
                        `**Key Information:**\n` +
                        `🏙️ **Capital:** ${this.generalInfo.sikkim.capital}\n` +
                        `🗺️ **Districts:** ${this.generalInfo.sikkim.districts.join(', ')}\n` +
                        `🗣️ **Languages:** ${this.generalInfo.sikkim.languages.join(', ')}\n` +
                        `🙏 **Religion:** ${this.generalInfo.sikkim.religion}\n` +
                        `🌤️ **Climate:** ${this.generalInfo.sikkim.climate}\n` +
                        `📅 **Best Time to Visit:** ${this.generalInfo.sikkim.bestTimeToVisit}\n\n` +
                        `Sikkim is a paradise for Buddhist culture enthusiasts and nature lovers alike!`,
                data: this.generalInfo.sikkim
            };
        }

        return this.getDefaultResponse();
    }

    /**
     * Get default response with suggestions
     */
    getDefaultResponse() {
        return {
            type: 'default',
            message: `🙏 **Hello! I'm your Monastery360 AI Assistant.**\n\n` +
                    `I can help you with information about:\n\n` +
                    `🏛️ **Monasteries:** Details, history, locations of ${this.monasteries.length} monasteries\n` +
                    `🎭 **Festivals:** Cultural events and celebrations\n` +
                    `🌤️ **Weather:** Current conditions and forecasts\n` +
                    `🗺️ **Directions:** How to reach monasteries\n` +
                    `ℹ️ **General Info:** About Sikkim and travel tips\n\n` +
                    `**Try asking:**\n` +
                    `• "Tell me about Rumtek Monastery"\n` +
                    `• "What's the weather in Gangtok?"\n` +
                    `• "When is the next festival?"\n` +
                    `• "How to reach Pemayangtse?"\n\n` +
                    `What would you like to know? 😊`,
            suggestions: [
                "Show all monasteries",
                "Weather in Gangtok", 
                "Upcoming festivals",
                "About Sikkim",
                "Travel information"
            ]
        };
    }
}


export const knowledgeBase = new ChatbotKnowledgeBase();
export default knowledgeBase;
