import { Routes, Route } from "react-router-dom";
import TopNavBar from "./comps/topnav";
import BottomNavBar from "./comps/btmnav";
import Home from "./pages/home";
import AudioPlayer from "./comps/audioplayer";
import "./App.css";


function App() {
    return (
        <div className="app-layout">
            <TopNavBar />

            <div className="page-layout">
                <Routes>
                    
                    <Route path="/" element={<Home />} />
                    
                </Routes>
            </div>
            <AudioPlayer trackId="_MnJIbwX6MY" ></AudioPlayer>
            
            <BottomNavBar />
        </div>
    );
}

export default App;
