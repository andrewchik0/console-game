import useStore from '@store/store'

import { registerCommand } from '../commands'
import stream from '../iostream'

const env = process.env.NODE_ENV
if (env == 'development') {
  registerCommand({
    name: 'dev',
    location: '',
    description: 'turn on dev mode',
    mainFunc: async () => {
      useStore.getState().setIsDev(!useStore.getState().isDev)
      stream.writeLn(useStore.getState().isDev ? 'on' : 'off')
      return 0
    }
  })
}
