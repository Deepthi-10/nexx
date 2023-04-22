import React from "react";
import { AlertPopUp } from "../Popups/DownloadAlertPopUp";
import { ProgressPopup } from "../Popups/ProgressPopup";
import { properties } from './../../Properties/Properties';

function ProgressBar(props) {
  //props.trigger is true and selected url length !=0 progress bar is rendered
  if (props.trigger && props.url.length !== 0) {
    return (
      <div>
      <ProgressPopup
          title={properties.download.postiveMessage}
          filename={props.filename}
          percentage={props.percentage}
          setShowModal={props.setTrigger}
        />
        {props.progress === "finished" ? props.setTrigger(false) : null}
        </div>
    );
  }
  //props.trigger is true and selected url length ===0 progress bar is not rendered instead a AlertPopUp gets rendered
  if (props.trigger && props.url.length === 0) {
    return (
      <AlertPopUp
          title={properties.download.alertTitle}
          message={properties.download.alertMessage}
          setShowModal={props.setTrigger}
        />
    );
  }
}

export default ProgressBar;
