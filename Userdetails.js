import React from "react";
import { useEffect, useState } from "react";
import {  Navigate } from "react-router-dom";
import { Box, Text } from "grommet";
import { User } from "grommet-icons";

function Userdetails() {
  const [userData, setUserData] = useState({});
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    //parsing url to fetch code 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    
    //Using code obtained fetch accessToken from github api
    if (codeParam && sessionStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("http://localhost:8773/getAccessToken?code=" + codeParam, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.access_token) {
              sessionStorage.setItem("accessToken", data.access_token);
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
    //Using accessToken getting user Data from github api
    async function getUserData() {
      await fetch("http://localhost:8773/getUserData", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setUserData(data);
        });
    }

    getUserData();
  }, [rerender]);

  return (
    <>
      {sessionStorage.getItem("booleanValue") === "true" ? (
        <>
          {sessionStorage.getItem("accessToken") ? (
            <>
              {Object.keys(userData).length !== 0 ? (
                <>
                  <Box direction="row" align="center" gap="medium">
                    <Text color="text-strong" weight="bold">{userData.name}</Text>
                    <User/>
                  </Box>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
            {null}
            </>
          )}
        </>
      ) : (
        <>
          <Navigate to="/" />
        </>
      )}
    </>
  );
}

export default Userdetails;
