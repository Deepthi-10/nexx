import React, { useState, useEffect } from "react";
import { setGlobalState } from "../GlobalVariables/Global";
import { CheckBox, Button, Box } from "grommet";
import { Expand } from "grommet-icons";
import { DownloadCommand } from "../Popups/DownloadCommandPopup";

// Function to extract the filename from a URL
const filename = (url) => {
  var name = url.substring(url.lastIndexOf("/") + 1, url.length);
  return name;
};

function CheckBoxComponent(props) {
  // Initialize state variables 'artifacts' and 'selectedfiles' with an empty array, and 'checked' with an empty object
  const [artifacts, setArtifacts] = useState([]);
  const [selectedfiles, setSelectedfiles] = useState([]);
  const [checked, setChecked] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);

  //To find the selected index among the list of artifacts
  const [selectedIndex,setSelectedIndex] = useState();

  // Get the values of 'filelist' and 'check' from local storage
  let array = window.localStorage.getItem("filelist");
  let filelist = JSON.parse(array);
  let check = window.localStorage.getItem("check");
  let checkedvalue = JSON.parse(check);

  useEffect(() => {
    setArtifacts(props.body);
    // If there are no selected files and the 'filelist' exists in local storage
    if (
      selectedfiles.length === 0 &&
      localStorage.getItem("filelist") != null
    ) {
      setSelectedfiles(filelist);
      setChecked(checkedvalue);
    }
  }, [props.body, checkedvalue, filelist, selectedfiles.length]);

  // Function to add or remove selected file
  const addOrRemove = (name) => {
    const index = selectedfiles.indexOf(name);
    if (index === -1) {
      selectedfiles.push(name);
    } else {
      selectedfiles.splice(index, 1);
    }
    setSelectedfiles(selectedfiles);
    setGlobalState("downloadfilearray", selectedfiles);
    window.localStorage.setItem("filelist", JSON.stringify(selectedfiles));
  };

  // handleChange updates the checked state object by setting a new key/value pair
  // where the key is the name of the artifact and the value is the checked status
  const handleChange = (e, name) => {
    setChecked({
      ...checked,
      [name]: e.target.checked,
    });
    window.localStorage.setItem(
      "check",
      JSON.stringify({ ...checked, [name]: e.target.checked })
    );
  };


  // update the selected index on click of the button
  const onClickHandler = (id) => {
    setSelectedIndex(id);
  };

  return (
    <div>
    {buttonPopup && <DownloadCommand
              title="Download via CLI"
              message="curl command"
              setShowModal={setButtonPopup}
              id={selectedIndex}
              artifacts={artifacts}
              minor_version={props.minor_release_version}
              major_version={props.major_release_version}
              product_name={props.product_name}
              key={props.key}
            />}
      {artifacts.map((tab1, idx) =>
        Object.entries(tab1).map(([key1, value1]) => (
          <>
          <Box direction="row-responsive" responsive={true} gap="none" align="center">
            <CheckBox
              checked={checked[value1] || null}
              label={filename(value1)}
              onChange={(e) => {
                addOrRemove(value1);
                handleChange(e, value1);
              }}
            />
            <Button
              type="button"
              onClick={() => {
                setButtonPopup(true);
                onClickHandler(idx);
              }}
              tip={{
                dropProps: { align: { left: "right" } },
                content: "Download command via CLI",
              }}
              a11yTitle="Download via CLI button"
            >
              <Expand size="small" />
            </Button>
          </Box>
        </>
        ))
      )}
    </div>
  );
}

export default CheckBoxComponent;
