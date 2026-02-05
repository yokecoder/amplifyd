const { Router} = require("express");
const axios = require("axios")
const router = Router();
const { getRandomApiKey } = require("../utils/getApiKey");

require('dotenv').config();



router.get('/info/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    const { data } = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoId,
          key: getRandomApiKey(),
        }
      }
    );

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      id: data.items[0].id,
      thumbnails: data.items[0].snippet.thumbnails,
      title: data.items[0].snippet.title,
      description: data.items[0].snippet.description,
      channelTitle: data.items[0].snippet.channelTitle,
      duration: data.items[0].contentDetails.duration,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});


router.get("/search", async (req,res)=>{
  try {
    const {q} = req.query;
    const {data} = await  axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: q,
          type: 'video,playlist',
          maxResults: 10,
          key: getRandomApiKey(),
        }
      }
    );  
    res.json(data)
  }
  catch(err){
    res.status(500).json({ error: 'Failed to fetch search results' });
  }

});

module.exports = router;