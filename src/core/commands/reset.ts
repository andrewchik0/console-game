import { reset } from '@store/store'

import { confirmed } from '@utils/utils'

import { registerCommand } from '../commands'
import stream from '../iostream'

registerCommand({
  name: 'reset',
  location: '',
  description: 'reset all progress',
  mainFunc: async () => {
    if (await confirmed(stream)) reset()
    return 0
  }
})
