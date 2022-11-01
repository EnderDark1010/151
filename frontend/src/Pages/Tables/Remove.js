import axios from "axios";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Log } from "../../OtherElements/Log";
export function Remove(props) {
  const { getAccessTokenSilently } = useAuth0();
  const [deleteId, setDeleteId] = useState();
  const [log, setLog] = useState("");
  const viewableTables = [
    "",
    "movie",
    "genre",
    "director",
    "actor",
    "image",
    "actor_movie",
    "genre_movie",
  ];

  const [selectedTable, setSelectedTable] = useState(viewableTables.keys());
  let options = [];

  viewableTables.forEach((value, key, map) => {
    options.push(<option value={value}>{value}</option>);
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
      <Log data={log} />
      {optionSelect}
      <input
        type={"number"}
        placeholder="ID of row to delete"
        value={deleteId}
        onChange={(e) => setDeleteId(e.target.value)}
      />
      <button onClick={startRequest}>Remove</button>
    </div>
  );

  function changeTable(evt) {
    const val = evt.target.value;
    setSelectedTable(val);
  }

  async function startRequest() {
    await axios({
      method: "delete",
      url: "http://localhost:5000/" + selectedTable,
      data: { id: parseInt(deleteId) },
      headers: {
        Authorization: `Bearer ${await getAccessTokenSilently()}`,
      },
    })
      .then((data) => {
        setLog(data);
      })
      .catch((error) => {
        setLog(error.toJSON());
      });
  }
}
