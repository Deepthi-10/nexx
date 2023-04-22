import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Hpe } from "grommet-icons";
import { LogOutPopup } from "../Popups/LogOutPopup";
import { properties } from "../../Properties/Properties";
import Userdetails from "./Userdetails";
import { SearchBar } from "../SearchBar/SearchBar";
import { Box, Button, DropButton, Header, ResponsiveContext, Text, Tip } from "grommet";
import { DropDown } from "./dropdown";




function HeaderComponent({ token, option }) {
  // Use the useContext hook to access the current screen size from ResponsiveContext
  
  const size = useContext(ResponsiveContext);
  // Use the useState hook to manage the state of the buttonPopup state
  const [buttonPopup, setButtonPopup] = useState(false);
  // Use the useState hook to manage the state of the focused state
  const [focused, setFocused] = useState(false);
  // Use the useRef hook to create a reference to the input element
  const inputRef = useRef();
  // Use the useEffect hook to focus the input element when the focused state is true

  useEffect(() => {
  }, [option])
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused, setFocused]);


  return (
    
    <Header
      fill="horizontal"
      pad={{ horizontal: "small", vertical: "small" }}
      background="background-front"
    >
      
      <Link to={`/products`}>
        <Tip content="Click to navigate to product page">
          <Button>
            <Box
              direction="row"
              align="start"
              gap="small"
              pad={{ vertical: "small" }}
              responsive={false}
            >
              <Hpe color="brand" />
              
             

              {(!["xsmall", "small"].includes(size) ||
                (["xsmall", "small"].includes(size) && !focused)) && (
                  <Box direction="row" gap="xsmall" wrap>
                    <Text color="text-strong" weight="bold">
                      {properties.HeaderComponent.Organisation}
                    </Text>
                    <Text color="text-strong">
                      {" "}
                      {properties.HeaderComponent.Title}
                    </Text>
                    
                  </Box>
                )}
            </Box>
          </Button>
        </Tip>
      </Link>
      
      <Box
        direction="row-responsive"
        width={{ min: "550px" }}
        elevation="medium"
        pad="none"
        margin="none"
      >
        <SearchBar token={token} />
      </Box>
      <Box direction="row" align="center" gap="medium">
      <Box
          direction="row"
          align="center"
          gap="medium"

          responsive={false}
        >
          
        </Box>
        <DropDown option={option}/>
        <Box>
          <Userdetails token={token} />
        </Box>

     
        <Tip content="Click to logout">
          <Button
            size="small"
            label="Log Out"
            secondary
            onClick={() => setButtonPopup(true)}
          />
        </Tip>
        {/*if buttonPopup is set to true render LogOutPopup*/}
        {buttonPopup ? (
          <LogOutPopup
            title="Log Out"
            message={`Are you sure you want to log out?`}
            setShowModal={setButtonPopup}
          />
        ) : null}
      </Box>
    </Header>
  );
}
export default HeaderComponent;

