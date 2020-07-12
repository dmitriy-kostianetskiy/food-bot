import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListItem, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { RecipeModel } from '../model/recipe-model';

interface RecipeListProps {
  title: string;
  items: RecipeModel[];
}

export default function RecipeList(props: RecipeListProps) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = props.items[index];
    const link = `/recipe/${index.toString()}`

    return (
      <ListItem button component={Link} to={link} style={style} key={item.title}>
        <ListItemText primary={item.title} />
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
