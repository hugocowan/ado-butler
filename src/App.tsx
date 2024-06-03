import React from "react";
import "./App.css";
import { DOMMessage, DOMMessageResponse } from "./types";
import logo from "../../public/img/logo.png";

function App() {
  const [title, setTitle] = React.useState("");
  const [name, setName] = React.useState("");
  const [headlines, setHeadlines] = React.useState<string[]>([]);
  const [tab, setTab] = React.useState<chrome.tabs.Tab | null>(null);
  const [firstSelect, setFirstSelect] = React.useState("");
  const [secondSelect, setSecondSelect] = React.useState("");
  const [image, setImage] = React.useState("");

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
          setTab(tabs[0]);
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
              console.log("Hello!", response.menu);
              setTitle(response.title);
              setName(
                response.name?.split(",").reverse().join(" ") || "to ADO Butler"
              
              );
              setImage(response.image || "");
              setHeadlines(response.headlines);
            }
          );
          
        }
        
      );
  });

  const clickAThing = () => {
    console.log("Hi!");
    chrome.tabs.sendMessage(tab?.id || 0, { action: "clickAThing" });
  };

  console.log(process.env.REACT_APP_TEAMS);

  return (
    <div className="App">
            <img src="/assets/vodafone.png" className={'logo'} alt="logo" />
      <h1>ADO Butler</h1>

      <ul className="SEOForm">
        <li className="SEOValidation">
          <div className="SEOValidationField">
            <span className="SEOValidationFieldTitle">Welcome {name}!</span>
            <div className="QuestionDiv">
              <span className="Question">What can I help you with...</span>

              <span className={`SEOValidationFieldStatus Error`}>
                What do you need help with?
              </span>
            </div>
          </div>
          <div className="SEOVAlidationFieldValue">{title}</div>
        </li>
        <button onClick={() => clickAThing()}>Click me pls</button>

        <li className="SEOValidation">
          <div className="SEOValidationField">
            <span className="SEOValidationFieldTitle">
              Please select an option from the below... I'm looking for
              information relating to...
            </span>
            <span className={`SEOValidationFieldStatus`}></span>
          </div>
          <div className="SEOVAlidationFieldValue">
            <ul>
              {headlines.map((headline, index) => (
                <li key={index}>{headline}</li>
              ))}
            </ul>
          </div>
          <div className="selects">
            <select
              onChange={(e) => setFirstSelect(e.target.value)}
              value={firstSelect}
              className="Dropdown"
            >
              <option value="">Select an option</option>
              <option value="team">A team</option>
              <option value="person">A person</option>
              <option value="project">A project</option>
              <option value="wiki">A wiki page</option>
              <option value="pat">A PAT token</option>
            </select>

            {["team", "wiki"].includes(firstSelect) && (
              <select
                onChange={(e) => setSecondSelect(e.target.value)}
                value={secondSelect}
                className="Dropdown"
              >
                <option value="">Select a team</option>
                {process.env.REACT_APP_TEAMS?.split(",").map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default App;
