import React, { useState, useEffect } from "react";
import axios from "axios";

import API_URL from "../../Constant/constant";
import { formatDate } from "../../Utils/helper";

const { WORLD_CLOCK_API } = API_URL;

function WorldClock() {
  const [time, setTime] = useState(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState("Asia/Kolkata"); // Default to IST

  useEffect(() => {
    // Function to fetch time from the Internet time API
    const fetchTime = async () => {
      try {
        const response = await axios.get(
          `${WORLD_CLOCK_API}/${selectedTimeZone}`
        );
        setTime(response.data.utc_datetime);
      } catch (error) {
        console.error("Error fetching time:", error);
        setTime(null);
      }
    };

    // Fetch time initially
    fetchTime();
  }, [selectedTimeZone]);

  useEffect(() => {
    // Update time every second
    let localTime = null;
    const intervalId = setInterval(() => {
      localTime = time;
      if (!localTime) {
        return null;
      }
      const newDate = new Date(localTime);
      newDate.setSeconds(newDate.getSeconds() + 1);
      localTime = newDate.toISOString();
      setTime(localTime);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [time]);

  const handleTimeZoneChange = async (event) => {
    const newTimeZone = event.target.value;
    setSelectedTimeZone(newTimeZone);
  };

  return (
    <div>
      <h1>Internet Time Display</h1>
      <label htmlFor="timeZone">Select Time Zone:</label>
      <select
        id="timeZone"
        value={selectedTimeZone}
        onChange={handleTimeZoneChange}
      >
        <option value="Asia/Kolkata">IST</option>
        <option value="America/Los_Angeles">PST</option>
      </select>
      {time && <p>Current Time: {formatDate(time, selectedTimeZone)}</p>}
    </div>
  );
}

export default WorldClock;
