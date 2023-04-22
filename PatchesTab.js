import { Link } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { properties } from "./../../Properties/Properties";
import { Box, DataTable, Text, ResponsiveContext } from "grommet";

const PatchesTab = (props) => {
  // Access the size context for responsive design
  const size = useContext(ResponsiveContext);
  // Local state to store an array of patches
  const [iarray, setIarray] = useState([]);
  // Use the useEffect hook to update the local state with the patch information from props
  useEffect(() => {
    // Destructure the patch information from props
    let iarray = props.patchvalue;
    // Map the patch information to a new format and update the local state
    setIarray(
      iarray.map((d) => {
        return {
          patch_name: d.patch_name,
          patch_description: d.patch_description,
        };
      })
    );
   // Specify the dependencies for the effect to only run when the patchvalue in props changes
  }, [props.patchvalue]);

  // Defining columns for table
  const columns = [
    // Column for patch name
    {
      property: "patch_name",
      header: properties.patchtab.patchname,
      render: (datum) =>
        props.minor_release_version ? (
          <Link
            style={{ color: "#01A982" }}
            to={`/products/${props.product_name}/${props.major_release_version}/${props.minor_release_version}/patch/${datum.patch_name}`}
          >
            <Text truncate>{datum.patch_name}</Text>
          </Link>
        ) : (
          <Link
            style={{ color: "#01A982" }}
            to={`/products/${props.product_name}/${props.major_release_version}/patch/${datum.patch_name}`}
          >
            {datum.patch_name}
          </Link>
        ),
      primary: true,
      sortable: false,
    },
    // Column for patch description
    {
      property: "patch_description",
      header: properties.patchtab.patchdescription,
      render: (datum) => <Text truncate>{datum.patch_description}</Text>,
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
};

export default PatchesTab;
