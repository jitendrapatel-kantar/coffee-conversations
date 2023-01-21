import React from 'react'
import './App.css'
import {UnauthenticatedApp} from 'unauthenticated-app'
import {AuthenticatedApp} from 'authenticated-app'
import {useAuth} from 'context/auth-context'
import {FullPageLoading} from 'components/lib'

function App() {
  const {user} = useAuth()
  return (
    <React.Suspense fallback={<FullPageLoading />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>

  )
}

export default App
