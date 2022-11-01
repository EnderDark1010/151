import React from "react";

export function Log(props) {
  let isOkay = true;
  let message = "Success";
  if (props.data === "") {
    return <></>;
  }
  if ("message" in props.data) {
    isOkay = false;
    message = props.data.message;
  } else if ("errno" in props.data.data) {
    isOkay = false;
    message = "Failed with Error:" + props.data.data.errno;
  }
  return <div className={isOkay ? "log-green" : "log-red"}>{message}</div>;
}
