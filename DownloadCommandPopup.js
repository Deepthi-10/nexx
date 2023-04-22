import PropTypes from "prop-types";
import { Box, Button, Notification, Paragraph, TextArea } from "grommet";
import { ModalBody, ModalDialog, ModalFooter } from "../Card/ModalDialog";
import { Copy } from "grommet-icons";
import Clipboard from "clipboard";
import { useState, useEffect } from "react";


//Obtain filename from given URL.
const filename = (url) => {
  var name = url.substring(url.lastIndexOf("/") + 1, url.length);
  return name;
};

export const DownloadCommand = ({
  id,
  key,
  minor_version,
  major_version,
  product_name,
  message,
  setShowModal,
  title,
  artifacts,
  ...rest
}) => {

  //Set of hooks which helps to copy commands to clipboard.
  const [data, setData] = useState("");
  const [copied, setCopied] = useState(false);

  const onClose = () => {
    setShowModal(false);
  };

  var array = Object.values(artifacts[id]);
  var url = array[0];

  var file = filename(url);

  //Curl command for the given artifact
  var command = `curl -o ${file} --location 'http://15.112.157.65:8776/proxy' \
  --header 'Authorization: Bearer ${sessionStorage.getItem("accessToken")}' \
  --data '{"URL":"${url}" }'`;

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

  return (
    <ModalDialog
      title={title}
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
          <Paragraph margin="none">{message}</Paragraph>
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
            <TextArea value={command} fill="true" plain resize="horizontal" />
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
                clickHandler(command);
              }}
            />
            {copied && (
              <Notification
                toast
                status="normal"
                message='Copied Successfully'
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
DownloadCommand.propTypes = {
  message: PropTypes.string,
  setShowModal: PropTypes.func,
  title: PropTypes.string,
};
