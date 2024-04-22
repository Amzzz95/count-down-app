import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import constant from "../../Constant/constant";
import { formatDate } from "../../Utils/helper";
import { MyContext } from "../../Context/Context";

const { WORLD_CLOCK_API, TIME_ZONE_OPTIONS } = constant;

function WorldClock() {
  const { showError } = useContext(MyContext);
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
        const timeZoneOption = TIME_ZONE_OPTIONS.find(
          (timeZone) => timeZone.timeZoneValue === selectedTimeZone
        );
        showError(`Error fetching time for ${timeZoneOption?.timeZone} zone`);
        console.error(
          `Error fetching time for ${timeZoneOption?.timeZone} zone`,
          error
        );
        setTime(null);
      }
    };

    // Fetch time initially
    fetchTime();
  }, [selectedTimeZone, showError]);

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
        {TIME_ZONE_OPTIONS.map((timeZoneOption) => {
          return (
            <option value={timeZoneOption.timeZoneValue}>
              {timeZoneOption.timeZone}
            </option>
          );
        })}
      </select>
      {time && <p>Current Time: {formatDate(time, selectedTimeZone)}</p>}
    </div>
  );
}

export default WorldClock;
