export function extractDayIdFromDateString(dateString: string): number | null {
  if (!dateString) {
    console.warn('Input dateString is empty or null.');
    return null;
  }

  const dateObj = new Date(dateString);

  // Check if the date parsing resulted in a valid date
  if (isNaN(dateObj.getTime())) {
    console.error(`Invalid date string provided: "${dateString}"`);
    return null;
  }

  // Get the day of the week using JavaScript's getDay() method.
  // jsDay returns: 0 (Sunday), 1 (Monday), ..., 5 (Friday), 6 (Saturday).
  const jsDay = dateObj.getDay();

  // Convert JavaScript's day (0-6) to your desired day_id (1-7, where 1=Saturday, ..., 7=Friday)
  let dayId: number;
  if (jsDay === 6) { // If it's Saturday (JS 6), map to 1
    dayId = 1;
  } else if (jsDay === 0) { // If it's Sunday (JS 0), map to 2
    dayId = 2;
  } else { // For Monday (JS 1) through Friday (JS 5), add 2 to shift the days
    dayId = jsDay + 2;
  }

  return dayId;
}

// Example Usage (based on current date: Monday, July 7, 2025)
/*
console.log(`'2025-07-07' (Monday) -> ${extractDayIdFromDateString('2025-07-07')}`); // Expected: 3 (Monday is 3)
console.log(`'2025-07-12' (Saturday) -> ${extractDayIdFromDateString('2025-07-12')}`); // Expected: 1 (Saturday is 1)
console.log(`'2025-07-13' (Sunday) -> ${extractDayIdFromDateString('2025-07-13')}`); // Expected: 2 (Sunday is 2)
console.log(`'2025-07-11' (Friday) -> ${extractDayIdFromDateString('2025-07-11')}`); // Expected: 7 (Friday is 7)
console.log(`'2025-07-08' (Tuesday) -> ${extractDayIdFromDateString('2025-07-08')}`); // Expected: 4 (Tuesday is 4)
console.log(`'InvalidDate' -> ${extractDayIdFromDateString('InvalidDate')}`); // Expected: null (and a console error)
console.log(`null input -> ${extractDayIdFromDateString(null as any)}`); // Expected: null (and a console warning)
*/
