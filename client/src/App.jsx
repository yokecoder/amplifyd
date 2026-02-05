import { Routes, Route } from "react-router-dom";
import TopNavBar from "./comps/topnav";
import BottomNavBar from "./comps/btmnav";
import EmbedPlayer from "./comps/player";
import Home from "./pages/home";
import useTrackQueue from "./utils/queue_manager";
import "./App.css";



function App() {
    const {trackQueue,currentTrack}=useTrackQueue();

    return (
        <div className="app-layout">
            <TopNavBar />
            <div className="page-layout">
                <Routes>  
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
            <BottomNavBar />
            <EmbedPlayer trackId={currentTrack} />
        </div>
    );
}

export default App;
