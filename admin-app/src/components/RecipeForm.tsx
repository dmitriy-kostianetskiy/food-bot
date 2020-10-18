import React, { useState } from 'react'
import MealForm from '../components/MealForm'
import { RecipeModel, MealModel, CategoryModel, MealKind } from '../model'
import { Box, FormControl, TextField, Switch, FormControlLabel, makeStyles, Theme, createStyles, InputLabel, Select, MenuItem } from '@material-ui/core'
import { createMeal } from '../recipe.helper'

interface Props {
  recipe: RecipeModel;
  categories: CategoryModel[];
  onChange: (recipe: RecipeModel) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      paddingTop: theme.spacing(2)
    },
    formControl: {
      minWidth: 200,
      flex: 1,
      padding: theme.spacing(1)
    }
  })
)

export default function RecipeForm({ categories, recipe, onChange }: Props) {
  const classes = useStyles()

  const [showSide, setShowSide] = useState(!!recipe.side)

  const handleReadyInChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange({
      ...recipe,
      readyIn: event.target.value as string
    })
  }

  const handleMealKindChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange({
      ...recipe,
      mealKind: event.target.value as MealKind
    })
  }

  const handleShowSideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!recipe.side) {
      onChange({
        ...recipe,
        side: createMeal()
      })
    }

    setShowSide(event.target.checked)
  }

  return (
    <Box className={classes.box}>
      <FormControl className={classes.formControl}>
        <TextField
          required
          variant="outlined"
          label="Ready in"
          value={recipe.readyIn}
          onChange={handleReadyInChange}/>
      </FormControl>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="meal-kind-label">Meal kind</InputLabel>
        <Select
          labelId="meal-kind-label"
          value={recipe.mealKind}
          onChange={handleMealKindChange}
          label="Meal kind">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="beef">Beef</MenuItem>
          <MenuItem value="pork">Pork</MenuItem>
          <MenuItem value="poultry">Poultry</MenuItem>
          <MenuItem value="vegetarian">Vegetarian</MenuItem>
        </Select>
      </FormControl>
      <MealForm
        meal={recipe.main}
        categories={categories}
        onChange={(main: MealModel) => onChange({ ...recipe, main })}/>
      <FormControl className={classes.formControl}>
        <FormControlLabel
          control={<Switch checked={showSide} onChange={handleShowSideChange} />}
          label="Side dish"/>
      </FormControl>
      {
        recipe.side && showSide && (
          <MealForm
            meal={recipe.side}
            categories={categories}
            onChange={(side: MealModel) => onChange({ ...recipe, side })}/>
        )
      }
    </Box>
  )
}
