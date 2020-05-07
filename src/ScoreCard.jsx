import React, { useRef, useEffect } from 'react'
import { Card, CardContent, Typography, TextField } from '@material-ui/core';

const ScoreCard = (props) => {
    let forms;

    const inputRef = useRef(null);

    useEffect(() => {
        if (props.active) {
            // const timeout = setTimeout(() => {
            inputRef.current.focus();
            // }, 500);

            // return () => clearTimeout(timeout);
        }
    }, [props.active])

    if (props.byTotal) {
        forms = (
            <TextField
                label="New Round Score"
                type="number"
                onChange={event => props.handleNewPlayerScores(event.target.value, props.player, "positive")}
                inputRef={inputRef}
                fullWidth
            />
        );
    } else {
        forms = (
            <>
                <TextField
                    label="New Round Negative Score"
                    type="number"
                    onChange={event => props.handleNewPlayerScores(event.target.value, props.player, "negative")}
                    inputRef={inputRef}
                    fullWidth
                />
                <TextField
                    label="New Round Positive Score"
                    type="number"
                    onChange={event => props.handleNewPlayerScores(event.target.value, props.player, "positive")}
                    fullWidth
                />
            </>
        );
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>{props.player}</Typography>
                <Typography color="textSecondary" gutterBottom>
                    Current Score: {props.players[props.player].reduce((total, round) => total + round.positive - round.negative, 0)}
                </Typography>
                {forms}
            </CardContent>
        </Card>
    );
}

export default ScoreCard;