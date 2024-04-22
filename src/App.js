import React, { useState, useCallback } from "react";

import "./App.css";
import AppRoutes from "./Routes/Routes";
import { MyContext } from "./Context/Context";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(false);
  const showError = useCallback((message) => {
    setErrorMessage(message);
  }, []);

  const closeError = () => {
    setErrorMessage("");
  };

  return (
    <div className="App">
      <div class="menu-bar">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/countdown-list">Count Down History</a>
          </li>
        </ul>
      </div>
      {errorMessage && (
        <div className="error-overlay">
          <div className="error-popup">
            <div className="error-message">{errorMessage}</div>
            <button className="close-button" onClick={closeError}>
              Close
            </button>
          </div>
        </div>
      )}

      <MyContext.Provider value={{ showError }}>
        <AppRoutes />
      </MyContext.Provider>
    </div>
  );
};

export default App;
