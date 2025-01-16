import "./SettingsView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";
import { updateProfile, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function SettingsView() {
  const { user, setUser, choices, setChoices, prevPurchases } = useStoreContext();
  const [fName, setfName] = useState(user.displayName.split(" ")[0]);
  const [lName, setlName] = useState(user.displayName.split(" ")[1]);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
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
      await updateProfile(user, {
        displayName: `${fName} ${lName}`,
      })

      setUser((prevUser) => ({
        ...prevUser,
        displayName: `${fName} ${lName}`,
      }));

      alert("Name has been successfully changed!");
    } catch (error) {
      console.log(error);
      alert("Error updating first and last name");
    }
    console.log(user);

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
    if (newPass != confirmPass) {
      return alert("Your new passwords do not match")
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        oldPass
      )
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      return alert("Incorrect old password, please try again");
    }

    try {
      await updatePassword(user, newPass);
      return alert("Password updated!");
    } catch (error) {
      return alert("Error changing passowrd");
    }

  }

  return (
    <div>
      <Header />
      <h1>User Settings</h1>
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
            <div>
              <form className="names" onSubmit={(event) => { changeName(event) }}>
                <label>First Name:</label>
                <input type="text" value={fName} onChange={(event) => setfName(event.target.value)} required></input>
                <label>Last Name:</label>
                <input type="text" value={lName} onChange={(event) => setlName(event.target.value)} required></input>
                <button>Change First Name or Last Name</button>
              </form>
              <br></br>

              <form className="password" onSubmit={(event) => { changePassword(event) }}>
                <label>Old Password</label>
                <input type="password" onChange={(event) => setOldPass(event.target.value)} required></input>
                <label>New Password</label>
                <input type="password" onChange={(event) => setNewPass(event.target.value)} required></input>
                <label>Confirm New Password</label>
                <input type="password" onChange={(event) => setConfirmPass(event.target.value)} required></input>
                <button>Reauth test</button>
              </form>
            </div>
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
      </div>
      <Footer />
    </div>
  );
}

export default SettingsView;