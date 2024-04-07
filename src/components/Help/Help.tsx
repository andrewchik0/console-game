'use client'
import React from 'react'

import { executingPrograms } from '@constants/general'

import useStore from '@store/store'

const Help = () => {
  const game = useStore((store) => store.game)
  const console = useStore((store) => store.console)

  const evalHelp = () => {
    for (const execProgram of executingPrograms) {
      if (console.executingProgram === execProgram.name && execProgram.help) {
        return execProgram.help.map((help) => {
          if ((help.condition && eval(help.condition) === true) || !help.condition) {
            return help.showingText
          }
          return ''
        })
      }
    }
  }

  return (
    <div>
      <h3>Help</h3>
      {console.isExecuting ? (
        <>
          <p>'ctrl + c' - terminate program</p>
        </>
      ) : (
        <>
          <p>'go {'<location>'}' - go to a location</p>
          {console.location !== '' && <p>'home' - go back</p>}
        </>
      )}
      {evalHelp()}
    </div>
  )
}

export default Help
