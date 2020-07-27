import React, { useState, useEffect } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LoadingCircle from './LoadingCircle';
import CloseIcon from '@material-ui/icons/Close';
import { Fab, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import GameScore from './GameScore';

const useStyles = makeStyles((theme) => ({
    closeFab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    }
}));

const History = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [maxSteps, setMaxSteps] = useState(3);

    useEffect(() => {
        if (props.games) {
            setMaxSteps(props.games.length);
        }
    }, [props.games]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>
            {props.games ?
                <div>
                    <br />
                    <Typography variant="h6">Game History</Typography>
                    {props.games.length ?
                        <>
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
                            <GameScore {...props} currentGame={props.games[activeStep]} />
                        </> :
                        <Typography>No past games found</Typography>}
                    <Fab className={classes.closeFab} onClick={() => history.push("/")}>
                        <CloseIcon />
                    </Fab>
                </div> :
                <LoadingCircle />}
        </>
    );
};

export default History;