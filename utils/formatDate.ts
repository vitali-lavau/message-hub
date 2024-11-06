import { format, isToday } from 'date-fns';

export function formatDate(date: Date): string {
    if (isToday(date)) {
        return 'Today';
    }
    return format(date, 'EEEE, MMMM do');
}