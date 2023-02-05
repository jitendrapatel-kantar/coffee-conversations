/** @jsx jsx */
import {jsx} from '@emotion/react'
import React from 'react'

import {useParams} from 'react-router-dom'
import { Card, hoverUnderlineAnimation, GridContainer, InfoCard} from 'components/lib'
import { useAuth } from 'context/auth-context'
import useSWR from 'swr'
import {client} from 'utils/api-client'
import {motion} from 'framer-motion'
import * as colors from 'styles/colors'

function Date() {
  const {user} = useAuth()
  const {data: previousDates} = useSWR(
    `coffeedate/${user.ID}/getPreviousCoffeeDates`,
    client,
  )
  const {dateID} = useParams()
  const dateData = previousDates?.CoffeeDates.find(date => date.ID.toString() === dateID)
  const coffeeDateMembers = dateData?.Users.map(user => (
    <li key={user.ID}>
      {user.Name} <em css={{color: colors.gray80}}>({user.Email})</em>
    </li>
  ))
  return(
    <Card>
        <motion.h2 {...hoverUnderlineAnimation({variant: 'initial'})}>
          Date Information
        </motion.h2>
        <div css={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
            <h4>Week: {dateData?.Week}, </h4>
            <h4>Year: {dateData?.Year}</h4>
        </div>
        <div css={{marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline'}}>
            <h3>Members</h3>
            <ul>{coffeeDateMembers}</ul>
        </div>
        <section css={{marginTop: 16}}>
            <h3 css={{marginBottom: 16}}>Notes</h3>
            <GridContainer minWidth={'500px'}>{dateData?.Notes.map(note => <InfoCard key={note.ID}>{note.Text}</InfoCard>)}</GridContainer>
        </section>
    </Card>
  )
}

export {Date}
