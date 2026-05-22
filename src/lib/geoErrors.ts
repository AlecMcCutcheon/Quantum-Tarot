/** True when browser network location (Google 403, etc.) failed — skip retries, use IP. */
export function isNetworkLocationFailure(err: GeolocationPositionError): boolean {
  const msg = err.message;
  return (
    /403|googleapis|Network location provider/i.test(msg) ||
    err.code === err.POSITION_UNAVAILABLE
  );
}

export function isNetworkLocationBlocked(message: string | null): boolean {
  if (!message) return false;
  return /403|googleapis|Network location provider|IP location/i.test(message);
}
