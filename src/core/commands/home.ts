import useStore from '@store/store'

import { registerCommand } from '../commands'
import stream from '../iostream'

registerCommand({
  name: ['home', 'back'],
  location: '',
  description: 'go home location',
  skipLocationChecking: true,
  mainFunc: async () => {
    stream.setLocation('')
    useStore.getState().game.setCommandAvailability('home', false)
    return 0
  }
})
