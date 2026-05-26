import React from "react";
import { useReducer } from "react";
import { createContext } from "react";

// Create a context object to be shared across the app
export const DataContext = createContext();

const DataProvider = ({ children, reducer, initialState }) => {
  return (
    // Provider component that supplies the state and dispatch to all children
    <DataContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
