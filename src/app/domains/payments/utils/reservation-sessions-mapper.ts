import { extractDayIdFromDateString } from "./date-helpers";

export interface IReservationInput {
  date: string | Date;
  time_id: {
    id?: number;
    start_time: string;
    end_time: string;
    [key: string]: any; // Allows for other properties in time_id if they exist
  };
}

export interface IMappedReservationOutput {
  date: string; // Changed to string for 'YYYY-MM-DD' format
  start_time: string;
  end_time: string;
  day_id: number; // Day of the week (1=Monday, ..., 7=Sunday)
}

export function mapReservationsToSimplifiedFormat(
  reservationsList: IReservationInput[]
): IMappedReservationOutput[] {
  if (!reservationsList || !Array.isArray(reservationsList)) {
    console.warn('Invalid input: reservationsList must be an array.');
    return [];
  }

  return reservationsList.map(item => {
    const startTime = item.time_id?.start_time || '';
    const endTime = item.time_id?.end_time || '';

    let formattedDate = '';
    let dayId: number | null = null;

    try {
      const dateObj = new Date(item.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date format');
      }

      // Format to 'YYYY-MM-DD' in UTC to avoid timezone shifts
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;

      // Use your helper to determine day_id
      dayId = extractDayIdFromDateString(formattedDate);
      if (dayId === null) {
        throw new Error(`extractDayIdFromDateString returned null for ${formattedDate}`);
      }

    } catch (e) {
      console.error(`Error processing date "${item.date}":`, e);
      formattedDate = '';
      dayId = -1; // fallback to indicate error
    }

    return {
      date: formattedDate,
      start_time: startTime,
      end_time: endTime,
      day_id: dayId!
    };
  });
}

// Example Usage (for testing purposes)
/*
const packagesReservationsList = [
  {
    "date": "2025-07-07T09:29:00.861Z", // Monday
    "time_id": {
      "start_time": "13:00",
      "end_time": "13:15"
    }
  },
  {
    "date": "2025-07-13T21:00:00.000Z", // Sunday
    "time_id": {
      "start_time": "17:00",
      "end_time": "17:15"
    }
  },
  {
    "date": "2025-07-27T21:00:00.000Z", // Sunday
    "time_id": {
      "start_time": "17:00",
      "end_time": "17:15"
    }
  },
  {
    "date": "2025-08-12", // Example with a simple date string input
    "time_id": {
      "start_time": "09:00",
      "end_time": "09:30"
    }
  },
  {
    "date": "InvalidDateString", // Example of an invalid date
    "time_id": {
      "start_time": "09:00",
      "end_time": "09:30"
    }
  }
];

const mappedData = mapReservationsToSimplifiedFormat(packagesReservationsList);
console.log(mappedData);
// Expected output:
// [
//   { date: '2025-07-07', start_time: '13:00', end_time: '13:15', day_id: 1 }, // Monday
//   { date: '2025-07-13', start_time: '17:00', end_time: '17:15', day_id: 7 }, // Sunday
//   { date: '2025-07-27', start_time: '17:00', end_time: '17:15', day_id: 7 }, // Sunday
//   { date: '2025-08-12', start_time: '09:00', end_time: '09:30', day_id: 2 }, // Tuesday (assuming UTC)
//   { date: '', start_time: '09:00', end_time: '09:30', day_id: -1 } // Example with error
// ]
*/
