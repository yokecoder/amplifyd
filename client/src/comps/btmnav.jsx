import { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function BottomNavBar() {
    return (
        <div className="bottom-nav">
            <Link className="link" to="/">
                <IconButton className="bottom-nav-icon">
                  <HomeIcon />
                </IconButton>
            </Link>
            <Link className="link" to="/search">
                <IconButton className="bottom-nav-icon">
                  <SearchIcon />
                </IconButton>
            </Link>
            <Link className="link" to="/profile">
                <IconButton className="bottom-nav-icon">
                  <AccountCircleIcon/>
                </IconButton>
            </Link> 
            
        </div>
    );
}
