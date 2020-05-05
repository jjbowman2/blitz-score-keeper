import React from 'react'
import { Card, CardContent, Typography, FormControl, InputLabel, Input } from '@material-ui/core';

const ScoreCard = (props) => {
    let forms;

    if (props.byTotal) {
        forms = (
            <FormControl fullWidth>
                <InputLabel htmlFor={`${props.player}ScoreInput`}>New Round Score</InputLabel>
                <Input id={`${props.player}ScoreInput`} type="number" onChange={event => props.handleNewPlayerScores(event.target.value, props.player, "positive")} />
            </FormControl>
        );
    } else {
        forms = (
            <>
                <FormControl fullWidth>
                    <InputLabel htmlFor={`${props.player}NegativeScoreInput`}>New Round Negative Score</InputLabel>
                    <Input id={`${props.player}NegativeScoreInput`} type="number" onChange={event => props.handleNewPlayerScores(event.target.value, props.player, "negative")} />
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel htmlFor={`${props.player}PositiveScoreInput`}>New Round Positive Score</InputLabel>
                    <Input id={`${props.player}PositiveScoreInput`} type="number" onChange={event => props.handleNewPlayerScores(event.target.value, props.player, "positive")} />
                </FormControl>
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