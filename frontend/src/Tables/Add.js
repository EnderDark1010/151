import axios from "axios";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function Add(props) {
  const { getAccessTokenSilently } = useAuth0();
  const [adminPassword, setAdminPassword] = useState();
  const viewableTables = new Map([
    ["", [""]],
    ["movie", ["name", "image_id", "director_id", "fsk/Min_Age"]],
    ["genre", ["name"]],
    ["director", ["firstName", "lastName"]],
    ["actor", ["firstName", "lastName"]],
    ["image", ["image_file"]],
    ["actor_movie", ["actor_id", "movie_id"]],
    ["movie_genre", ["movie_id", "genre_id"]],
  ]);

  const inputFieldTypes = new Map([
    ["", [""]],
    ["movie", ["text", "number", "number", "number"]],
    ["genre", ["text"]],
    ["director", ["text", "text"]],
    ["actor", ["text", "text"]],
    ["image", ["file"]],
    ["actor_movie", ["number", "number"]],
    ["movie_genre", ["number", "number"]],
  ]);

  const [inputData, setInputData] = useState([]);

  const [selectedTable, setSelectedTable] = useState(viewableTables.keys());
  const [inputTable, setTable] = useState();
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
      <button onClick={(evt) => generateTable()}>Load input field</button>
      {inputTable}
      <input
        type={"text"}
        placeholder={"admin password"}
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
      />
      <button onClick={startRequest}>Add</button>
    </div>
  );

  function changeTable(evt) {
    const val = evt.target.value;
    setSelectedTable(val);
    setInputData([]);
    setTable("");
  }
  function generateTable() {
    let names = viewableTables.get(selectedTable);
    let tableDataTypes = inputFieldTypes.get(selectedTable);

    let table;
    table = (
      <table>
        <tr>
          {names.map((headerName) => {
            return <th>{headerName}</th>;
          })}
        </tr>
        {tableDataTypes.map((data, index) => {
          if (data == "file") {
            return (
              <td>
                <input
                  type={"file"}
                  accept={
                    "image/png,image/jpg,image/jpeg, image/gif, image/webp "
                  }
                  onChange={(e) => changeValue(e, data, index)}
                  value={inputData[index]}
                ></input>
              </td>
            );
          } else {
            return (
              <td>
                <input
                  type={data}
                  onChange={(e) => changeValue(e, data, index)}
                  value={inputData[index]}
                ></input>
              </td>
            );
          }
        })}
      </table>
    );
    setTable(table);
  }

  function changeValue(e, data, index) {
    let copyInputData = inputData;

    if (data == "file") {
      //raw image
      copyInputData[index] = e.target.files;
    } else {
      copyInputData[index] = e.target.value;
    }
    setInputData(copyInputData);
  }

  async function postRequest(formdata) {
    console.log(
      await axios({
        method: "post",
        url: "http://localhost:5000/" + selectedTable,
        data: formdata,
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
      })
    );
  }

  function startRequest() {
    switch (selectedTable) {
      case "genre":
        postRequest({ adminPassword: adminPassword, name: inputData[0] });
        return;
      case "movie":
        postRequest({
          adminPassword: adminPassword,
          name: inputData[0],
          image_id: parseInt(inputData[1]),
          director_id: parseInt(inputData[2]),
          fsk: parseInt(inputData[3]),
        });
        return;
      case "director":
        postRequest({
          adminPassword: adminPassword,
          firstName: inputData[0],
          lastName: inputData[1],
        });
        return;
      case "actor":
        postRequest({
          adminPassword: adminPassword,
          firstName: inputData[0],
          lastName: inputData[1],
        });
        return;
      case "image":
        const reader = new FileReader();
        reader.readAsDataURL(inputData[0][0]);

        reader.onload = function () {
          postRequest({ adminPassword: adminPassword, img: reader.result });
          return;
        };
        return;
      case "actor_movie":
        postRequest({
          adminPassword: adminPassword,
          actor_id: parseInt(inputData[0]),
          movie_id: parseInt(inputData[1]),
        });
        return;
      case "movie_genre":
        postRequest({
          adminPassword: adminPassword,
          movie_id: parseInt(inputData[0]),
          genre_id: parseInt(inputData[1]),
        });
        return;
    }
  }
}
