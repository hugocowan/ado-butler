import React from "react";
import "./App.css";
import { DOMMessage, DOMMessageResponse } from "./types";

function App() {
  const [name, setName] = React.useState("");
  const [tab, setTab] = React.useState<chrome.tabs.Tab | null>(null);
  const [firstSelect, setFirstSelect] = React.useState("");
  const [secondSelect, setSecondSelect] = React.useState("");
  const [thirdSelect, setThirdSelect] = React.useState([""]);
  const [fourthSelect, setFourthSelect] = React.useState("");

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
              setName(
                response.name?.split(",").reverse().join(" ") || "to ADO Butler"
              );
            }
          );
        }
      );
  });

  const makeQuery = () => {
    chrome.tabs.sendMessage(tab?.id || 0, {
      action: "makeQuery",
      data: {
        firstSelect,
        secondSelect,
        thirdSelect,
        fourthSelect,
      },
    });
  };

  const handleMultiSelectChange = (
    callback: any,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValues = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    callback(newValues);
  };

  return (
    <div className="App">
      <img src="/assets/vodafone.png" className={"logo"} alt="logo" />
      <h1>ADO Butler</h1>

      <ul className="SEOForm">
        <li className="SEOValidation">
          <div className="SEOValidationField">
            <span className="SEOValidationFieldTitle">Welcome {name}!</span>
          </div>
        </li>

        <li className="SEOValidation">
          <div className="SEOValidationField">
            <span className="SEOValidationFieldTitle">
              Please select an option from the below... I'm looking for
              information relating to...
            </span>
            <span className={`SEOValidationFieldStatus`}></span>
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

            {secondSelect !== "" && (
              <select
                onChange={(e) => handleMultiSelectChange(setThirdSelect, e)}
                value={thirdSelect}
                multiple={true}
                className="Dropdown"
              >
                <option key="" value="">
                  Select a work item type
                </option>
                <option key="Theme" value="Theme">
                  Theme
                </option>
                <option key="Epic" value="Epic">
                  Epic
                </option>
                <option key="Feature" value="Feature">
                  Feature
                </option>
                <option key="User Story" value="User Story">
                  User Story
                </option>
                <option key="Bug" value="Bug">
                  Bug
                </option>
                <option key="Task" value="Task">
                  Task
                </option>
                <option key="Test Data" value="Test Data">
                  Test Data
                </option>
                <option key="Release" value="Release">
                  Release
                </option>
              </select>
            )}

            {thirdSelect[0] !== "" && (
              <select
                onChange={(e) => handleMultiSelectChange(setFourthSelect, e)}
                value={fourthSelect}
                multiple={true}
                className="Dropdown"
              >
                <option value="">Select the relevant sprints</option>
                <option value="Select all">Select all</option>
                <option value="Current sprint">Current sprint</option>
                <option value="33.3">33.3</option>
                <option value="33.2">33.2</option>
                <option value="33.1">33.1</option>
                <option value="32.5">32.5</option>
                <option value="32.4">32.4</option>
                <option value="32.3">32.3</option>
                <option value="32.2">32.2</option>
                <option value="32.1">32.1</option>
              </select>
            )}

            {fourthSelect && (
              <button onClick={() => makeQuery()}>Click me pls</button>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default App;
