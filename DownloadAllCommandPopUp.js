import PropTypes from "prop-types";
import { Box, Button, Notification, Paragraph, TextArea } from "grommet";
import { ModalBody, ModalDialog, ModalFooter } from "../Card/ModalDialog";
import { Copy } from "grommet-icons";
import Clipboard from "clipboard";
import { useState, useEffect } from "react";
import { AlertPopUp } from "./DownloadAlertPopUp";
import { properties } from "./../../Properties/Properties";

// Obtain filename from the url
const filename = (url) => {
  var name = url.substring(url.lastIndexOf("/") + 1, url.length);
  return name;
};

export const DownloadAllCommand = ({ setTrigger, ...rest }) => {
// useState hooks used for copying data in clipboard
  const [data, setData] = useState("");
  const [copied, setCopied] = useState(false);
  const [final, setFinal] = useState();

  const onClose = () => {
    setTrigger(false);
  };

// Obtain filelist from localStorage
  var array = JSON.parse(localStorage.getItem("filelist"));


// Obtain the final command which has all commands to download the selected files
  useEffect(() => {
    if (array) {
      var finalCommand;
      for (let i = 0; i < array.length; i++) {
        var command = `curl -o ${filename(array[i])} --location 'http://15.112.157.65:8776/proxy' \
  --header 'Authorization: Bearer ${sessionStorage.getItem("accessToken")}' \
  --data '{"URL":"${array[i]}" }'`;
        if (finalCommand) finalCommand = finalCommand + "\n" + command;
        else finalCommand = command;
      }
      setFinal(finalCommand);
    }
  }, [array]);

  // Function to handle the copying of the image command
  function clickHandler(command) {
    // Update the local state with the selected image command
    setData(command);

    // Update the local state to indicate that the image command has been copied
    setCopied(true);

    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  // Use the useEffect hook to update the local state with the image information from props
  useEffect(() => {
    // Initialize the ClipboardJS library with the class selector for the copy button
    const clipboard = new Clipboard(".copy-button");

    // Log success and error events for the clipboard
    clipboard.on("success", function (e) {
      console.log(e);
    });
    clipboard.on("error", function (e) {
      console.log(e);
    });

    // Clean up the clipboard when the component unmounts
    return () => clipboard.destroy();
  }, []);

  if (!array || array.length === 0)
    return (
      <AlertPopUp
        title={properties.download.alertTitle}
        message={properties.download.alertMessage}
        setShowModal={setTrigger}
      />
    );
  else
    return (
      <ModalDialog
        title="Download via CLI"
        onEsc={() => {
          onClose();
        }}
        {...rest}
      >
        <Box gap="medium">
          <ModalBody gap="small">
            <Notification
              status="info"
              message="Copy and paste command in your CLI."
            />
            <Paragraph margin="none">curl commands</Paragraph>
            <Box
              direction="column"
              responsive="true"
              height="small"
              width="large"
              background={{
                color: "black",
                dark: true,
                clip: "text",
              }}
            >
              <TextArea value={final} fill="true" plain resize="horizontal" />
            </Box>
          </ModalBody>
          <ModalFooter justify="end">
            <Box direction="row" gap="small">
              <Button
                label="Cancel"
                onClick={() => {
                  onClose();
                }}
              />
              <Button
                className="copy-button"
                data-clipboard-text={data}
                primary
                label="Copy"
                icon={<Copy />}
                type="submit"
                onClick={() => {
                  clickHandler(final);
                }}
              />
              {copied && (
                <Notification
                  toast
                  status="normal"
                  message="Copied Successfully"
                  onClose={onClose}
                />
              )}
            </Box>
          </ModalFooter>
        </Box>
      </ModalDialog>
    );
};
// Define the propTypes for the component
DownloadAllCommand.propTypes = {
  message: PropTypes.string,
  setShowModal: PropTypes.func,
  title: PropTypes.string,
};
