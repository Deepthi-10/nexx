import React from "react";
import { useState, useEffect, useContext } from "react";
import { Copy } from "grommet-icons";
import { Box, DataTable, Button, Text, Tip, ResponsiveContext } from "grommet";
import { properties } from "../../Properties/Properties";
import Clipboard from 'clipboard';

function ImageTab(props) {
  // Access the size context for responsive design
  const size = useContext(ResponsiveContext);

  // Local state to store an array of images and its information
  const [iarray, setIarray] = useState([]);

  // Local state to store the image command that is to be copied
  const [data, setData] = useState('');

  // Local state to track whether the image command has been copied or not
  const [copied, setCopied] = useState(false);

  // Function to handle the copying of the image command
  function handleClick(imageCommand) {
    // Update the local state with the selected image command
    setData(imageCommand);

    // Update the local state to indicate that the image command has been copied
    setCopied(true);

    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000); 
  }

  // Use the useEffect hook to update the local state with the image information from props
  useEffect(() => {
    // Destructure the image information from props
    let iarray = props.imagevalue;

    // Map the image information to a new format and update the local state
    setIarray(
      iarray.map((d) => {
        return {
          image_name: d.image_name,
          image_command: d.image_command,
        };
      })
    );

    // Initialize the ClipboardJS library with the class selector for the copy button
    const clipboard = new Clipboard('.copy-btn');

    // Log success and error events for the clipboard
    clipboard.on('success', function(e) {
        console.log(e);
    });
    clipboard.on('error', function(e) {
        console.log(e);
    });

    // Clean up the clipboard when the component unmounts
    return () => clipboard.destroy()
  }, [props.imagevalue]);

  // Defining columns for table
  const columns = [
    // Column for image name
    {
      property: "image_name",
      header: properties.imagetab.imagename,
      render: (datum) => <Text truncate>{datum.image_name}</Text>,
      primary: true,
      sortable: false,
    },
    // Column for image command
    {
      property: "image_command",
      header: properties.imagetab.imagecommand,
      render: (datum) => <Text truncate>{datum.image_command}</Text>,
      sortable: false,
    },
    // Column for copying image command
    {
      header: properties.imagetab.imagecopycommand,
      render: (datum) => (
        <div>
          <Tip
            content={
              <Box width={{ max: "small" }} round="xsmall">
                <Text>{properties.imagetab.imagecopymessage}</Text>
              </Box>
            }
          >
            <Button className="copy-btn" data-clipboard-text={data} onClick={() => handleClick(datum.image_command)}>
              <Copy color="brand" />
              <span>
                {data === datum.image_command && copied ? "copied!" : ""}
              </span>
            </Button>
          </Tip>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <Box pad="small">
      <Box>
        <DataTable
          aria-describedby="storage-pools-heading"
          data={iarray}
          columns={[...columns]}
          fill
          paginate={{
            border: "top",
            direction: "row",
            fill: "horizontal",
            flex: false,
            justify: !["xsmall", "small"].includes(size) ? "end" : "center",
            pad: { top: "xsmall" },
          }}
          step={10}
          sortable
        />
      </Box>
    </Box>
  );
}

export default ImageTab;
