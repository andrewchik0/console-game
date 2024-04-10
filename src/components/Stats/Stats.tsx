'use client'
import React from 'react'

import { locations, StatUnit } from '@constants/general'

import { getCurrentProgram } from '@core/commands'

import useStore from '@store/store'

import { getObjectKey } from '@utils/utils'

const Stats = () => {
  const game = useStore((store) => store.game)
  const console = useStore((store) => store.console)

  const renderStats = (stats: StatUnit[]) => {
    return stats.map((stat, idx) => {
      if ((stat.condition && eval(stat.condition) === true) || !stat.condition) {
        return (
          <p key={idx}>
            <>
              {stat.showingText}: {getObjectKey(game, stat.fieldName)}
            </>
          </p>
        )
      }
      return ''
    })
  }

  const evalStatsLocations = () => {
    for (const location of locations) {
      if (console.location === location.name && location.stats) {
        return renderStats(location.stats)
      }
    }
  }

  const evalStatsExecution = () => {
    return getCurrentProgram()?.stats?.map((stat, idx) => {
      if ((stat.condition && eval(stat.condition) === true) || !stat.condition) {
        return (
          <p key={idx}>
            <>
              {stat.showingText}: {getObjectKey(game, stat.fieldName)}
            </>
          </p>
        )
      }
      return ''
    })
  }

  return (
    <div>
      <h3>stats</h3>
      <p>money: {game.money}$</p>
      <p>internet speed: {game.internetSpeed} Kb/s</p>
      {console.isExecuting ? evalStatsExecution() : evalStatsLocations()}
    </div>
  )
}

export default Stats
