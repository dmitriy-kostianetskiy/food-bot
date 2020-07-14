import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListItem, ListItemText, Typography, Container, Box, makeStyles, Theme, createStyles, ListSubheader, Divider, FormHelperText } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { RecipeModel } from '../model/recipe-model';

interface RecipeListProps {
  title: string;
  items: { id: string; data: RecipeModel;}[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column'
    },
    box: {
      display: 'flex',
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

    return (
      <ListItem button component={Link} to={link} style={style} key={item.id} className={classes.listItem}>
        <ListItemText primary={item.data.main.title} secondary={item.data.side?.title} />
      </ListItem>
    );
  };

  return props.items.length
    ? (
      <Container className={classes.container}>
        <ListSubheader component="div">Reipes</ListSubheader>
        <Box className={classes.box}>
          <AutoSizer>
            {({ height, width }) => (
              <div>
                <FixedSizeList height={height} width={width} itemSize={48} itemCount={props.items.length}>
                {Row}
                </FixedSizeList>
              </div>
            )}
          </AutoSizer>
        </Box>
      </Container>
      )
    : (
      <Container className={classes.container}>
        <Typography variant="h5">Oops! No recipes</Typography>
      </Container>
    );
}
