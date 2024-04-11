import React, { useState, useEffect } from "react";
import axios from "axios";

import API_URL from "../../Constant/constant";

const { HOST_API } = API_URL;

const CountdownTimer = ({ id, initialSeconds, timerName, onRemove }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, seconds]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = async () => {
    const updateObj = {
      id,
      activeTimeInSeconds: initialSeconds - seconds,
    };
    try {
      setIsActive(false);
      const result = await axios.put(`${HOST_API}/counter`, updateObj);
      return result;
    } catch (error) {
      console.error("Error while updating counter", error);
      setIsActive((prev) => prev);
    }
  };

  const handleDelete = async () => {
    const updateObj = {
      id,
      activeTimeInSeconds: initialSeconds - seconds,
      deletionDate: new Date(),
    };
    try {
      setIsActive(false);
      await axios.put(`${HOST_API}/counter`, updateObj);
      onRemove(id);
    } catch (error) {
      console.error("Error while updating counter", error);
      setIsActive((prev) => prev);
    }
  };

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div>
      <div>
        {timerName}&nbsp;
        {minutes}:
        {remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
        &nbsp;
        <button onClick={handleStart}>Start</button>&nbsp;
        <button onClick={handleStop}>Stop</button>&nbsp;
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

const StopwatchManager = () => {
  const [timers, setTimers] = useState([]);
  const [initialSeconds, setInitialSeconds] = useState("");
  const [timerName, setTimerName] = useState("");

  const handleAddTimer = async () => {
    if (timerName.trim === "" || !initialSeconds || initialSeconds <= 0) {
      return null;
    }
    const addObj = {
      timerName,
      timerValue: initialSeconds,
    };
    try {
      const {
        data: { data: id },
      } = await axios.post(`${HOST_API}/counter`, addObj);
      setTimers([
        ...timers,
        { id, seconds: parseInt(initialSeconds), timerName },
      ]);
    } catch (error) {
      console.error("Error while adding countdown timer", error);
      setTimers((prev) => prev);
    }
    setTimerName("");
    setInitialSeconds("");
  };

  const handleRemoveTimer = (timerId) => {
    setTimers(timers.filter((timer) => timer.id !== timerId));
  };

  return (
    <div>
      <h1>Stopwatch Manager</h1>
      <div className="stopwatch-manager">
        <input
          name="stopwatchTimer"
          value={initialSeconds}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setInitialSeconds(isNaN(value) ? 0 : value);
          }}
          placeholder="Enter time in seconds"
          type="number"
          min="0"
        />
        <input
          name="stopwatchName"
          value={timerName}
          onChange={(e) => {
            const value = e.target.value;
            setTimerName(value);
          }}
          placeholder="Enter timer name"
          type="text"
        />
        <button onClick={handleAddTimer}>Add Timer</button> (
        <a href="/countdown-list">View all Countdowns</a>)
      </div>
      {timers.map((timer, idx) => (
        <CountdownTimer
          key={idx}
          id={timer.id}
          initialSeconds={timer.seconds}
          timerName={timer.timerName}
          onRemove={() => handleRemoveTimer(timer.id)}
        />
      ))}
    </div>
  );
};

export default StopwatchManager;
