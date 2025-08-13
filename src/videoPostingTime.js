

export function diffTime(publishedDate){
let now = new Date();
publishedDate = new Date(publishedDate);
console.log(now);

  const diffInMs = now - publishedDate;
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (days < 7) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (weeks < 4) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (months < 12) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}

function formatCompactNumber(num) {
  if (num < 1000) return num.toString();

  const units = ["", "K", "M", "B", "T"];
  const tier = Math.floor(Math.log10(num) / 3);

  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
 console.log(scaled.toFixed(1), tier, scale);
  // Round to 1 decimal if not whole number
  const rounded =
    scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1);

  return `${rounded}${units[tier]}`;
}
console.log(formatCompactNumber(12100000)); // "123.5M"