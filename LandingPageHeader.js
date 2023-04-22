import React, { useContext, useEffect, useRef, useState } from "react";
import { Hpe } from "grommet-icons";
import { properties } from "./../../Properties/Properties";
import {
  Box,
  Button,
  Header,
  ResponsiveContext,
  Text,
} from "grommet";

function LandingPageHeaderComponent() {
   // Use the useContext hook to access the current screen size from ResponsiveContext
  const size = useContext(ResponsiveContext);
  // Use the useState hook to manage the state of the focused state
  const [focused, setFocused] = useState(false);
  // Use the useRef hook to create a reference to the input element
  const inputRef = useRef();
// Use the useEffect hook to focus the input element when the focused state is true
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused, setFocused]);

  return (
    <Header
      fill="horizontal"
      pad={{ horizontal: "medium", vertical: "small" }}
      background="black"
    >
      <Button>
        <Box
          direction="row"
          align="start"
          gap="medium"
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
                {properties.HeaderComponent.Title}
              </Text>
            </Box>
          )}
        </Box>
      </Button>
    </Header>
  );
}
export default LandingPageHeaderComponent;
