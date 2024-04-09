import { Stream } from '@core/iostream'

import useStore, { Store } from '@store/store'

let abortController = useStore.getState().console.abortController
useStore.subscribe((state: Store) => (abortController = state.console.abortController))

export const wait = (seconds: number) => {
  return new Promise<void>((resolve, reject) => {
    const abortHandler = () => {
      reject(new DOMException('Aborted', 'AbortError'))
    }
    setTimeout(() => {
      resolve()
      abortController.signal?.removeEventListener('abort', abortHandler)
    }, seconds * 1000)
    abortController.signal?.addEventListener('abort', abortHandler)
  })
}

export const clamp = (num: number, min: number, max: number) => {
  return num <= min ? min : num >= max ? max : num
}

export const randomHex = (size = 1) => {
  const hex = '0123456789abcdef'
  let output = ''
  for (let i = 0; i < size; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length))
  }
  return output
}

export const renderUnknownHex = async (stream: Stream, seconds: number, count = 1) => {
  const oneCharRenderTime = 0.04

  for (let i = 0; i < seconds / oneCharRenderTime; i++) {
    for (let j = 0; j < count; j++) {
      stream.write(randomHex())
    }
    await wait(oneCharRenderTime)
    stream.backspace(count)
  }
  for (let j = 0; j < count; j++) {
    stream.write(randomHex())
  }
}

export const renderLoading = async (stream: Stream, text: string, seconds: number) => {
  stream.write(text + '\n')
  stream.hideCaret()

  const barSize = 16
  const loadingAnimation = '/-\\|'
  for (let i = 0; i < barSize; ++i) {
    stream.write(
      '[' +
        multiplyString('#', i) +
        multiplyString(' ', barSize - i) +
        '] ' +
        loadingAnimation[i % loadingAnimation.length]
    )
    await wait(seconds / barSize)
    stream.backspace(barSize + 4)
  }
  stream.backspace(text.length + 1)
  stream.showCaret()
}

export const multiplyString = (str: string, count: number) => {
  let output = ''

  for (let i = 0; i < count; i++) {
    output += str
  }
  return output
}

export const confirmed = async (stream: Stream) => {
  let msg = ''
  while (
    msg !== 'y' &&
    msg !== 'yes' &&
    msg != 'Y' &&
    msg !== 'Yes' &&
    msg !== 'n' &&
    msg !== 'no' &&
    msg != 'N' &&
    msg !== 'No'
  ) {
    stream.writeLn('are you sure [y/n]? ')
    msg = await customInput(stream)
  }
  return msg === 'y' || msg === 'yes' || msg === 'Y' || msg === 'Yes'
}

export const customInput = async (stream: Stream, max = 16) => {
  let message = ''
  let key = ''
  let caretPos = 0
  stream.moveCaretPos(0, -1)

  while (key !== 'Enter') {
    key = await stream.readKey()
    if (key.length === 1 && message.length <= max) {
      stream.backspace(message.length)
      message = spliceString(message, caretPos, 0, key)
      caretPos++
      stream.write(message)
      stream.moveCaretPos(-message.length + caretPos, 0)
    } else if (key === 'Backspace' && caretPos > 0) {
      stream.backspace(message.length)
      caretPos--
      stream.moveCaretPos(-1, 0)
      message = spliceString(message, caretPos, 1, '')
      stream.write(message)
      stream.moveCaretPos(-message.length + caretPos, 0)
    } else if (key === 'ArrowLeft' && caretPos > 0) {
      caretPos--
      stream.moveCaretPos(-1, 0)
    } else if (key === 'ArrowRight' && caretPos < message.length) {
      caretPos++
      stream.moveCaretPos(1, 0)
    } else if (key === 'Delete' && caretPos < message.length) {
      stream.backspace(message.length)
      message = spliceString(message, caretPos, 1, '')
      stream.write(message)
      stream.moveCaretPos(-message.length + caretPos, 0)
    }
  }
  stream.writeLn('')
  stream.moveCaretPos(0, 1)
  return message
}

export const spliceString = (
  origin: string,
  start: number,
  delCount: number,
  newSubStr: string
) => {
  return origin.slice(0, start) + newSubStr + origin.slice(start + Math.abs(delCount))
}

export const chooseList = async (stream: Stream, list: string[]): Promise<number> => {
  let index = 0
  let key = ''
  let renderedStringLength = 0
  const helpMsg = '\n↑↓ - select\nenter - submit\nesc - exit'

  stream.hideCaret()

  const renderList = () => {
    stream.backspace(renderedStringLength)
    renderedStringLength = 0
    stream.writeLn('')
    list.forEach((item, idx) => {
      if (idx == index) stream.write(` > ${item} <\n`)
      else stream.write(`   ${item}  \n`)
      renderedStringLength += item.length + 6
    })
    renderedStringLength += helpMsg.length
    stream.write(helpMsg)
  }

  renderList()

  while (key !== 'Escape' && key !== 'Enter') {
    key = await stream.readKey()
    if (key === 'ArrowUp') index = index === 0 ? (index = list.length - 1) : index - 1
    if (key === 'ArrowDown') index = (index + 1) % list.length
    renderList()
  }

  stream.showCaret()
  if (key === 'Enter') return index
  return -1
}
