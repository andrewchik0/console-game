'use client'
import React from 'react'

import { executingPrograms } from '@constants/general'

import useStore from '@store/store'

const Stats = () => {
  const game = useStore((store) => store.game)
  const console = useStore((store) => store.console)

  const evalStats = () => {
    for (const execProgram of executingPrograms) {
      if (console.executingProgram === execProgram.name && execProgram.stats) {
        return execProgram.stats.map((stat) => {
          const key = stat.fieldName as keyof typeof game
          if ((stat.condition && eval(stat.condition) === true) || !stat.condition) {
            return `${stat.showingText}: ${game[key]}`
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
      {evalStats()}
    </div>
  )
}

export default Stats
