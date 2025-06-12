/**
 * Format a date string from ISO format to DD/MM/YYYY - HH:MM
 * @param dateString - Date string in ISO format (e.g., 2025-04-06T22:52:38.379Z)
 * @returns Formatted date string in DD/MM/YYYY - HH:MM format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  // Get date components
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is 0-indexed
  const year = date.getFullYear()

  // Get time components
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${day}/${month}/${year} - ${hours}:${minutes}`
}

/**
 * Format a date string from ISO format to DD/MM/YYYY (date only)
 * @param dateString - Date string in ISO format (e.g., 2025-04-06T22:52:38.379Z)
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDateOnly(dateString: string): string {
  const date = new Date(dateString)

  // Get date components
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is 0-indexed
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
