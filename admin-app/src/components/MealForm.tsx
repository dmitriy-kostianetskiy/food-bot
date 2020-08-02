import React from 'react'
import { FormControl, TextField, makeStyles, createStyles, Box, Theme } from '@material-ui/core'
import IngredientsForm from './IngredientsForm'
import { CategoryModel, IngredientModel, MealModel } from '../model'

interface Props {
  meal: MealModel;
  categories: CategoryModel[];
  form?: string;
  onChange: (meal: MealModel) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      display: 'flex',
      flexDirection: 'column'
    },
    formControl: {
      minWidth: 200,
      flex: 1,
      padding: theme.spacing(1)
    }
  })
)

export default function MealForm({ meal, categories, onChange }: Props) {
  const classes = useStyles()

  const handleTitleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange({
      ...meal,
      title: event.target.value as string
    })
  }

  const handleStepsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const steps = event.target.value as string

    onChange({
      ...meal,
      steps: steps?.split('\n')
    })
  }

  const handleDeleteIngredient = (ingredient: IngredientModel) => {
    onChange({
      ...meal,
      ingredients: meal.ingredients.filter(item => item !== ingredient)
    })
  }

  const handleAddIngredient = (ingredient: IngredientModel) => {
    onChange({
      ...meal,
      ingredients: [...meal.ingredients, ingredient]
    })
  }

  return (
    <Box>
      <Box className={classes.box}>
        <FormControl className={classes.formControl}>
          <TextField
            variant="outlined"
            label="Title"
            value={meal?.title}
            onChange={handleTitleChange} required/>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            required
            variant="outlined"
            label="Steps"
            multiline
            rows={8}
            value={meal?.steps.join('\n')}
            onChange={handleStepsChange}/>
        </FormControl>
      </Box>
      <IngredientsForm
        categories={categories}
        ingredients={meal?.ingredients}
        onDelete={handleDeleteIngredient}
        onAdd={handleAddIngredient}/>
    </Box>
  )
}
