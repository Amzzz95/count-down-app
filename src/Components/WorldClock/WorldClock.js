import React, { useState, useEffect } from "react";
import axios from "axios";

const HOST_API = "http://worldtimeapi.org/api/timezone";
function WorldClock() {
  const [time, setTime] = useState(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState("Asia/Kolkata"); // Default to IST

  useEffect(() => {
    // Function to fetch time from the Internet time API
    const fetchTime = async () => {
      try {
        const response = await axios.get(`${HOST_API}/${selectedTimeZone}`);
        setTime(response.data.utc_datetime);
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    // Fetch time initially
    fetchTime();

    // Update time every second
    const intervalId = setInterval(fetchTime, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [selectedTimeZone]);

  const handleTimeZoneChange = async (event) => {
    const newTimeZone = event.target.value;
    setSelectedTimeZone(newTimeZone);
  };

  const formattedDateToShow = () => {
    const date = new Date(time).toLocaleString("en-US", {
      timeZone: selectedTimeZone,
    });

    return date;
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
      {time && <p>Current Time: {formattedDateToShow()}</p>}
    </div>
  );
}

export default WorldClock;
