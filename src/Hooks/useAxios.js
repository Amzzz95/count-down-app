import React, { useEffect, useState } from "react";
import axios from "axios";

const NETWORK_STATE = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
};
const useAxios = (
  axiosParams,
  { isEnabled = true, onSuccess = null, onError = null }
) => {
  const [networkState, setNetworkState] = useState(NETWORK_STATE.IDLE);
  const { method, apiUrl, body = {} } = axiosParams;
  const [data, setData] = useState(null);
  const onHookError = (error) => {
    if (onError) onError(error);
    setNetworkState(NETWORK_STATE.ERROR);
    setData(null);
  };
  const invokeAxiosMethod = async () => {
    if (!isEnabled) {
      setNetworkState(NETWORK_STATE.IDLE);
      setData(null);
      return null;
    }
    try {
      setNetworkState(NETWORK_STATE.LOADING);
      const { data: responseData } = await axios[method](apiUrl, body);
      if (onSuccess) {
        const processedData = onSuccess(responseData);
        setData(processedData);
      } else {
        setData(data);
      }
      setNetworkState(NETWORK_STATE.IDLE);
    } catch (error) {
      onHookError(error);
    }
  };

  useEffect(() => {
    invokeAxiosMethod();
  }, [isEnabled]);

  return [networkState, data];
};

export default useAxios;
