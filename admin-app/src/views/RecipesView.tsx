import React from 'react'
import { LinearProgress } from '@material-ui/core'
import RecipesList from '../components/RecipesList'
import Error from '../components/Error'
import ForbiddenError from '../components/ForbiddenError'

import useAllRecipes from '../hooks/useAllRecipes'
import useTitle from '../hooks/useTitle'

export default function RecipesView(props: { searchTerm: string }) {
  const recipes = useAllRecipes(props.searchTerm)

  useTitle('Recipes')

  switch (recipes) {
    case 'loading':
      return (<LinearProgress />)
    case 'error':
      return (<Error />)
    case 'forbidden':
      return (<ForbiddenError />)
    default:
      return (<RecipesList title="Recipes" items={recipes} />)
  }
}
