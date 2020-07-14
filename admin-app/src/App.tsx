import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './App.scss';

import AppHeaderBar from './components/AppHeaderBar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginView from './views/LoginView';
import EditRecipeView from './views/EditRecipeView';
import CreateRecipeView from './views/CreateRecipeView';
import RecipesView from './views/RecipesView';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <AppHeaderBar />
        </Route>
      </Switch>
        <Switch>
          <ProtectedRoute path="/recipe/new">
            <CreateRecipeView />
          </ProtectedRoute>
          <ProtectedRoute path="/recipe/:id">
            <EditRecipeView />
          </ProtectedRoute>
          <Route path="/login">
            <LoginView />
          </Route>
          <ProtectedRoute path="/">
            <RecipesView />
          </ProtectedRoute>
        </Switch>
    </Router>
  );
}

export default App;
