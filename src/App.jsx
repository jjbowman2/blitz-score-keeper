import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Bar from './Bar';
import Score from './Score';
import NewGame from './NewGame';
import Preference from './Preferences';
import History from './History';
import LoadingCircle from './LoadingCircle';
import { Container } from '@material-ui/core';
import { UserContext } from './providers/UserProvider';
import { firestore } from './firebase';
import NewRound from './NewRound';


const App = () => {
	const user = useContext(UserContext);
	const [games, setGames] = useState(null);
	const [currentGame, setCurrentGame] = useState(null);
	const [preferences, setPreferences] = useState(null);

	useEffect(() => {
		if (user) {
			return firestore.collection("users").doc(user.uid).onSnapshot(doc => {
				if (doc.exists) {
					const userData = doc.data();
					setGames(userData.games);
					setCurrentGame(userData.games.find(game => game.active));
					setPreferences(userData.preferences);
				} else {
					console.log(user.uid);
					firestore.collection("users").doc(user.uid).set({
						games: [],
						preferences: {
							"default-winning-score": 50,
							"enter-by-total": true
						}
					})
				}
			})
		}
	}, [user])

	return (
		<Router>
			<Bar />
			<Container>
				<Route exact path="/">
					{
						currentGame === null ?
							<LoadingCircle /> :
							currentGame === undefined ?
								<Redirect to="/newgame" /> :
								<Score preferences={preferences} games={games} currentGame={currentGame} />
					}
				</Route>
				<Route path="/newgame">
					<NewGame games={games} currentGame={currentGame} preferences={preferences} />
				</Route>
				<Route path="/preferences">
					<Preference preferences={preferences} />
				</Route>
				<Route path="/history">
					<History preferences={preferences} games={games && games.filter(game => !game.active)} />
				</Route>
				<Route path="/new-round">
					<NewRound preferences={preferences} games={games} players={currentGame && currentGame.players} />
				</Route>
			</Container>
		</Router>
	);
}

export default App;
