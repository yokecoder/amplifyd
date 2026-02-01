import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import ExploreCarousel from "../comps/explore_cards"
import EmbedPlayer from "../comps/player";

export default function Home() {
  const [isloading, setIsLoading] = useState(true);
  
  
  return (
    <div className="HomeExplorePage">
      <ExploreCarousel title="Trending">
        {isloading && Array.from({ length: 6}).map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="carousel-card-1 skeleton"/>
        ))}
      </ExploreCarousel>
      
      
      
      
    </div>
  )
  
}
