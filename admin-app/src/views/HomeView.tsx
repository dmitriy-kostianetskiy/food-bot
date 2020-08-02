import React from 'react'
import { Container, Box, Card, CardContent, Typography, CardActions, Button, makeStyles, Theme, createStyles } from '@material-ui/core'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(2)
    },
    box: {
      height: '100%'
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      marginRight: theme.spacing(2),
      minWidth: '300px'
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },
    cardActions: {
      display: 'flex',
      flex: 0
    }
  })
)

export default function HomeView() {
  const classes = useStyles()

  return (
    <Container className={classes.container}>
      <Box display="flex" justifyContent="center" paddingTop="20px">
        <Card className={classes.card} variant="outlined">
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" component="h2">
              All recipes
            </Typography>
            <Typography variant="body2" component="p">
              View all my recipes
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button size="small" color="primary" component={Link} to={'recipes'}>Go</Button>
          </CardActions>
        </Card>
        <Card className={classes.card} variant="outlined">
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" component="h2">
              Create new recipe
            </Typography>
            <Typography variant="body2" component="p">
              Create new recipe
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button size="small" color="primary" component={Link} to={'recipe/new'}>Go</Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  )
}
