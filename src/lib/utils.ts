import { format, formatDistanceToNow } from 'date-fns'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return format(date, 'MMM d, yyyy')
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  return formatDistanceToNow(date, { addSuffix: true })
}

export function generateShareId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function getExcerpt(content: string, maxLength = 120): string {
  // Strip markdown syntax for excerpt
  const stripped = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  return truncateText(stripped, maxLength)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const CATEGORIES = [
  'General',
  'Work',
  'Personal',
  'Ideas',
  'Research',
  'Meeting Notes',
  'Todo',
  'Journal',
]
