
export function isSameLocalDay(
  isoDateString: string,
  nowOverride?: Date
): boolean {
  if (!isoDateString) return false;

  try {
    const inputDate = new Date(isoDateString);
    const now = nowOverride ?? new Date();

    return (
      inputDate.getFullYear() === now.getFullYear() &&
      inputDate.getMonth() === now.getMonth() &&
      inputDate.getDate() === now.getDate()
    );
  } catch (e) {
    console.error('Invalid date input:', isoDateString, e);
    return false;
  }
}

export function isFutureTimeToday(timeStr: string, now: Date = new Date()): boolean {
  const [hours, minutes] = timeStr.split(':').map(Number);

  const todayTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );

  return todayTime.getTime() > now.getTime();
}

