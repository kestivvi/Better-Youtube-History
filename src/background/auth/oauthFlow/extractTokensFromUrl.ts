type Tokens = {
  access_token: string
  refresh_token: string
  provider_token: string
  provider_refresh_token: string
}

export default function extractTokensFromUrl(url: string): Tokens | null {
  const hash = new URL(url).hash.slice(1)
  if (!hash) return null

  const tokens = hash.split("&").reduce(
    (acc, part) => {
      const [key, value] = part.split("=")
      if (key && value) acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

  if (
    tokens.access_token &&
    tokens.refresh_token &&
    tokens.provider_token &&
    tokens.provider_refresh_token
  ) {
    return tokens as Tokens
  }

  return null
}
