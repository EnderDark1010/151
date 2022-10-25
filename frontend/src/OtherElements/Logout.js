import React from "react";
import axios from "axios";
import { sanitizeXSS } from "../Functions/Sanitize";
export function Logout(props) {
  return (
      <button onClick={(evt) => logout()}>Logout</button>
  );
}

function logout() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  console.log(document.cookie);
}
