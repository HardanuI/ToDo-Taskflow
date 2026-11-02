import { format, parseISO, isValid } from 'date-fns';
import { enUS, id } from 'date-fns/locale';

export function parseDate(dateStr) {
  if (!dateStr) return null;
  try {
    const parsed = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function formatDate(dateStr, formatStr = 'dd MMM yyyy', locale = enUS) {
  const date = parseDate(dateStr);
  if (!date) return '';
  return format(date, formatStr, { locale });
}

export function formatTime(dateStr, formatStr = 'HH:mm') {
  const date = parseDate(dateStr);
  if (!date) return '';
  return format(date, formatStr);
}

export function formatDateTime(dateStr, formatStr = 'dd MMM yyyy, HH:mm', locale = enUS) {
  const date = parseDate(dateStr);
  if (!date) return '';
  return format(date, formatStr, { locale });
}

export function formatTimeRange(startStr, endStr) {
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  if (!start && !end) return '';
  if (start && !end) return formatTime(start);
  return `${formatTime(start)} - ${formatTime(end)}`;
}

