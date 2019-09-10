import { Request } from 'express'
import lodash = require('lodash')

export function getPaginationRanges(
  currentPage: number,
  resultsPerPage: number,
  totalResults: number,
) {
  const paddingAroundCurrentPage = 2

  // 0 results corresponds to 1 page
  const pageCount = Math.max(Math.ceil(totalResults / resultsPerPage), 1)

  // make sure we don't have an out-of-range page
  currentPage = Math.min(Math.max(1, currentPage), pageCount)

  const paginationRanges = [
    [1],
    lodash.range(
      Math.max(1, currentPage - paddingAroundCurrentPage),
      Math.min(currentPage + paddingAroundCurrentPage + 1, pageCount + 1),
    ),
    [pageCount],
  ]

  return paginationRanges.reduce(
    function(ranges, currRange) {
      if (currRange.length === 0) return ranges

      const unchangedRanges = [...ranges]
      const prevRange: number[] = unchangedRanges.pop()

      if (prevRange[prevRange.length - 1] >= currRange[0] - 1) {
        // The two ranges are sequential or intersecting; merge them
        const newRange = lodash.uniq([...prevRange, ...currRange])
        return [...unchangedRanges, newRange]
      } else {
        return [...unchangedRanges, prevRange, currRange]
      }
    },
    [paginationRanges[0]],
  )
}

export function generatePaginatedUrl(request: Request, page: number) {
  const url = new URL(request.url, 'http://example.com') // URL base isn't actually used
  url.searchParams.set('page', page.toString())
  return request.path + url.search
}
