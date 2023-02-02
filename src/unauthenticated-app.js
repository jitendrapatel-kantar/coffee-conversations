/** @jsx jsx */
import {jsx} from '@emotion/react'

import React from 'react'
import styled from '@emotion/styled'
import * as colors from 'styles/colors'
import {CoffeeIcon} from 'assets/icons'
import {motion} from 'framer-motion'
import {GoogleLogin} from '@react-oauth/google'
import { useAuth } from 'context/auth-context'

function UnauthenticatedApp() {
  const {login} = useAuth()
  return (
    <Container>
      <motion.div>
        <CoffeeIcon size={80} animation={true} />
        <h1>Coffee Conversations</h1>
      </motion.div>
      <motion.div
        initial={{opacity: 0}}
        animate={{scale: 1.4, opacity: 1}}
      >
        <GoogleLogin
          onSuccess={credentialResponse => login({idtoken: credentialResponse.credential})}
          onError={(error) => {
            console.log('Login Failed', error)
          }}
          size="medium"
          theme="filled_black"
        />
      </motion.div>
    </Container>
  )
}

const Container = styled.div({
  height: '100%',
  backgroundColor: colors.white,
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  justifyContent: 'center',
  alignItems: 'center',
  '& > div': {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
})

// const HeadingContainer = styled.div({
//     display: 'flex',

// })

export default UnauthenticatedApp
