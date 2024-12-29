import "./Header.css";
import { useNavigate } from "react-router";
import { useStoreContext } from "../context";

function Header() {
  let navigate = useNavigate();
  const { loggedIn, setLoggedIn, defaultGenre } = useStoreContext();
  const { user, setUser } = useStoreContext();

  function logout() {
    setLoggedIn(false);
    navigate("/login");
  }

  function movies() {
    if (loggedIn) {
      return navigate(`/movies/genre/${defaultGenre}`);
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

        {loggedIn ? (
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
      {loggedIn ? (
        <h1>Welcome to WStream4U, {user.displayName.split(" ")[0]}!</h1>
      ) : (
        <></>
      )}

    </div>
  );
}

export default Header;