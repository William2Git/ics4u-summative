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
        //genres and previous purchases
        const getInfo = async () => {
          try {
            const docRef = doc(firestore, "users", user.email);
            const data = await getDoc(docRef);
            if (data.exists()) {
              const genres = data.data().sortedGenres;
              setChoices(genres);
              const prevCart = Map(data.data().previous);
              setPrevPurchases(prevCart);
            } else {
              setPrevPurchases(Map());
            }
          } catch (error) {
            alert("Cart error");
          }
        };
        getInfo();
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