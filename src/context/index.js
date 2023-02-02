import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthProvider} from './auth-context'
import {GoogleOAuthProvider} from '@react-oauth/google'

function AppProviders({children}) {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId="22176436387-p9t2i4vsd9r1au57ji7op6v7lnbh13bf.apps.googleusercontent.com">
        <Router>{children}</Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  )
}

export {AppProviders}
