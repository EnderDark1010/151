import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Log } from "../../OtherElements/Log";
export function Edit(props) {
  const { getAccessTokenSilently } = useAuth0();
  const [editId, setEditId] = useState();
  const [adminPassword, setAdminPassword] = useState();
  const [editData, setEditData] = useState([]);
  const [table, setTable] = useState();
  const [log, setLog] = useState("");
  const viewableTables = new Map([
    ["", [""]],
    ["movie", ["id", "name", "image_id", "director_id", "fsk/Min_Age"]],
    ["genre", ["id", "name"]],
    ["director", ["id", "firstName", "lastName"]],
    ["actor", ["id", "firstName", "lastName"]],
    ["image", ["id", "image_file"]],
  ]);

  const inputFieldTypes = new Map([
    ["", [""]],
    ["movie", ["id", "text", "number", "number", "number"]],
    ["genre", ["id", "text"]],
    ["director", ["id", "text", "text"]],
    ["actor", ["id", "text", "text"]],
    ["image", ["id", "file"]],
  ]);
  const [selectedTable, setSelectedTable] = useState(viewableTables.keys());
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
      <Log data={log} />
      {optionSelect}

      <input
        type={"number"}
        placeholder="ID of row to delete"
        value={editId}
        onChange={(e) => setEditId(e.target.value)}
      />
      <button onClick={loadData}>Load data</button>

      <button onClick={edit}>Edit</button>
      <input
        type={"text"}
        placeholder={"admin password"}
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
      />
      <br />
      {table}
    </div>
  );

  function changeTable(evt) {
    const val = evt.target.value;
    setSelectedTable(val);
    editData = [];
    setTable("");
    setLog("");
  }

  function loadTable() {
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
          console.log(data);
          if (data == "file") {
            return (
              <td>
                <input
                  type={"file"}
                  accept={
                    "image/png,image/jpg,image/jpeg, image/gif, image/webp "
                  }
                  onChange={(e) => changeValue(e, data, index)}
                  value={editData[index] + ""}
                ></input>
              </td>
            );
          } else if (data == "id") {
            return <div>{editId}</div>;
          } else {
            return (
              <td>
                <input
                  type={data}
                  onChange={(e) => changeValue(e, data, index)}
                  value={editData[index] + ""}
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
    if (data == "file") {
      //raw image
      editData[index] = e.target.files;
    } else {
      editData[index] = e.target.value;
    }
    loadTable();
  }

  async function loadData() {
    let gottenData = await axios({
      method: "get",
      url: "//localhost:5000/" + selectedTable + "/" + editId,
      headers: {
        Authorization: `Bearer ${await getAccessTokenSilently()}`,
      },
    });

    Object.values(gottenData.data[0]).map((val, index) => {
      console.log(val);
      editData[index] = val;
    });
    loadTable();
  }

  async function edit() {
    switch (selectedTable) {
      case "genre":
        putRequest({
          adminPassword: adminPassword,
          id: parseInt(editId),
          name: editData[0],
        });
        return;
      case "movie":
        putRequest({
          adminPassword: adminPassword,
          id: parseInt(editId),
          name: editData[1],
          image_id: parseInt(editData[2]),
          director_id: parseInt(editData[3]),
          fsk: parseInt(editData[4]),
        });
        return;
      case "director":
        putRequest({
          adminPassword: adminPassword,
          id: parseInt(editId),
          firstName: editData[0],
          lastName: editData[1],
        });
        return;
      case "actor":
        putRequest({
          adminPassword: adminPassword,
          id: parseInt(editId),
          firstName: editData[0],
          lastName: editData[1],
        });
        return;
      case "image":
        const reader = new FileReader();
        reader.readAsDataURL(editData[0][0]);

        reader.onload = function () {
          putRequest({
            adminPassword: adminPassword,
            id: parseInt(editId),
            img: reader.result,
          });
          return;
        };
        return;
    }
  }

  async function putRequest(formdata) {
    axios({
      method: "put",
      url: "http://localhost:5000/" + selectedTable,
      data: formdata,
      headers: {
        Authorization: `Bearer ${await getAccessTokenSilently()}`,
      },
    })
      .then((data) => {
        setLog(data);
      })
      .catch((error) => {
        console.log(error.toJSON().message);
        setLog(error.toJSON());
      });
  }
}
