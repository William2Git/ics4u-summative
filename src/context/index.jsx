import { createContext, useContext, useState } from "react";
import { Map } from 'immutable';


const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    // Add your state management code here
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cart, setCart] = useState(Map());
    const [loggedIn, setLoggedIn] = useState(false);
    const [choices, setChoices] = useState([]);
    const [defaultGenre, setDefaultGenre] = useState(28);
    const [user, setUser] = useState(null);

    return (
        <StoreContext.Provider value={{
            firstName, setFirstName, lastName, setLastName, email, setEmail,
            password, setPassword, cart, setCart, choices, setChoices, loggedIn, setLoggedIn, defaultGenre, setDefaultGenre,
            user, setUser
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}