import { useState } from "react";
import { MovieDashBoard } from "./Pages/MovieDashBoard";
import { TablePage } from "./Pages/TablePage";

export function PageProvider() {
  const [selectedPage, selectPage] = useState("Movies");
  let page;
  switch (selectedPage) {
    case "Movies":
      page = <MovieDashBoard />;
      break;
    case "Admin":
      page = <TablePage />;
      break;
  }

  return (
    <div>
      <div>
        <a onClick={() => selectPage("Movies")}>Movies</a>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <a onClick={() => selectPage("Admin")}>Admin</a>
      </div>
      <br />
      {page}
    </div>
  );
}
