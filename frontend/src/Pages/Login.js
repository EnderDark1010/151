import React from "react";
import axios from "axios";
import { sanitizeXSS } from "../Functions/Sanitize";
export function Login(props) {
  return (
    <div>
      <div>
        <input
          type={"text"}
          value={props.username}
          onChange={(evt) => updateUsername(evt, props)}
          placeholder="username"
        ></input>
      </div>
      <div>
        <input
          type={"text"}
          value={props.password}
          onChange={(evt) => updatePassword(evt, props)}
          placeholder="password"
        ></input>
      </div>

      <button onClick={(evt) => login(props)}>Login</button>

      <button onClick={(evt) => register(props)}>Register</button>
    </div>
  );
}

function login(props) {

  axios
    .get(`//localhost:5000/login/${props.username}/${props.password}`)
    .then(function (token) {
      props.setToken(token);
    });
}
async function register(props) {
  if (props.username !== "" && props.password !== "") {
    axios.put("//localhost:5000/register", {
      username: props.username,
      password: props.password,
    }).then(function(token){
      props.setToken(token);
    });
  }
}

function updateUsername(evt, props) {
  const val = sanitizeXSS(evt.target.value);
  props.setUsername(val);
}

function updatePassword(evt, props) {
  const val = sanitizeXSS(evt.target.value);
  props.setPassword(val);
}

