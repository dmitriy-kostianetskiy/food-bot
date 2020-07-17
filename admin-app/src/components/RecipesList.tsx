import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListItem, ListItemText, Typography, Box, Container, ListSubheader } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { RecipeModel, Document } from '../model';

import './RecipesList.scss';

interface RecipeListProps {
  title: string;
  items: Document<RecipeModel>[]
}

export default function RecipesList(props: RecipeListProps) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = props.items[index];
    const link = `/recipe/${item.id}`;

    return (
      <ListItem button component={Link} to={link} style={style} key={item.id}>
        <ListItemText primary={item.data.main.title} secondary={item.data.side?.title} />
      </ListItem>
    );
  };

  return props.items.length
    ? (
      <Container className="container">
        <ListSubheader component="div">Reipes</ListSubheader>
        <Box className="box">
          <AutoSizer>
            {({ height, width }) => (
              <div>
                <FixedSizeList height={height} width={width} itemSize={50} itemCount={props.items.length}>
                {Row}
                </FixedSizeList>
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
