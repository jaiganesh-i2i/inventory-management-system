/**
 * Helper utility functions
 */

/**
 * Safely parse an integer from a string, returning 0 if invalid
 */
export const safeParseInt = (value: string | undefined): number => {
  if (!value) return 0;
  const parsed = parseInt(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Safely parse a boolean from a string
 */
export const safeParseBoolean = (value: string | undefined): boolean | undefined => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

/**
 * Safely parse sort order
 */
export const safeParseSortOrder = (value: string | undefined): 'asc' | 'desc' => {
  return (value === 'asc' || value === 'desc') ? value : 'desc';
}; 