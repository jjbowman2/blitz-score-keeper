import React, { useState, useContext } from 'react';
import LoadingCircle from './LoadingCircle';
import { Typography, Fab, makeStyles, Menu, MenuItem, Dialog, DialogTitle, DialogContent, TextField, Button, List, ListItem, DialogActions } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router-dom';
import GameScore from './GameScore';
import { firestore } from './firebase';
import { UserContext } from './providers/UserProvider';

const useStyles = makeStyles((theme) => ({
    addFab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    editFab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(10),
    }
}));

const Score = (props) => {
    const user = useContext(UserContext);
    const history = useHistory();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [showScoreChangeDialog, setShowScoreChangeDialog] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePlayerAdd = () => {
        setShowAddDialog(true);
        setAnchorEl(null);
    };

    const addPlayerToGame = (event) => {
        event.preventDefault();

        // retrieve the given values
        const newPlayerName = document.querySelector("#newPlayerName").value;
        const newPlayerScore = document.querySelector("#newPlayerScore").value;

        // calculate the number of rounds that have passed without the player
        let passedRounds = 0;
        const otherPlayerRounds = Object.values(props.currentGame.players);
        if (otherPlayerRounds.length) {
            passedRounds = otherPlayerRounds[0].length;
        };

        // pad the player with n-1 zero-score rounds
        const newPlayerRounds = [];
        for (let i = 0; i < passedRounds - 1; i++) {
            newPlayerRounds.push({ negative: 0, positive: 0 });
        }

        // make the last round have the new score
        newPlayerRounds.push({ negative: 0, positive: Number(newPlayerScore) });

        const updatedGame = Object.assign({}, props.currentGame);
        updatedGame.players[newPlayerName] = newPlayerRounds;
        const updatedGames = props.games;
        const currentGameIndex = updatedGames.findIndex(game => game.active);
        updatedGames[currentGameIndex] = updatedGame;
        firestore.collection("users").doc(user.uid).update({
            games: updatedGames
        }).then(() => setShowAddDialog(false));
    }

    const handlePlayerRemove = () => {
        setShowRemoveDialog(true);
        setAnchorEl(null);
    };

    const removePlayer = (player) => {
        const updatedGames = props.games;
        const currentGameIndex = updatedGames.findIndex(game => game.active);
        delete updatedGames[currentGameIndex].players[player];
        firestore.collection("users").doc(user.uid).update({
            games: updatedGames
        }).then(() => setShowRemoveDialog(false));
    };

    const handleChangeScore = () => {
        setShowScoreChangeDialog(true);
        setAnchorEl(null);
    };

    const changeScore = (event) => {
        event.preventDefault();
        const updatedGames = props.games;
        const currentGameIndex = updatedGames.findIndex(game => game.active);
        updatedGames[currentGameIndex]["winning-score"] = Number(document.querySelector("#newWinningScore").value);
        firestore.collection("users").doc(user.uid).update({
            games: updatedGames
        }).then(() => setShowScoreChangeDialog(false));
    };

    return (
        <>
            {!props.currentGame ?
                <LoadingCircle /> :
                <>
                    <br />
                    <Typography variant="h6">Current Score</Typography>
                    <GameScore {...props} />
                    <Fab className={classes.editFab} color="secondary" onClick={handleClick}>
                        <EditIcon />
                    </Fab>
                    <Fab className={classes.addFab} color="primary" onClick={() => history.push("/new-round")}>
                        <AddIcon />
                    </Fab>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handlePlayerAdd}>Add a New Player</MenuItem>
                        <MenuItem onClick={handlePlayerRemove}>Remove a Player</MenuItem>
                        <MenuItem onClick={handleChangeScore}>Change Score to Win</MenuItem>
                    </Menu>
                    <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
                        <DialogTitle>Add a Player</DialogTitle>
                        <DialogContent>
                            <form id="newPlayerForm" onSubmit={addPlayerToGame}>
                                <TextField
                                    id="newPlayerName"
                                    autoFocus
                                    label="New Player Name"
                                    fullWidth
                                    required
                                />
                                <TextField
                                    id="newPlayerScore"
                                    label="Starting Score"
                                    type="number"
                                    defaultValue={0}
                                    fullWidth
                                    required
                                />

                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" type="submit" form="newPlayerForm">Add</Button>
                            <Button color="secondary" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={showRemoveDialog} onClose={() => setShowRemoveDialog(false)}>
                        <DialogTitle onClose={() => setShowRemoveDialog(false)}>Remove a Player</DialogTitle>
                        <DialogContent>
                            <List>
                                {Object.keys(props.currentGame.players).map((player, index) => {
                                    return (
                                        <ListItem button key={`remove${player}Button`} onClick={() => removePlayer(player)}>
                                            <Typography align="center">{player}</Typography>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" onClick={() => setShowRemoveDialog(false)}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={showScoreChangeDialog} onClose={() => setShowScoreChangeDialog(false)}>
                        <DialogTitle>Change Score to Win</DialogTitle>
                        <DialogContent>
                            <form id="scoreChangeForm" onSubmit={changeScore}>
                                <TextField
                                    id="newWinningScore"
                                    autoFocus
                                    label="New Winning Score"
                                    fullWidth
                                    required
                                />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" type="submit" form="scoreChangeForm">Save</Button>
                            <Button color="secondary" onClick={() => setShowScoreChangeDialog(false)}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
        </>
    );
};

export default Score;