import { getTrackedProgress, showTip, trackProgress } from '@core/tips'

import useStore from '@store/store'

import { chooseList, lastRenderedListLength } from '@utils/utils'

import { registerCommand } from '../../commands'
import stream from '../../iostream'

type Item = {
  onChoose: () => void
  showingName: string
  cost: number
}

const generateItemList = (): Item[] => {
  const items: Item[] = []

  const decSpeed = useStore.getState().game.decryptingSpeed
  const newDecSpeed = Math.floor(Math.pow(decSpeed, 1.2)) + 1
  const decSpeedCost = Math.floor(2 * newDecSpeed)
  items.push({
    onChoose: () => {
      useStore.getState().game.increaseDecryptingSpeed(newDecSpeed - decSpeed)
    },
    showingName: `increase decrypting speed (${decSpeed} -> ${newDecSpeed})`,
    cost: decSpeedCost
  })
  const internetSpeed = useStore.getState().game.internetSpeed
  const newInternetSpeed = Math.floor(Math.pow(internetSpeed, 1.1)) + 1
  const internetSpeedCost = Math.floor(2 * newInternetSpeed)
  items.push({
    onChoose: () => {
      useStore.getState().game.increaseInternetSpeed(newInternetSpeed - internetSpeed)
    },
    showingName: `increase internet speed (${internetSpeed} -> ${newInternetSpeed})`,
    cost: internetSpeedCost
  })

  if (!getTrackedProgress('double_hash_per_click')) {
    items.push({
      onChoose: () => {
        useStore
          .getState()
          .game.increaseAmountOfHashPerClick(useStore.getState().game.amountOfHashPerClick)
        trackProgress('double_hash_per_click')
      },
      showingName: `double the speed of decrypting`,
      cost: 16
    })
  }
  return items
}

// Consumes money if enough money.
// Returns success of operation
const consumeMoneyIfPossible = (amount: number): boolean => {
  if (useStore.getState().game.money < amount) return false
  useStore.getState().game.decreaseMoney(amount)
  return true
}

registerCommand({
  name: 'list',
  location: 'shop',
  description: 'view available products',
  onExit: () => {
    if (!getTrackedProgress('first_leave_from_shop')) {
      showTip('first_leave_from_shop')
      trackProgress('first_leave_from_shop')
    }
  },
  mainFunc: async () => {
    await stream.writeGradually('\n  available products')
    stream.writeLn('  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾')

    let index = 0

    while (true) {
      const itemList = generateItemList()
      index = await chooseList(
        stream,
        itemList.map((item) => `${item.cost}$ - ${item.showingName}`),
        index
      )

      if (index === -1) {
        return 0
      }
      stream.backspace(lastRenderedListLength)
      if (consumeMoneyIfPossible(itemList[index].cost)) {
        showTip('successfully_bought', ` (1x ${itemList[index].showingName})`)
        itemList[index].onChoose()
      } else {
        showTip('not_enough_have_money', ` - ${itemList[index].showingName}`)
      }
    }
    return 0
  }
})
