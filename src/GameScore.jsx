import React, { useState, useEffect } from 'react';
import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Input, FormControl, InputLabel, List, ListItem, makeStyles, GridList, GridListTile, useMediaQuery, useTheme } from '@material-ui/core';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';

const useStyles = makeStyles((theme) => ({
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    }
}));

const GameScore = (props) => {
    const classes = useStyles();
    const [players, setPlayers] = useState(null);
    const [playerScores, setPlayerScores] = useState({});
    const [currentWinner, setCurrentWinner] = useState({
        name: "",
        score: 0
    });
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    useEffect(() => {
        if (props.currentGame) {
            setPlayers(props.currentGame.players);
            const updatedPlayerScores = {};
            let updatedWinner = { name: "", score: 0 };
            Object.keys(props.currentGame.players).forEach(player => {
                const score = props.currentGame.players[player].reduce((total, round) => total + round.positive - round.negative, 0);
                updatedPlayerScores[player] = score;
                if (props.currentGame && score >= props.currentGame["winning-score"] && score > updatedWinner.score) {
                    updatedWinner = { name: player, score: score };
                }
            });
            setPlayerScores(updatedPlayerScores);
            setCurrentWinner(updatedWinner);
        }
    }, [props])
    return (
        <>
            {players && Object.keys(players).sort((p1, p2) => playerScores[p2] - playerScores[p1]).map((player, index) => {
                return (
                    <ExpansionPanel key={`player${index}`}>
                        <ExpansionPanelSummary>
                            <Typography>{`${player}:`}</Typography>
                            {currentWinner.name === player &&
                                <EmojiEventsIcon style={{ marginLeft: "auto" }} />}
                            <Typography style={currentWinner.name !== player ? { marginLeft: "auto" } : {}}>{playerScores[player]}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{ justifyContent: "space-between" }}>
                            <GridList className={classes.gridList} cols={matches ? Math.min(Object.values(players)[0].length, 5) : Math.min(Object.values(players)[0].length, 2)}>
                                {players[player].map((round, index) => {
                                    let result;
                                    if (props.preferences && props.preferences["enter-by-total"]) {
                                        result = (
                                            <GridListTile key={`player${player}Round${index}`} rows={.5}>
                                                <FormControl>
                                                    <InputLabel htmlFor={`player${player}Round${index}`}>{`Round ${index + 1}`}</InputLabel>
                                                    <Input id={`player${player}Round${index}`} type="number" value={round.positive - round.negative} readOnly />
                                                </FormControl>
                                            </GridListTile>
                                        );
                                    } else {
                                        result = (
                                            <GridListTile key={`player${player}Round${index}`} rows={1}>
                                                <List >
                                                    <ListItem key={`player${player}Round${index}`}>
                                                        <FormControl >
                                                            <InputLabel htmlFor={`player${player}Round${index}Negative`}>{`${index + 1}. Negative`}</InputLabel>
                                                            <Input id={`player${player}Round${index}Negative`} type="number" value={round.negative} readOnly />
                                                        </FormControl>
                                                    </ListItem>
                                                    <ListItem>
                                                        <FormControl>
                                                            <InputLabel htmlFor={`player${player}Round${index}Positive`}>{`${index + 1}. Positive`}</InputLabel>
                                                            <Input id={`player${player}Round${index}Positive`} type="number" value={round.positive} readOnly />
                                                        </FormControl>
                                                    </ListItem>

                                                </List>
                                            </GridListTile>
                                        );
                                    }
                                    return result;
                                })}
                            </GridList>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                );
            })}
        </>
    );
};

export default GameScore;