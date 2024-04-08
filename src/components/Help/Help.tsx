'use client'
import React, { CSSProperties, ReactNode } from 'react'

import styles from './Help.module.scss'

import { getCommandsByLocation, getCurrentProgram, isCommandAvailable } from '@core/commands'

import useStore from '@store/store'

import { renderWithBackground } from '@utils/uiUtils'

const Help = () => {
  const console = useStore((store) => store.console)
  useStore((store) => store.game.commandsAvailability)

  const commandSpanStyle: CSSProperties = {
    backgroundColor: '#161616',
    borderRadius: '4px',
    padding: '1px 4px 2px'
  }

  const evalHelpExecution = () => {
    return getCurrentProgram()?.help?.map((help, idx) => {
      if ((help.condition && eval(help.condition) === true) || !help.condition) {
        return (
          <p className={styles.help__unit} key={idx}>
            {renderWithBackground(help.showingText, commandSpanStyle)}
          </p>
        )
      }
      return ''
    })
  }

  const evalHelpPrograms = () => {
    const array: ReactNode[] = []
    for (const [idx, cmd] of getCommandsByLocation(console.location).entries()) {
      if (isCommandAvailable((cmd.getFullName && cmd.getFullName()) || '')) {
        array.push(
          <p className={styles.help__unit} key={idx}>
            {renderWithBackground(
              `'${typeof cmd.name === 'string' ? cmd.name : cmd.name[0]}' - ${cmd.description}`,
              commandSpanStyle
            )}
          </p>
        )
      }
    }
    return array
  }

  return (
    <div>
      <h3>controls</h3>
      {console.isExecuting ? (
        <>
          <p className={styles.help__unit}>
            <span style={commandSpanStyle}>ctrl + c</span> - terminate program
          </p>
          {evalHelpExecution()}
        </>
      ) : (
        <>{evalHelpPrograms()}</>
      )}
    </div>
  )
}

export default Help
