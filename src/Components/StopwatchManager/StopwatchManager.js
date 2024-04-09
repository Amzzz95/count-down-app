import React, { useState, useEffect } from "react";
import axios from "axios";

const HOST_API = "http://localhost:8000";
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
    const result = await axios.put(`${HOST_API}/counter`, updateObj);
    setIsActive(false);
    return result;
  };

  const handleDelete = async () => {
    const updateObj = {
      id,
      activeTimeInSeconds: initialSeconds - seconds,
      deletionDate: new Date(),
    };
    const result = await axios.put(`${HOST_API}/counter`, updateObj);
    setIsActive(false);
    onRemove(id);
    return result;
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
      </div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleDelete}>Delete</button>
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
    const {
      data: { data: id },
    } = await axios.post(`${HOST_API}/counter`, addObj);
    setTimers([
      ...timers,
      { id, seconds: parseInt(initialSeconds), timerName },
    ]);
    setTimerName("");
    setInitialSeconds("");
  };

  const handleRemoveTimer = (timerId) => {
    setTimers(timers.filter((timer) => timer.id !== timerId));
  };

  return (
    <div>
      <h1>Stopwatch Manager</h1>
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
      <button onClick={handleAddTimer}>Add Timer</button>
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
