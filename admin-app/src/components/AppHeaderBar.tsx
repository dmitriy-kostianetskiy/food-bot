
import React, { PropsWithChildren, useState } from 'react'
import { AppBar, Toolbar, Typography, makeStyles, Theme, createStyles, Button, Box, IconButton, Snackbar } from '@material-ui/core'
import { Home, Add, RestaurantMenu } from '@material-ui/icons'
import { useHistory, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      flex: 0,
      display: 'flex'
    },
    box: {
      flex: 0,
      display: 'flex'
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
)

export default function AppHeaderBar(props: PropsWithChildren<{}>) {
  const classes = useStyles()
  const history = useHistory()
  const [auth, authState] = useAuth()

  const [showGenerateMenuToast, setShowGenerateMenuToast] = useState<'success' | 'error'>()

  const handleLogout = () => {
    const logout = async () => {
      await auth.signOut()

      history.push('/login')
    }

    logout()
  }

  const handleGenerateMenu = async () => {
    try {
      const response = await fetch('https://europe-west3-generate-menu.cloudfunctions.net/generateMenuHttps')

      setShowGenerateMenuToast(response.ok ? 'success' : 'error')
    } catch (e) {
      console.error(e)

      setShowGenerateMenuToast('error')
    }
  }

  const handleCloseAlert = () => setShowGenerateMenuToast(undefined)

  const toolbar = (
    <Box className={classes.box}>
      {props.children}
      <IconButton className={classes.menuButton} color="inherit" component={Link} to="/" title="Home">
        <Home />
      </IconButton>
      <IconButton className={classes.menuButton} color="inherit" onClick={() => handleGenerateMenu()} title="Generate new menu">
        <RestaurantMenu />
      </IconButton>
      <IconButton className={classes.menuButton} color="inherit" component={Link} to="/recipe/new" title="Create new recipe">
        <Add />
      </IconButton>
      <Button color="inherit" onClick={handleLogout}>Logout</Button>
    </Box>
  )

  const getAlert = () => {
    switch (showGenerateMenuToast) {
      case 'success':
        return (<Alert onClose={handleCloseAlert} severity="success">The new menu has been generated!</Alert>)
      case 'error':
        return (<Alert onClose={handleCloseAlert} severity="error">Unable to generate new menu!</Alert>)
      default:
        return undefined
    }
  }

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Box className={classes.title}>
          <Button className={classes.title} color="inherit" component={Link} to="/">
            <Typography variant="h6">Recipes Bot admin panel</Typography>
          </Button>
        </Box>
        { !authState.pending && authState.isSignedIn && toolbar }
      </Toolbar>
      <Snackbar open={!!showGenerateMenuToast} autoHideDuration={6000} onClose={handleCloseAlert}>
        {getAlert()}
      </Snackbar>
    </AppBar>
  )
}
