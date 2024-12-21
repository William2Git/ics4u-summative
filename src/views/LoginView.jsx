import "./LoginView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router";
import { useState } from 'react';
import { useStoreContext } from "../context";


function LoginView() {
  let [user, setUser] = useState("");
  let [pass, setPass] = useState("");
  const { email, password, setLoggedIn } = useStoreContext();
  const navigate = useNavigate();

  function login(event) {
    event.preventDefault();
    if (user == "") {
      return alert("Please enter an email");
    }
    if (user != email || pass != password) {
      return alert("Incorrect login credentials, please try again");
    }
    setLoggedIn(true);
    return navigate("/movies/genre/28");
  }

  return (
    <div>
      <Header />
      <form id="contents" onSubmit={(event) => { login(event) }}>
        <h2>Login</h2>
        <br></br>
        <label>Email:</label>
        <input type="email" value={user} onChange={(event) => setUser(event.target.value.trim())}></input>
        <label>Password:</label>
        <input type="password" value={pass} onChange={(event => setPass(event.target.value))}></input>
        <button id="enter" style={{ cursor: 'pointer' }}>Login</button>
      </form>
      <Footer />
    </div>

  );
}

export default LoginView;