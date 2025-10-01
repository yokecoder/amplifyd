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


// RapidAPI keys rotation
router.get("/stream", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Video ID is required" });
  }

  // ✅ API keys and index moved INSIDE the route
  const apiKeys = [
    process.env.YTAPIKEY1,
    process.env.YTAPIKEY2,
    process.env.YTAPIKEY3,
    process.env.YTAPIKEY4,
    process.env.YTAPIKEY5,
  ];
  let currentKeyIndex = 0;
  const TIMEOUT = 10000;

  try {
    let data;
    let attempts = 0;

    while (attempts < apiKeys.length) {
      try {
        const response = await axios.get("https://yt-api.p.rapidapi.com/dl", {
          params: { id, cgeo: "IN" },
          headers: {
            "x-rapidapi-key": apiKeys[currentKeyIndex],
            "x-rapidapi-host": "yt-api.p.rapidapi.com",
          },
          timeout: TIMEOUT,
        });

        data = response.data;
        break;
      } catch (err) {
        const status = err.response?.status;
        if (status === 403 || status === 429) {
          currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
          attempts++;
          continue;
        }
        throw err;
      }
    }

    if (!data?.formats?.length) {
      return res.status(404).json({ error: "No formats found" });
    }

    const fileUrl = data.formats[0].url;
    if (!fileUrl) {
      return res.status(404).json({ error: "Audio URL not found" });
    }

    const streamResponse = await axios.get(fileUrl, {
      responseType: "stream",
      timeout: TIMEOUT,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    res.setHeader("Content-Type", "audio/mpeg");
    if (streamResponse.headers["content-length"]) {
      res.setHeader("Content-Length", streamResponse.headers["content-length"]);
    }
    res.setHeader("Connection", "keep-alive");

    req.on("close", () => streamResponse.data.destroy());

    streamResponse.data.pipe(res);
  } catch (err) {
    console.error("Streaming error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to stream audio",
        message: err.message,
      });
    }
  }
});

router.get("/stream2", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Video ID is required" });
  }

  const apiKeys = [
    process.env.YTAPIKEY1,
    process.env.YTAPIKEY2,
    process.env.YTAPIKEY3,
    process.env.YTAPIKEY4,
    process.env.YTAPIKEY5,
  ];

  let currentKeyIndex = 0;
  const TIMEOUT = 10000;

  try {
    let data;
    let attempts = 0;

    while (attempts < apiKeys.length) {
      try {
        const response = await axios.get("https://yt-api.p.rapidapi.com/dl", {
          params: { id, cgeo: "IN" },
          headers: {
            "x-rapidapi-key": apiKeys[currentKeyIndex],
            "x-rapidapi-host": "yt-api.p.rapidapi.com",

            // ✅ Anti-403 headers
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "*/*",
            Origin: "https://render.com",
            Referer: "https://render.com/",
            Connection: "keep-alive",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: TIMEOUT,
        });

        data = response.data;
        break;
      } catch (err) {
        const status = err.response?.status;
        if (status === 403 || status === 429) {
          currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
          attempts++;
          continue;
        }
        throw err;
      }
    }

    if (!data?.formats?.length) {
      return res.status(404).json({ error: "No formats found" });
    }

    const fileUrl = data.formats[0].url;
    if (!fileUrl) {
      return res.status(404).json({ error: "Audio URL not found" });
    }

    const streamResponse = await axios.get(fileUrl, {
      responseType: "stream",
      timeout: TIMEOUT,
      headers: {
        // ✅ Important headers to bypass 403 when streaming
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "*/*",
        Connection: "keep-alive",
        Referer: "https://render.com/",
      },
    });

    res.setHeader("Content-Type", "audio/mpeg");
    if (streamResponse.headers["content-length"]) {
      res.setHeader("Content-Length", streamResponse.headers["content-length"]);
    }
    res.setHeader("Connection", "keep-alive");

    req.on("close", () => streamResponse.data.destroy());

    streamResponse.data.pipe(res);
  } catch (err) {
    console.error("Streaming error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to stream audio",
        message: err.message,
      });
    }
  }
});


module.exports = router;



