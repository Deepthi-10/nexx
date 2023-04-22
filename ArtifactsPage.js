import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderComponent from "../Header/HeaderComponent";
import CheckBoxComponent from "../ArtifactsPageComponents/CheckBoxComponent";
import ImageTab from "./../ArtifactsPageComponents/ImageTab";
import PatchesTab from "./../ArtifactsPageComponents/PatchesTab";
import { TabContent } from "../ArtifactsPageComponents/TabContent";
import DownloadFiles from "../Download/DownloadFiles";
import { properties } from "./../../Properties/Properties";
import { Box, Main, Tabs, ResponsiveContext, Tab, PageHeader } from "grommet";
import { setGlobalState } from "../GlobalVariables/Global";
import { useStateContext } from "../../lib/context";
import axios from "axios";
import Spin from "../Spinner/Spin";

//Custom hook written to provide searching of parameters in the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// This is the ArtifactsPage component that fetches data from the API and displays it in the UI
const ArtifactsPage = () => {
  //Access the search query parameter passed in the URL
  let query = useQuery();
  let key = query.get("key");
  // Destructure the product_name, major_release_version, and minor_release_version from the URL parameters
  const { product_name, major_release_version, minor_release_version } =
    useParams();
  // Get the breakpoint from the ResponsiveContext
  const breakpoint = useContext(ResponsiveContext);
  // State to keep track of the currently active tab index
  const [index, setIndex] = useState(0);
  // Handler for setting the active tab index
  const onActive = (nextIndex) => {
    console.log(nextIndex);
    setIndex(nextIndex);
  };
  // State to store the data fetched from the API
  const [array, setArray] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const { databaseDecider } = useStateContext();

  // Set the API URL based on whether the minor_release_version is present or not
  //var url;
  /*if (minor_release_version != null || "") {
    url = `http://localhost:8777/artifacts/minor/${product_name}/${major_release_version}/${minor_release_version}`;
  } else {
    url = `http://localhost:8777/artifacts/major/${product_name}/${major_release_version}`;
  }*/
  let data_specific_schema;
  // Fetch data from the API on component mount and set the data in the 'array' state
  useEffect(() => {
    window.localStorage.clear();
    setGlobalState("downloadfilearray", []);
    console.log("entered")
    
    if ( databaseDecider=== "Daily builds") {
      console.log('db snaps')
      if (minor_release_version != null || "") {
        data_specific_schema = `http://localhost:8777/artifacts/minor/${product_name}/${major_release_version}/${minor_release_version}?server=ss`;//variable to store URL that displays artifacts from snapshot server 
      } else {
        data_specific_schema = `http://localhost:8777/artifacts/major/${product_name}/${major_release_version}?server=ss`;
      }
    
    
    } else if (databaseDecider === "QA builds") {
      console.log('db qa')
      if (minor_release_version != null || "") {
        data_specific_schema = `http://localhost:8777/artifacts/minor/${product_name}/${major_release_version}/${minor_release_version}?server=qa`;//variable to store URL that displays artifacts from quality assurance server 
      } else {
        data_specific_schema = `http://localhost:8777/artifacts/major/${product_name}/${major_release_version}?server=qa`;
      }
    } else {
      console.log('db release')
      if (minor_release_version != null || "") {
        data_specific_schema = `http://localhost:8777/artifacts/minor/${product_name}/${major_release_version}/${minor_release_version}`;//variable to store URL that displays artifacts from release server 
      } else {
        data_specific_schema = `http://localhost:8777/artifacts/major/${product_name}/${major_release_version}`;
      }  
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(data_specific_schema, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        const responseData = response.data;

        const loadedArray = [];
        // Filter the data and store it in 'loadedArray'
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
              key1 !== "product_name" &&
              key1 !== "major_release_version" &&
              key1 !== "minor_release_version"
            ) {
              loadedArray.push({
                [key1]: responseData[key][key1],
              });
            }
          }
        }
        setArray(loadedArray);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [major_release_version, product_name, data_specific_schema,databaseDecider]);

  //Find to set the index of active tab as specified in the search params
  useEffect(() => {
    const getIndex = () => {
      let len = array.length;
      if (key) {
        for (let i = 0; i < len; i++) {
          if (array[i][key]) return i;
        }
      }
    };
    let index = getIndex();
    setIndex(index);
  }, [array, key]);

  return (
    <>
      <HeaderComponent option={databaseDecider} />
      <Box flex>
        <Box height={{ min: "100%" }}>
          <Main background="background-back" pad="medium" fill={undefined}>
            <PageHeader
              style={{ padding: "7px" }}
              title={properties.artifactspage.Title}
              subtitle={properties.artifactspage.Subtitle}
              actions={breakpoint !== "xsmall" ? <DownloadFiles /> : null}
            />
            {isLoading && <Spin />}
            {array.length > 0 && (
              <Tabs activeIndex={index} onActive={onActive} justify="start">
                {array.map((tab, id) =>
                  Object.entries(tab).map(([key, value]) => {
                    return (
                      <Tab key={id} title={key}>
                        {key === "patches" ? (
                          <TabContent>
                            <PatchesTab
                              patchvalue={value}
                              major_release_version={major_release_version}
                              minor_release_version={minor_release_version}
                              product_name={product_name}
                            />
                          </TabContent>
                        ) : key === "images" ? (
                          <TabContent>
                            <ImageTab imagevalue={value} />
                          </TabContent>
                        ) : (
                          <TabContent>
                            <CheckBoxComponent
                              major_release_version={major_release_version}
                              minor_release_version={minor_release_version}
                              product_name={product_name}
                              body={value}
                              key={key}
                            />
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

export default ArtifactsPage;
