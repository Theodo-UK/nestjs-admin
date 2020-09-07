import { Request } from 'express';
export declare function getPaginationRanges(currentPage: number, resultsPerPage: number, totalResults: number): number[][];
export declare function generatePaginatedUrl(request: Request, page: number): string;
