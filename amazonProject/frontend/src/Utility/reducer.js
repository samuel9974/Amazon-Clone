/**
 * reducer.js - State Management Reducer
 *
 * Manages the global application state using React's useReducer hook.
 * Handles state transitions based on dispatched actions.
 *
 * State Structure:
 * - basket: Array of products added to the shopping cart
 */

import { Types } from "./actionType";

// Initial state when the app loads
export const initialState = {basket: []} // Shopping basket - stores all items added by user

/**
 * Reducer function that updates state based on actions
 * @param {Object} state - Current state
 * @param {Object} action - Action object with type and payload
 * @returns {Object} New state
 */

export const reducer = (state, action) => {
  switch (action.type) {
    case Types.ADD_TO_BASKET:
      // Add a new product to the basket
      return {...state, basket: [...state.basket, action.item]}
    case Types.REMOVE_FROM_BASKET:
      return {
        ...state,
        basket: state.basket.filter((_, i) => i !== action.index),
      }
    default: return state
  }
}
