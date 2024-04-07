import { chooseList } from '@utils/utils'

import { registerCommand } from '../../commands'
import stream from '../../iostream'

registerCommand({
  name: 'list',
  location: 'shop',
  mainFunc: async () => {
    await stream.writeGradually('shop:\n ')
    const itemList = ['123', 'adfasdf', 'some stuff']
    stream.write(itemList[await chooseList(stream, itemList)])
    stream.writeLn(' ')
    return 0
  }
})
