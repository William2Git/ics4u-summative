import "./SettingsView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";
import { updateProfile, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";

function SettingsView() {
  const { user, setUser, choices, setChoices, prevPurchases } = useStoreContext();
  const [fName, setfName] = useState(user.displayName.split(" ")[0]);
  const [lName, setlName] = useState(user.displayName.split(" ")[1]);
  const oldPass = useRef('');
  const newPass = useRef('');
  const confirmPass = useRef('');
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
  const checkboxesRef = useRef({});

  async function changeName(event) {
    event.preventDefault();
    if (fName == user.displayName.split(" ")[0] && lName == user.displayName.split(" ")[1]) {
      return alert("No changes were made. Please input the changes you want before clicking this button.")
    }

    try {
      // makes sure that the user is up to date, allowing for the name change button to be used multiple times without refreshing the page
      const currentUser = auth.currentUser;
      await updateProfile(currentUser, {
        displayName: `${fName} ${lName}`,
      });

      setUser((prevUser) => ({
        ...prevUser,
        displayName: `${fName} ${lName}`,
      }));

      alert("Name has been successfully changed!");
    } catch (error) {
      alert("Error updating first and last name");
    }
  }

  async function updateGenres() {
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

    setChoices(sortedGenres);
    //writes genre changes to firestore
    const docRef = doc(firestore, "users", user.email);
    await setDoc(docRef, { sortedGenres: sortedGenres, previous: prevPurchases.toJS() });
    alert("Genres Have been updated!")
  }

  async function changePassword(event) {
    event.preventDefault();
    const currentUser = auth.currentUser;
    if (newPass.current.value != confirmPass.current.value) {
      return alert("Your new passwords do not match")
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPass.current.value
      )
      await reauthenticateWithCredential(currentUser, credential);
    } catch (error) {
      return alert("Incorrect old password, please try again");
    }

    try {
      await updatePassword(currentUser, newPass.current.value);
      oldPass.current.value = '';
      newPass.current.value = '';
      confirmPass.current.value = '';
      return alert("Password updated!");
    } catch (error) {
      return alert("Error changing passowrd");
    }
  }

  return (
    <div>
      <Header />
      <h1>User Settings</h1>
      <br></br>
      <div className="settings">
        <div className="profile">
          {/* checks if the user signed in with google */}
          {user.emailVerified ? (
            <div className="names">
              <h2>You're signed in with Google</h2>
              <label>First Name:</label>
              <input type="text" value={fName} readOnly></input>
              <label>Last Name:</label>
              <input type="text" value={lName} readOnly></input>
            </div>
          ) : (
            <form className="names" onSubmit={(event) => { changeName(event) }}>
              <h2>Profile</h2>
              <label>First Name:</label>
              <input type="text" value={fName} onChange={(event) => setfName(event.target.value)} required></input>
              <label>Last Name:</label>
              <input type="text" value={lName} onChange={(event) => setlName(event.target.value)} required></input>
              <button>Change First Name or Last Name</button>
            </form>
          )}
          <label>Email:</label>
          <input type="email" style={{ cursor: "no-drop" }} value={user.email} readOnly ></input>
        </div>

        <div className="checklist">
          <h2>Genres</h2>
          <p>Edit your 10 preferred genres</p>
          {choices && choices.length > 0 ? (
            genres.map((item) => {
              const isChecked = choices.some(choice => choice.id == item.id);
              return (
                <div key={item.id}>
                  <input
                    type="checkbox"
                    id="check"
                    defaultChecked={isChecked}
                    ref={(el) => (checkboxesRef.current[item.id] = el)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label className="genre-name">{item.genre}</label>
                </div>
              );
            })) : (
            <p>Genres are loading</p>
          )}
          <br></br>
          <button onClick={() => updateGenres()}>Update Your Genres</button>
        </div>

        {/* Password change for login with email users */}
        {user.emailVerified ? (
          <></>
        ) : (
          <form className="password" onSubmit={(event) => { changePassword(event) }}>
            <h2>Change Password</h2>
            <label>Old Password</label>
            <input type="password" ref={oldPass} required></input>
            <label>New Password</label>
            <input type="password" ref={newPass} required></input>
            <label>Confirm New Password</label>
            <input type="password" ref={confirmPass} required></input>
            <button>Change Password</button>
          </form>
        )}
      </div>
      <br></br>

      <div className="previous-purchases">
        <h2>Previous Purchases</h2>
        <div className="purchases">
          {prevPurchases.entrySeq().map(([key, value]) => {
            return (
              <div key={key}>
                <li>{value.title}</li>
                <img src={`https://image.tmdb.org/t/p/w500${value.url}`} height={"200px"} />
              </div>
            )
          })}
        </div>
      </div>
      <br></br>
      <Footer />
    </div>
  );
}

export default SettingsView;