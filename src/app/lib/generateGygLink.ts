/**
 * Builds a GetYourGuide affiliate search URL from destination + activity text
 *
 * @param destination - e.g. "Tokyo"
 * @param activity - e.g. "robot restaurant"
 * @returns Full GYG search URL with partner tracking
 */
export function generateGygLink(destination: string, activity: string): string {
  const query = encodeURIComponent(`${destination} ${activity}`)
  return `https://www.getyourguide.com/s/?q=${query}&partner_id=JHEOJMX&utm_medium=online_publisher`
}
