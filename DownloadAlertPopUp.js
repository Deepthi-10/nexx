import PropTypes from "prop-types";
import { Box, Button, Notification, Paragraph } from "grommet";
import { ModalBody, ModalDialog, ModalFooter } from "../Card/ModalDialog";
export const AlertPopUp = ({ message, setShowModal, title, ...rest }) => {
  const onClose = () => {
    setShowModal(false);
  };

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
            status="critical"
            message="This action cannot be done."
          />
          <>
            <Paragraph margin="none">{message}</Paragraph>
          </>
        </ModalBody>
        <ModalFooter justify="end">
          <Box direction="row" gap="small">
            <Button
              primary
              label="OK"
              onClick={() => {
                onClose();
              }}
            />
          </Box>
        </ModalFooter>
      </Box>
    </ModalDialog>
  );
};
// Define the propTypes for the component
AlertPopUp.propTypes = {
  message: PropTypes.string,
  setShowModal: PropTypes.func,
  title: PropTypes.string,
};
