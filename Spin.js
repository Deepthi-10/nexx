import { Box, Spinner } from "grommet";

function Spin() {
  return (
    <Box align="center" justify="center" height={{ min: "small" }}>
      <Spinner
        size="medium"
        message={{
          start: "Loading data.",
          end: "Data has been loaded.",
        }}
      />
    </Box>
  );
}

export default Spin;
