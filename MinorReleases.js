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


// This is the MinorReleases component that fetches data from the API and displays it in the UI

function MinorReleases() {
  // Destructure the product_name, major_release_version from the URL parameters
  const { product_name, major_release_version } = useParams();
  // State to store the data fetched from the API
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const size = useContext(ResponsiveContext);
  
  const {databaseDecider}=useStateContext();
    // Fetch data from the API on component mount and set the data in the 'data' state
  useEffect(() => {
    console.log("entered")
    let data_specific_schema;
    if ( databaseDecider=== "Daily builds") {
      console.log('db snaps')
      data_specific_schema = `http://localhost:8777/release/${product_name}/${major_release_version}?server=ss`;//variable to store URL that displays minorrelease from snapshot server 
    } else if (databaseDecider === "QA builds") {
      console.log('db qa')
      data_specific_schema = `http://localhost:8777/release/${product_name}/${major_release_version}?server=qa`;//variable to store URL that displays minorrelease from quality assurance server 
    } else {
      console.log('db release')
      data_specific_schema = `http://localhost:8777/release/${product_name}/${major_release_version}`;  //variable to store URL that displays minorrelease from release server 
    }
    const fetchData = async () => {
      setIsLoading(true);
      try{
        const res=await axios
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
          minor_release_version: responseData[key].minor_release_version,
          major_release_version: responseData[key].major_release_version,
        });
      }
      //set data
      setData(loadedData);
    }catch(error){
      console.log(error);
    }
    setIsLoading(false);
    };

    fetchData();
  }, [product_name, major_release_version]);

  //function returning list of minor release in card component
  const minorReleaseList = data.map((data) =>
    data.minor_release_version === "" || null ? (
      <Link
        style={{ textDecoration: "none", color: "black" }}
        to={`/products/${product_name}/${major_release_version}/artifacts`}
      >
        <DesignSystemCard
          key={data.id}
          title={data.major_release_version}
          description={`${product_name}'s ${data.major_release_version} major version released  `}
          level={2}
          actions={
            <Tip content="Click to get artifacts">
              <Button
                size="small"
                label="Expand"
                primary
                // tabIndex is -1 because the entire card is clickable
                tabIndex={-1}
              />
            </Tip>
          }
          onClick={() => {}}
          width="medium"
        />
      </Link>
    ) : (
      <Link
        style={{ textDecoration: "none", color: "black" }}
        to={`/products/${product_name}/${major_release_version}/${data.minor_release_version}/artifacts`}
      >
        <DesignSystemCard
          key={data.id}
          title={data.minor_release_version}
          description={`${product_name}'s ${data.minor_release_version} minor version released  `}
          level={2}
          actions={
            <Tip content="Click to get artifacts">
              <Button size="small" label="Expand" primary tabIndex={-1} />
            </Tip>
          }
          onClick={() => {}}
          width="medium"
        />
      </Link>
    )
  );

  return (
    <>
      <HeaderComponent option={databaseDecider}/>
      <Box flex>
        <Box height={{ min: "100%" }}>
          <Main background="background-back" pad="medium" fill={undefined}>
            <Heading color="text-strong" margin="none" size="small">
              {`${major_release_version} & its Minor Releases`}
            </Heading>
            <Paragraph>
              {`check out  ${product_name}'s ${major_release_version} and its ${properties.minor_release_page.Title} `}
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
              {minorReleaseList}
            </Grid>
          </Main>
        </Box>
      </Box>
    </>
  );
}

export default MinorReleases;
