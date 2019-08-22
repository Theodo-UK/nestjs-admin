import lodash = require('lodash')

export function getPaginationRanges(current: number, resultsPerPage: number, totalResults: number) {
  const delta = 2
  const pages = Math.ceil(totalResults / resultsPerPage)
  current = Math.min(Math.max(1, current), pages)

  const nranges = [
    [1],
    lodash.range(Math.max(1, current - delta), Math.min(current + delta + 1, pages + 1)),
    [pages],
  ]

  return nranges.reduce(
    function(ranges, currRange) {
      if (currRange.length === 0) return [...ranges]

      const prevRange: number[] = ranges[ranges.length - 1]
      if (prevRange[prevRange.length - 1] >= currRange[0] - 1) {
        const lastRange = ranges.pop()

        const newRange = [...lastRange, ...currRange]
        return [...ranges, lodash.uniq(newRange)]
      } else {
        return [...ranges, currRange]
      }
    },
    [nranges[0]],
  )
}

export function getPaginationIndices1dd(
  current: number,
  resultsPerPage: number,
  totalResults: number,
) {
  const pages = Math.ceil(totalResults / resultsPerPage)
  const last = pages
  const delta = 2
  const left = current - delta
  const right = current + delta + 1
  const range = []
  const rangeWithDots = []
  let l = null

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

export function generatePaginationUrl(request: Request, page: number) {
  let url = request.url
  if (!url) url = window.location.href

  const key = 'page'
  const re = new RegExp('([?&])' + key + '=.*?(&|#|$)(.*)', 'gi')
  let hash = null

  if (re.test(url)) {
    if (typeof page !== 'undefined' && page !== null) {
      return url.replace(re, '$1' + key + '=' + page + '$2$3')
    } else {
      hash = url.split('#')
      url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '')
      if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
        url += '#' + hash[1]
      }
      return url
    }
  } else {
    if (typeof page !== 'undefined' && page !== null) {
      const separator = url.indexOf('?') !== -1 ? '&' : '?'
      hash = url.split('#')
      url = hash[0] + separator + key + '=' + page
      if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
        url += '#' + hash[1]
      }
      return url
    } else {
      return url
    }
  }
}
