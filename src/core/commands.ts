import stream from '@core/iostream'

import useStore, { Store } from '@store/store'

export type Command = {
  name: string | string[]
  location: string
  skipLocationChecking?: boolean
  mainFunc: (args: string[], { signal }?: { signal?: AbortSignal }) => Promise<number>
}
export type Commands = Command[]

const commands = [] as Commands

let console = useStore.getState().console
useStore.subscribe((state: Store) => (console = state.console))

const handleCommand = async (
  input: string,
  { signal }: { signal: AbortSignal }
): Promise<number> => {
  let executed = false
  let returnValue = 0

  const splittedInput = input.split(' ').filter((el) => el.length > 0)
  const commandName = splittedInput.shift() || ''
  const args = splittedInput

  try {
    if (commandName === '') {
      executed = true
    }

    for (const command of commands) {
      if (
        ((Array.isArray(command.name) && command.name.indexOf(commandName) !== -1) ||
          (typeof command.name == 'string' && command.name === commandName)) &&
        (command.skipLocationChecking || command.location === console.location)
      ) {
        console.setExecutingProgram(
          command.location +
            '/' +
            (typeof command.name === 'string' ? command.name : command.name[0])
        )
        returnValue = await command.mainFunc(args, { signal })
        executed = true
      }
    }
    if (!executed) {
      stream.writeLn('undefined command, type "help"')
      returnValue = 0
    }
  } catch (e) {
    if ((e as Error).name !== 'AbortError') throw e
  }
  return new Promise<number>((resolve) => {
    resolve(returnValue)
  })
}

export const registerCommand = (cmd: Command) => {
  const wrapper =
    (func: (args: string[], { signal }?: { signal: AbortSignal }) => Promise<number>) =>
    async (args: string[], { signal }: { signal?: AbortSignal } = {}) => {
      return new Promise<number>((resolve, reject) => {
        const abortHandler = () => {
          reject(new DOMException('Aborted', 'AbortError'))
        }
        // start async operation
        func(args).then((value) => {
          resolve(value)
          signal?.removeEventListener('abort', abortHandler)
        })
        signal?.addEventListener('abort', abortHandler)
      })
    }

  cmd.mainFunc = wrapper(cmd.mainFunc)
  commands.push(cmd)
}

export default handleCommand
