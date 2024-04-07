import { registerCommand } from '../../commands'
import stream from '../../iostream'

registerCommand({
  name: 'categories',
  location: 'shop',
  mainFunc: async () => {
    await stream.writeGradually('categories: ')
    return 0
  }
})
