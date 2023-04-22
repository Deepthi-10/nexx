import React from "react";
import Highlighter from "react-highlight-words";
import "./Suggestion.css";
import { DocumentZip, Document } from "grommet-icons";

const SuggestionCard = ({ valToHighlight, icon, text, subtext }) => {
  const searchWords = [valToHighlight];

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-icon">
          {icon === "document" ? (
            <Document color="plain" size="medium" />
          ) : (
            <DocumentZip color="plain" size="medium" />
          )}
        </div>
        <div className="card-text">
          <p>
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={searchWords}
              autoEscape={true}
              textToHighlight={text}
            />
          </p>
          <small>
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={searchWords}
              autoEscape={true}
              textToHighlight={subtext}
            />
          </small>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
