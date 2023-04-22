import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeaderComponent from "../Header/HeaderComponent";
import DesignSystemCard from "../Card/DesignSystemCard";
import { properties } from "./../../Properties/Properties";
import axios from 'axios';
import Spin from "../Spinner/Spin";
import { useStateContext } from "../../lib/context";
import {
  Tip,
  Button,
  Heading,
  Box,
  Grid,
  Main,
  ResponsiveContext,
  Paragraph,
} from "grommet";
// This is the MajorReleases component that fetches data from the API and displays it in the UI
function MajorReleases() {
  // Destructure the product_name from the URL parameters
  const { product_name } = useParams();
  // State to store the data fetched from the API
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const size = useContext(ResponsiveContext);
  // Fetch data from the API on component mount and set the data in the 'data' state
  const {databaseDecider} = useStateContext();
  useEffect(() => {
    console.log("entered")
    console.log(databaseDecider)
    let data_specific_schema;
    if (databaseDecider === "Daily builds") {
      
      console.log('db snaps')
      
      data_specific_schema = `http://localhost:8777/release/${product_name}?server=ss`;//variable to store URL that displays majorrelease from snapshot server 
    } else if (databaseDecider === "QA builds") {
      console.log('db qa')
      data_specific_schema = `http://localhost:8777/release/${product_name}?server=qa`;//variable to store URL that displays majorrelease from quality assurance server 
    } else {
      console.log('db release')
      data_specific_schema = `http://localhost:8777/release/${product_name}`;//variable to store URL that displays majorrelease from release server 
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios
          .get(data_specific_schema, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          })
        const responseData = await res.data;
        const loadedData = [];
        //store data in loadedData
        for (const key in responseData) {
          loadedData.push({
            id: key,
            major_release_version: responseData[key].major_release_version,
            product_name: product_name,
          });
        }
        //set data
        setData(loadedData);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [product_name]);

  //function returning list of major release in card component
  const majorReleaseList = data.map((data) => (
    <>
      <Link
        style={{ textDecoration: "none", color: "black" }}
        to={`/products/${data.product_name}/${data.major_release_version}/minorrelease`}
      >
        <DesignSystemCard
          key={data.id}
          title={data.major_release_version}
          description={`${product_name}'s ${data.major_release_version} major version released `}
          level={2}
          actions={
            <Tip content="Click to know more details">
              <Button
                size="small"
                label="Expand"
                primary
                // tabIndex is -1 because the entire card is clickable
                tabIndex={-1}
              />
            </Tip>
          }
          onClick={() => { }}
          width="medium"
        />
      </Link>
    </>
  ));

  return (
    <>
      <HeaderComponent option={databaseDecider} />
      <Box flex>
        <Box height={{ min: "100%" }}>
          <Main background="background-back" pad="medium" fill={undefined}>
            <Heading color="text-strong" margin="none" size="small">
              {properties.major_release_page.Title}
            </Heading>
            <Paragraph>
              {`check out the Major Releases of ${product_name}`}
            </Paragraph>
            {isLoading && <Spin />}
            <Grid
              columns={
                !["xsmall", "small"].includes(size)
                  ? "small"
                  : { count: 2, size: "auto" }
              }
              gap={!["xsmall", "small"].includes(size) ? "medium" : "small"}
            >
              {majorReleaseList}
            </Grid>
          </Main>
        </Box>
      </Box>
    </>
  );
}

export default MajorReleases;
