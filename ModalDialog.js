import PropTypes from 'prop-types';
import { Box, Footer, Layer } from 'grommet';

import { LayerHeader } from './../Header/LayerHeader';
export const ModalDialog = ({
  children,
  title,
  subtitle,
  onClose,
  ...layerProps
}) => (
  <Layer position="center" {...layerProps}>
    <Box gap="medium" pad="medium" width={{ min: 'medium' }} flex="grow">
      <LayerHeader title={title} subtitle={subtitle} onClose={onClose} />
      {children}
    </Box>
  </Layer>
);
// Define the propTypes for the component
ModalDialog.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.object,
  ]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onClose: PropTypes.func,
};

export const ModalBody = ({ children, ...boxProps }) => (
  <Box {...boxProps}>{children}</Box>
);
// Define the propTypes for the component
ModalBody.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.object,
  ]),
};

export const ModalFooter = ({ children, ...boxProps }) => (
  <Footer {...boxProps}>{children}</Footer>
);
// Define the propTypes for the component
ModalFooter.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.object,
  ]),
};