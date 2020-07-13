import React, { useState } from 'react';
import { IngredientModel } from '../model/ingredient-model';
import { CategoryModel } from '../model/category-model';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { List, Typography, Box, ListItemSecondaryAction, IconButton, ListItemText, ListItem, TextField, FormControl, Theme, createStyles, makeStyles } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';

interface IngredientsFormProps {
  title: string;
  ingredients: IngredientModel[];
  categories: CategoryModel[];
  onAdd: (model: IngredientModel) => void;
  onDelete: (model: IngredientModel) => void;
}

interface Suggestion {
  title: string;
  group: string;
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

export default function IngredientsForm(props: IngredientsFormProps) {
  const classes = useStyles();

  const suggestions: Suggestion[] = props.categories.flatMap(category => category.ingredients.map(ingredient => ({
    title: ingredient,
    group: category.title
  })));

  const getSecondaryLine = (ingredient: IngredientModel) => {
    if (!ingredient.amount) {
      return null;
    }

    return ingredient.unit ? `${ingredient.amount} ${ingredient.unit}` : `${ingredient.amount}`;
  }

  const [title, setTitle] = useState('');
  const handleTitleChage = (event: React.ChangeEvent<{}>, value: string | Suggestion | null) => {
    if (typeof value === 'string') {
      setTitle(value);
    } else {
      setTitle(value?.title || '');
    }
  };

  const [amount, setAmount] = useState('');
  const handleAmountChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAmount(event.target.value as string);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const [amountPart, unitPart] = amount.split(' ');
    const numericAmount = +amountPart;

    const ingredient: IngredientModel = isFinite(numericAmount)
      ? {
        title,
        amount: numericAmount,
        unit: unitPart || ''
      }
      : {
        title
      };

    props.onAdd(ingredient);

    setAmount('');
    setTitle('');
  };

  return (
    <form id="ingredients-form" onSubmit={handleSubmit}>
      <Box className={classes.box}>
        <Typography variant="h5">{props.title}</Typography>
      </Box>
      <Box className={classes.box}>
        <FormControl className={classes.formControl}>
          <Autocomplete
            size="small"
            options={suggestions}
            getOptionLabel={(suggestion: Suggestion) => suggestion?.title || '' }
            groupBy={(suggestion: Suggestion) => suggestion.group}
            freeSolo={true}
            inputValue={title}
            renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Ingredient"/>}
            onChange={handleTitleChage}
            onInputChange={handleTitleChage}/>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            size="small"
            label="Amount"
            value={amount}
            onChange={handleAmountChange}/>
        </FormControl>
        <IconButton 
          type="submit"
          disabled={!title}
          color="primary">
          <AddIcon />
        </IconButton>
      </Box>
      <Box className={classes.box}>
        <List>
          {
            props.ingredients.map((ingredient, index) =>
              <ListItem key={index}>
                <ListItemText
                  primary={ingredient.title}
                  secondary={getSecondaryLine(ingredient)}/>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => props.onDelete(ingredient)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          }
        </List>
      </Box>
    </form>
  );
}
