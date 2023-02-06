/** @jsx jsx */
import {jsx} from '@emotion/react'

import {Routes, Route} from 'react-router-dom'
import {ErrorBoundary} from 'react-error-boundary'
import {FullPageErrorFallback, ErrorMessage} from 'components/lib'
import { AnimatePresence } from 'framer-motion'
import {Header} from 'components/Header'
import {NotFoundScreen} from 'screeens/not-found'
import {DashBoard} from 'screeens/dashboard'
import {AdminPanel} from 'screeens/admin-panel'
import {useAuth} from 'context/auth-context'
import { DateList } from 'screeens/date-list'
import { Date } from 'screeens/date'
import { CurrentDate } from 'screeens/current-date'
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
            padding: '5rem 1rem 1rem',
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AnimatePresence>
              <AppRoutes />
            </AnimatePresence>
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
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/previous-dates" element={<DateList />} />
      <Route path="/current-date" element={<CurrentDate />} />
      <Route path="/date/:dateID" element={<Date />} />
      <Route path="*" element={<NotFoundScreen />} />

    </Routes>
  )
}
export default AuthenticatedApp
