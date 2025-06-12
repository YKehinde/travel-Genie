import { generateGygLink } from './generateGygLink'

export function linkifyDynamicActivities(
  text: string,
  destination: string,
): string {
  // Matches [text](https://example.com/...) style links
  const linkRegex = /\[([^\]]+)\]\(https:\/\/example\.com\/[^\)]+\)/g

  if (typeof text !== 'string') {
    return ''
  }
  return text.replace(linkRegex, (_match, activity) => {
    const url = generateGygLink(destination, activity)
    return `[${activity}](${url})`
  })
}
