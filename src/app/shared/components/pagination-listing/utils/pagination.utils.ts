// src/app/shared/utils/get-pagination-range.ts
export function getPaginationRange(
  current: number,
  total: number,
  maxVisible: number = 5
): (number | string)[] {
  const delta = Math.floor((maxVisible - 3) / 2); // how many pages to show around current
  const range: (number | string)[] = [];

  const showLeftDots = current - delta > 2;
  const showRightDots = current + delta < total - 1;

  range.push(1); // Always show first page

  if (showLeftDots && !showRightDots) {
    const start = total - (maxVisible - 2);
    for (let i = start; i < total; i++) {
      range.push(i);
    }
    range.splice(1, 0, '...');
  } else if (!showLeftDots && showRightDots) {
    for (let i = 2; i < maxVisible - 1; i++) {
      range.push(i);
    }
    range.push('...');
  } else if (showLeftDots && showRightDots) {
    range.push('...');
    for (let i = current - delta; i <= current + delta; i++) {
      range.push(i);
    }
    range.push('...');
  } else {
    for (let i = 2; i < total; i++) {
      range.push(i);
    }
  }

  if (total > 1) range.push(total); // Always show last page
  return range;
}
