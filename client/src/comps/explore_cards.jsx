import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function ExploreCarousel({title, children}){
  return (
    <div className="explore-section">
      <span className="title" > {title}</span>
      <div className="carousel"> {children} </div>
    </div>
  )
}

export function ExploreCard({thumbnail, title, channelName, onPlay }){
  return (
    <div className="carousel-card-1">
      <img src={thumbnail} alt="" className="carousel-card-img" />
      <div className="card-info">
        <div className="card-title">{title}</div>
        <div className="card-channel">{channelName}</div>
        
      </div>
      <div className="card-ctrls">
        <IconButton className="icon-btn" onClick={onPlay}>
          <PlayArrowIcon />
        </IconButton>
      </div>
    </div>
  )
}