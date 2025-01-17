import "./LoginView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router";
import { useState } from 'react';
import { useStoreContext } from "../context";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";


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
      //need to pull genres from firestore to get the correct navigation page
      //this is because the observer in index.jsx does not update quickly enough
      const docRef = doc(firestore, "users", user.email);
      const data = await getDoc(docRef);
      const genres = data.data().sortedGenres;
      navigate(`/movies/genre/${genres[0].id}`);
    } catch (error) {
      alert("Invalid credentials, please try again");
    }
  }

  async function loginByGoogle() {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      //need to pull genres from firestore to get the correct navigation page
      //this is because the observer in index.jsx does not update quickly enough
      const docRef = doc(firestore, "users", user.email);
      const data = await getDoc(docRef);
      const genres = data.data().sortedGenres;
      navigate(`/movies/genre/${genres[0].id}`);
    } catch (error) {
      alert("Error signing in with Google!");
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