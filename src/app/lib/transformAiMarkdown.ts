import { generateGygLink } from './generateGygLink'

export function transformAiMarkdown(
  text: string = '',
  destination: string,
): string {
  const lines = text.split('\n')
  let currentTitle: string | null = null

  const output = lines.map((line, index) => {
    // Look ahead to find the next [Book now](...) and associate it with the most recent title line

    if (line.trim() === '') {
      return line // preserve blank lines
    }

    // Capture the title line (first line of a block)
    const isTitleLine = index === 0 || lines[index - 1].trim() === ''

    if (isTitleLine && !line.includes('[Book now]')) {
      currentTitle = line.replace(/^[^\w\d]+/, '').trim() // remove emoji from start
      return line
    }

    // Replace the Book now URL using the cleaned title
    if (line.includes('[Book now]') && currentTitle) {
      const newUrl = generateGygLink(destination, currentTitle)
      return `[Book now](${newUrl})`
    }

    return line
  })

  return output.join('\n')
}
