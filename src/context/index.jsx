import { createContext, useContext, useState, useEffect } from "react";
import { Map } from 'immutable';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
	// Add your state management code here
	const [user, setUser] = useState(null);
	const [choices, setChoices] = useState([]);
	const [cart, setCart] = useState(Map());
	const [prevPurchases, setPrevPurchases] = useState(null);
	//prevents the page from rendering before the user object is obtained
	const [loading, setLoading] = useState(true);

	const [defaultGenre, setDefaultGenre] = useState(28);

	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				setUser(user);
			}
			setLoading(false);
		});
	}, [])

	// const sessionCart = localStorage.getItem(user.uid);
	// if (sessionCart) {
	//     setCart(Map(JSON.parse(sessionCart)));
	// }

	if (loading) {
		return <h1>Loading...</h1>
	}

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