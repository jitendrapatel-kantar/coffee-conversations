import React from 'react'
import './App.css'
import {useAuth} from 'context/auth-context'
import {FullPageLoading} from 'components/lib'
import {AnimatePresence} from 'framer-motion'

const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ './authenticated-app'),
)
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  const {user} = useAuth()
  return (
    <React.Suspense
      fallback={
        <AnimatePresence>
          <FullPageLoading />
        </AnimatePresence>
      }
    >
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export default App
