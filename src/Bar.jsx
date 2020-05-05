import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Avatar, makeStyles, Menu, IconButton, MenuItem } from '@material-ui/core';
import { UserContext } from './providers/UserProvider';
import { auth } from './firebase';

const useStyles = makeStyles({
    iconButton: {
        display: "flex",
        marginLeft: "auto"
    }
})

const Bar = () => {
    const user = useContext(UserContext);
    const avatarSrc = user && user.photoURL;
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNewGame = () => {
        setAnchorEl(null);
        history.push("/newgame");
    };

    const handlePreferences = () => {
        setAnchorEl(null);
        history.push("/preferences");
    };

    const handleHistory = () => {
        setAnchorEl(null);
        history.push("/history");
    };

    const handleLearnToPlay = () => {
        setAnchorEl(null);
        window.open("https://www.youtube.com/watch?v=6n3VyC0ngY8", '_blank');
    };

    const handleLogout = () => {
        auth.signOut();
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6">
                    Blitz Score Keeper
                </Typography>
                <IconButton color="inherit" className={classes.iconButton} onClick={handleClick}>
                    <Avatar src={avatarSrc} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleNewGame}>New Game</MenuItem>
                    <MenuItem onClick={handlePreferences}>Preferences</MenuItem>
                    <MenuItem onClick={handleHistory}>History</MenuItem>
                    <MenuItem onClick={handleLearnToPlay}>Learn to Play</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>

        </AppBar>
    );
};

export default Bar;