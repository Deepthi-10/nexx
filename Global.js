import { createGlobalState } from "react-hooks-global-state";

// Create a global state with an initial value of an empty array for downloadfilearray
const { setGlobalState , useGlobalState } = createGlobalState({
    downloadfilearray : []
});

// Export the useGlobalState and setGlobalState hooks for use in other components
export { useGlobalState, setGlobalState};