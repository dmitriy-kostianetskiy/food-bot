import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListItem, ListItemText, Typography, Box, Container, ListSubheader, makeStyles, Theme, createStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso'

import { RecipeModel, Document } from '../model';

import './RecipesList.scss';

interface RecipeListProps {
  title: string;
  items: Document<RecipeModel>[]
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column'
    }
  })
);

export default function RecipesList(props: RecipeListProps) {
  const classes  = useStyles();

  const Row = (index: number) => {
    const item = props.items[index];
    const link = `/recipe/${item.id}`;

    return (
      <ListItem button component={Link} to={link} key={item.id}>
        <ListItemText primary={item.data.main.title} secondary={item.data.side?.title} />
      </ListItem>
    );
  };

  return props.items.length
    ? (
      <Container className={classes.container}>
        <ListSubheader component="div">Recipes</ListSubheader>
        <Box className="box">
          <AutoSizer>
            {({ height, width }) => (
              <div>
                <Virtuoso
                  style={{ width: width, height: height }}
                  totalCount={props.items.length}
                  item={index => Row(index)} />
              </div>
            )}
          </AutoSizer>
        </Box>
      </Container>
      )
    : (
      <Typography variant="h5">Oops! No recipes</Typography>
    );
}
