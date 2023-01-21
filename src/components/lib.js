/** @jsx jsx */
import {jsx} from '@emotion/react'

import React from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import styled from '@emotion/styled'
import * as colors from 'styles/colors'
import { CoffeeIcon } from 'assets/icons'

function Button({variant, children, ...props}) {
  const buttonVariants = {
    primary: {
      background: colors.brown,
      color: colors.light,
    },
    primaryLightened: {
      background: colors.brown,
      color: colors.light,
    },
    black: {
      background: colors.black,
      color: colors.light,
    },
    white: {
      background: colors.light,
      color: colors.black,
    },
  }
  const AnimatedButton = styled(motion.button)(
    {
      padding: '10px 15px',
      border: '0',
      lineHeight: '1',
      borderRadius: '3px',
    },
    ({variant = 'primary'}) => buttonVariants[variant],
  )
  return (
    <AnimatedButton
      whileHover={{scale: 1.1}}
      whileTap={{scale: 0.9}}
      transition={{type: 'spring', stiffness: 400, damping: 17}}
      {...props}
    >{children}</AnimatedButton>
  )
}

function FullPageErrorFallback({error}) {
  return (
    <div
      role="alert"
      css={{
        color: colors.danger,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  )
}

function FullPageLoading({...props}){
  const Backdrop = styled(motion.div)({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${colors.brown}80`,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0

  })

  const Container = styled(motion.div)({
    width: '12rem',
    height: '12rem',
    backgroundColor: `${colors.light}`,
    borderRadius: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px'
  })
  return(
    <Backdrop initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} {...props}>
      <Container initial={{y: '-100vh'}} animate={{y: 0}} exit={{y:'100vh'}} transition={{type: 'spring', stiffness: 200, damping: 15, delay: 0.5}}>
        <CoffeeIcon size={80} animation={true} loop={true} />
        <div css={{textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold'}}>Loading...</div>
      </Container>
    </Backdrop>
  )
}
export {Button, FullPageErrorFallback, FullPageLoading}
