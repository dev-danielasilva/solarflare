import * as React from 'react'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import FuseSplashScreen from '@fuse/core/FuseSplashScreen'
import { showMessage } from 'app/store/fuse/messageSlice'
import { logoutUser, setUser } from 'app/store/user/userSlice'
import { useAppDispatch } from 'app/store'
import { AxiosError } from 'axios'
import BaseUserType from 'app/store/user/BaseUserType'
import jwtService from './services/jwtService'

/**
 * The AuthContext object is a React context object that provides authentication information to child components.
 */
const AuthContext = React.createContext({})

type AuthProviderProps = { children: ReactNode }

/**
 * The AuthProvider component is a wrapper component that provides authentication information to child components.
 */
function AuthProvider(props: AuthProviderProps) {
  const { children } = props
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [waitAuthCheck, setWaitAuthCheck] = useState(true)
  const dispatch = useAppDispatch()
  const val = useMemo(() => ({ isAuthenticated }), [isAuthenticated])

  useEffect(() => {
    jwtService.on('onAutoLogin', () => {
      //   dispatch(showMessage({ message: 'Signing in with JWT' }))

      /**
       * Sign in and retrieve user data with stored token
       */
      // This method would trigger the call to the sign in endpoint, the default one set.
      // Keeping in case we need to revert.
      // jwtService
      // 	.signInWithToken()
      // 	.then((user) => {
      // 		success(user as UserType, 'Signed in with JWT');
      // 	})
      // 	.catch((error: AxiosError) => {
      // 		console.log('Here is the problem!')
      // 		pass(error.message);
      // 	});
      jwtService
        .verifyToken()
        .then((user: BaseUserType) => {
          //   success(user, 'Signed in with JWT')
          success(user, '')
        })
        .catch((error: AxiosError) => {
          //   pass(error.message)
          pass('')
        })
    })

    jwtService.on('onLogin', (user: BaseUserType) => {
      // success(user, 'Signed in'); // Use this if you want to show the toast
      success(user, '')
    })

    jwtService.on('onLogout', () => {
      //   pass('Signed out')
      pass('')

      dispatch(logoutUser())
    })

    jwtService.on('onAutoLogout', (message: string) => {
      //   pass(message)
      pass('')

      dispatch(logoutUser())
    })

    jwtService.on('onNoAccessToken', () => {
      pass()
    })

    jwtService.init()

    function success(user: BaseUserType, message: string) {
      Promise.all([
        dispatch(setUser(user)),

        // You can receive data in here before app initialization
      ]).then(() => {
        if (message) {
          dispatch(showMessage({ message }))
        }

        setWaitAuthCheck(false)
        setIsAuthenticated(true)
      })
    }

    function pass(message?: string) {
      if (message) {
        dispatch(showMessage({ message }))
      }

      setWaitAuthCheck(false)
      setIsAuthenticated(false)
    }
  }, [dispatch])

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={val}>{children}</AuthContext.Provider>
  )
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}

export { useAuth, AuthProvider }
