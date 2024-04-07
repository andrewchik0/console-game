import stream from '@core/iostream'

const renderDialogue = async (strings: string[]) => {
  const stringsWithoutLast = strings.slice(0, -1)
  for (const str of stringsWithoutLast) {
    await stream.writeGradually('- ' + str)

    let key = ''
    while (key !== ' ' && key !== 'Enter') {
      key = await stream.readKey()
    }
  }
  await stream.writeGradually('- ' + strings[strings.length - 1])
}

export default renderDialogue
