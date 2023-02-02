/** @jsx jsx */
import {jsx} from '@emotion/react'

import {Routes, Route, Link, useMatch} from 'react-router-dom'
import {ErrorBoundary} from 'react-error-boundary'
import {FullPageErrorFallback, ErrorMessage} from 'components/lib'

import {Header} from 'components/Header'
import {NotFoundScreen} from 'screeens/not-found'
import {DashBoard} from 'screeens/dashboard'
import {AdminPanel} from 'screeens/admin-panel'
import {useAuth} from 'context/auth-context'
import * as colors from 'styles/colors'

function ErrorFallback({error}) {
  return (
    <ErrorMessage
      error={error}
      css={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )
}

function AuthenticatedApp() {
  const user = useAuth()
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <div>
        <Header user={user} />
        <main
          css={{
            width: '100%',
            height: '100%',
            padding: '5rem 1rem 0',
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="*" element={<NotFoundScreen />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  )
}
export default AuthenticatedApp
