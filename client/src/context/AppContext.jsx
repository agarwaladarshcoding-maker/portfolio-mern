// ============================================================
// AppContext.jsx — Global Application State
// ============================================================
// WHY A CONTEXT HERE?
//   Two things need to be globally known:
//   1. Has the loading animation finished? (controls when to
//      render the main site — prevents content flash)
//   2. Future: auth state, theme overrides, etc.
//
//   We use React Context + useReducer instead of a library
//   like Redux because the state is genuinely simple. Adding
//   Redux for 2 pieces of state is over-engineering.
// ============================================================

import { createContext, useContext, useReducer } from "react";

// ── Initial State ─────────────────────────────────────────
const initialState = {
  // isLoading: true means the neural network animation is running.
  // When it completes, it calls setLoadingDone() which flips this
  // to false and reveals the main portfolio content.
  isLoading: true,

  // activeSection: tracks which nav section is in view.
  // Used to highlight the active nav item.
  activeSection: "hero",
};

// ── Reducer ───────────────────────────────────────────────
// WHY REDUCER OVER MULTIPLE useStates?
//   State transitions are explicit and traceable. Every change
//   goes through one function. Easy to debug and extend.
const appReducer = (state, action) => {
  switch (action.type) {
    case "LOADING_COMPLETE":
      return { ...state, isLoading: false };

    case "SET_ACTIVE_SECTION":
      return { ...state, activeSection: action.payload };

    default:
      return state;
  }
};

// ── Context Creation ──────────────────────────────────────
const AppContext = createContext(null);

// ── Provider Component ────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators — clean API for components to use
  const setLoadingDone = () => dispatch({ type: "LOADING_COMPLETE" });
  const setActiveSection = (section) =>
    dispatch({ type: "SET_ACTIVE_SECTION", payload: section });

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLoadingDone,
        setActiveSection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ── Custom Hook ───────────────────────────────────────────
// Components call useApp() instead of useContext(AppContext)
// directly. This gives a better error message if used outside
// the provider, and is cleaner at the call site.
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};