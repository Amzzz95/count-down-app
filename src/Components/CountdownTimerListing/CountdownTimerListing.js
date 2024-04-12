import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import axios from "axios";

import WorldClock from "../WorldClock";
import API_URL from "../../Constant/constant";
import { formatDate } from "../../Utils/helper";

const { HOST_API } = API_URL;

const CountdownTimerListing = () => {
  const [countdowns, setCountDowns] = useState([]);

  useEffect(() => {
    const fetchAllCountDowns = async () => {
      try {
        const allCountDowns = await axios.get(`${HOST_API}/counter`);
        setCountDowns(allCountDowns.data.data);
      } catch (err) {
        console.error("error in fetching counter listing");
        setCountDowns([]);
      }
    };
    fetchAllCountDowns();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <WorldClock />
      <h1>Countdown Listing</h1>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Timer Name</TableCell>
              <TableCell align="right">Timer Value (in secs)</TableCell>
              <TableCell align="right">Active Duration (in secs)</TableCell>
              <TableCell align="right">Deleted Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countdowns.map((countdown, idx) => (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {countdown.timerName}
                </TableCell>
                <TableCell align="right">{countdown.timerValue}</TableCell>
                <TableCell align="right">
                  {countdown.activeDuration || 0}
                </TableCell>
                <TableCell align="right">
                  {formatDate(countdown.deleteDate, "Asia/Kolkata") || "NA"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CountdownTimerListing;
