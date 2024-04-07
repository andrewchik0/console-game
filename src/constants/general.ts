export const name = 'The Console Miner'

export type HelpUnit = {
  showingText: string
  condition?: string
}
export type StatUnit = {
  fieldName: string
  showingText: string
  condition?: string
}

export type Location = {
  name: string
  help?: HelpUnit[]
  stats?: StatUnit[]
  child?: Location[]
}
export type Locations = Location[]
export const locations: Locations = [
  {
    name: 'shop',
    help: [
      { showingText: "'list <category>' - list items in category" },
      { showingText: "'categories' - list all categories" }
    ]
  },
  {
    name: 'farm'
  }
]

export type ExecutingProgram = {
  name: string
  help?: HelpUnit[]
  stats?: StatUnit[]
}
export type ExecutingPrograms = ExecutingProgram[]
export const executingPrograms: ExecutingPrograms = [
  {
    name: 'start'
  },
  {
    name: 'miner',
    stats: [
      {
        fieldName: 'amountOfHashPerClick',
        showingText: 'blocks/click',
        condition: 'console.amountOfHashPerClick > 1'
      },
      {
        fieldName: 'decryptingSpeed',
        showingText: 'decrypting speed'
      }
    ],
    help: [
      {
        showingText: "'space' - mine blockchain"
      }
    ]
  },
  {
    name: 'shop/list'
  },
  {
    name: 'shop/categories'
  }
]
