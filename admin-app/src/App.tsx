import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './App.scss';

import AppHeaderBar from './components/AppHeaderBar';

import Home from './views/Home';
import Recipe from './views/Recipe';

function App() {
  return (
    <main>
      <AppHeaderBar />
      <section className="content">
        <Router>
          <Switch>
            <Route path="/recipe/:id" children={<Recipe />}/>
            <Route path="/"><Home /></Route>
          </Switch>
        </Router>
      </section>
    </main>
  );
}

export default App;
