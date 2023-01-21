import React from 'react'
import {motion} from 'framer-motion'

function GoogleIcon({size} = {}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 24 24`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z"
        fill="currentColor"
      />
    </svg>
  )
}
function CoffeeIcon({size = 24, animation = false, loop = false} = {}) {
  const loopAnimation = loop
    ? {transition: {type: 'tween', ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', duration: 1, repeatDelay: 0.3}}
    : {}
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 24 24`}
      fill="none"
      stroke="#222222"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-coffee"
    >
      <motion.path
        d="M18 8h1a4 4 0 0 1 0 8h-1"
        {...(animation
          ? {
              initial: {opacity: 0, pathLength: 0},
              animate: {opacity: 1, pathLength: 1},
              transition: {duration: 0.5},
            }
          : {})}
        {...loopAnimation}
      ></motion.path>
      <motion.path
        d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
        {...(animation
          ? {
              initial: {opacity: 0, pathLength: 0},
              animate: {opacity: 1, pathLength: 1},
              transition: {duration: 0.5},
            }
          : {})}
        {...loopAnimation}
      ></motion.path>
      <motion.line
        x1="6"
        y1="1"
        x2="6"
        y2="4"
        {...(animation
          ? {
              initial: {opacity: 0},
              animate: {opacity: 1},
              transition: {delay: 0.5},
            }
          : {})}
        {...loopAnimation}
      ></motion.line>
      <motion.line
        x1="10"
        y1="1"
        x2="10"
        y2="4"
        {...(animation
          ? {
              initial: {opacity: 0},
              animate: {opacity: 1},
              transition: {delay: 0.6},
            }
          : {})}
        {...loopAnimation}
      ></motion.line>
      <motion.line
        x1="14"
        y1="1"
        x2="14"
        y2="4"
        {...(animation
          ? {
              initial: {opacity: 0},
              animate: {opacity: 1},
              transition: {delay: 0.7},
            }
          : {})}
        {...loopAnimation}
      ></motion.line>
    </svg>
  )
}

export {GoogleIcon, CoffeeIcon}
