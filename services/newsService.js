const axios = require('axios');

const API_KEY = process.env.NEWS_API_KEY ;

async function fetchNewsByPreferences(preferences) {
    try {
        const { categories, languages, sources, region } = preferences;

        const params = {
            apiKey: API_KEY,
            country: region || 'IN'
        };

        if (categories?.length) params.category = categories[0]; 
        if (languages?.length) params.language = languages[0];   

        const response = await axios.get('https://newsapi.org/v2/top-headlines', { params });

        if (response.status !== 200 || !response.data.articles) {
            throw new Error('Failed to fetch news articles');
        }

        return response.data.articles;

    } catch (error) {
        console.error('Error in fetchNewsByPreferences:', error.message);
        throw new Error('Error fetching news from external API');
    }
}

module.exports = { fetchNewsByPreferences };
