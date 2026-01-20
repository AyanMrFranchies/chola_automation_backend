export function getExpiryTime(min = 5) {
  return new Date(Date.now() + min * 60 * 1000);
}
