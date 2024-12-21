import "./CartView.css";
import { useStoreContext } from "../context/index.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function CartView() {
  const { cart, setCart } = useStoreContext();

  return (
    <div>
      <Header />
      <div className="cart-view">
        <h1>Cart</h1>
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