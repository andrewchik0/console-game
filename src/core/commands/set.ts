import useStore from '@store/store'

import { registerCommand } from '../commands'
import stream from '../iostream'

const env = process.env.NODE_ENV
if (env == 'development') {
  registerCommand({
    name: 'set',
    location: '',
    description: 'set <name> <value>',
    mainFunc: async (args) => {
      const state = { ...useStore.getState() }
      let ref: any = state

      const strNotation = args[0].split('.')
      while (strNotation.length !== 1) {
        ref = ref[strNotation[0]]
        strNotation.shift()
      }
      ref[strNotation[0]] = args[1]

      useStore.setState({ ...state })
      return 0
    }
  })
}
