import React, { useEffect, useState, useContext } from 'react';
import LoadingCircle from './LoadingCircle';
import { Typography, Grid, Switch, FormControl, InputLabel, Input, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { firestore } from './firebase';
import { UserContext } from './providers/UserProvider';

const Preferences = (props) => {
    const history = useHistory();
    const user = useContext(UserContext);
    const [score, setScore] = useState("");
    const [enterByTotal, setEnterByTotal] = useState(true);

    useEffect(() => {
        if (props.preferences) {
            setScore(props.preferences["default-winning-score"]);
            setEnterByTotal(props.preferences["enter-by-total"]);
        }
    }, [props]);

    const handleSavePreferences = () => {
        firestore.collection("users").doc(user.uid).update({
            preferences: {
                "default-winning-score": score,
                "enter-by-total": enterByTotal
            }
        }).then(() => {
            history.push("/");
        });
    };

    return (
        <>
            {props.preferences ?
                <>
                    <br />
                    <Typography variant="h6">Preferences</Typography>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="defaultWinningScore">Default Score to Win</InputLabel>
                        <Input id="defaultWinningScore" type="number" value={score} onChange={event => setScore(event.target.value)} required />
                    </FormControl>
                    <br /><br />
                    <Typography>Enter Scores as:</Typography>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>-/+</Grid>
                        <Grid item>
                            <Switch
                                color="primary"
                                checked={enterByTotal}
                                onChange={event => setEnterByTotal(event.target.checked)}
                            />
                        </Grid>
                        <Grid item>Total</Grid>
                    </Grid>
                    <br />
                    <Button onClick={handleSavePreferences}>Save</Button>
                    <Button color="secondary" onClick={() => history.push("/")}>Cancel</Button>
                </> :
                <LoadingCircle />}
        </>
    );
};

export default Preferences;