import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import AppHeaderBar from './components/AppHeaderBar'
import ProtectedRoute from './components/ProtectedRoute'

import LoginView from './views/LoginView'
import EditRecipeView from './views/EditRecipeView'
import CreateRecipeView from './views/CreateRecipeView'
import RecipesView from './views/RecipesView'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Router>
      <Switch>
        <Route path="/">
          <AppHeaderBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}/>
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
        <ProtectedRoute path="/recipes">
          <RecipesView searchTerm={searchTerm}/>
        </ProtectedRoute>
        <Redirect to="recipes" />
      </Switch>
    </Router>
  )
}
