const FAVICON_API = 'https://favicons.fuzqing.workers.dev/api/getFavicon?url='

export const DEFAULT_FAVICON =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMjg5M2ZkIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTE2IDJhMTQgMTQgMCAxIDAgMCAyOGExNCAxNCAwIDAgMCAwLTI4em0wIDIuN2M0LjA3IDAgNy40NyAyLjMyIDkuMjMgNS43aC0xOC40NkM4LjUzIDcuMDIgMTEuOTMgNC43IDE2IDQuN3ptLTkuNjUgNy4zaDE5LjNjLjMyIDEuMDguNDggMi4yLjQ4IDMuM3MtLjE2IDIuMjItLjQ4IDMuM0g2LjM1YTUuODkgNS44OSAwIDAgMSAwLTYuNnptLjkyIDguM2gxNy41Yy0xLjc2IDMuMzgtNS4xNiA1LjctOS4yMyA1LjctNC4wNyAwLTcuNDctMi4zMi05LjIzLTUuN3oiLz48L3N2Zz4='

function getDomainName(url: string) {
  const domain = url.replace(/(^\w+:|^)\/\//, '')
  const matches = domain.match(/([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/)
  return matches && matches.length > 1 ? matches[1] : null
}

export function getFaviconUrl(url: string) {
  const domain = getDomainName(url)
  if (!domain) return ''
  const faviconUrl = `${FAVICON_API}${domain}&size=64`
  console.log('[favicon]', faviconUrl)
  return faviconUrl
}
