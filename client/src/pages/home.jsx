import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import ExploreCarousel,{ExploreCard} from "../comps/explore_cards"
import { useQuery } from "@tanstack/react-query";
import useTrackQueue from "../utils/queue_manager";


const API = import.meta.env.VITE_API_URL;



export default function Home() {

  const {addToQueue} = useTrackQueue()
  
  
  const { data:trending,isLoading} = useQuery({
          queryKey: ["trending"],
          queryFn: async () => {
              const res = await fetch(`${API}api/search?q=trending%20songs`);
              return res.json();
          },
          enabled: true,
          staleTime: 1000 * 60,
  });
  
  return (
    <div className="HomeExplorePage">
      <ExploreCarousel title="Trending">
        {isLoading && Array.from({ length: 6}).map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="carousel-card-1 skeleton"/>
        ))}
        {!isLoading && trending?.items?.map((item) => (
          <ExploreCard
            key={item.id.videoId ?? item.id.playlistId}
            thumbnail={item.snippet.thumbnails.medium.url}  
            title={item.snippet.title}
            channelName={item.snippet.channelTitle}
            onPlay={()=>{addToQueue(item.id.videoId)}}
          />  
        ))}

      </ExploreCarousel>
      
      
      
      
    </div>
  )
  
}
