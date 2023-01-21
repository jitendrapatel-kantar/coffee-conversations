/** @jsx jsx */
import {jsx} from '@emotion/react'

import * as React from 'react'
import * as auth from 'utils/auth'
import { Loginclient } from 'utils/api-client'
import {useAsync} from 'utils/hooks'
import {FullPageLoading, FullPageErrorFallback} from 'components/lib'
import {AnimatePresence} from 'framer-motion'

async function getUser() {
  let user = null

  const idtoken = await auth.getToken()
  if (idtoken) {
    user = await Loginclient({idtoken})
  }

  return user
}

const userPromise = getUser()

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
    status,
  } = useAsync()

  React.useEffect(() => {
    run(userPromise)
  }, [run])

  const login = React.useCallback(
    form => auth.login(form).then(user => setData(user)),
    [setData],
  )
  const logout = React.useCallback(() => {
    auth.logout()
    setData(null)
  }, [setData])

  const value = React.useMemo(
    () => ({user, login, logout}),
    [login, logout, user],
  )

  if (isLoading || isIdle) {
    return (
      <AnimatePresence>
        <FullPageLoading />
      </AnimatePresence>
    )
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export {AuthProvider, useAuth}
