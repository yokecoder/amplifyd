import useTheme from "../utils/theme";
import { Icon, IconButton } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

export default function TopNavBar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <div className="top-nav">
                <div className="app-title">
                    <IconButton >
                      <GraphicEqIcon className="topnav-icon-btn" />
                    </IconButton>
                    <span>Amplifyd</span>
                </div>
                <IconButton className="topnav-icon-btn" onClick={toggleTheme}>
                    {theme === "dark" ? <LightMode /> : <DarkMode />}
                </IconButton>
            </div>
        </>
    );
}
