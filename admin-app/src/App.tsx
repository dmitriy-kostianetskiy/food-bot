import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import AppHeaderBar from './components/AppHeaderBar'
import SearchBox from './components/SearchBox'
import ProtectedRoute from './components/ProtectedRoute'

import LoginView from './views/LoginView'
import EditRecipeView from './views/EditRecipeView'
import CreateRecipeView from './views/CreateRecipeView'
import RecipesView from './views/RecipesView'
import HomeView from './views/HomeView'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Router>
      <Switch>
        <Route path="/recipes">
          <AppHeaderBar>
            <SearchBox
              searchTerm={searchTerm}
              onSearchTermChange={value => setSearchTerm(value)}/>
          </AppHeaderBar>
        </Route>
        <Route path="/">
          <AppHeaderBar></AppHeaderBar>
        </Route>
      </Switch>
      <Switch>
        <Route path="/home">
          <HomeView />
        </Route>
        <Route path="/login">
          <LoginView />
        </Route>
        <ProtectedRoute path="/recipe/new">
          <CreateRecipeView />
        </ProtectedRoute>
        <ProtectedRoute path="/recipe/:id">
          <EditRecipeView />
        </ProtectedRoute>
        <ProtectedRoute path="/recipes">
          <RecipesView searchTerm={searchTerm}/>
        </ProtectedRoute>
        <Redirect to="home" />
      </Switch>
    </Router>
  )
}
