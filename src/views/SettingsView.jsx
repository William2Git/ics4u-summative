import "./SettingsView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";

function SettingsView() {
    const { email, firstName, lastName, choices, setChoices, setDefaultGenre, setFirstName, setLastName } = useStoreContext();
    const [fName, setfName] = useState(firstName);
    const [lName, setlName] = useState(lastName);
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

    function changeName(event) {
        event.preventDefault();
        if (fName == firstName && lName == lastName) {
            return alert("No changes were made. Please input the changes you want before clicking this button.")
        }
        setFirstName(fName);
        setLastName(lName);
        alert("Name has been successfully changed!");
    }

    function updateGenres() {
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
        setDefaultGenre(sortedGenres[0].id);
        alert("Genres Have been updated!")
    }

    return (
        <div>
            <Header />
            <h1>User Settings</h1>
            <div className="settings">
                <div className="profile">
                    <form className="names" onSubmit={(event) => { changeName(event) }}>
                        <label>First Name:</label>
                        <input type="text" value={fName} onChange={(event) => setfName(event.target.value)} required></input>
                        <label>Last Name:</label>
                        <input type="text" value={lName} onChange={(event) => setlName(event.target.value)} required></input>
                        <button>Change First Name or Last Name</button>
                    </form>
                    <label>Email:</label>
                    <input type="email" style={{ cursor: "no-drop" }} value={email} readOnly ></input>
                </div>
                <div className="checklist">
                    <h2>Genres</h2>
                    <p>Edit your 10 preferred genres</p>
                    {genres.map((item) => {
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
                    })}
                    <br></br>
                    <button onClick={() => updateGenres()}>Update Your Genres</button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default SettingsView;