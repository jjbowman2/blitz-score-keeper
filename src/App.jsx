import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Bar from './Bar';
import Score from './Score';
import NewGame from './NewGame';
import Preference from './Preferences';
import History from './History';
import { Container } from '@material-ui/core';
import UserProvider from './providers/UserProvider';

const App = (props) => {
  const [currentGame, setCurrentGame] = useState(null);

  return (
    <UserProvider>
      <Router>
        <Bar />
        <Container>
          <Route exact path="/">
            {
              currentGame ?
                <Score currentGame={currentGame} setCurrentGame={setCurrentGame} /> :
                <Redirect to="/newgame" />
            }
          </Route>
          <Route path="/newgame">
            <NewGame setCurrentGame={setCurrentGame} />
          </Route>
          <Route path="/preferences">
            <Preference />
          </Route>
          <Route path="/history">
            <History />
          </Route>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
