import React, { useState, useEffect } from 'react'
import LoadingCircle from './LoadingCircle';
import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Input, FormControl, InputLabel, List, ListItem, Fab, makeStyles, GridList, GridListTile, useMediaQuery, useTheme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import { useHistory } from 'react-router-dom';

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
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    }
}));

const Score = (props) => {
    const history = useHistory();
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
            {!props.currentGame ?
                <LoadingCircle /> :
                <>
                    <br />
                    <Typography variant="h6">Current Score</Typography>
                    {players && Object.keys(players).map((player, index) => {
                        return (
                            <ExpansionPanel key={`player${index}`}>
                                <ExpansionPanelSummary>
                                    <Typography>{`${player}:`}</Typography>
                                    {currentWinner.name === player &&
                                        <EmojiEventsIcon style={{ marginLeft: "auto" }} />}
                                    <Typography style={currentWinner.name !== player ? { marginLeft: "auto" } : {}}>{playerScores[player]}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <GridList className={classes.gridList} cols={matches ? 4 : 2}>
                                        {players[player].map((round, index) => {
                                            let result;
                                            if (props.preferences && props.preferences["enter-by-total"]) {
                                                result = (
                                                    <GridListTile key={`player${player}Round${index}`} cols={matches ? 2 : 1} rows={.5}>
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
                    <Fab className={classes.editFab} color="secondary" disabled>
                        <EditIcon />
                    </Fab>
                    <Fab className={classes.addFab} color="primary" onClick={() => history.push("/new-round")}>
                        <AddIcon />
                    </Fab>
                </>
            }
        </>
    );
};

export default Score;