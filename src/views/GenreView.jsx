import "./GenreView.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useStoreContext } from "../context";

function GenreView() {
  let [page, setPage] = useState(1);
  let [posters, setPosters] = useState([]);
  let [maxPage, setMaxPage] = useState(0);
  const { user, cart, setCart, prevPurchases } = useStoreContext();
  const params = useParams();
  const navigate = useNavigate();

  const addToCart = (id, title, poster) => {
    setCart((prevCart) => {
      const cart = prevCart.set(id + "", { title: title, url: poster });
      localStorage.setItem(user.uid, JSON.stringify(cart.toJS()));
      return cart;
    });
  }

  //this use effect provides new pages of posters for the SAME genre
  useEffect(() => {
    (async function getGenre() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${params.id}&page=${page}`
      );
      setPosters(response.data.results);
      setMaxPage(response.data.total_pages);
    })()
  }, [page]);

  //this use effect RESETS the page count to 1 and provides posters for a NEW genre
  useEffect(() => {
    setPage(1);
    (async function getGenre() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${params.id}&page=${page}`
      );
      setPosters(response.data.results);
      setMaxPage(response.data.total_pages);
    })()
  }, [params.id]);

  function previousPage() {
    if (page > 1) {
      page--;
      setPage(page);
    }
  }

  function nextPage() {
    if (page < maxPage) {
      page++;
      setPage(page);
    }
  }

  function setText(id) {
    if (prevPurchases.has(id + "")) {
      return "Purchased";
    }
    if (cart.has(id + "")) {
      return "Added";
    } else {
      return "Buy";
    }
  }

  return (
    <div className="poster-section">
      {posters.length > 0 ? (
        posters.map((mov) => (
          <div key={mov.id}>
            <div >
              <img className="poster-image" height={"300px"} style={{ cursor: "pointer" }}
                onClick={() => navigate(`/movies/details/${mov.id}`)}
                src={`https://image.tmdb.org/t/p/w500${mov.poster_path}`}
                alt={mov.title} />
            </div>
            <button onClick={() => addToCart(mov.id, mov.original_title, mov.poster_path)}
              className="buy-button">{setText(mov.id)}</button>
          </div>
        ))

      ) : (
        <p>Loading content</p>
      )}
      <div className="button-container">
        <button className="page-button" style={{ cursor: "pointer" }} onClick={() => previousPage()}>Previous Page</button>
        <button className="page-button" style={{ cursor: "pointer" }} onClick={() => nextPage()} >Next Page</button>
      </div>
      <p id="page-count">Page: {page}/{maxPage}</p>
    </div>
  )
}

export default GenreView;