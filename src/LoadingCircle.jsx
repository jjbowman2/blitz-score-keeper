import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    loadingParent: {
        display: "flex",
        height: "90vh",
        justifyContent: "center",
        alignItems: "center"
    }
}))

const LoadingCircle = () => {
    const classes = useStyles();
    return (
        <div className={classes.loadingParent} >
            <CircularProgress />
        </div>
    );
}

export default LoadingCircle;