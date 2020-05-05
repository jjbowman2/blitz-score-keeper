import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingCircle = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center" }} >
            <CircularProgress />
        </div>
    );
}

export default LoadingCircle;