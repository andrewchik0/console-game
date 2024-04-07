'use client'
import React from 'react'

import { executingPrograms, locations } from '@constants/general'

import useStore from '@store/store'

const Help = () => {
  const console = useStore((store) => store.console)

  const evalHelpExecution = () => {
    for (const execProgram of executingPrograms) {
      if (console.executingProgram === execProgram.name && execProgram.help) {
        return execProgram.help.map((help, idx) => {
          if ((help.condition && eval(help.condition) === true) || !help.condition) {
            return <p key={idx}>{help.showingText}</p>
          }
          return ''
        })
      }
    }
  }

  const evalHelpLocations = () => {
    for (const location of locations) {
      if (console.location === location.name && location.help) {
        return location.help.map((help, idx) => {
          if ((help.condition && eval(help.condition) === true) || !help.condition) {
            return <p key={idx}>{help.showingText}</p>
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
          {evalHelpExecution()}
        </>
      ) : (
        <>
          <p>'go {'<location>'}' - go to a location</p>
          {console.location !== '' && <p>'home' - go back</p>}
          {evalHelpLocations()}
        </>
      )}
    </div>
  )
}

export default Help
