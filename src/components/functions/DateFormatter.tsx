import dayjs from 'dayjs';

export function DateFormatter(dateString: string): string {
  // Parse dan format tanggal menjadi 'DD/MM/YYYY'
  return dayjs(dateString).format('DD/MM/YYYY');
}