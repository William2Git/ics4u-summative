import "./Genres.css";
import { useNavigate } from "react-router";

function Genres(props) {
  const navigate = useNavigate();

  return (
    <div>
      <h2 id="list-title">Genres</h2>
      <ul>
        {
          props.genresList.map((gen) => {
            return (
              <li id="categories" key={gen.id} onClick={() => navigate(`genre/${gen.id}`)}
                style={{ cursor: 'pointer' }}>{gen.genre}</li>
            )
          })
        }
      </ul>
    </div>
  );
}

export default Genres;