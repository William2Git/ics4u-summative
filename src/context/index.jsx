import { createContext, useContext } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    // Add your state management code here

    return (
        <StoreContext.Provider value={{ }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}