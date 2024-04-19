import React, { useState, useEffect } from "react";
import axios from "axios";

import API_URL from "../../Constant/constant";

const { HOST_API } = API_URL;

const CountdownTimer = ({
  id,
  initialSeconds,
  timerName,
  onRemove,
  setLoading,
  timeElapsedFromBeginning,
}) => {
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
    if (parseInt(seconds) === 0) {
      return;
    }
    const updateObj = {
      id,
      activeTimeInSeconds: initialSeconds - seconds + timeElapsedFromBeginning,
    };
    try {
      setLoading(true);
      setIsActive(false);
      await axios.put(`${HOST_API}/counter`, updateObj);
    } catch (error) {
      console.error("Error while updating counter", error);
      setIsActive((prev) => prev);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const updateObj = {
      id,
      activeTimeInSeconds: initialSeconds - seconds + timeElapsedFromBeginning,
      deletionDate: new Date(),
    };
    try {
      setLoading(true);
      setIsActive(false);
      await axios.put(`${HOST_API}/counter`, updateObj);
      onRemove(id);
    } catch (error) {
      console.error("Error while updating counter", error);
      setIsActive((prev) => prev);
    }
    setLoading(false);
  };

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div>
      <div>
        <div className="timer-container">
          <div className="container">
            <div className="item">{timerName}</div>
            <div className="item">
              {minutes}:
              {remainingSeconds < 10
                ? `0${remainingSeconds}`
                : remainingSeconds}
            </div>
            <div className="item">
              <button onClick={handleStart}>Start</button>&nbsp;
              <button onClick={handleStop}>Stop</button>&nbsp;
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StopwatchManager = () => {
  const [timers, setTimers] = useState([]);
  const [initialSeconds, setInitialSeconds] = useState("");
  const [timerName, setTimerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllCountDowns = async () => {
      try {
        setLoading(true);
        const allCountDowns = await axios.get(`${HOST_API}/active-counter`);
        setTimers(
          allCountDowns?.data?.data?.map((countDown) => {
            const {
              _id: id,
              timerName,
              timerValue,
              activeDuration,
            } = countDown;
            return {
              id,
              timerName,
              seconds: parseInt(
                timerValue - (activeDuration ? activeDuration : 0)
              ),
              timeElapsedFromBeginning: activeDuration,
            };
          })
        );
      } catch (err) {
        console.error("error in fetching counter listing");
      }
      setLoading(false);
    };
    fetchAllCountDowns();
  }, []);

  const handleAddTimer = async () => {
    if (timerName.trim === "" || !initialSeconds || initialSeconds <= 0) {
      return null;
    }
    const addObj = {
      timerName,
      timerValue: initialSeconds,
    };
    try {
      setLoading(true);
      const {
        data: { data: id },
      } = await axios.post(`${HOST_API}/counter`, addObj);
      setTimers((prevTimer) => {
        return [
          ...prevTimer,
          { id, seconds: parseInt(initialSeconds), timerName },
        ];
      });
    } catch (error) {
      console.error("Error while adding countdown timer", error);
      setTimers((prev) => prev);
    }
    setLoading(false);
    setTimerName("");
    setInitialSeconds("");
  };

  const handleRemoveTimer = (timerId) => {
    setTimers((prevTimer) => prevTimer.filter((timer) => timer.id !== timerId));
  };
  return (
    <div>
      <h1>Stopwatch Manager</h1>
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
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
        <button onClick={handleAddTimer}>Add Timer</button>
      </div>
      {timers.map((timer, idx) => (
        <CountdownTimer
          key={idx}
          id={timer.id}
          initialSeconds={timer.seconds}
          timerName={timer.timerName}
          timeElapsedFromBeginning={timer.timeElapsedFromBeginning || 0}
          onRemove={(id) => handleRemoveTimer(id)}
          setLoading={(isLoading) => setLoading(isLoading)}
        />
      ))}
    </div>
  );
};

export default StopwatchManager;
