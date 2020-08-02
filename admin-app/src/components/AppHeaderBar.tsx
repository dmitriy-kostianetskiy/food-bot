
import React, { PropsWithChildren } from 'react'
import { AppBar, Toolbar, Typography, makeStyles, Theme, createStyles, Button, Box, IconButton, InputBase, fade } from '@material-ui/core'
import { Home, Add, Search, RestaurantMenu } from '@material-ui/icons'
import { useHistory, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

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
    },
    search: {
      height: '36px',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      alignSelf: 'center',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto'
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch'
      }
    }
  })
)

export default function AppHeaderBar(props: PropsWithChildren<{
  searchTerm: string,
  onSearchTermChange: (value: string) => void
}>) {
  const classes = useStyles()
  const history = useHistory()
  const [auth, authState] = useAuth()

  const handleLogout = () => {
    const logout = async () => {
      await auth.signOut()

      history.push('/login')
    }

    logout()
  }

  const handleGenerateMenu = async () => {
    // TODO: add toast
    await fetch('https://europe-west3-generate-menu.cloudfunctions.net/generateMenuHttps', {
      mode: 'no-cors'
    })
  }

  const toolbar = (
    <Box className={classes.box}>
      {props.children}
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <Search />
        </div>
        <InputBase
          placeholder="Search…"
          value={props.searchTerm}
          onChange={event => props.onSearchTermChange(event.target.value)}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
        />
      </div>
      <IconButton className={classes.menuButton} color="inherit" component={Link} to="/">
        <Home />
      </IconButton>
      <IconButton className={classes.menuButton} color="inherit" onClick={() => handleGenerateMenu()}>
        <RestaurantMenu />
      </IconButton>
      <IconButton className={classes.menuButton} color="inherit" component={Link} to="/recipe/new">
        <Add />
      </IconButton>
      <Button color="inherit" onClick={handleLogout}>Logout</Button>
    </Box>
  )

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Box className={classes.title}>
          <Button className={classes.title} color="inherit" component={Link} to="/">
            <Typography variant="h6">MenuBot admin panel</Typography>
          </Button>
        </Box>

        { !authState.pending && authState.isSignedIn && toolbar }
      </Toolbar>
    </AppBar>
  )
}
