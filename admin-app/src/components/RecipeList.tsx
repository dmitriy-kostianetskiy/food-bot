import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { RecipeModel } from '../model/recipe-model';

interface RecipeListProps {
  title: string;
  items: { id: string; data: RecipeModel;}[]
}

export default function RecipeList(props: RecipeListProps) {
  if (!props.items.length) {
    return (
      <Typography variant="h5">Oops! No recipes</Typography>
    );
  }

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = props.items[index];
    const link = `/recipe/${item.id}`

    return (
      <ListItem button component={Link} to={link} style={style} key={item.id}>
        <ListItemText primary={item.data.main.title} secondary={item.data.side?.title} />
      </ListItem>
    )
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList height={height} width={width} itemSize={46} itemCount={props.items.length}>
        {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}
