import "./Feature.css";
import axios from "axios";
import { useState, useEffect } from "react";

function Feature() {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    (async function getPosters() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );

      setPosters(response.data.results);
    })()
  }, []);

  return (
    <div className="featured">
      <div style={{ textAlign: "center" }}>
        <br></br>
        <br></br>
        <p style={{ fontSize: "30px" }}>Plans starting at $6.99/month.</p>
        <br></br>
        <br></br>
        <h6 style={{ fontSize: "30px" }} width={"100%"}>Trending</h6>
      </div>

      <div className="trending">
        <div id="display">
          {posters.length > 0 ? (
            <div>
              <img height={"500px"}
                src={`https://image.tmdb.org/t/p/w500${posters[Math.floor((Math.random() * 5))].poster_path}`}
              />
              <img height={"500px"}
                src={`https://image.tmdb.org/t/p/w500${posters[Math.floor((Math.random() * 5 + 5))].poster_path}`}
              />
              <img height={"500px"}
                src={`https://image.tmdb.org/t/p/w500${posters[Math.floor((Math.random() * 5 + 10))].poster_path}`}
              />
              <img height={"500px"}
                src={`https://image.tmdb.org/t/p/w500${posters[Math.floor((Math.random() * 5 + 15))].poster_path}`}
              />
            </div>
          ) : (
            <p>Posters are loading</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feature;