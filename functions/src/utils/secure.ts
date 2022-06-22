export const secure = (input: string, n = 5): string => {
  if (!input) {
    return input;
  }

  const numberOfCharacters = Math.max(n, input.length - n);
  const regex = new RegExp(`^.{0, ${numberOfCharacters}}`, 'g');

  return input.replace(regex, '*');
};
