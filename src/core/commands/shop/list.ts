import { chooseList } from '@utils/utils'

import { registerCommand } from '../../commands'
import stream from '../../iostream'

registerCommand({
  name: 'list',
  location: 'shop',
  description: 'view available products',
  mainFunc: async () => {
    await stream.writeGradually('\n  available products')
    stream.writeLn('  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾')
    const itemList = [
      '100$ - new router (x1.2 internet speed)',
      '150$ - faster mining',
      '1000$ - double mining speed'
    ]
    stream.write(itemList[await chooseList(stream, itemList)])
    stream.writeLn(' ')
    return 0
  }
})
