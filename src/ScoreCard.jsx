import React, { useRef, useEffect } from 'react'
import { Card, CardContent, Typography, TextField } from '@material-ui/core';

const ScoreCard = (props) => {
    let forms;

    const negRef = useRef(null);
    const posRef = useRef(null);

    useEffect(() => {
        if (props.active) {
            const timeout = setTimeout(() => {
                posRef.current.focus();
            }, 300);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [props])

    if (props.byTotal) {
        forms = (
            <TextField
                label="New Round Score"
                type="number"
                onChange={event => props.handleNewPlayerScores(event.target.value, props.player, "positive")}
                inputRef={posRef}
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
                    inputRef={posRef}
                    fullWidth
                />
                <TextField
                    label="New Round Positive Score"
                    type="number"
                    onChange={event => props.handleNewPlayerScores(event.target.value, props.player, "positive")}
                    inputRef={negRef}
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