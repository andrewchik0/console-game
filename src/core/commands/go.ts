import { Location, locations } from '@constants/general'

import { multiplyString } from '@utils/utils'

import { registerCommand } from '../commands'
import stream from '../iostream'

registerCommand({
  name: ['cd', 'go'],
  location: '',
  mainFunc: async (args) => {
    if (args[0] == 'help') {
      await stream.writeGradually('available locations:')

      stream.writeLn(' .')
      const printLocationsRec = (locs: Location[], deepLvl = 1) => {
        locs.forEach((loc) => {
          stream.writeLn(multiplyString(' |', deepLvl) + multiplyString('_', 2) + loc.name)
          if (loc.child) {
            printLocationsRec(loc.child, deepLvl + 1)
          }
        })
      }
      printLocationsRec(locations)
      stream.writeLn(' ')
      return 0
    }
    const path = args[0].split('/')

    const found = (locs: Location[], path: string[]): boolean => {
      let flag = false
      locs.forEach((loc) => {
        if (loc.name == path[0]) {
          if (loc.child && path.length > 1) {
            path.shift()
            flag = found(loc.child, path)
          }
          flag = true
        }
      })
      return flag
    }

    if (found(locations, path)) {
      stream.setLocation(args[0])
    } else {
      await stream.writeGradually(`no such location: ${args[0]}`)
      await stream.writeGradually(`to list all available locations use 'go help'`)
    }
    return 0
  }
})
