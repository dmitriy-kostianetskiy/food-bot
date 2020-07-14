import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListItem, ListItemText, Typography, Container, Box, makeStyles, Theme, createStyles, ListSubheader, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { RecipeModel } from '../model/recipe-model';

interface RecipeListProps {
  title: string;
  items: { id: string; data: RecipeModel;}[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      flex: 1
    },
    listItem: {
      borderTop: '1px solid',
      borderColor: theme.palette.divider
    }
  })
);

export default function RecipeList(props: RecipeListProps) {
  const classes = useStyles();

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = props.items[index];
    const link = `/recipe/${item.id}`;

    console.log(index)

    return (
      <ListItem button component={Link} to={link} style={style} key={item.id} className={classes.listItem}>
        <ListItemText primary={item.data.main.title} secondary={item.data.side?.title} />
      </ListItem>
    );
  };

  return (
    <Container className={classes.container}>
      {
        props.items.length
        ? (
          <div>
            <ListSubheader component="div">Reipes</ListSubheader>
            <AutoSizer>
              {({ height, width }) => (
                <div>
                  <FixedSizeList height={height} width={width} itemSize={48} itemCount={props.items.length}>
                  {Row}
                  </FixedSizeList>
                </div>
              )}
            </AutoSizer>
          </div>
          )
        : (
          <Typography variant="h5">Oops! No recipes</Typography>
        )
      }
      
    </Container>
  );
}
