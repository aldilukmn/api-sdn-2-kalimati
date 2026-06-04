export const capitalizeWords = (
  text: string
): string => {
  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};