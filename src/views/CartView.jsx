import "./CartView.css";
import { useStoreContext } from "../context/index.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Map } from 'immutable';

function CartView() {
  const { user, cart, setCart, prevPurchases, setPrevPurchases, choices } = useStoreContext();

  const checkout = async () => {
    const newCart = prevPurchases.merge(cart);
    setPrevPurchases(newCart);
    //adds cart to firestore
    const docRef = doc(firestore, "users", user.email);
    await setDoc(docRef, { sortedGenres: choices, previous: newCart.toJS() });
    //removes from local storage and react context
    localStorage.removeItem(user.email);
    setCart(Map());
    return alert("Thank you for your purchase!");
  }

  function removeItem(key) {
    //updates local storage
    setCart((prevCart) => {
      const newCart = prevCart.delete(key);
      localStorage.removeItem(user.email);
      localStorage.setItem(user.email, JSON.stringify(newCart.toJS()));
      return newCart;
    });
  }

  return (
    <div>
      <Header />
      <div className="cart-view">
        <h1>Shopping Cart & Checkout</h1>
        <button id="checkout" onClick={() => checkout()}>Checkout</button>
        <div className="cart-items">
          {
            cart.entrySeq().map(([key, value]) => {
              return (
                <div className="cart-item" key={key}>
                  <h2>{value.title}</h2>
                  <img src={`https://image.tmdb.org/t/p/w500${value.url}`} height={"200px"} />
                  <button onClick={() => removeItem(key)}>Remove</button>
                </div>
              )
            })
          }
        </div>
      </div>
      <br></br>
      <Footer />
    </div>

  );
}

export default CartView;