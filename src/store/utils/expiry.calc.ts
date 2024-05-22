export function calcExpiry(date: Date, duration: string) {
  const value = parseInt(duration.slice(0, -1));
  const unit = duration.slice(-1);

  switch (unit) {
    case 's': // seconds
      date.setUTCSeconds(date.getUTCSeconds() + value);
      break;
    case 'm': // minutes
      date.setUTCMinutes(date.getUTCMinutes() + value);
      break;
    case 'h': // hours
      date.setUTCHours(date.getUTCHours() + value);
      break;
    case 'd': // days
      date.setUTCDate(date.getUTCDate() + value);
      break;
    case 'w': // weeks
      date.setUTCDate(date.getUTCDate() + value * 7);
      break;
    case 'M': // months
      date.setUTCMonth(date.getUTCMonth() + value);
      break;
    case 'y': // years
      date.setUTCFullYear(date.getUTCFullYear() + value);
      break;
    default:
      throw new Error('Invalid duration unit');
  }

  return date;
}
