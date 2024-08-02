// This function extracts the videoId from the style attribute of the mini player.
// Example input:
// "width: 242.342px; height: 135.671px; background: url("https://i.ytimg.com/sb/KWB-gDVuy_I/storyboard3_L1/M0.jpg?sqp=-oaymwENSDfyq4qpAwVwAcABBqLzl_8DBgihu6itBg==&sigh=rs%24AOn4CLAe_oTRY_zugZfgv3aaWjo5TLcjUA") -1458px -544px / 2430px 1360px; --darkreader-inline-bgcolor: initial;"
// Example output: "KWB-gDVuy_I"
// The function uses a regular expression to find the videoId in the URL within the style string.
export default function (input: string): string | undefined {
  const videoIdRegex = /https:\/\/i\.ytimg\.com\/sb\/([a-zA-Z0-9_-]+)\//
  const match = input.match(videoIdRegex)
  if (match) return match[1] ?? undefined
  return undefined
}
