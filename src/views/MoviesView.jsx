import "./MoviesView.css";
import { Outlet } from "react-router";
import Genres from "../components/Genres.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { useStoreContext } from "../context";

function MoviesView() {
  const { choices } = useStoreContext();

  return (
    <div>
      <Header />
      <br></br>
      <div className="middle">
        <Genres genresList={choices} />
        <Outlet />
      </div>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  )
}

export default MoviesView;