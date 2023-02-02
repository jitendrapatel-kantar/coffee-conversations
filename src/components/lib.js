/** @jsx jsx */
import {jsx} from '@emotion/react'

import React from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {Link as RouterLink} from 'react-router-dom'
import styled from '@emotion/styled'
import * as colors from 'styles/colors'
import {CoffeeIcon} from 'assets/icons'

function Button({variant, children, ...props}) {
  if (variant === undefined) {
    variant = 'primary'
  }
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
      color: colors.white,
    },
    light: {
      background: colors.light,
      color: colors.black,
    },
    white: {
      background: colors.white,
      color: colors.black,
    },
  }
  const AnimatedButton = styled(motion.button)(
    {
      padding: '10px 15px',
      border: '0',
      lineHeight: '1',
      cursor: 'pointer',
      borderRadius: '2px',
      transition: 'box-shadow 200ms',
    },
    buttonVariants[variant],
  )
  return (
    <AnimatedButton
      initial={{scale: 1, filter: 'none'}}
      whileHover={{scale: 1.1, boxShadow: 'var(--shadow-elevation-medium)'}}
      whileTap={{scale: 0.9}}
      transition={{type: 'spring', stiffness: 400, damping: 17}}
      {...props}
    >
      {children}
    </AnimatedButton>
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

function FullPageLoading({...props}) {
  const Backdrop = styled(motion.div)({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${colors.black}80`,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
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
    gap: '8px',
  })
  return (
    <Backdrop
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      {...props}
    >
      <Container
        initial={{y: '-100vh'}}
        animate={{y: 0}}
        exit={{y: '100vh'}}
        transition={{type: 'spring', stiffness: 200, damping: 15, delay: 1}}
      >
        <CoffeeIcon size={80} animation={true} loop={true} />
        <div
          css={{textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold'}}
        >
          Loading...
        </div>
      </Container>
    </Backdrop>
  )
}

const animationVariants = {
  dropIn: {
    hidden: {
      y: '-100vh',
      opacity: 0,
      filter: 'none',
    },
    visible: {
      y: '0',
      opacity: 1,
      transition: {
        duration: 0.1,
        type: 'spring',
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: '100vh',
      opacity: 0,
    },
  },
  fadeIn: {
    hidden: {opacity: 1, filter: 'none'},
    visible: {
      opacity: 1,
    },
    exit: {opacity: 0},
  },
}
const backdropVariants = {
  black: {
    backgroundColor: `${colors.light}80`,
  },
  white: {
    backgroundColor: `${colors.black}90`,
  },
}
const containerVariants = {
  black: {
    backgroundColor: `${colors.black}`,
    color: `${colors.white}`,
  },
  white: {
    backgroundColor: `${colors.white}`,
    color: `${colors.black}`,
  },
}
function Modal({
  children,
  variant = 'white',
  onClose,
  animationVariant = 'dropIn',
  modalHeading,
  ...props
}) {
  const scrollY = window.scrollY;
  const Backdrop = styled(motion.div)(
    {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: scrollY,
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: 2
    },
    backdropVariants[variant],
  )

  const Container = styled(motion.div)(
    {
      width: 'clamp(500px, 65%, 800px)',
      maxWidth: '100%',
      borderRadius: '2px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '8px',
      padding: '1rem',
      transition: 'filter 1s',
    },
    containerVariants[variant],
  )
  return (
    <Backdrop
      onClick={onClose}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >
      <Container
        variants={animationVariants[animationVariant]}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{
          filter: `drop-shadow(0px 10px 30px ${colors.black})`,
        }}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        <div
          css={{
            borderBottom: '1px solid',
            paddingBottom: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          {modalHeading && (
            <span css={{fontSize: '1.5rem', fontWeight: 500}}>
              {modalHeading}
            </span>
          )}
          <motion.svg
            onClick={onClose}
            initial={{border: `none`, borderRadius: '50%'}}
            whileHover={{
              border: `2px solid`,
              scale: 1.5,
              cursor: 'pointer',
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-x-circle"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </motion.svg>
        </div>
        <motion.div>{children}</motion.div>
      </Container>
    </Backdrop>
  )
}

function ErrorMessage({error, variant = 'stacked', ...props}) {
  const errorMessageVariants = {
    stacked: {display: 'block'},
    inline: {display: 'inline-block'},
  }
  return (
    <div
      role="alert"
      css={[{color: colors.danger}, errorMessageVariants[variant]]}
      {...props}
    >
      <span>There was an error: </span>
      <pre
        css={[
          {whiteSpace: 'break-spaces', margin: '0', marginBottom: -5},
          errorMessageVariants[variant],
        ]}
      >
        {error.message}
      </pre>
    </div>
  )
}

const Link = styled(RouterLink)({
  color: colors.brown,
  ':hover': {
    color: colors.brownLightened2,
    textDecoration: 'underline',
  },
})

function Card({children, ...props}) {
  return (
    <div
      css={{
        boxShadow: 'var(--shadow-elevation-medium)',
        borderRadius: '2px',
        backgroundColor: `${colors.white}`,
        padding: '1rem',
        color: `${colors.black}`,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Button,
  FullPageErrorFallback,
  FullPageLoading,
  ErrorMessage,
  Link,
  Card,
  Modal,
}
