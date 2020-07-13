import React, { PropsWithChildren } from 'react';
import {
  Route,
  Redirect,
  RouteProps
} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Box } from '@material-ui/core';

export default function ProtectedRoute({ children, ...rest }: PropsWithChildren<RouteProps>) {
  const [, authState] = useAuth();

  if (authState.pending) {
    return (<Box>Signing in...</Box>)
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authState.isSignedIn ? (children) : (<Redirect to={{ pathname: "/login", state: { from: location }}}/>)
      }
    />
  );
}
