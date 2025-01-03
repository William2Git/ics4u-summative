import "./LoginView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router";
import { useState } from 'react';
import { useStoreContext } from "../context";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';


function LoginView() {
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  const { setUser } = useStoreContext();
  const navigate = useNavigate();

  async function loginByEmail(event) {
    event.preventDefault();

    try {
      const user = (await signInWithEmailAndPassword(auth, email, pass)).user;
      setUser(user);
      navigate('/movies/genre/28');
      
      console.log(user);
    } catch (error) {
      console.log(error);
      alert("Invalid credentials, please try again");
    }
  }

  async function loginByGoogle() {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      navigate('/movies/genre/28');

      console.log(user);
    } catch (error) {
      console.log(error);
      alert("Error signing in!");
    }
  }

  return (
    <div>
      <Header />
      <div className="login-form">
        <form id="login-email" onSubmit={(event) => { loginByEmail(event) }}>
          <h2>Login</h2>
          <br></br>
          <label>Email:</label>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value.trim())}></input>
          <label>Password:</label>
          <input type="password" value={pass} onChange={(event => setPass(event.target.value))}></input>
          <button id="enter" style={{ cursor: 'pointer' }}>Login</button>
        </form>
        <button id="enter" style={{ cursor: 'pointer' }} onClick={() => loginByGoogle()}>Login with Google</button>
      </div>
      <Footer />
    </div>

  );
}

export default LoginView;