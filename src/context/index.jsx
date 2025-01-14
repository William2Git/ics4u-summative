import { createContext, useContext, useState, useEffect } from "react";
import { Map } from 'immutable';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
	// Add your state management code here
	const [user, setUser] = useState(null);
	const [choices, setChoices] = useState([]);
	const [cart, setCart] = useState(Map());
	const [prevPurchases, setPrevPurchases] = useState(Map());
	//prevents the page from rendering before the user object is obtained
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				//current user
				setUser(user);
				//current cart
				const sessionCart = localStorage.getItem(user.email);
				if (sessionCart) {
					setCart(Map(JSON.parse(sessionCart)));
				} else {
					setCart(Map());
				}
				//previous purchases
				const getPrevPurchases = async () => {
					try {
						const docRef = doc(firestore, "users", user.email);
						const data = await getDoc(docRef);
						if (data.exists()) {
							const prevCart = Map(data.data());
							console.log(prevCart);
							setPrevPurchases(prevCart);
						} else {
							setPrevPurchases(Map());
						}
					} catch (error) {
						console.log(error);
						alert("Cart error");
					}
				};
				getPrevPurchases();
				//selected genres
				const getGenres = async () => {
					try {
						const docRef = doc(firestore, "users", `${user.email}_genre`);
						const data = await getDoc(docRef);
						if (data.exists()) {
							const genres = data.data().sortedGenres;
							console.log(genres);
							setChoices(genres);
						} //genres has to exist so theres no else scenario
					} catch (error) {
						console.log(error);
						alert("Genre error");
					}
				};
				getGenres();

			}
			setLoading(false);
		});
	}, [])

	if (loading) {
		return <h1>Loading...</h1>
	}

	return (
		<StoreContext.Provider value={{
			cart, setCart, choices, setChoices, user, setUser, prevPurchases, setPrevPurchases
		}}>
			{children}
		</StoreContext.Provider>
	);
}

export const useStoreContext = () => {
	return useContext(StoreContext);
}