import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import HeaderComponent from "../Header/HeaderComponent";
import DesignSystemCard from "../Card/DesignSystemCard";
import { properties } from "./../../Properties/Properties";
import Spin from "../Spinner/Spin";
//import './ProductsPage.css';
import { useStateContext } from "../../lib/context";
import axios from 'axios';




import {
  Tip,
  Button,
  Heading,
  Box,
  Grid,
  Main,
  Menu,
  ResponsiveContext,
  Paragraph,
} from "grommet";


function ProductsPage() {
  // State to store the data fetched from the API
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [prod,setProd]= useState([]);
  const size = useContext(ResponsiveContext);

 
  const {databaseDecider}=useStateContext();

  
  
  useEffect(() => {
    console.log("entered")
    let data_specific_schema;
    if ( databaseDecider=== "Daily builds") {
      console.log('db snaps')
      data_specific_schema = "http://localhost:8777/products?server=ss" //variable to store URL that displays products from snapshot server 
    } else if (databaseDecider === "QA builds") {
      console.log('db qa')
      data_specific_schema = "http://localhost:8777/products?server=qa";//variable to store URL that displays products from quality assurance server 
    } else {
      console.log('db release')
      data_specific_schema = "http://localhost:8777/products";  //variable to store URL that displays products from release server 
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        //console.log(data_specific_schema);
        const res=await axios
        .get(data_specific_schema, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        })
      const responseData =await res.data;
      const loadedData = [];
        //store data in loadedData
        for (const key in responseData) {
          loadedData.push({
            id: key,
            product_name: responseData[key].product_name,
            product_description: responseData[key].product_description,
          });
        }
        //set data
        console.log(loadedData);
        setData(loadedData);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false); 
    };
    fetchData();
  }, [databaseDecider]);
  //function returning list pf products in card component
  const productList = data.map((data) => (
    <>
      <Link
        style={{ textDecoration: "none", color: "black" }}
        to={`/products/${data.product_name}/majorrelease`}
      >
        <DesignSystemCard
          key={data.id}
          title={data.product_name}
          description={data.product_description}
          level={2}
          actions={
            <Tip content="Click to get release details">
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
      {sessionStorage.getItem("booleanValue") === "true" ? (
        <>
          <HeaderComponent option={databaseDecider} />
          <Box flex>
            <Box height={{ min: "100%" }}>
              <Main background="background-back" pad="medium" fill={undefined}>
                <Heading color="text-strong" margin="none">
                  {properties.productspage.Title}
                </Heading>

              

                {/* <select className="menu">
                  <option value="snapshot" disabled selected hidden>Server</option>
                  <option value="snapshot">snapshot</option>
                  <option value="release">release</option>
                  <option value="quality assurance">quality assurance</option>
                </select> */}
                <Paragraph>{properties.productspage.Subtitle}</Paragraph>
                {isLoading && <Spin />}
                <Grid
                  columns={
                    !["xsmall", "small"].includes(size)
                      ? "small"
                      : { count: 2, size: "auto" }
                  }
                  gap={!["xsmall", "small"].includes(size) ? "medium" : "small"}
                >
                  {productList}
                </Grid>
              </Main>
            </Box>
          </Box>
        </>
      ) : (
        <>
          {" "}
          <Navigate to="/" />{" "}
        </>
      )}
    </>
  );
}

export default ProductsPage;
