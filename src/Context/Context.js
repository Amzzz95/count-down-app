import { createContext } from "react";

export const MyContext = createContext("");
export const ErrorProvider = ({ children }) => {
  return <MyContext.Provider>{children}</MyContext.Provider>;
};
