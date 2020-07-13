
import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles, Theme, createStyles, Button, Box } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
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
      <Button color="inherit" component={Link} to="/recipe/new">Create recipe</Button>
      <Button color="inherit" onClick={handleLogout}>Logout</Button>
    </Box>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6">MenuBot admin panel</Typography>
          { !authState.pending && authState.isSignedIn && toolbar }
        </Toolbar>
      </AppBar>
    </div>
  );
}
