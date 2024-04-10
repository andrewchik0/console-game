import { HelpUnit, StatUnit } from '@constants/general'

import stream from '@core/iostream'

import useStore, { LocationAvailability, Store } from '@store/store'

export type Command = {
  name: string | string[]
  location: string
  skipLocationChecking?: boolean
  description: string
  help?: HelpUnit[]
  stats?: StatUnit[]
  mainFunc: (args: string[], { signal }?: { signal?: AbortSignal }) => Promise<number>
  getFullName?: () => string
  onExit?: () => void
  showingName?: string
}
export type Commands = Command[]

const commands = [] as Commands

let console = useStore.getState().console
useStore.subscribe((state: Store) => (console = state.console))
let game = useStore.getState().game
useStore.subscribe((state: Store) => (game = state.game))

const handleCommand = async (
  input: string,
  { signal }: { signal: AbortSignal }
): Promise<number> => {
  let executed = false
  let returnValue = 0

  const splittedInput = input.split(' ').filter((el) => el.length > 0)
  const commandName = splittedInput.shift() || ''
  const args = splittedInput
  let onExit: (() => void) | undefined

  try {
    if (commandName === '') {
      executed = true
    }

    for (const command of commands) {
      if (
        ((Array.isArray(command.name) && command.name.indexOf(commandName) !== -1) ||
          (typeof command.name == 'string' && command.name === commandName)) &&
        (command.skipLocationChecking || command.location === console.location) &&
        isCommandAvailable((command.getFullName && command.getFullName()) || '')
      ) {
        onExit = command.onExit
        console.setExecutingProgram((command.getFullName && command.getFullName()) || '')
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
  } finally {
    onExit && onExit()
  }
  return new Promise<number>((resolve) => {
    resolve(returnValue)
  })
}

export const registerCommand = (cmd: Command) => {
  const wrapper =
    (func: (args: string[], { signal }?: { signal?: AbortSignal }) => Promise<number>) =>
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
  cmd.getFullName = () => {
    const name = typeof cmd.name === 'string' ? cmd.name : cmd.name[0]
    if (cmd.location === '') return name
    return cmd.location + '/' + name
  }
  cmd.mainFunc = wrapper(cmd.mainFunc)
  commands.push(cmd)
}

export const isCommandAvailable = (name: string) => {
  if (useStore.getState().isDev) return true
  for (const cmd of game.commandsAvailability) {
    if (name === cmd.name) {
      return cmd.value
    }
  }
  return false
}

export const isLocationAvailable = (name: string) => {
  if (useStore.getState().isDev) return true

  const checkAvailability = (loc: LocationAvailability, path: string[]): boolean => {
    if (!loc.child) return false
    for (const l of loc.child) {
      if (path[0] === l.name) {
        if (path.length === 1) return l.value
        path.shift()
        return checkAvailability(l, path)
      }
    }
    return false
  }

  return checkAvailability(game.locationsAvailability, name.split('/'))
}

export const getCommandsByLocation = (loc: string) => {
  const result: Commands = []
  for (const cmd of commands) {
    if (cmd.location === loc || cmd.skipLocationChecking) result.push(cmd)
  }
  return result
}

export const getCurrentProgram = () => {
  for (const cmd of commands) {
    if (cmd.getFullName && cmd.getFullName() === console.executingProgram) return cmd
  }
}

export default handleCommand
