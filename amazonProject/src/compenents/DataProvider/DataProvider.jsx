import React from "react";
import { useReducer } from "react";
import { createContext } from "react";

export const DataContext = createContext();

const DataProvider = ({ children, reducer, initialState }) => {
  return (
    <DataContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
