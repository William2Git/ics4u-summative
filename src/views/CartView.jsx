import "./CartView.css";
import { useStoreContext } from "../context/index.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Map } from 'immutable';

function CartView() {
  const { user, cart, setCart, prevPurchases, setPrevPurchases } = useStoreContext();

  const checkout = async () => {
    setPrevPurchases(cart);
    //adds cart to firestore
    const docRef = doc(firestore, "users", user.uid);
    console.log(docRef);
    console.log(firestore);
    await setDoc(docRef, cart.toJS());
    //removes from local storage and react context
    localStorage.removeItem(user.uid);
    console.log(cart);
    console.log(prevPurchases);
    setCart(Map());
    return alert("Thank you for your purchase!"); 
  }

  return (
    <div>
      <Header />
      <div className="cart-view">
        <h1>Cart</h1>
        <button id="checkout" onClick={() => checkout()}>Checkout</button>
        <div className="cart-items">
          {
            cart.entrySeq().map(([key, value]) => {
              return (
                <div className="cart-item" key={key}>
                  <h2>{value.title}</h2>
                  <img src={`https://image.tmdb.org/t/p/w500${value.url}`} height={"200px"} />
                  <button onClick={() => setCart((prevCart) => prevCart.delete(key))}>Remove</button>
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