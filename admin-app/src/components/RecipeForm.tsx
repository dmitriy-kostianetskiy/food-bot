import React, { useState } from 'react';
import MealForm from '../components/MealForm';
import { RecipeModel, MealModel, CategoryModel } from '../model';
import { Box, FormControl, TextField, Switch, FormControlLabel, makeStyles, Theme, createStyles } from '@material-ui/core';
import { createMeal } from '../recipe.helper';

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
);

export default function RecipeForm({ categories, recipe, onChange }: Props) {
  const classes = useStyles();

  const [showSide, setShowSide] = useState(!!recipe.side);

  const handleReadyInChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange({
      ...recipe,
      readyIn: event.target.value as string
    });
  };

  const handleShowSideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!recipe.side) {
      onChange({
        ...recipe,
        side: createMeal()
      });
    }

    setShowSide(event.target.checked);
  };

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
  );
}
