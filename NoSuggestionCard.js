import React from "react";
import "./Suggestion.css";


const NoSuggestionCard = ({ icon, text, subtext }) => {
  return (
    <div className="card1">
      <div className="card-content1">
        <p>No suggestions found!</p>
      </div>
    </div>
  );
};

export default NoSuggestionCard;
