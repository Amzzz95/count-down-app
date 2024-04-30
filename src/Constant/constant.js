export default Object.freeze({
  HOST_API: process.env.REACT_APP_HOST_API,
  WORLD_CLOCK_API: "https://worldtimeapi.org/api/timezone",
  TIME_ZONE_OPTIONS: [
    {
      timeZone: "IST",
      timeZoneValue: "Asia/Kolkata",
    },
    {
      timeZone: "PST",
      timeZoneValue: "America/Los_Angeles",
    },
  ],
});
