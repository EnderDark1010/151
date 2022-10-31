import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
export function Edit(props) {
  const { getAccessTokenSilently } = useAuth0();
  const [editId, setEditId] = useState();
  let editData=[];
  const [table,setTable]=useState();
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
      {optionSelect}
      
      <input
        type={"number"}
        placeholder="ID of row to delete"
        value={editId}
        onChange={(e) => setEditId(e.target.value)}
      />
      <button onClick={loadData}>Load data</button>
      <button onClick={loadTable}>Load Table here</button>
      <button onClick={edit}>Edit</button>
<br/>
      {table}
    </div>
  );

  function changeTable(evt) {
    const val = evt.target.value;
    setSelectedTable(val);
    editData=[];
    setTable("");
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
                  value={editData[index]+""}
                ></input>
              </td>
            );
          } else if (data == "id") {
            return <div>{editId}</div>;
          }else{
            return (
              <td>
                <input
                  type={data}
                  onChange={(e) => changeValue(e, data, index)}
                  value={editData[index]+""}
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
      editData[index]=e.target.value;
    }
    loadTable();
  }

 async function loadData(){
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

  async function edit(){

  }
}
