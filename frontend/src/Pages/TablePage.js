import React, { useState } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Edit } from "../Tables/Edit";
import { Add } from "../Tables/Add";
import { Remove } from "../Tables/Remove";
import { View } from "../Tables/View";
export function TablePage(props) {
  const [selectedMode, setMode] = useState("view");

  let element = getElement(selectedMode);

  return (
    <>
      <label for="mode">Selected Mode:</label>
      <select id="mode" name="mode" onChange={(e) => changeMode(e, setMode)}>
        <option value="view">view</option>
        <option value="add">add</option>
        <option value="edit">edit</option>
        <option value="remove">remove</option>
      </select>

      {element}
    </>
  );
}
function changeMode(event, setMode) {
  setMode(event.target.value);
}

function getElement(mode) {
  switch (mode) {
    case "view":
      return <View />;
    case "add":
      return <Add />;
    case "edit":
      return <Edit />;
    case "remove":
      return <Remove />;
  }
}

export default withAuthenticationRequired(View, {
  // Update message with loading icon
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
