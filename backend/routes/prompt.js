require('dotenv').config();

const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  const detailedPrompt = `
Please provide 10-30 TikTok video links about the prompt: ${prompt}.
For each recommendation, include:
- The restaurant name
- The direct TikTok video URL
- The restaurant address
- The coordinates (latitude, longitude)

Format each recommendation as:
1. Name: [restaurant name]
   TikTok link: [video URL]
   Address: [full address]
   Coordinates: [latitude, longitude]
`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [{
          role: 'user',
          content: detailedPrompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ 
      error: 'Perplexity API request failed',
      details: err.message
    });
  }
});

module.exports = router;