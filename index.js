const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();
const port = 3000; // You can change the port if needed

// Load environment variables from .env file
dotenv.config();

// Replace with your actual API key
const API_KEY = 'Kastg_XpdGAGqxAvHerDXZxF4h_free';
const API_URL = 'https://api.kastg.xyz/api/ai/command-r-plus';

// Retrieve valid user IDs from environment variable
const validUserIDs = process.env.VALID_USER_IDS.split(',');

// Route for root URL
app.get('/', (req, res) => {
    res.send('Go to http://YOUR_API_ENDPOINT/chat?prompt=YOUR%20QUESTIONS&key=YOUR_KEY');
});

// Endpoint to handle GET requests with a URL parameter
app.get('/chat', async (req, res) => {
    const { prompt, key: userID } = req.query;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt parameter is required' });
    }

    if (!userID) {
        return res.status(400).json({ error: 'UserID or Key parameter is required' });
    }

    if (!validUserIDs.includes(userID)) {
        return res.status(403).json({ error: 'Invalid UserID or Invalid Key' });
    }

    try {
        const response = await axios.get(API_URL, {
            params: {
                prompt: prompt,
                key: API_KEY
            }
        });

        if (response.data.status === 'true' && response.data.result.length > 0) {
            return res.json({ response: response.data.result[0].response });
        } else {
            return res.status(500).json({ error: 'Failed to get a response from the API' });
        }
    } catch (error) {
        console.error('Error fetching response:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});