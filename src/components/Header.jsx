import "./Header.css";
import { useNavigate } from "react-router";
import { useStoreContext } from "../context";
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { Map } from 'immutable';

function Header() {
  let navigate = useNavigate();
  const { user, setUser, choices, setChoices, setPrevPurchases } = useStoreContext();

  async function logout() {
    try {
      await signOut(auth);
      setUser(null);
      setChoices([]);
      setPrevPurchases(Map());
      console.log(user);
      navigate("/login");
    } catch (error) {
      alert("Error signing out");
    }
  }

  function movies() {
    if (user) {
      return navigate(`/movies/genre/${choices[0].id}`);
    }
    return alert("Please log in before viewing available movies");
  }

  return (
    <div>
      <div className="navbar">
        <h1 style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>WStream4U</h1>
        <div className="left">
          <button onClick={() => navigate("/")}>Home</button>
          <button>About</button>
          <button>TV Shows</button>
          <button onClick={() => movies()}>Movies</button>
          <button>Popular</button>
          <button>My Watchlist</button>
        </div>

        {user ? (
          <div>
            <button onClick={() => navigate("/cart")}>Cart</button>
            <button onClick={() => navigate("/settings")}>Settings</button>
            <button onClick={() => logout()}>Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Signup</button>
          </div>
        )}

      </div >
      {user && user.displayName ? (
        <h1>Welcome to WStream4U, {user.displayName.split(" ")[0]}!</h1>
      ) : (
        <></>
      )}

    </div>
  );
}

export default Header;