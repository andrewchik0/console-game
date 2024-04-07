import { registerCommand } from '../commands'
import stream from '../iostream'

registerCommand({
  name: ['home', 'back'],
  location: '',
  mainFunc: async () => {
    stream.setLocation('')
    return 0
  }
})
