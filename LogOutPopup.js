import PropTypes from "prop-types";
import { Box, Button, Paragraph } from "grommet";
import { Link } from "react-router-dom";
import { ModalBody, ModalDialog, ModalFooter } from "./../Card/ModalDialog";
import { useState } from "react";


export const LogOutPopup = ({ message, setShowModal, title, ...rest }) => {
  const onClose = () => {
    setShowModal(false);
  };
  const [rerender, setRerender] = useState(false);

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
          <>
            <Paragraph margin="none">{message}</Paragraph>
          </>
        </ModalBody>
        <ModalFooter justify="end">
          <Box direction="row" gap="small">
            <Button
              label="Cancel"
              onClick={() => {
                onClose();
              }}
            />
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button
                primary
                label="Yes"
                type="submit"
                onClick={() => {
                  //remove git's stored credentials 
                  sessionStorage.removeItem("booleanValue");
                  sessionStorage.removeItem("accessToken");
                  setRerender(!rerender);
                }}
              />
            </Link>
          </Box>
        </ModalFooter>
      </Box>
    </ModalDialog>
  );
};
// Define the propTypes for the component
LogOutPopup.propTypes = {
  message: PropTypes.string,
  setShowModal: PropTypes.func,
  title: PropTypes.string,
};
