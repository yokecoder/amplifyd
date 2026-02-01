const express = require('express');

const router = express.Router();
const axios = require('axios');
require("dotenv").config({
    path: `.env.${process.env.NODE_ENV || "development"}`
});

const YTAPIKEY = process.env.YTAPIKEY1;


router.get('/info/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    const ytApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YTAPIKEY}&part=snippet,contentDetails,status`;
    const response  = await axios.get(ytApiUrl);
    
    const videoInfo = {
        id: response.data.items[0].id,
        title: response.data.items[0].snippet.title,
        description: response.data.items[0].snippet.description,
        thumbnails: response.data.items[0].snippet.thumbnails,
        channelTitle: response.data.items[0].snippet.channelTitle,
        duration: response.data.items[0].contentDetails.duration,
    }
    res.json(videoInfo);
})

module.exports = router;