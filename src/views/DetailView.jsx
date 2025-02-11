import "./DetailView.css";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useStoreContext } from "../context";

function DetailView() {
  const [movDetails, setMovDetails] = useState([]);
  const [production, setProduction] = useState([]);
  const { user, cart, setCart, prevPurchases } = useStoreContext();
  const params = useParams();

  useEffect(() => {
    (async function getGenre() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${params.id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=videos`
      );
      setMovDetails(response.data);
      setProduction(response.data.production_companies);
    })()
  }, []);

  function getCompanies() {
    let companies = "";
    for (let i = 0; i < production.length; i++) {
      companies += production[i].name;
      if (i != production.length - 1) {
        companies += ", ";
      }
    }
    return companies;
  }

  function getOnlyTrailers(videos) {
    let trailers = videos.filter(vid => vid.type == "Trailer");
    if (trailers.length <= 0) {
      return (
        <p>No Trailers Available</p>
      )
    }

    return trailers.map((trailer) => (
      <div key={trailer.id} className="trailer-tile">
        <a
          href={`https://www.youtube.com/watch?v=${trailer.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="trailer-thumbnail"
            src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
            alt={trailer.name}
          />
          <h3>{trailer.name}</h3>
        </a>
      </div>
    ));
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

  const addToCart = (id, title, poster) => {
    if (prevPurchases.has(id + "")) {
      //cannot add an item that has already been purchased
      return;
    }
    if (cart.has(id + "")) {
      //cannot add an item that has already been added
      return;
    }
    setCart((prevCart) => {
      const cart = prevCart.set(id + "", { title: title, url: poster });
      localStorage.setItem(user.email, JSON.stringify(cart.toJS()));
      return cart;
    });
  }

  return (
    <div>
      <h4>{movDetails.original_title}</h4>
      <button onClick={() => addToCart(params.id, movDetails.original_title, movDetails.poster_path)}
        className="buy-button">{setText(params.id)}</button>
      <p id="detail">Release Date: {movDetails.release_date}</p>
      <p id="detail">Runtime: {movDetails.runtime} mins</p>
      <p id="detail">Language: {movDetails.original_language}</p>
      <p id="detail">Production Companies: {getCompanies()}</p>
      <p id="detail">Description: {movDetails.overview}</p>
      <img id="poster" src={`https://image.tmdb.org/t/p/w500${movDetails.poster_path}`} />

      <div className="trailers-section">
        <h2>Trailers</h2>
        <div className="trailers-grid">
          {movDetails.videos && movDetails.videos.results.length > 0 ? (
            getOnlyTrailers(movDetails.videos.results)
          ) : (
            <p>No Trailers Available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailView;