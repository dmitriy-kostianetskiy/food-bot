import React from 'react';
import { RecipeModel } from '../model/recipe-model';
import { FormControl, InputLabel, Select, MenuItem, TextField, Typography, makeStyles, Theme, createStyles, Box, Container, Button } from '@material-ui/core';
import IngredientsForm from './IngredientsForm';
import { IngredientModel } from '../model/ingredient-model';
import { CategoryModel } from '../model/category-model';

interface RecipeFormProps {
  title: string;
  recipe: RecipeModel;
  categories: CategoryModel[];
  onSave: (recipe: RecipeModel) => void;
  onDelete: (recipe: RecipeModel) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      }
    },
    formControl: {
      minWidth: 200,
      flex: 1
    }
  })
);

export default function RecipeForm(props: RecipeFormProps) {
  const classes = useStyles();

  const [title, setTitle] = React.useState(props.recipe.title);
  const handleTitleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTitle(event.target.value as string);
  };

  const [readyIn, setReadyIn] = React.useState(props.recipe.readyIn);
  const handleReadyInChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setReadyIn(event.target.value as number);
  };

  const [steps, setSteps] = React.useState(props.recipe.steps.join('\n'));
  const handleStepsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSteps(event.target.value as string);
  };

  const [ingredients, setIngredients] = React.useState(props.recipe.ingredients);
  const handleDeleteIngredient = (ingredient: IngredientModel) => {
    setIngredients((prevState: IngredientModel[]) => prevState.filter(item => item !== ingredient));
  };

  const handleAddIngredient = (ingredient: IngredientModel) => {
    setIngredients((prevState: IngredientModel[]) => [...prevState, ingredient]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    props.onSave(props.recipe);
  };

  const handleDelete = () => {
    props.onDelete(props.recipe);
  };

  const toSelectLabel = (value: number) => {
    const minutes = value % 60;
    const hours = (value - minutes) / 60;

    return [
      hours ? `${hours.toFixed(0)} ${hours === 1 ? 'hour' : 'hours'}` : '',
      minutes ? `${minutes.toFixed(0)} ${minutes === 1 ? 'minute' : 'minutes'}` : ''
    ].join(' ');
  }

  return (
    <Container>
      <form id="recipe-form" onSubmit={handleSubmit}>
      </form>
      <Box className={classes.box}>
        <Typography variant="h4">{props.title}</Typography>
      </Box>
      <Box className={classes.box}>
        <Typography variant="h5">Recipe and steps</Typography>
      </Box>
      <Box className={classes.box}>
        <FormControl className={classes.formControl}>
          <TextField id="title-input" label="Title" value={title} onChange={handleTitleChange} required/>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="ready-in-label">Ready in</InputLabel>
          <Select
            labelId="ready-in-label"
            id="ready-in-select"
            value={readyIn}
            onChange={handleReadyInChange}>
            {
              Array.from(Array(12)).map((value, index) => (index + 1) * 15)
                .map(value => <MenuItem value={value} key={value}>{toSelectLabel(value)}</MenuItem>)
            }
          </Select>
        </FormControl>
      </Box>
      <Box className={classes.box}>
        <FormControl className={classes.formControl}>
          <TextField
            id="steps-input"
            label="Steps"
            multiline
            rows={8}
            value={steps}
            onChange={handleStepsChange}/>
        </FormControl>
      </Box>
      <IngredientsForm
        title="Ingredients"
        categories={props.categories}
        ingredients={ingredients}
        onDelete={handleDeleteIngredient}
        onAdd={handleAddIngredient}/>
      <Box className={classes.box}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          form="recipe-form">
          Save
        </Button>
        {
          props.onDelete &&
          <Button
            variant="contained"
            color="secondary"
            form="recipe-form"
            onClick={handleDelete}>
            Delete
          </Button>
        }
      </Box>
    </Container>
  );
}
