import { registerCommand } from '../commands'
import stream from '../iostream'

registerCommand({
  name: 'help',
  location: '',
  description: '',
  skipLocationChecking: true,
  mainFunc: async () => {
    await stream.writeGradually('look at the right panel')
    return 0
  }
})
