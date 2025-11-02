import { IAppointmentCategory } from "../models";

export const ALL_APPOINTMENT_CATEGORY_ITEM: IAppointmentCategory = {
  "id": 0,
  "name": "all", // Translation key for "All"
  "color": "#000000",
  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcast-categories-images/nUq3DKDekYKIBR1g9NqFcVzSnthxfvpeW6Iryn3B.png",
  "created_at": "2024-07-30T15:49:47.000000Z",
  "updated_at": "2024-07-30T15:49:47.000000Z",
  status: null, // No status filter for 'All'
  is_start: null,
  is_end: null,
  badge_class: 'badge-info' // Example class
};

export const APPOINTMENT_CATEGORIES: IAppointmentCategory[] = [
  ALL_APPOINTMENT_CATEGORY_ITEM,
  {
    "id": 'Upcoming',
    "name": "upcoming",
    "color": "#000000",
    "image": "",
    "created_at": "",
    "updated_at": "",
    status: 1, // Assuming 1 means active/scheduled
    is_start: 0, // Not started
    is_end: 0,   // Not ended
    badge_class: 'badge-primary' // Example class
  },
  {
    "id": 'Ongoing', // New ID for Ongoing
    "name": "running", // Translation key for Ongoing (جارية)
    "color": "#000000",
    "image": "",
    "created_at": "",
    "updated_at": "",
    status: 1, // Active
    is_start: 1, // Started
    is_end: 0,   // Not ended
    badge_class: 'badge-warning' // Example class
  },
  {
    "id": 'Completed',
    "name": "completed",
    "color": "#000000",
    "image": "",
    "created_at": "",
    "updated_at": "",
    status: 1, // Active
    is_start: 1, // Started
    is_end: 1,   // Ended
    badge_class: 'badge-success' // Example class
  },
  {
    "id": 'Cancelled',
    "name": "cancelled",
    "color": "#000000",
    "image": "",
    "created_at": "",
    "updated_at": "",
    status: 0, // Cancelled
    is_start: null, // Irrelevant for cancelled
    is_end: null,   // Irrelevant for cancelled
    badge_class: 'badge-danger' // Example class
  }
];
