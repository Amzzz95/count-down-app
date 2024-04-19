import React from "react";

import "./App.css";
import AppRoutes from "./Routes/Routes";

const App = () => {
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
      <AppRoutes />
    </div>
  );
};

export default App;
