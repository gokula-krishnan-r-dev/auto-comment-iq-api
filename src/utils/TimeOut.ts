export function timeAgoString(publishedAt: any) {
  const secondsAgo = Math.floor((Date.now() - publishedAt.getTime()) / 1000);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  if (secondsAgo < minute) {
    return `${secondsAgo} sec ago`;
  } else if (secondsAgo < hour) {
    const minutes = Math.floor(secondsAgo / minute);
    return `${minutes} min ago`;
  } else if (secondsAgo < day) {
    const hours = Math.floor(secondsAgo / hour);
    return `${hours} hour ago`;
  } else if (secondsAgo < month) {
    const days = Math.floor(secondsAgo / day);
    return `${days} day ago`;
  } else {
    const months = Math.floor(secondsAgo / month);
    return `${months} month ago`;
  }
}
