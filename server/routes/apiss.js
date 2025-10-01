const express = require('express');
const playdl = require('play-dl');
const ytdl = require('ytdl-core');
const axios = require('axios');
const router = express.Router();
const https  = require('https');
const  url =  require("url");
require("dotenv").config();




router.get('/info', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'VIDEO ID  is required' });
  }
  const url  = `https://www.youtube.com/watch?v=${id}`

  try {
    // Validate URL
    if (!playdl.yt_validate(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await playdl.video_info(url);

    res.json({
      id , 
      title: info.video_details.title,
      author: info.video_details.channel.name,
      duration: info.video_details.durationInSec,
      thumbnails: info.video_details.thumbnails,
      url: info.video_details.url,
      formats: info.format,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch video info',
      message: err.message,
    });
  }
});






// Array of RapidAPI keys
const streamApiKeys = [
  process.env.YTAPIKEY1,
  process.env.YTAPIKEY2,
  process.env.YTAPIKEY3,
  process.env.YTAPIKEY4,
  process.env.YTAPIKEY5,
];
let currentKeyIndex = 0;
// Function to rotate API keys
const getNextApiKey = () => {
  const key = streamApiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % streamApiKeys.length;
  return key;
};



router.get('/stream', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
    // Step 1: Fetch download info from RapidAPI
    const { data } = await axios.get('https://yt-api.p.rapidapi.com/dl', {
      params: { id, cgeo: 'IN' },
      headers: {
        'x-rapidapi-key': getNextApiKey(),
        'x-rapidapi-host': 'yt-api.p.rapidapi.com',
      },
      timeout: 10000, // 10 seconds timeout
    });

    if (!data?.formats?.length) {
      return res.status(404).json({ error: 'No available formats found', data });
    }

    // Choose the first available format
    const fileUrl = data.formats[0].url;
    if (!fileUrl) {
      return res.status(404).json({ error: 'Audio URL not found', data });
    }

    // Step 2: Stream the audio to the client
    const streamResponse = await axios.get(fileUrl, { responseType: 'stream' });

    // Set proper headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', streamResponse.headers['content-length'] || 0);
    res.setHeader('Connection', 'keep-alive');

    // Pipe the audio stream
    streamResponse.data.pipe(res);

    streamResponse.data.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error streaming audio', message: err.message });
      }
    });
  } catch (err) {
    console.error('Request error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: 'Failed to fetch and stream audio',
      message: err.response?.data || err.message,
    });
  }
});


module.exports = router;



