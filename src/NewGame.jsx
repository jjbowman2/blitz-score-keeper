import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { Typography, IconButton, Input, FormControl, InputLabel, List, ListItem, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import LoadingCircle from './LoadingCircle';
import { firestore } from './firebase';
import { UserContext } from './providers/UserProvider';

const NewGame = (props) => {
    const history = useHistory();
    const user = useContext(UserContext);
    const [score, setScore] = useState("");
    const [players, setPlayers] = useState([])
    const [newPlayer, setNewPlayer] = useState("");

    useEffect(() => {
        if (props.preferences) {
            setScore(props.preferences["default-winning-score"]);
        }
    }, [props]);

    const addNewPlayer = () => {
        const updatedPlayers = [...players];
        updatedPlayers.push(newPlayer);
        setPlayers(updatedPlayers);
        setNewPlayer("");
    }

    const handleGameSubmit = (event) => {
        event.preventDefault();
        const playersObj = {};
        players.forEach(player => {
            playersObj[player] = [];
        });
        const updatedGames = props.games.map(game => Object.assign({}, game, { active: false }));
        updatedGames.push({
            "active": true,
            "players": playersObj,
            "winning-score": Number(score)
        })

        firestore.collection("users").doc(user.uid).update({
            games: updatedGames
        }).then(() => {
            history.push("/");
        });
    };


    return (
        <>
            {!props.preferences ?
                <LoadingCircle /> :
                <>
                    <br />
                    <Typography variant="h6">New Game</Typography>
                    <form id="createGameForm" onSubmit={handleGameSubmit}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="winningScore">Score to Win</InputLabel>
                            <Input id="winningScore" type="number" value={score} onChange={event => setScore(event.target.value)} required />
                        </FormControl>
                    </form>
                    <br /><br />
                    <Typography>Players:</Typography>
                    <List>
                        {players.map((player, index) => {
                            return (
                                <ListItem key={`player${index}`} >
                                    <FormControl fullWidth>
                                        <Input id={`playerInput${index}`} type="text" value={player} onChange={event => {
                                            const updatedPlayers = [...players];
                                            updatedPlayers[index] = event.target.value;
                                            setPlayers(updatedPlayers);
                                        }} endAdornment={
                                            <IconButton onClick={() => {
                                                const updatedPlayers = [...players];
                                                updatedPlayers.splice(index, 1);
                                                setPlayers(updatedPlayers);
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        } />
                                    </FormControl>
                                </ListItem>
                            )
                        })}
                        <ListItem>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="newPlayer">Next Player Name</InputLabel>
                                <Input id="newPlayer" type="text" value={newPlayer} onChange={event => setNewPlayer(event.target.value)} onKeyPress={event => {
                                    if (event.key === "Enter") {
                                        addNewPlayer();
                                    }
                                }} endAdornment={
                                    <IconButton onClick={event => {
                                        if (newPlayer) {
                                            addNewPlayer();
                                        }
                                    }}>
                                        <DoneIcon />
                                    </IconButton>
                                } />

                            </FormControl>
                        </ListItem>
                    </List>
                    <Button type="submit" form="createGameForm">Done</Button>
                    <Button color="secondary" disabled={!props.currentGame} onClick={() => history.push("/")}>Cancel</Button>
                </>}
        </>
    );
};

export default NewGame;