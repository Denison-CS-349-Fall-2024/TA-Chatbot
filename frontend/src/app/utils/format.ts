/**
 * Formats a semester string into a more readable format.
 * 
 * @param semester - The semester string in the format 'seasonYYYY'.
 * @returns The formatted semester string in the format 'Season YYYY'.
 */
export function formatSemester(semester: string): string {
  const season = semester.slice(0, -4);
  const year = semester.slice(-4);
  return `${season.charAt(0).toUpperCase()}${season.slice(1)} ${year}`;
}