import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { useGlobalState } from "../GlobalVariables/Global";
import { Button,Tip } from "grommet";
import ProgressBar from "./DownloadActionResult";
import { Box } from "grommet";
import { DownloadAllCommand } from "../Popups/DownloadAllCommandPopUp";

// Function to extract the filename from a URL
const filename = (url) => {
  var name = url.substring(url.lastIndexOf("/") + 1, url.length);
  return name;
};

// Function to download multiple files as a zip archive
function DownloadFiles() {
  // Create a new JSZip object
  var zip = new JSZip();

  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonPopup1, setButtonPopup1] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [progress, setProgress] = useState(null);
  const [fileName, setFileName] = useState(null);

  // Get the download file URLs from the global state
  const globalvalue = useGlobalState("downloadfilearray");

  var urls = globalvalue[0];
  let downloadPercentage = 0;

  // Function to download all the files and zip them
  var donwloadAll = async () => {
    // Update the progress status
    setProgress("in-progress");

    // Loop through the URLs
    for (let i = 0; i < urls.length; i++) {
      // Create a request object
      const url = {
        URL: urls[i],
      };

      // Make a POST request to the proxy server for each URL
      // http://15.112.157.65:8776/proxy
      await axios
        .post("http://15.112.157.65:8776/proxy", url, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            // Calculate the percentage of the file that has been downloaded
            downloadPercentage = Math.floor((loaded / total) * 100);
            setPercentage(downloadPercentage);
            setFileName(filename(url.URL));
          },
        })
        // If the request is successful, add the file to the zip archive
        .then((response) => {
          const blob = response.data;
          var currentURL = url.URL;
          var filename = currentURL.substring(
            currentURL.lastIndexOf("/") + 1,
            currentURL.length
          );
          zip.file(filename, blob, {
            binary: true,
            type: "application/zip",
          });
          // If all the files have been added to the zip archive, generate it
          if (i === urls.length - 1) {
            zip
              .generateAsync({ type: "blob" })
              // Save the zip archive
              .then(function (content) {
                saveAs(content, new Date() + ".zip");
              })
              .then(() => {
                setProgress("finished");
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };


  // Two different buttons are used,one for generating curl commands and other for downloading.
  return (
    <>
      <Box direction="row" gap="small">
        <Tip content="Click for curl commands">
          <Button
            primary
            label="Generate curl commands"
            onClick={() => {
              setButtonPopup1(true);
            }}
          ></Button>
        </Tip>
        <Tip content="Click to Download">
          <Button
            primary
            label="Download"
            onClick={() => {
              setButtonPopup(true);
              donwloadAll();
            }}
          ></Button>
        </Tip>
      </Box>
      {buttonPopup1 && <DownloadAllCommand setTrigger={setButtonPopup1} />}
      <ProgressBar
        url={urls}
        filename={fileName}
        percentage={percentage}
        progress={progress}
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
      />
    </>
  );
}

export default DownloadFiles;
