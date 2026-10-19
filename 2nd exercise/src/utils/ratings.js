export const MAX_STARS = 5;
export const STAR_VALUES = [5, 4, 3, 2, 1];

const LABELS = [
  { min: 4.5, label: 'Excellent' },
  { min: 4, label: 'Very good' },
  { min: 3, label: 'Good' },
  { min: 2, label: 'Fair' },
  { min: 0, label: 'Poor' },
];

const toCount = (value) => (Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);

export function summariseRatings(ratings = []) {
  const counts = new Map(STAR_VALUES.map((stars) => [stars, 0]));
  ratings.forEach(({ stars, count }) => {
    if (counts.has(stars)) {
      counts.set(stars, counts.get(stars) + toCount(count));
    }
  });

  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  const weighted = [...counts].reduce((sum, [stars, count]) => sum + stars * count, 0);
  const average = total === 0 ? 0 : Math.round((weighted / total) * 10) / 10;

  const breakdown = STAR_VALUES.map((stars) => {
    const count = counts.get(stars);
    return { stars, count, percentage: total === 0 ? 0 : (count / total) * 100 };
  });

  return { total, average, breakdown };
}

export function getRatingLabel(average, total) {
  if (!total) {
    return 'No ratings yet';
  }
  return LABELS.find(({ min }) => average >= min).label;
}

export function starFill(rating, index) {
  return Math.min(Math.max(rating - index, 0), 1);
}

const numberFormat = new Intl.NumberFormat('en-GB');
export const formatCount = (count) => numberFormat.format(count);
