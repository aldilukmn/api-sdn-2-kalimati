export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(word => {
      const match = word.match(/^([^a-z]*)([a-z].*)$/);
      if (match) {
        return match[1] + match[2].charAt(0).toUpperCase() + match[2].slice(1);
      }
      return word;
    })
    .join(" ");
};