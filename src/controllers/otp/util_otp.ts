import moment from "moment";

/**
 * Generate a random 6-digit numeric code
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Add seconds to the current date and return the result
 */
export function getOtpExpireAt(seconds = 3600): Date {
  return moment().add(seconds, "seconds").toDate();
}
