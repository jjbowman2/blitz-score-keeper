import React, { useState, useEffect, useContext } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import LoadingCircle from './LoadingCircle';
import ScoreCard from './ScoreCard';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import { Fab, Snackbar, IconButton } from '@material-ui/core';
import { firestore } from './firebase';
import { UserContext } from './providers/UserProvider';
import { useHistory } from 'react-router-dom';

// Adapted from https://material-ui.com/components/steppers/

const useStyles = makeStyles((theme) => ({
    doneFab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    }
}));

const NewRound = (props) => {
    const history = useHistory();
    const user = useContext(UserContext);
    const classes = useStyles();
    const theme = useTheme();
    const [openSnack, setOpenSnack] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [maxSteps, setMaxSteps] = useState(0);
    const [newPlayerScores, setNewPlayerScores] = useState({});

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };


    useEffect(() => {
        if (props.players) {
            setMaxSteps(Object.keys(props.players).length);
        }
    }, [props]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step, type) => {
        if (type === "end") {
            setActiveStep(step);
        }
    };

    const handleNewPlayerScores = (value, player, type) => {
        const updatedScores = Object.assign({}, newPlayerScores);
        if (!updatedScores[player]) {
            updatedScores[player] = {
                negative: 0,
                positive: 0
            };
        }
        updatedScores[player][type] = Number(value);
        setNewPlayerScores(updatedScores);
    }

    const handleSubmitScores = () => {
        if (Object.keys(newPlayerScores).length !== Object.keys(props.players).length) {
            setOpenSnack(true);
        } else {
            const updatedGames = props.games;
            const currentGameIndex = updatedGames.findIndex(game => game.active);
            const updatedGame = updatedGames[currentGameIndex];
            Object.keys(newPlayerScores).forEach(player => {
                updatedGame.players[player].push(newPlayerScores[player]);
            })
            updatedGames[currentGameIndex] = updatedGame;
            firestore.collection("users").doc(user.uid).update({
                games: updatedGames
            }).then(() => {
                history.push("/");
            })
        }
    }

    return (
        <>
            {props.players ?
                <div>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onSwitching={handleStepChange}
                        enableMouseEvents
                    >
                        {Object.keys(props.players).map((player, index) => (
                            <ScoreCard
                                key={`score${index}`}
                                players={props.players}
                                player={player}
                                handleNewPlayerScores={handleNewPlayerScores}
                                byTotal={props.preferences && props.preferences["enter-by-total"]}
                                active={index === activeStep}
                            />
                        ))}
                    </SwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        variant="text"
                        activeStep={activeStep}
                        nextButton={
                            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                Next
                                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                Back
                            </Button>
                        }
                    />
                    <Fab className={classes.doneFab} color="primary" onClick={handleSubmitScores}>
                        <DoneIcon />
                    </Fab>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={openSnack}
                        autoHideDuration={2000}
                        onClose={handleSnackClose}
                        message="Please add scores for all players."
                        action={
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                    />
                </div> :
                <LoadingCircle />}
        </>
    );
}

export default NewRound;