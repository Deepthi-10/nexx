//This component returns a view consisting of a header component, a greeting message and a button to initiate the Github login process
import React from "react";
import { Button } from "grommet";
import LandingPageHeaderComponent from "../Header/LandingPageHeader";
import { properties } from "./../../Properties/Properties";
import "../../App.css";

//CLIENT_ID is defined and used in the URL for the Github login authorization.
//const CLIENT_ID = "c2c0fefcb0940e6b1ed7";
const CLIENT_ID = "a8f53c84a79e8f97b9d4";

export default function LandingPage() {
  function loginWithGithub() {
    sessionStorage.setItem("booleanValue", "true");
    window.location.assign(
      "https://github.hpe.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }
  return (
    <>
      <div
        className="main-wrapper"
        style={{
          justify: "center",
          align: "center",
          backgroundImage: "url(/landingpagebackgroundimage.png)",
        }}
      >
        <LandingPageHeaderComponent />
      </div>
      <div className="sub-wrapper">
        <h2>{properties.landingpage.Greetings}</h2>
        <p>{properties.landingpage.Title}</p>
        <p>{properties.landingpage.Subtitle}</p>
        <div className="buttons text-center">
          <p style={{ justify: "center", align: "center" }}></p>

          <Button
            primary
            size="xlarge"
            label="Login with Github"
            onClick={loginWithGithub}
          />
        </div>
      </div>
    </>
  );
}
