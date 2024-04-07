import useStore, { Store } from '@store/store'

import { renderLoading, renderUnknownHex } from '@utils/utils'

import { registerCommand } from '../commands'
import stream from '../iostream'

let game = useStore.getState().game
useStore.subscribe((state: Store) => (game = state.game))

registerCommand({
  name: 'miner',
  location: '',
  mainFunc: async () => {
    await stream.writeGradually('press or hold space to start')
    stream.writeLn('\n')
    let length = 0

    while (true) {
      let key = ''

      while (key !== ' ') {
        key = await stream.readKey()
      }
      await renderUnknownHex(
        stream,
        1 / Math.pow(game.decryptingSpeed, 0.35),
        game.amountOfHashPerClick
      )
      length += game.amountOfHashPerClick

      if (length >= 16) {
        length = 0
        game.increaseMoney(game.moneyPerBlock)
        stream.writeLn('')
        await renderLoading(
          stream,
          'downloading new block: ',
          16 / Math.pow(game.internetSpeed, 0.5)
        )
      }
    }
    return 0
  }
})
