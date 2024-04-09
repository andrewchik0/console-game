'use client'
import React, { CSSProperties, useEffect, useState } from 'react'

import styles from './Console.module.scss'

import handleCommand from '@core/commands'

import useStore, { updateStore } from '@store/store'

import useFocus from '@hooks/useFocus'

import Cursor from '@ui/Cursor/Cursor'

import '@core/commandList'

const Console = () => {
  const console = useStore((state) => state.console)

  const [inputValue, setInputValue] = useState('')
  const [commandsHistory, setCommandsHistory] = useState<string[]>([])
  const [historyCounter, setHistoryCounter] = useState<number>(-1)

  const [inputRef, isInFocus, setInputFocus] = useFocus<HTMLInputElement>(true)

  // Save game on page closure
  useEffect(() => {
    updateStore()
    window.addEventListener('beforeunload', () => {
      useStore.getState().game.setCommandAvailability('home', false)
    })
    return () => {
      window.localStorage.setItem('game', JSON.stringify(useStore.getState().game))
    }
  })

  // Handle pressing keys
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowUp' && historyCounter < commandsHistory.length - 1) {
      setHistoryCounter(historyCounter + 1)
      setInputValue(commandsHistory[historyCounter + 1])
      console.setCaretPos(3 + console.location.length + inputValue.length, console.caretPos.y)
    } else if (e.code === 'ArrowDown' && historyCounter > -1) {
      setHistoryCounter(historyCounter - 1)
      historyCounter - 1 === -1
        ? setInputValue('')
        : setInputValue(commandsHistory[historyCounter - 1])
      console.setCaretPos(3 + console.location.length + inputValue.length, console.caretPos.y)
    }

    if (console.isExecuting && e.code == 'KeyC' && e.ctrlKey) {
      console.abortController.abort()
    }

    if (console.isExecuting && console.inputDemanded) {
      console.pushKey(e.key)
      console.onInput()
    }
  }
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [handleKeyDown])

  // Caret rendering callbacks
  const calculateCaretPosPx = (): CSSProperties => {
    return {
      position: 'absolute',
      left: `${console.caretPos.x * 9.64}px`,
      top: `${2 + console.caretPos.y * 21}px`,
      backgroundColor: isInFocus ? 'green' : '#00000000'
    }
  }
  const moveCaret = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.currentTarget.setSelectionRange(inputValue.length, inputValue.length)
    }
    console.setCaretPos(
      (event.currentTarget.selectionStart || 0) + 3 + console.location.length,
      console.caretPos.y
    )
  }

  // Submit input to the console
  const submit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      console.pushMessage(`~/${console.location} ${inputValue}`)
      setCommandsHistory([inputValue, ...commandsHistory])
      console.executingStarted()

      handleCommand(inputValue, { signal: console.abortController.signal }).then((value) => {
        if (value !== 0) {
          console.pushMessage(`exited with code ${value}`)
        }
        console.setCaretPos(3 + console.location.length, console.caretPos.y)
        console.executingStopped()
        console.setAbortController(new AbortController())
        console.setExecutingProgram('')
        console.setShowCaret(true)

        setInputValue('')
        setInputFocus()
      })
    }
  }

  return (
    <div
      className={styles.console}
      onClick={() => setInputFocus()}
      style={{ borderColor: isInFocus ? 'green' : '#004400' }}
    >
      <div className={styles.console__wrapper}>
        {console.messages.map((msg, idx) => (
          <div key={idx} className={styles.console__message}>
            {msg}
          </div>
        ))}

        {console.showCaret && (
          <div className={styles.console__cursor_wrapper}>
            <Cursor style={calculateCaretPosPx()} />
          </div>
        )}

        {!console.isExecuting && (
          <div className={styles.console__input_row_wrapper}>
            <span>~/{console.location}</span>
            <input
              className={styles.console__input}
              spellCheck='false'
              autoFocus
              maxLength={50}
              onKeyUp={moveCaret}
              onKeyDown={submit}
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Console
