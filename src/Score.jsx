import React from 'react';
import LoadingCircle from './LoadingCircle';
import { Typography, Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router-dom';
import GameScore from './GameScore';

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
    const history = useHistory();
    const classes = useStyles();

    return (
        <>
            {!props.currentGame ?
                <LoadingCircle /> :
                <>
                    <br />
                    <Typography variant="h6">Current Score</Typography>
                    <GameScore {...props} />
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