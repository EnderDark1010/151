import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
export function View(props) {
  const { getAccessTokenSilently } = useAuth0();
  const viewableTables = new Map([
    ["", [""]],
    [
      "movie",
      [
        "id",
        "name",
        "image",
        "director name",
        "fsk/image",
        "genre_list",
        "actor list",
      ],
    ],
    ["genre", ["id", "name", "movie_list_that_has_genre"]],
    ["director", ["id", "firstName", "lastName", "movies_directed"]],
    ["actor", ["id", "firstName", "lastName", "movies_played_in_list"]],
    ["image", ["id", "image"]],
    ["actor_movie",["id","Actor_name","Movie"]],
    ["movie_genre",["id","Movie","Genre"]]
  ]);
  const [selectedTable, setSelectedTable] = useState(viewableTables.keys());
  const [table, setTable] = useState();
  let options = [];

  viewableTables.forEach((values, key, map) => {
    options.push(<option value={key}>{key}</option>);
  });

  let optionSelect = (
    <div>
      <label for="table">Table:</label>
      <select
        name="table"
        id="table"
        onChange={changeTable}
        value={selectedTable}
      >
        {options}
      </select>
    </div>
  );
  return (
    <div>
      {optionSelect}
      <button onClick={(evt) => generateTable(props)}>search</button>
      {table}
    </div>
  );

  function changeTable(evt) {
    const val = evt.target.value;
    setSelectedTable(val);
  }

  async function generateTable() {
    let row = [];
    axios({
      method: "get",
      url: "//localhost:5000/" + selectedTable,
      headers: {
        Authorization: `Bearer ${await getAccessTokenSilently()}`,
      },
    }).then(function (data) {
      console.log(data);
      data.data.forEach((element) => {
        let dataRow = [];
        Object.values(element).forEach((value) => {
          dataRow.push(value);
        });
        row.push(dataRow);
      });
      let builtTable;
      builtTable = (
        <table>
          <tr>
            {viewableTables.get(selectedTable).map((element) => (
              <th>{element}</th>
            ))}
          </tr>
          {row.map((entry) => {
            return (
              <tr>
                {entry.map((data, index) => {
                  if (
                    viewableTables.get(selectedTable)[index].includes("image")
                  ) {
                    //data needs to be the prefix+base64 encoded image
                    return (
                      <td>
                        <img src={data} />
                      </td>
                    );
                  } else {
                    return <td>{data}</td>;
                  }
                })}
              </tr>
            );
          })}
        </table>
      );
      setTable(builtTable);
    });
  }
}
