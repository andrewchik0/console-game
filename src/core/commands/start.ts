import { start } from '@constants/dialogues'

import { registerCommand } from '../commands'
import renderDialogue from '../dialogueRenderer'

registerCommand({
  name: 'start',
  location: '',
  mainFunc: async () => {
    await renderDialogue(start)
    return 0
  }
})
