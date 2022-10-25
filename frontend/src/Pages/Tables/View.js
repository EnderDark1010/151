import React, { useState } from "react";
import axios from "axios";
import { sanitizeXSS } from "../../Functions/Sanitize";
import { Logout } from "../../OtherElements/Logout";
export function View(props) {
 const viewableTables =new Map([
  ["",[""]],
  ["user",["id","username"]],
 ])
  const [selectedTable, setSelectedTable] = useState(viewableTables.keys());
  const [table,setTable]=useState();
  let options = [];

  viewableTables.forEach((values,key,map) => {
    options.push(<option value={key}>{key}</option>);
  });

  let optionSelect = (
    <div>
      //delete {selectedTable}<br/>
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
    const val = sanitizeXSS(evt.target.value);
    console.log(val);
    setSelectedTable(val);
    console.log(selectedTable);
  }

  async function generateTable() {
    let row = [];
    axios.get("//localhost:5000/table/user").then(function (data) {
      data.data.forEach((element) => {
        let dataRow = [];
        Object.values(element).forEach((value) => {
          dataRow.push(value);
        });
        row.push(dataRow);
      });
      let builtTable;
      builtTable = <table><tr>
        {viewableTables.get(selectedTable).map(element=>
          <th>{element}</th>
        )}</tr>
        {row.map(entry=>{
          return <tr>
            {entry.map(data=>{
              return<td>{data}</td>
            })}
          </tr>
        })}
      </table>;
setTable(builtTable);

    });
  }
}
