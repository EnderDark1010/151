import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Movie } from "../OtherElements/Movie";

export function MovieDashBoard(props) {
  const { getAccessTokenSilently } = useAuth0();
  const [movies, setmovies] = useState([]);
  useEffect(() => {
    const getmovies = async function () {
      const baseURL = "http://hp-api.herokuapp.com/api/movies";
      const response = await axios({
        method: "get",
        url: "http://localhost:5000/movie",
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
      });
      let movieArr = [];
      console.log(response);
      response.data.forEach((element, index) => {
        movieArr[index] = [
          element.name,
          element.genres,
          element.actors,
          element.director,
          element.img,
          element.fsk,
        ];
      });
      //set movies to movies state
      setmovies(movieArr);
    };
    getmovies();
  }, []);
  console.log(movies);
  return (
    <div className="gallery">
      {movies.map((movie, index) => (
        <Movie
          img={movie[4]}
          title={movie[0]}
          text={[
            "Director: ".concat(movie[3] ? movie[3] : "None"),
            "Actors: ".concat(movie[2] ? movie[2] : "None"),
            "Genre: ".concat(movie[1] ? movie[1] : "None"),
          ]}
          fsk={movie[5]}
        />
      ))}
    </div>
  );
}
