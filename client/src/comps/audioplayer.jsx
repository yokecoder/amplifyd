import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Skeleton from "@mui/material/Skeleton";



export default function AudioPlayer({ trackId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMiniPlayer, setMiniPlayer] = useState(true);

  const trackRef = useRef(null);

  // Fetch track info
  const { data: trackInfo, isloading } = useQuery({
    queryKey: ["trackInfo", trackId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/apiss/info?id=${trackId}`
      );
      return response.data;
    },
    enabled: !!trackId,
  });

  // Play / Pause audio
  const playAudio = () => {
    const audio = trackRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  // Update current time and duration
  useEffect(() => {
    const audio = trackRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () =>{ setDuration(audio.duration); audio.play()};

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [trackInfo]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={trackRef} style={{ display: "none" }}>
      <source src={`http://localhost:3000/apiss/stream?id=${trackId}`} type="audio/mpeg" />
</audio>
    
      {/* Player UI */}
      {isMiniPlayer ? (
      
        <div className="mini-player">
          {trackInfo && !isloading && (<>
            <img className="thumbnail" src={trackInfo.thumbnails[trackInfo.thumbnails.length -1 ].url}></img>
            <div className="mini-info" onClick={() => setMiniPlayer(false)}>
              <span className="title" >{trackInfo?.title}</span>
              <span className="author">{trackInfo?.author.split('-')[0]}</span>
            </div>
            <div className="controls">
              <IconButton className="icon-btn">
                <SkipPreviousIcon className="icon"/>
              </IconButton>
              <IconButton className="icon-btn" onClick={playAudio}>
                {isPlaying ? <PauseIcon className="icon"/> : <PlayArrowIcon className="icon"/> }
              </IconButton>
              <IconButton className="icon-btn">
                <SkipNextIcon className="icon"/>
              </IconButton>
            </div>
          </>)}
        </div>
        
      ) : (
        <div className="audioplayer">
          {trackInfo && (
            <>
              {/* Top controls */}
              <IconButton onClick={()=> setMiniPlayer(true)} className="icon-btn-top">
                <ArrowDropDownIcon className="icon" />
              </IconButton>

              {/* Track info */}
              <div className="info">
                <img
                  className="thumbnail"
                  src={
                    trackInfo.thumbnails[trackInfo.thumbnails.length - 1].url
                  }
                  alt={trackInfo.title}
                />
                <div className="title">{trackInfo.title}</div>
                <div className="author">{trackInfo.author.split("-")[0]}</div>
              </div>

              {/* Progress bar */}
              <div className="progress-container">
                <span>{formatTime(currentTime)}</span>
                <progress
                  className="progress-bar"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  max="100"
                />
                <span>{formatTime(duration)}</span>
              </div>

              {/* Playback controls */}
              <div className="controls">
                <IconButton className="icon-btn">
                  <SkipPreviousIcon className="icon" />
                </IconButton>

                <IconButton className="icon-btn" onClick={playAudio}>
                  {isPlaying ? (
                    <PauseIcon className="icon" />
                  ) : (
                    <PlayArrowIcon className="icon" />
                  )}
                </IconButton>

                <IconButton className="icon-btn">
                  <SkipNextIcon className="icon" />
                </IconButton>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}