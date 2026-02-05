//TODO: add loading state and error handling, progress bar with duration

import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { useState, useEffect, useRef } from "react";
import Youtube from "react-youtube";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";



const API = import.meta.env.VITE_API_URL;



export default function EmbedPlayer({trackId}) {
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [miniPlayer,setMiniPlayer] = useState(true);

    const onPlayerReady = (e) => {
        setPlayer(e.target);
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            player?.pauseVideo();
        } else {
            player?.playVideo();
        }
        setIsPlaying(!isPlaying);
    }   

    const { data: videoInfo } = useQuery({
        queryKey: ["video-info", trackId],
        queryFn: async () => {
            const res = await fetch(`${API}api/info/${trackId}`);
            return res.json();
        },
        enabled: !!trackId,
        staleTime: 1000 * 60,
    });

    useEffect(() => {
        if (player && trackId) {
            player.loadVideoById(trackId);
            setIsPlaying(true);
        }
    }, [trackId, player]);




  return (
    <div>
        <Youtube
            videoId={trackId}
            onReady={onPlayerReady}
            style={{display:"none"}}
        />


        {miniPlayer && (<div className="mini-player">
            <img src={videoInfo?.thumbnails?.default.url} alt="" className="thumbnail" />
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
                <img src={videoInfo?.thumbnails?.high.url} alt="" className="thumbnail" />
                <div className="info">
                    <div className="title">{videoInfo?.title}</div>
                    <div className="author">{videoInfo?.channelTitle.split("-")[0]}</div>
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

