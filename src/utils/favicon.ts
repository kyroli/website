const FAVICON_API = 'https://api.xinac.net/icon/?url='

function getDomainName(url: string) {
  const domain = url.replace(/(^\w+:|^)\/\//, '')
  const matches = domain.match(/([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/)
  return matches && matches.length > 1 ? matches[1] : null
}

export function getFaviconUrl(url: string) {
  const domain = getDomainName(url)
  if (!domain) return ''
  return `${FAVICON_API}https://${domain}`
}
