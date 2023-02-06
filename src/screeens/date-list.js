/** @jsx jsx */
import {jsx} from '@emotion/react'

import React from 'react'
import {motion} from 'framer-motion'
import {
  Card,
  BlackTooltip,
  hoverUnderlineAnimation,
  GridContainer,
  Button,
  InfoCard,
} from 'components/lib'
import useSWR from 'swr'
import {client} from 'utils/api-client'
import {useAuth} from 'context/auth-context'
import * as colors from 'styles/colors'
import {Link as RouterLink} from 'react-router-dom'

function DateInfoCard({dateData}) {
  const dateMembers = dateData?.Users.map(member => <div key={member.ID}>{member.Name}</div>)
  return (
    <InfoCard>
      <div>
        <span>Week: {dateData.Week}, </span>

        <span>Year: {dateData.Year}</span>
      </div>
      <div css={{fontWeight: 500, fontSize: '1.25rem', margin: '8px 0 4px'}}>
        Members
      </div>
      <div css={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
        {dateMembers}
      </div>
      <RouterLink to={`/date/${dateData.ID}`}>
        <Button variant={'black'} css={{marginTop: 8}}>
          More Info
        </Button>
      </RouterLink>
    </InfoCard>
  )
}
function PreviousDates() {
  const {user} = useAuth()
  const {data: previousDates} = useSWR(
    `coffeedate/${user.ID}/getPreviousCoffeeDates`,
    client,
  )
  if (previousDates?.CoffeeDates.length === 0) {
    return (
      <Card>
        <h2>No previous dates.</h2>
      </Card>
    )
  }
  const previouslyMet = makeUsersObject({userID: user.ID, previousDates})?.map(
    user => (
      <li key={user.Email}>
        {user.Name}{' '}
        <em css={{fontSize: '0.825rem', color: `${colors.gray80}`}}>
          ({user.Email})
        </em>{' '}
        :&nbsp;&nbsp; <span css={{fontWeight: 600}}>{user.count} times</span>
      </li>
    ),
  )
  return (
    <Card>
      <BlackTooltip title="Here you can see all your previous dates and click on them see more details like meeting notes.">
        <motion.h2 {...hoverUnderlineAnimation({variant: 'initial'})}>
          Previous Dates
        </motion.h2>
      </BlackTooltip>
      <section>
        <h3>Colleagues you have met on coffee dates</h3>
        <ul>{previouslyMet}</ul>
      </section>
      <GridContainer minWidth={'350px'} css={{marginTop: 32}}>
        {previousDates?.CoffeeDates.map(coffeedate => (
          <DateInfoCard key={coffeedate.ID} dateData={coffeedate} />
        ))}
      </GridContainer>
    </Card>
  )
}

function DateList() {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{delay: 0.4}}
    >
      <PreviousDates />
    </motion.div>
  )
}
function makeUsersObject({userID, previousDates}) {
  const userCount = {}
  previousDates?.CoffeeDates.forEach(date =>
    date?.Users.forEach(user => {
      if (user.ID !== userID) {
        if (user.ID in userCount) {
          userCount[user.ID].count += 1
        } else {
          userCount[user.ID] = {count: 1, Name: user.Name, Email: user.Email}
        }
      }
    }),
  )
  const userCountArray = []
  for (const user in userCount) {
    userCountArray.push(userCount[user])
  }
  return userCountArray
}
export {DateList}
