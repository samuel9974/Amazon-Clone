/**
 * DataProvider.jsx - Global State Context Provider
 *
 * Creates and provides a global context for state management using React Context API.
 * Wraps the entire application to make state and dispatch function accessible
 * to any component via useContext(DataContext).
 *
 * Props:
 * - children: React components to wrap
 * - reducer: State reducer function
 * - initialState: Initial state object
 *
 * Usage in components: const [state, dispatch] = useContext(DataContext)
 */

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
