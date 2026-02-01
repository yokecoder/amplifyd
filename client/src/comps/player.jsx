import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { useState, useEffect, useRef } from "react";
import Youtube from "react-youtube";

const API = import.meta.env.VITE_API_URL;

export default function EmbedPlayer({trackId}) {
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoInfo, setVideoInfo] = useState(null);
    const [miniPlayer,setMiniPlayer] = useState(true);

    const onPlayerReady = (e) => {
        setPlayer(e.target);
        /*player.playVideo();
        setIsPlaying(true);*/
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
        setIsPlaying(!isPlaying);
    }   

    const fetchVideoInfo = async (videoId) => {
        try {
            const response = await fetch(`${API}ytstream/info/${videoId}`);
            const data = await response.json();
            setVideoInfo(data);
        } catch (error) {
            console.error("Error fetching video info:", error);
        
        }
    }

    useEffect(() => {
        fetchVideoInfo(trackId);
        /*if (videoInfo && player) {
            player.playVideo();
            setIsPlaying(true);
        }*/
    }, [trackId]);

    
    

  return (
    <div>
      
        <Youtube
            videoId={trackId}
            onReady={onPlayerReady}
            opts={{height:"0",width:"0",playerVars: {  controls: 0 }}}
            style={{display:"none"}}
        />

        
        {miniPlayer && (<div className="mini-player">
            <img src={videoInfo?.thumbnails.default.url} alt="" className="thumbnail" />
            <div className="mini-info" onClick={()=> setMiniPlayer(false)}>
                <div className="title">{videoInfo?.title}</div>
                <div className="author">{videoInfo?.channelTitle.split("-")[0]}</div>
            </div>
            <div className="controls">
                <IconButton className="icon-btn" >
                    <SkipPrevious />
                </IconButton>
                <IconButton className="icon-btn" onClick={handlePlayPause} >
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton className="icon-btn"  >
                    <SkipNext />
                </IconButton>
            </div>

        </div>)}

        {!miniPlayer && (

            <div className="audioplayer">
                <IconButton className="icon-btn-top">
                    <ArrowDropDown className="icon" onClick={()=>setMiniPlayer(true)}/>
                </IconButton>
                <img src={videoInfo?.thumbnails.high.url} alt="" className="thumbnail" />
                <div className="info">
                    <div className="title">{videoInfo?.title}</div>
                    <div className="author">{videoInfo?.channelTitle.split("-")[0]}</div>
                </div>
                <div className="progress-container">

                    <input type="range" min="0" max="100" value="0" className="progress-bar" />
                </div>
                <div className="controls">
                    <IconButton className="icon-btn" >
                        <SkipPrevious className="icon"/>
                    </IconButton>
                    <IconButton className="icon-btn" onClick={handlePlayPause} >
                        {isPlaying ? <PauseIcon className="icon" /> : <PlayArrowIcon className="icon" />}
                    </IconButton>
                    <IconButton className="icon-btn"  >
                        <SkipNext  className="icon" />
                    </IconButton>
                </div>    

            </div>
        )}





        
        
    </div>
  );
}

