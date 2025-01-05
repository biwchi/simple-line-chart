export function parsePercent(str: string) {
  const match = str.match(/^(\d+)%$/)

  if (!match) {
    console.warn(`Invalid percent string: ${str}`)
    return 0
  }

  return Number.parseFloat(match[1]) / 100
}
