import { Routes, Route } from "react-router-dom";
import TopNavBar from "./comps/topnav";
import BottomNavBar from "./comps/btmnav";
import EmbedPlayer from "./comps/player";
import Home from "./pages/home";
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
            
            <BottomNavBar />
            <EmbedPlayer trackId={"uEDOBTJ2_Iw"} />
        </div>
    );
}

export default App;
