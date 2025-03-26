/**
 * Simple utility to combine CSS classes
 * Replacement for the cn function from shadcn
 */
export function classNames(...classes: (string | boolean | undefined | null | { [key: string]: boolean })[]): string {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'object') {
        return Object.keys(cls).filter(key => cls[key]).join(' ');
      }
      return cls;
    })
    .join(' ');
}
