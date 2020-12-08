import { getPaginationRanges } from './pagination';

describe('Pagination', () => {
  it('should produce 2 ranges when current=1, pages=10', () => {
    const result = getPaginationRanges(1, 1, 10);
    expect(result).toStrictEqual([[1, 2, 3], [10]]);
  });

  it('should produce 2 ranges when current=3, pages=10', () => {
    const result = getPaginationRanges(3, 1, 10);
    expect(result).toStrictEqual([[1, 2, 3, 4, 5], [10]]);
  });

  it('should produce 3 ranges when current=5, pages=10', () => {
    const result = getPaginationRanges(5, 1, 10);
    expect(result).toStrictEqual([[1], [3, 4, 5, 6, 7], [10]]);
  });

  it('should produce 1 range when current=1, pages=1', () => {
    const result = getPaginationRanges(1, 1, 1);
    expect(result).toStrictEqual([[1]]);
  });

  it('should produce 1 range when current=1, and totalResults=0', () => {
    const result = getPaginationRanges(1, 1, 0);
    expect(result).toStrictEqual([[1]]);
  });
});
