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

  // Find all lines starting with an emoji and extract the activities
  const emojiLineRegex =
    /^([\p{Emoji_Presentation}\p{Emoji}\u200d\uFE0F][^\n]*)/gmu
  const matches = text.match(emojiLineRegex) || []
  const activities = matches.map((line) =>
    line.replace(/^([\p{Emoji_Presentation}\p{Emoji}\u200d\uFE0F])\s*/u, ''),
  )

  return text.replace(linkRegex, (_match, activity) => {
    const index = activities.indexOf(activity)
    const url = generateGygLink(destination, activities[index] || activity)

    console.log(url)

    return `[${activity}](${url})`
  })
}
