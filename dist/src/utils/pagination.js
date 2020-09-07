"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaginatedUrl = exports.getPaginationRanges = void 0;
const lodash = require("lodash");
function getPaginationRanges(currentPage, resultsPerPage, totalResults) {
    const paddingAroundCurrentPage = 2;
    const pageCount = Math.max(Math.ceil(totalResults / resultsPerPage), 1);
    currentPage = Math.min(Math.max(1, currentPage), pageCount);
    const paginationRanges = [
        [1],
        lodash.range(Math.max(1, currentPage - paddingAroundCurrentPage), Math.min(currentPage + paddingAroundCurrentPage + 1, pageCount + 1)),
        [pageCount],
    ];
    return paginationRanges.reduce(function (ranges, currRange) {
        if (currRange.length === 0)
            return ranges;
        const unchangedRanges = [...ranges];
        const prevRange = unchangedRanges.pop();
        if (prevRange[prevRange.length - 1] >= currRange[0] - 1) {
            const newRange = lodash.uniq([...prevRange, ...currRange]);
            return [...unchangedRanges, newRange];
        }
        else {
            return [...unchangedRanges, prevRange, currRange];
        }
    }, [paginationRanges[0]]);
}
exports.getPaginationRanges = getPaginationRanges;
function generatePaginatedUrl(request, page) {
    const url = new URL(request.url, 'http://example.com');
    url.searchParams.set('page', page.toString());
    return request.path + url.search;
}
exports.generatePaginatedUrl = generatePaginatedUrl;
//# sourceMappingURL=pagination.js.map