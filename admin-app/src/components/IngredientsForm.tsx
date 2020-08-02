import React, { useState } from 'react'
import { IngredientModel } from '../model/ingredient-model'
import { CategoryModel } from '../model/category-model'
import { Add, Delete } from '@material-ui/icons'
import { List, Box, ListItemSecondaryAction, IconButton, Button, Divider, ListItemText, ListItem, TextField, FormControl, Theme, createStyles, makeStyles, ListSubheader } from '@material-ui/core'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'

interface IngredientsFormProps {
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
    form: {
      display: 'flex',
      flexDirection: 'column'
    },
    box: {
      display: 'flex',
      flex: 1,
      paddingLeft: theme.spacing(1)
    },
    list: {
      width: '100%'
    },
    formControl: {
      paddingRight: theme.spacing(1),
      minWidth: 200,
      flex: 1
    }
  })
)

export default function IngredientsForm(props: IngredientsFormProps) {
  const classes = useStyles()

  const suggestions: Suggestion[] = props.categories.flatMap(category => category.ingredients.map(ingredient => ({
    title: ingredient,
    group: category.title
  })))

  const getSecondaryLine = (ingredient: IngredientModel) => {
    if (!ingredient.amount) {
      return null
    }

    return ingredient.unit ? `${ingredient.amount} ${ingredient.unit}` : `${ingredient.amount}`
  }

  const [title, setTitle] = useState('')
  const handleTitleChange = (event: React.ChangeEvent<{}>, value: string | Suggestion | null) => {
    if (typeof value === 'string') {
      setTitle(value)
    } else {
      setTitle(value?.title || '')
    }
  }

  const [amount, setAmount] = useState('')
  const handleAmountChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAmount(event.target.value as string)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const [amountPart, unitPart] = amount.split(' ')
    const numericAmount = +amountPart

    const ingredient: IngredientModel = isFinite(numericAmount)
      ? {
        title,
        amount: numericAmount,
        unit: unitPart || ''
      }
      : {
        title
      }

    props.onAdd(ingredient)

    setAmount('')
    setTitle('')
  }

  return (
    <form className={classes.form} id="ingredients-form" onSubmit={handleSubmit}>
      <Box className={classes.box}>
        <List className={classes.list} subheader={<ListSubheader component="div" style={{ paddingLeft: 0 }}>Ingredients</ListSubheader>}>
          {
            props.ingredients.map((ingredient, index) =>
              <Box key={ingredient.title}>
                <Divider component="li" />
                <ListItem key={index}>
                  <ListItemText
                    primary={ingredient.title}
                    secondary={getSecondaryLine(ingredient)}/>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => props.onDelete(ingredient)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                { index === props.ingredients.length - 1 && <Divider component="li" /> }
              </Box>
            )
          }
        </List>
      </Box>
      <Box className={classes.box}>
        <FormControl className={classes.formControl} >
          <Autocomplete
            size="small"
            options={suggestions}
            getOptionLabel={(suggestion: Suggestion) => suggestion?.title || '' }
            groupBy={(suggestion: Suggestion) => suggestion.group}
            freeSolo={true}
            inputValue={title}
            renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} variant="outlined" label="Ingredient"/>}
            onChange={handleTitleChange}
            onInputChange={handleTitleChange}/>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            size="small"
            variant="outlined"
            label="Amount"
            value={amount}
            onChange={handleAmountChange}/>
        </FormControl>
      </Box>
      <Box className={classes.box}>
        <Button
          type="submit"
          disabled={!title}
          color="primary">
          <Add /> Add ingredient
        </Button>
      </Box>
    </form>
  )
}
