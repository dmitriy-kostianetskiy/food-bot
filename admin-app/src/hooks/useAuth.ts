import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { User } from 'firebase'

export interface AuthState {
  isSignedIn: boolean;
  pending: boolean;
  user: User | null;
}

export default function useAuth(): [firebase.auth.Auth, AuthState] {
  const [authState, setAuthState] = useState<AuthState>({
    isSignedIn: false,
    pending: true,
    user: null
  })

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user =>
      setAuthState({ user, pending: false, isSignedIn: !!user })
    )

    return () => unregisterAuthObserver()
  }, [])

  return [auth, authState]
}
