
export function generateInitials(fullName: string | null | undefined): string {
  if (!fullName || typeof fullName !== 'string') {
    return '?';
  }

  const trimmedName = fullName.trim();
  if (!trimmedName) {
    return '?';
  }

  // Handle Arabic or any script: get first character as-is
  const normalizeChar = (char: string) =>
    /[a-zA-Z]/.test(char) ? char.toUpperCase() : char;

  // If it's a single word, return the first character (capitalized if Latin)
  if (!trimmedName.includes(' ')) {
    return normalizeChar(trimmedName.charAt(0));
  }

  // Split into words and take the first char of up to 2 words
  const words = trimmedName.split(/\s+/);
  return words
    .slice(0, 2)
    .map(word => normalizeChar(word.charAt(0)))
    .join('');
}


export function shouldShowImage(imageUrl: string | null | undefined): boolean {
  return !!(imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined');
}

export function getAvatarBackgroundColor(name: string | null | undefined): string {
  if (!name) {
    return '#0E39B6'; // Default blue
  }

  // Generate a consistent color based on the name
  const colors = [
    '#0E39B6', // Blue
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function testArabicInitials(name: string): string {
  return generateInitials(name);
}
