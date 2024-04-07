import { create } from 'zustand'

export type Point = {
  x: number
  y: number
}

export type State = {
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
  }
}

type Action = {
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
  }
}

export type Store = State & Action

export const initialState: State = {
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
    moneyPerBlock: 1
  }
}

const useStore = create<Store>()((set) => ({
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
      }))
  }
}))

useStore.getState().setGame(JSON.parse(window.localStorage.getItem('game') || '{}'))

export const reset = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear()
    useStore.getState().setGame(initialState.game as Store['game'])
    useStore.getState().setConsole(initialState.console as Store['console'])
  }
}

export default useStore
