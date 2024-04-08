import { start } from '@constants/dialogues'

import useStore from '@store/store'

import { registerCommand } from '../commands'
import renderDialogue from '../dialogueRenderer'

registerCommand({
  name: 'start',
  location: '',
  description: 'start the journey',
  mainFunc: async () => {
    await renderDialogue(start)
    useStore.getState().game.setCommandAvailability('miner', true)
    return 0
  }
})
