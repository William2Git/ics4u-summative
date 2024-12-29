import { createContext, useContext, useState } from "react";
import { Map } from 'immutable';


const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    // Add your state management code here
    const [user, setUser] = useState(null);
    const [choices, setChoices] = useState([]);
    const [cart, setCart] = useState(Map());
    const [prevPurchases, setPrevPurchases] = useState(null)

    const [defaultGenre, setDefaultGenre] = useState(28);
    

    return (
        <StoreContext.Provider value={{
            cart, setCart, choices, setChoices, defaultGenre, setDefaultGenre, 
            user, setUser, prevPurchases, setPrevPurchases
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}