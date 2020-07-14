
import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles, Theme, createStyles, Button, Box, IconButton } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import { useHistory, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      flex: 0,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1
    }
  }),
);

export default function AppHeaderBar() {
  const classes = useStyles();
  const history = useHistory();
  const [auth, authState] = useAuth();

  const handleLogout = () => {
    const logout = async () => {
      await auth.signOut();
  
      history.push('/login');
    }

    logout();
  }

  const toolbar = (
    <Box>
      <IconButton className={classes.menuButton} color="inherit" component={Link} to="/">
        <HomeIcon />
      </IconButton>
      <IconButton className={classes.menuButton} color="inherit" component={Link} to="/recipe/new">
        <AddIcon />
      </IconButton>
      <Button color="inherit" onClick={handleLogout}>Logout</Button>
    </Box>
  );

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>MenuBot admin panel</Typography>
        { !authState.pending && authState.isSignedIn && toolbar }
      </Toolbar>
    </AppBar>
  );
}
