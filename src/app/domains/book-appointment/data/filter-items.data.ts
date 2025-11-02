// Define interfaces for type safety
interface Option {
  label: string;
  value: string;
  checked?: boolean; // For checkboxes
  selected?: boolean; // For radio buttons
}

const gender: Option[] = [
  { label: 'ذكر', value: 'male', selected: true },
  { label: 'أنثى', value: 'female', selected: false }
];

const rating: Option[] = [
  { label: '5.0', value: '5.0', selected: false },
  { label: '4.0', value: '4.0', selected: false },
  { label: '3.0', value: '3.0', selected: false },
  { label: '2.0', value: '2.0', selected: false },
  { label: '1.0', value: '1.0', selected: false },
  { label: 'الكل', value: 'all', selected: true }
];

// Export the arrays for use in a component
export {
  gender,
  rating
};
