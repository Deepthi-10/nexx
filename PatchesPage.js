import React, { useEffect, useState, useContext } from "react";
import HeaderComponent from "../Header/HeaderComponent";
import { useParams } from "react-router-dom";
import DownloadFiles from "../Download/DownloadFiles";
import CheckBoxComponent from "../ArtifactsPageComponents/CheckBoxComponent";
import ImageTab from "../ArtifactsPageComponents/ImageTab";
import { TabContent } from "../ArtifactsPageComponents/TabContent";
import { properties } from "./../../Properties/Properties";
import { setGlobalState } from "../GlobalVariables/Global";
import { useStateContext } from "../../lib/context";
import axios from 'axios';
import Spin from "../Spinner/Spin";
import {
  Tabs,
  Tab,
  Box,
  Main,
  PageHeader,
  ResponsiveContext,
} from "grommet";

// This is the PatchPage component that fetches data from the API and displays it in the UI
const PatchesPage = () => {
  // Get the breakpoint from the ResponsiveContext
  const breakpoint = useContext(ResponsiveContext);
    // Destructure the product_name, patch_name from the URL parameters
  let { product_name, patch_name } = useParams();
// State to keep track of the currently active tab index
  const [index, setIndex] = useState(0);
    // Handler for setting the active tab index
  const onActive = (nextIndex) => setIndex(nextIndex);
   // State to store the data fetched from the API
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  // Fetch data from the API on component mount and set the data in the 'data' state
  const {databaseDecider}=useStateContext();// variable that holds value of dropdown option selected  
  useEffect(() => {
    window.localStorage.clear();
    setGlobalState("downloadfilearray", [])
    console.log("entered")
    let data_specific_schema;// variable that holds value of appropriate URL when  when dropdown option selected  based on if condition
    if ( databaseDecider=== "Daily builds") {
      console.log('db snaps')
      data_specific_schema = `http://localhost:8777/patchartifacts/${patch_name}?server=ss`;//variable to store URL that displays patchartifacts from snaphots server 
    } else if (databaseDecider === "QA builds") {
      console.log('db qa')
      data_specific_schema = `http://localhost:8777/patchartifacts/${patch_name}?server=qa`;//variable to store URL that displays patchartifacts from quality asssurance server 
    } else {
      console.log('db release')
      data_specific_schema = `http://localhost:8777/patchartifacts/${patch_name}`;  //variable to store URL that displays patchartifacts from release server 
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
      // Filter the data and store it in 'loadedData'
      for (const key in responseData) {
        for (const key1 in responseData[key]) {
          if (
            Array.isArray(responseData[key][key1]) &&
            responseData[key][key1] !== "" &&
            responseData[key][key1] !== null &&
            key1 !== "ID" &&
            key1 !== "CreatedAt" &&
            key1 !== "UpdatedAt" &&
            key1 !== "DeletedAt" &&
            key1 !== "patch_name" &&
            key1 !== "major_release_version" &&
            key1 !== "minor_release_version"
          ) {
            loadedData.push({
              [key1]: responseData[key][key1],
            });
          }
        }
      }
      //set data
      setData(loadedData);
    }catch(error){
      console.log(error);
    }
    setIsLoading(false);
    };

    fetchData();
  }, [patch_name]);


  return (
    <>
      <HeaderComponent option={databaseDecider} />
      <Box flex>
        <Box height={{ min: "100%" }}>
          <Main background="background-back" pad="medium" fill={undefined}>
            <PageHeader
              style={{ padding: "10px" }}
              title={properties.patchartifactspage.Title}
              subtitle={`${product_name} Patch ${patch_name} `}
              actions={breakpoint !== "xsmall" ? <DownloadFiles /> : null}
            />
             {isLoading && <Spin />}
            {data.length > 0 && (
              <Tabs activeIndex={index} onActive={onActive} justify="start">
                {data.map((tab, id) =>
                  Object.entries(tab).map(([key, value]) => {
                    return (
                      <Tab key={id} title={key}>
                        {key === "images" ? (
                          <TabContent>
                            <ImageTab imagevalue={value} />
                          </TabContent>
                        ) : (
                          <TabContent>
                            <CheckBoxComponent body={value} />
                          </TabContent>
                        )}
                      </Tab>
                    );
                  })
                )}
              </Tabs>
            )}
          </Main>
        </Box>
      </Box>
    </>
  );
};

export default PatchesPage;
