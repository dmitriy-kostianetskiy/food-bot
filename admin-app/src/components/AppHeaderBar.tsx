
import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

export default function AppHeaderBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">MenuBot admin panel</Typography>
      </Toolbar>
    </AppBar>
  );
}
