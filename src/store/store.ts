import { create } from 'zustand'

export type Point = {
  x: number
  y: number
}

export type LocationAvailability = {
  name: string
  value: boolean
  child?: LocationAvailability[]
}

export type State = {
  guides: string[]
  isDev: boolean
  console: {
    messages: string[]
    isExecuting: boolean
    caretPos: Point
    location: string
    inputDemanded: boolean
    pressedKeys: string[]
    onInput: () => void
    abortController: AbortController
    executingProgram: string
    showCaret: boolean
  }
  game: {
    money: number
    internetSpeed: number
    amountOfHashPerClick: number
    decryptingSpeed: number
    moneyPerBlock: number
    commandsAvailability: { name: string; value: boolean }[]
    locationsAvailability: LocationAvailability
    progressTracker: Record<string, boolean>
  }
}

type Action = {
  pushGuide: (str: string) => void
  setIsDev: (value: boolean) => void
  setConsole: (game: Action['console']) => void
  console: {
    pushMessage: (str: string) => void
    popMessage: () => void
    modifyLastMessage: (str: string) => void
    setCaretPos: (x: number, y: number) => void
    incrementCaretPos: () => void
    executingStarted: () => void
    executingStopped: () => void
    demandInput: () => void
    stopDemandingInput: () => void
    setLocation: (str: string) => void
    pushKey: (key: string) => void
    setOnInput: (func: () => void) => void
    setAbortController: (ac: AbortController) => void
    setExecutingProgram: (name: string) => void
    setShowCaret: (value: boolean) => void
  }
  setGame: (game: Action['game']) => void
  game: {
    increaseMoney: (amount: number) => void
    decreaseMoney: (amount: number) => void
    increaseInternetSpeed: (amount: number) => void
    increaseAmountOfHashPerClick: (amount: number) => void
    increaseDecryptingSpeed: (amount: number) => void
    increaseMoneyPerBlock: (amount: number) => void
    setCommandAvailability: (name: string, value?: boolean) => void
    setLocationsAvailability: (name: string, value?: boolean) => void
    addKeyToProgress: (key: string, value?: boolean) => void
  }
}

export type Store = State & Action

export const initialState: State = {
  guides: [],
  isDev: false,
  console: {
    messages: [],
    caretPos: { x: 3, y: 0 },
    isExecuting: false,
    inputDemanded: false,
    location: '',
    pressedKeys: [],
    onInput: () => {},
    abortController: new AbortController(),
    executingProgram: '',
    showCaret: true
  },
  game: {
    money: 0,
    internetSpeed: 1,
    amountOfHashPerClick: 1,
    decryptingSpeed: 1,
    moneyPerBlock: 1,
    commandsAvailability: [
      { name: 'start', value: true },
      { name: 'dev', value: true },
      { name: 'reset', value: true },
      { name: 'help', value: true },
      { name: 'set', value: true }
    ],
    locationsAvailability: {
      name: '',
      value: true
    },
    progressTracker: {}
  }
}

