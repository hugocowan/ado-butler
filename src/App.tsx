import React from "react";
import "./App.css";
import { DOMMessage, DOMMessageResponse } from "./types";

function App() {
  const [title, setTitle] = React.useState("");
  const [headlines, setHeadlines] = React.useState<string[]>([]);

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          /**
           * Sends a single message to the content script(s) in the specified tab,
           * with an optional callback to run when a response is sent back.
           *
           * The runtime.onMessage event is fired in each content script running
           * in the specified tab for the current extension.
           */
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "GET_DOM" } as DOMMessage,
            (response: DOMMessageResponse) => {
              setTitle(response.title);
              setHeadlines(response.headlines);
            }
          );
        }
      );
  });

  return (
    <div className="App">
      <h1>ADO Butler</h1>

      <ul className="SEOForm">
        <li className="SEOValidation">
          <div className="SEOValidationField">
            <span className="SEOValidationFieldTitle">Welcome John!</span>
            <div className="QuestionDiv">
            <span className="Question">What can I help you with...</span>
    
            <span
              className={`SEOValidationFieldStatus Error`}
            >
               What do you need help with?
            </span>
            </div>
          </div>
          <div className="SEOVAlidationFieldValue">{title}</div>
        </li>
        

        <li className="SEOValidation">
          <div className="SEOValidationField">
            <span className="SEOValidationFieldTitle">Please select an option from the below. I'm looking for information realting to… (single select)</span>
            <span
              className={`SEOValidationFieldStatus`}
            >
            </span>
          </div>
          <div className="SEOVAlidationFieldValue">
            <ul>
              {headlines.map((headline, index) => (
                <li key={index}>{headline}</li>
              ))}
            </ul>
          </div>
          <select className="Dropdown">
            <option value="option1">A team</option>
            <option value="option2">A person</option>
            <option value="option3">A project</option>
            <option value="option3">A wiki page</option>
            <option value="option3">A PAT token</option>
          </select>
        </li>
      </ul>
    </div>
  );
}

export default App;
