export default function (input: string): string | undefined {
  // Regular expression to match the videoId
  const videoIdRegex = /https:\/\/i\.ytimg\.com\/sb\/([a-zA-Z0-9_-]+)\//

  // Execute the regular expression on the input string
  const match = input.match(videoIdRegex)

  // If match found, return the videoId (first capturing group), otherwise return undefined
  return match ? match[1] ?? undefined : undefined
}
