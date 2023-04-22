import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TextInput } from "grommet";
import axios from "axios";
import { Search as SearchIcon } from "grommet-icons";
import { SearchSuggestions } from "../../Helper/Search";
import NoSuggestionCard from "./NoSuggestionCard";
const StyledTextInput = styled(TextInput).attrs(() => ({
  "aria-labelledby": "search-icon",
}))``;

const message = {
  enterSelect: "(Press Enter to Select)",
  suggestionsCount: "suggestions available",
  suggestionsExist: "This input has suggestions use arrow keys to navigate",
  suggestionIsOpen:
    "Suggestions drop is open, continue to use arrow keys to navigate",
};

export const SearchBar = () => {
  const [value, setValue] = React.useState("");
  const [suggestions, setSuggestions] = React.useState();
  const [data, setData] = React.useState();
  const navigate = useNavigate();
  const [icon, setShowIcon] = useState(true);
  // const [searchHistory, setSearchHistory] = React.useState([]);
  // const [isLoading,setIsLoading]=('false');

  // Used to fetch the data from  releases api when the component
  // is mounted for first time or when it is remounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://15.112.157.65:8776/release");
        if (res.status === 200) setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    // setIsLoading(true);
    fetchData();
    // setIsLoading(false);
  }, []);

  //The suggestions keep changing for every input entered by user
  useEffect(() => {
    // setIsLoading(true);
    const newSuggestions = SearchSuggestions(data, value);
    setSuggestions(newSuggestions);
    // setIsLoading(false);
  }, [value, data]);

  const onChange = (event) => {
    setShowIcon(false);
    setValue(event.target.value);
  };

  const suggestionHandler = (object) => {
    console.log(object.suggestion);
    let sugg = object.suggestion.value;
    if (sugg === "No suggestions") return;
    if (!sugg.artifacts) {
      sugg.minor_release_version
        ? navigate(
            `/products/${sugg.product_name}/${sugg.major_release_version}/minorrelease`
          )
        : navigate(`/products/${sugg.product_name}/majorrelease`);
    } else {
      if (sugg.patch_name) {
        sugg.minor_release_version
          ? navigate(
              `/products/${sugg.product_name}/${sugg.major_release_version}/${sugg.minor_release_version}/patch/${sugg.patch_name}`
            )
          : navigate(
              `/products/${sugg.product_name}/${sugg.major_release_version}/patch/${sugg.patch_name}`
            );
      } else {
        sugg.minor_release_version
          ? navigate(
              `/products/${sugg.product_name}/${sugg.major_release_version}/${sugg.minor_release_version}/artifacts?key=${sugg.key}`
            )
          : navigate(
              `/products/${sugg.product_name}/${sugg.major_release_version}/artifacts?key=${sugg.key}`
            );
      }
    }
  };

  const onSuggestionCloseHandler = () => {
    setSuggestions([]);
    setValue();
    setShowIcon(true);
    // setIsLoading(false);
  };

  return (
    <StyledTextInput
      icon={icon ? <SearchIcon id="search-icon" /> : null}
      placeholder="Search for products,releases,artifacts"
      reverse
      suggestions={
        suggestions && suggestions.length > 0
          ? suggestions
          : value && value.length > 0
          ? [{ label: <NoSuggestionCard />, value: "No suggestions" }]
          : []
      }
      value={value}
      onChange={onChange}
      onSuggestionSelect={suggestionHandler}
      onSuggestionsClose={onSuggestionCloseHandler}
      type="search"
      messages={message}
      dropHeight="medium"
    />
  );
};
