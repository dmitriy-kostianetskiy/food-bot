import React, { useEffect } from 'react';
import { Box, Button } from '@material-ui/core';
import firebase from 'firebase';
import { useHistory } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function LoginView() {
  const history = useHistory();
  const [auth, authState] = useAuth();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const { user } = await auth.getRedirectResult();

        if (user) {
          history.push('/');
        }

      } catch (error) {
        console.error(error);
      }
    }

    handleRedirect();
  });

  const handleLoginClick = () => {
    const redirect = async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      await auth.signInWithRedirect(provider);
    };

    redirect();
  }

  return (
    <Box>
      {
        !authState.pending && !authState.isSignedIn && <Button onClick={handleLoginClick}>Login with google</Button>
      }
    </Box>
  );
}
