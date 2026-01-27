import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import AudioPlayer  from "../comps/audioplayer";
import useTrackQueue from "../utils/queue_manager.jsx";
import { useQueries } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import ExploreCarousel from "../comps/explore_cards"


export default function Home() {
  const [isloading, setIsLoading] = useState(true);
  
  
  return (
    <div className="HomeExplorePage">
      <ExploreCarousel title="Trending">
        {isloading && Array.from({ length: 6}).map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="carousel-card-1 skeleton"/>
        ))}
      </ExploreCarousel>
      
      <ExploreCarousel title="Newly Added" >
        {isloading && Array.from({ length: 6}).map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="carousel-card-1 skeleton"/>
        ))}
      </ExploreCarousel>
      
      <ExploreCarousel title="Top Mixes">
        {isloading && Array.from({ length: 6}).map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="carousel-card-1 skeleton"/>
        ))}
      </ExploreCarousel>
      
      <ExploreCarousel title="Top Artists">
        {isloading && Array.from({ length: 6}).map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="carousel-card-1 skeleton"/>
        ))}
      </ExploreCarousel>
      
      
    </div>
  )
  
}
