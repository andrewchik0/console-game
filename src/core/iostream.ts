import type { Store } from '@store/store'
import useStore from '@store/store'

import { wait } from '@utils/utils'

export type Stream = {
  readKey: () => Promise<string>
  readString: () => Promise<string>
  write: (str: string) => void
  writeLn: (str: string) => void
  writeGradually: (str: string) => Promise<void>
  setLocation: (str: string) => void
  backspace: (size?: number) => void
  moveCaretPos: (x: number, y: number) => void
  hideCaret: () => void
  showCaret: () => void
}

let console = useStore.getState().console
useStore.subscribe((state: Store) => (console = state.console))

const gradualWritingDelay = 0.04

const getCaretPosFromString = (str: string) => {
  let length = 0
  for (const ch of [...str]) {
    length++
    if (ch === '\n' || length >= 52) {
      length = 0
    }
  }
  return length
}

const stream: Stream = {
  hideCaret: () => console.setShowCaret(false),
  showCaret: () => console.setShowCaret(true),
  moveCaretPos: (x, y) => {
    console.setCaretPos(console.caretPos.x + x, console.caretPos.y + y)
  },
  backspace: (size = 1) => {
    const string = console.messages[console.messages.length - 1]

    if (string.length - size < 0) {
      console.popMessage()
      console.setCaretPos(
        getCaretPosFromString(console.messages[console.messages.length - 1]),
        console.caretPos.y
      )
    } else {
      console.modifyLastMessage(string.substring(0, string.length - size))
      console.setCaretPos(getCaretPosFromString(string), console.caretPos.y)
    }
  },
  write: (str) => {
    console.modifyLastMessage(console.messages[console.messages.length - 1] + str)
    console.setCaretPos(
      getCaretPosFromString(console.messages[console.messages.length - 1]),
      console.caretPos.y
    )
  },
  writeLn: (str) => {
    console.pushMessage(str)
    console.setCaretPos(getCaretPosFromString(str), console.caretPos.y)
  },
  writeGradually: async (str) => {
    console.pushMessage('')
    console.demandInput()

    let shouldSpeedUp = false
    let shouldStopChecking = false
    const checkInputKey = () => {
      stream.readKey().then((key) => {
        if (key === 'Enter' || key == ' ') shouldSpeedUp = true
        else if (!shouldStopChecking) checkInputKey()
      })
    }
    checkInputKey()

    const chars = [...str]
    const caretPos = {
      x: 0,
      y: console.caretPos.y - 1
    }
    for (const [idx, ch] of chars.entries()) {
      if (shouldSpeedUp) {
        console.modifyLastMessage(str)
        console.setCaretPos(getCaretPosFromString(str), -1)
        break
      }
      await wait(gradualWritingDelay)
      console.modifyLastMessage(str.substring(0, idx + 1))
      console.setCaretPos(getCaretPosFromString(str.substring(0, idx + 1)), -1)
      shouldStopChecking = true
    }
  },
  readKey: async () => {
    console.demandInput()

    // Wait until input appears
    await new Promise<void>((resolve, reject) => {
      const abortHandler = () => {
        reject(new DOMException('Aborted', 'AbortError'))
      }
      console.abortController.signal?.addEventListener('abort', abortHandler)

      console.setOnInput(() => {
        resolve()
        console.abortController.signal?.removeEventListener('abort', abortHandler)
      })
    })

    const char = console.pressedKeys[console.pressedKeys.length - 1]

    console.setOnInput(() => {})
    console.stopDemandingInput()
    return char
  },
  readString: async () => '',
  setLocation: (str) => console.setLocation(str)
}

export default stream
