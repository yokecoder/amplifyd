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


/*router.get('/stream', async (req, res) => {
  const { id } = req.query; // YouTube video ID

  if (!id) {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
    const response = await axios.get('https://yt-api.p.rapidapi.com/dl', {
      params: { id, cgeo: 'IN' }, // country code optional
      headers: {
        'x-rapidapi-key': '13107244c6mshfcb3037af722f60p1e22f0jsn56b9a0b9d6e5', // replace with your key
        'x-rapidapi-host': 'yt-api.p.rapidapi.com',
      },
    });
    const data = response.data;
    if (data) {
      res.redirect(data.formats[0].url);
    } else {
      res.status(500).json({ error: 'Audio URL not found', data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to fetch audio from RapidAPI',
      message: err.message,
    });
  }
});
*/

router.get('/stream', async (req, res) => {
  const { id } = req.query; // YouTube video ID

  const streamApiKeys = [
    process.env.YTAPIKEY1,
    process.env.YTAPIKEY2,
    process.env.YTAPIKEY3,
    process.env.YTAPIKEY4,
    process.env.YTAPIKEY5,
  ]
  var currentKeyIdx = 0

  function getNextApiKey() {
    const key = streamApiKeys[currentKeyIdx];
    currentKeyIdx = (currentKeyIdx + 1) % streamApiKeys.length;
    return key;
  }

  if (!id) {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
  // Step 1: Get the actual download URL from RapidAPI
    const response = await axios.get('https://yt-api.p.rapidapi.com/dl', {
    params: { id, cgeo: 'IN' },
    headers: {
    'x-rapidapi-key': `${getNextApiKey()}`,
    'x-rapidapi-host': 'yt-api.p.rapidapi.com',
    },
  });

  const data = response.data;  

  if (!data || !data.formats || data.formats.length === 0) {  
    return res.status(500).json({ error: 'Audio URL not found', data });  
  }  

  const fileUrl = data.formats[0].url;  
  
  // Step 2: Stream the content to the frontend  
  const streamResponse = await axios.get(fileUrl, { responseType: 'stream' });  

// Set headers for streaming  
  res.setHeader('Content-Type', 'audio/mpeg');  
  res.setHeader('Content-Length', streamResponse.headers['content-length'] || 0);  
  res.setHeader('Connection', 'Keep-Alive')
// Pipe the stream to the client  
  streamResponse.data.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({
    error: 'Failed to fetch and stream audio',
    message: err.message,
  });
  }
  });
















module.exports = router;