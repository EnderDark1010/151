import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import AuthenticationButton from "./Auth0/AuthenticationButton";
import { MovieDashBoard } from "./Pages/MovieDashBoard";
import { TablePage } from "./Pages/TablePage";

export function PageProvider() {
  const [selectedPage, selectPage] = useState("Movies");
  const { getAccessTokenSilently } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(0);
  useEffect(() => {
    const getmovies = async function () {
      const response = await axios({
        method: "get",
        url: "http://localhost:5000/permissions",
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
      });
      setIsAdmin(response.data[0].admin);

      //set movies to movies state
      //setmovies(movieArr);
    };
    getmovies();
  }, []);

  let page;
  switch (selectedPage) {
    case "Movies":
      page = <MovieDashBoard />;
      break;
    case "Admin":
      page = <TablePage />;
      break;
  }

  let adminPage;
  if(isAdmin==1){
    adminPage=<a onClick={() => selectPage("Admin")}>Admin</a>;
  }

  return (
    <div>
      <div>
        <AuthenticationButton />
        <a onClick={() => selectPage("Movies")}>Movies</a>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        {adminPage}
      </div>
      <br />
      {page}
    </div>
  );
}
