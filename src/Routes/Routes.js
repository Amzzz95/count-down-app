import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import StopwatchManager from "../Components/StopwatchManager";
import CountdownTimerListing from "../Components/CountdownTimerListing";
import NotFound from "../Components/NotFound";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<StopwatchManager />} />
        <Route path="/countdown-list" element={<CountdownTimerListing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
