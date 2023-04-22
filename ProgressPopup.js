import PropTypes from "prop-types";
import { Box, Meter, Paragraph } from "grommet";
import { ModalBody, ModalDialog } from "../Card/ModalDialog";
export const ProgressPopup = ({
  title,
  percentage,
  setShowModal,
  filename,
  ...rest
}) => {
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
        <ModalBody align="center" gap="small">
          <Paragraph margin="none">{filename}</Paragraph>
          <div style={{ justify: "center", align: "center" }}>
            <h4 textalign="center">{`${percentage}%`}</h4>
            <Meter type="bar" value={percentage} />
          </div>
        </ModalBody>
      </Box>
    </ModalDialog>
  );
};
// Define the propTypes for the component
ProgressPopup.propTypes = {
  percentage: PropTypes.string,
  title: PropTypes.string,
  setShowModal: PropTypes.func,
  filename: PropTypes.string,
};
