import { formatCount, getRatingLabel, starFill, summariseRatings } from '../../src/utils/ratings';

const DESIGN_RATINGS = [
  { stars: 5, count: 952 },
  { stars: 4, count: 171 },
  { stars: 3, count: 55 },
  { stars: 2, count: 14 },
  { stars: 1, count: 40 },
];

describe('summariseRatings', () => {
  it('computes total, average and percentages for the design data', () => {
    const { total, average, breakdown } = summariseRatings(DESIGN_RATINGS);

    expect(total).toBe(1232);
    expect(average).toBe(4.6); // 5677 / 1232 = 4.608
    expect(breakdown.map(({ stars }) => stars)).toEqual([5, 4, 3, 2, 1]);
    expect(breakdown[0].count).toBe(952);
    expect(breakdown[0].percentage).toBeCloseTo(77.27, 2);
  });

  it('returns breakdown ordered 5 to 1 regardless of input order', () => {
    const { breakdown } = summariseRatings([...DESIGN_RATINGS].reverse());
    expect(breakdown.map(({ stars }) => stars)).toEqual([5, 4, 3, 2, 1]);
  });

  it('treats missing star values as zero', () => {
    const { total, average, breakdown } = summariseRatings([{ stars: 4, count: 2 }]);

    expect(total).toBe(2);
    expect(average).toBe(4);
    expect(breakdown.find(({ stars }) => stars === 5)).toEqual({ stars: 5, count: 0, percentage: 0 });
  });

  it('adds up duplicate entries for the same star value', () => {
    const { breakdown } = summariseRatings([
      { stars: 5, count: 1 },
      { stars: 5, count: 2 },
    ]);
    expect(breakdown[0].count).toBe(3);
  });

  it('ignores invalid star values and negative, fractional or non-numeric counts', () => {
    const { total, breakdown } = summariseRatings([
      { stars: 6, count: 10 },
      { stars: 0, count: 10 },
      { stars: 5, count: -3 },
      { stars: 4, count: Number.NaN },
      { stars: 3, count: '7' },
      { stars: 2, count: 2.9 },
    ]);

    expect(total).toBe(2);
    expect(breakdown.find(({ stars }) => stars === 2).count).toBe(2);
  });

  it('returns zeros without dividing by zero when there are no ratings', () => {
    const { total, average, breakdown } = summariseRatings([]);

    expect(total).toBe(0);
    expect(average).toBe(0);
    breakdown.forEach(({ percentage }) => expect(percentage).toBe(0));
  });

  it('defaults to no ratings when called without arguments', () => {
    expect(summariseRatings().total).toBe(0);
  });
});

describe('getRatingLabel', () => {
  it.each([
    [5, 'Excellent'],
    [4.5, 'Excellent'],
    [4.4, 'Very good'],
    [4, 'Very good'],
    [3, 'Good'],
    [2, 'Fair'],
    [1.9, 'Poor'],
    [1, 'Poor'],
  ])('labels an average of %s as "%s"', (average, label) => {
    expect(getRatingLabel(average, 10)).toBe(label);
  });

  it('says there are no ratings when the total is zero', () => {
    expect(getRatingLabel(0, 0)).toBe('No ratings yet');
  });
});

describe('starFill', () => {
  it.each([
    [4.6, 0, 1],
    [4.6, 3, 1],
    [4.6, 4, 0.6],
    [4.6, 5, 0],
    [0, 0, 0],
    [5, 4, 1],
  ])('rating %s fills star %s by %s', (rating, index, expected) => {
    expect(starFill(rating, index)).toBeCloseTo(expected, 5);
  });
});

describe('formatCount', () => {
  it('adds thousands separators', () => {
    expect(formatCount(1232)).toBe('1,232');
    expect(formatCount(40)).toBe('40');
  });
});
