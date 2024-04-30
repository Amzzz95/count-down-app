import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import API_URL from "../../Constant/constant";
import { MyContext } from "../../Context/Context";

import useAxios from "../../Hooks/useAxios";

const { HOST_API } = API_URL;

const CountdownTimer = ({
  id,
  initialSeconds,
  timerName,
  onRemove,
  timeElapsedFromBeginning,
}) => {
  const { showError } = useContext(MyContext);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const updateObj = {
    id,
    activeTimeInSeconds: initialSeconds - seconds + timeElapsedFromBeginning,
  };
  const [counterNetworkState] = useAxios(
    {
      method: "put",
      apiUrl: `${HOST_API}/counter`,
      body: updateObj,
    },
    {
      isEnabled,
      onSuccess: () => {
        setIsEnabled(false);
      },
    }
  );

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

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
    setIsEnabled(true);
    setIsActive(false);
  };

  const handleDelete = async () => {
    const updateObj = {
      id,
      activeTimeInSeconds: initialSeconds - seconds + timeElapsedFromBeginning,
      deletionDate: new Date(),
    };
    try {
      setIsActive(false);
      await axios.put(`${HOST_API}/counter`, updateObj);
      onRemove(id);
    } catch (error) {
      showError("Error while deleting counter");
      console.error("Error while deleting counter", error);
    }
  };

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div>
      <div>
        {counterNetworkState === "loading" && (
          <div className="overlay">
            <div className="spinner"></div>
          </div>
        )}
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
  const { showError } = useContext(MyContext);
  const [timers, setTimers] = useState([]);
  const [initialSeconds, setInitialSeconds] = useState("");
  const [timerName, setTimerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [counterNetworkState, counterData] = useAxios(
    {
      method: "get",
      apiUrl: `${HOST_API}/active-counter`,
    },
    {
      onSuccess: (data) => {
        setTimers(
          data.data?.map((countDown) => {
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
      },
      onError: (error) => {
        showError("error in fetching counter listing");
        console.error("error in fetching counter listing", error);
      },
    }
  );

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
          { id, seconds: parseInt(initialSeconds), timerName },
          ...prevTimer,
        ];
      });
    } catch (error) {
      showError("Error while adding countdown timer");
      console.error("Error while adding countdown timer", error);
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
      {(counterNetworkState === "loading" || loading) && (
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
        />
      ))}
    </div>
  );
};

export default StopwatchManager;
