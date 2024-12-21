import "./RegisterView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";
// I reset the cart to be empty upon user registration
import { Map } from 'immutable';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

function RegisterView() {
  const navigate = useNavigate();
  const { setFirstName, setLastName, setEmail, setPassword, setChoices, setLoggedIn, setDefaultGenre, setCart } = useStoreContext();
  const { user, setUser } = useStoreContext();
  const firstName = useRef('');
  const lastName = useRef('');
  const email = useRef('');
  const password = useRef('');
  const [checkPassword, setCheckPassword] = useState("");
  const checkboxesRef = useRef({});
  const genres = [
    { id: 28, genre: "Action" },
    { id: 12, genre: "Adventure" },
    { id: 16, genre: "Animation" },
    { id: 35, genre: "Comedy" },
    { id: 80, genre: "Crime" },
    { id: 10751, genre: "Family" },
    { id: 14, genre: "Fantasy" },
    { id: 36, genre: "History" },
    { id: 27, genre: "Horror" },
    { id: 10402, genre: "Music" },
    { id: 9648, genre: "Mystery" },
    { id: 878, genre: "Sci-Fi" },
    { id: 53, genre: "Thriller" },
    { id: 10752, genre: "War" },
    { id: 37, genre: "Western" }
  ];

  function register(event) {
    event.preventDefault();
    if (password.current.value != checkPassword) {
      return alert("Passwords do not match. Please re-enter your password correctly");
    }

    const selectedGenres = Object.keys(checkboxesRef.current)
      .filter((genreId) => checkboxesRef.current[genreId].checked)
      .map(Number);

    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres!");
      return;
    }

    const sortedGenres = selectedGenres
      .map((genreId) => genres.find((genre) => genre.id === genreId))
      .sort((a, b) => a.genre.localeCompare(b.genre));

    alert("Account Successfully Created")
    setFirstName(firstName.current.value);
    setLastName(lastName.current.value);
    setEmail(email.current.value);
    setPassword(password.current.value);
    setLoggedIn(true);
    setChoices(sortedGenres);
    setDefaultGenre(sortedGenres[0].id);
    //resets cart to empty upon registration
    setCart(Map());
    navigate(`/movies/genre/${sortedGenres[0].id}`);
  }

  const registerByEmail = async (event) => {
    event.preventDefault();

    try {
      const user = (await createUserWithEmailAndPassword(auth, email.current.value, password.current.value)).user;
      await updateProfile(user, { displayName: `${firstName.current.value} ${lastName.current.value}` });
      setUser(user);
      //change this
      if (password.current.value != checkPassword) {
        return alert("Passwords do not match. Please re-enter your password correctly");
      }
  
      const selectedGenres = Object.keys(checkboxesRef.current)
        .filter((genreId) => checkboxesRef.current[genreId].checked)
        .map(Number);
  
      if (selectedGenres.length < 10) {
        alert("Please select at least 10 genres!");
        return;
      }

      alert("Account Successfully Created")
      setFirstName(firstName.current.value);
      setLastName(lastName.current.value);
      setEmail(email.current.value);
      setPassword(password.current.value);
      setLoggedIn(true);
      
      const sortedGenres = selectedGenres
      .map((genreId) => genres.find((genre) => genre.id === genreId))
      .sort((a, b) => a.genre.localeCompare(b.genre));
      setChoices(sortedGenres);
      setDefaultGenre(sortedGenres[0].id);
      //resets cart to empty upon registration
      setCart(Map());

      navigate(`/movies/genre/${sortedGenres[0].id}`);
      
    } catch (error) {
      alert("Error creating user with email and password!");
      console.log(error);
      console.log(user);
    }
  };

  const registerByGoogle = async () => {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      navigate('/movies/genre/28');
    } catch {
      alert("Error creating user with email and password!");
    }
  }

  return (
    <div>
      <Header />
      <div className="register-form">
        <div id="contents">
          <h2>Register</h2>
          <form onSubmit={(event) => { registerByEmail(event) }}>
            <label>First Name:</label>
            <input type="text" ref={firstName} required></input>
            <label>Last Name:</label>
            <input type="text" ref={lastName} required></input>
            <label>Email:</label>
            <input type="email" ref={email} required></input>
            <label>Password:</label>
            <input type="password" ref={password} required></input>
            <label>Confirm Password:</label>
            <input type="password" value={checkPassword} onChange={(event) => { setCheckPassword(event.target.value) }} required></input>
            <button id="enter" style={{ cursor: 'pointer' }}>Register</button>
          </form>
          <button onClick={() => registerByGoogle()} id="enter" style={{ cursor: 'pointer' }}>Register with Google</button>
        </div>

        <div className="genres-checklist">
          <h2>Genres</h2>
          <p>Please choose up to 10 preferred genres</p>

          {genres.map((item) => (
            <div key={item.id}>
              <input
                type="checkbox"
                id="check"
                ref={(el) => (checkboxesRef.current[item.id] = el)}
                style={{ cursor: 'pointer' }}
              />
              <label className="genre-name">{item.genre}</label>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </div >
  );
}

export default RegisterView;