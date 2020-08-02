import React, { PropsWithChildren } from 'react'
import {
  Route,
  Redirect,
  RouteProps
} from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { LinearProgress } from '@material-ui/core'

export default function ProtectedRoute({ children, ...rest }: PropsWithChildren<RouteProps>) {
  const [, authState] = useAuth()

  if (authState.pending) {
    return (<LinearProgress />)
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authState.isSignedIn ? (children) : (<Redirect to={{ pathname: '/login', state: { from: location } }}/>)
      }
    />
  )
}
