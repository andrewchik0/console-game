import { registerCommand } from '../commands'
import stream from '../iostream'

registerCommand({
  name: ['home', 'back'],
  location: '',
  skipLocationChecking: true,
  mainFunc: async () => {
    stream.setLocation('')
    return 0
  }
})