const useStore = create<Store>()((set) => ({
  ...initialState,
  pushGuide: (str) => set((state) => ({ guides: [...state.guides, str] })),
  setIsDev: (value) => set(() => ({ isDev: value })),
  setConsole: (console) => set((state) => ({ console: { ...state.console, ...console } })),
  console: {
    ...initialState.console,

    pushMessage: (str) => {
      set((state) => ({
        console: { ...state.console, messages: [...state.console.messages, str] }
      }))
    },
    popMessage: () => {
      set((state) => ({
        console: { ...state.console, messages: [...state.console.messages.slice(0, -1)] }
      }))
    },
    modifyLastMessage: (str) => {
      set((state) => {
        state.console.messages[state.console.messages.length - 1] = str
        return { console: { ...state.console, messages: [...state.console.messages] } }
      })
    },

    setCaretPos: (x, y) =>
      set((state) => ({ console: { ...state.console, caretPos: { x: x, y: y } } })),
    incrementCaretPos: () => {
      set((state) => ({
        console: {
          ...state.console,
          caretPos: { x: state.console.caretPos.x + 1, y: state.console.caretPos.y }
        }
      }))
    },

    executingStarted: () => set((state) => ({ console: { ...state.console, isExecuting: true } })),
    executingStopped: () => set((state) => ({ console: { ...state.console, isExecuting: false } })),
    setExecutingProgram: (name) =>
      set((state) => ({ console: { ...state.console, executingProgram: name } })),

    demandInput: () => set((state) => ({ console: { ...state.console, inputDemanded: true } })),
    stopDemandingInput: () =>
      set((state) => ({ console: { ...state.console, inputDemanded: false } })),

    setLocation: (str) => set((state) => ({ console: { ...state.console, location: str || '' } })),

    pushKey: (key) =>
      set((state) => ({
        console: { ...state.console, pressedKeys: [...state.console.pressedKeys, key] }
      })),

    setOnInput: (func) => set((state) => ({ console: { ...state.console, onInput: func } })),
    setAbortController: (ac) =>
      set((state) => ({ console: { ...state.console, abortController: ac } })),

    setShowCaret: (value) => set((state) => ({ console: { ...state.console, showCaret: value } }))
  },

  setGame: (game) => set((state) => ({ game: { ...state.game, ...game } })),
  game: {
    ...initialState.game,

    increaseMoney: (amount) =>
      set((state) => ({ game: { ...state.game, money: state.game.money + amount } })),
    decreaseMoney: (amount) =>
      set((state) => ({ game: { ...state.game, money: state.game.money - amount } })),
    increaseInternetSpeed: (amount) =>
      set((state) => ({
        game: { ...state.game, internetSpeed: state.game.internetSpeed + amount }
      })),
    increaseAmountOfHashPerClick: (amount) =>
      set((state) => ({
        game: { ...state.game, amountOfHashPerClick: state.game.amountOfHashPerClick + amount }
      })),
    increaseDecryptingSpeed: (amount) =>
      set((state) => ({
        game: { ...state.game, decryptingSpeed: state.game.decryptingSpeed + amount }
      })),
    increaseMoneyPerBlock: (amount) =>
      set((state) => ({
        game: { ...state.game, moneyPerBlock: state.game.moneyPerBlock + amount }
      })),

    setCommandAvailability: (name, value = true) =>
      set((state) => {
        for (const [idx, cmd] of state.game.commandsAvailability.entries()) {
          if (cmd.name == name) {
            const newArray = [...state.game.commandsAvailability]
            newArray[idx].value = value
            return { game: { ...state.game, commandAvailability: newArray } }
          }
        }
        return {
          game: {
            ...state.game,
            commandsAvailability: [...state.game.commandsAvailability, { name: name, value: value }]
          }
        }
      }),

    setLocationsAvailability: (name, value = true) =>
      set((state) => {
        const newState = { ...state }
        if (name[0] !== '/') name = '/' + name
        const path = name.split('/')

        path.shift()

        const setLocation = (loc: LocationAvailability, value: boolean, path: string[]) => {
          // Set value if it is last subpath
          if (path.length === 0) {
            loc.value = value
            return
          }

          let found = false
          loc.child && (found = loc.child.find((l) => path[0] === l.name) !== undefined)

          // Push new element if there is no such element
          if (!found) {
            loc.child = [
              ...(loc.child || []),
              {
                name: path[0],
                value: false
              }
            ]
          }

          let newLoc: LocationAvailability | undefined
          loc.child && (newLoc = loc.child.find((l) => path[0] === l.name))
          path.shift()
          newLoc && setLocation(newLoc, value, path)
        }
        setLocation(newState.game.locationsAvailability, value, path)
        return { ...newState }
      }),
    addKeyToProgress: (key, value = true) =>
      set((state) => {
        const newState = { ...state }
        newState.game.progressTracker[key] = value
        return { ...newState }
      })
  }
}))

export const updateStore = () => {
  if (typeof window !== 'undefined') {
    useStore.getState().setGame(JSON.parse(window.localStorage.getItem('game') || '{}'))
  }
}

export const reset = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear()
    useStore.getState().setGame(initialState.game as Store['game'])
    useStore.getState().setConsole(initialState.console as Store['console'])
  }
}

export default useStore
