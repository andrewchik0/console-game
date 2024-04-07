'use client'
import React from 'react'

import { executingPrograms, locations } from '@constants/general'

import useStore from '@store/store'

const Stats = () => {
  const game = useStore((store) => store.game)
  const console = useStore((store) => store.console)

  const evalStatsExecution = () => {
    for (const execProgram of executingPrograms) {
      if (console.executingProgram === execProgram.name && execProgram.stats) {
        return execProgram.stats.map((stat, idx) => {
          const key = stat.fieldName as keyof typeof game
          if ((stat.condition && eval(stat.condition) === true) || !stat.condition) {
            return (
              <p key={idx}>
                <>
                  {stat.showingText}: {game[key]}
                </>
              </p>
            )
          }
          return ''
        })
      }
    }
  }

  const evalStatsLocations = () => {
    for (const location of locations) {
      if (console.location === location.name && location.stats) {
        return location.stats.map((stat, idx) => {
          const key = stat.fieldName as keyof typeof game
          if ((stat.condition && eval(stat.condition) === true) || !stat.condition) {
            return (
              <p key={idx}>
                <>
                  {stat.showingText}: {game[key]}
                </>
              </p>
            )
          }
          return ''
        })
      }
    }
  }

  return (
    <div>
      <h3>Stats</h3>
      <p>money: {game.money}$</p>
      <p>internet speed: {game.internetSpeed} Kb/s</p>
      {console.isExecuting ? evalStatsExecution() : evalStatsLocations()}
    </div>
  )
}

export default Stats
