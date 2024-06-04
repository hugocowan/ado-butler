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
      <div className="header">
        <h1>ADO Butler</h1>
        <img src="/assets/vodafone.png" className={"logo"} alt="logo" />
      </div>

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
              information relating to a...
            </span>
            <span className={`SEOValidationFieldStatus`}></span>
          </div>
          <div className="choices">
            <button
              className={firstSelect === "person" ? "selected" : ""}
              onClick={(e) => setFirstSelect("person")}
            >
              Person
            </button>
            <button
              className={firstSelect === "project" ? "selected" : ""}
              onClick={(e) => setFirstSelect("project")}
            >
              Project
            </button>
            <button
              className={firstSelect === "team" ? "selected" : ""}
              onClick={(e) => setFirstSelect("team")}
            >
              Team
            </button>
            <button
              className={firstSelect === "wiki" ? "selected" : ""}
              onClick={(e) => setFirstSelect("wiki")}
            >
              Wiki page
            </button>
            <button
              className={firstSelect === "pat" ? "selected" : ""}
              onClick={(e) => setFirstSelect("pat")}
            >
              PAT setup
            </button>
          </div>
          <div className="selects">
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
                <option
                  className={thirdSelect.includes("Theme") ? "selected" : ""}
                  key="Theme"
                  value="Theme"
                >
                  Theme
                </option>
                <option
                  className={thirdSelect.includes("Epic") ? "selected" : ""}
                  key="Epic"
                  value="Epic"
                >
                  Epic
                </option>
                <option
                  className={thirdSelect.includes("Feature") ? "selected" : ""}
                  key="Feature"
                  value="Feature"
                >
                  Feature
                </option>
                <option
                  className={
                    thirdSelect.includes("User Story") ? "selected" : ""
                  }
                  key="User Story"
                  value="User Story"
                >
                  User Story
                </option>
                <option
                  className={thirdSelect.includes("Bug") ? "selected" : ""}
                  key="Bug"
                  value="Bug"
                >
                  Bug
                </option>
                <option
                  className={thirdSelect.includes("Task") ? "selected" : ""}
                  key="Task"
                  value="Task"
                >
                  Task
                </option>
                <option
                  className={
                    thirdSelect.includes("Test Data") ? "selected" : ""
                  }
                  key="Test Data"
                  value="Test Data"
                >
                  Test Data
                </option>
                <option
                  className={thirdSelect.includes("Release") ? "selected" : ""}
                  key="Release"
                  value="Release"
                >
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
                <option
                  className={
                    fourthSelect.includes("Select all") ? "selected" : ""
                  }
                  value="Select all"
                >
                  Select all
                </option>
                <option
                  className={
                    fourthSelect.includes("Current sprint") ? "selected" : ""
                  }
                  value="Current sprint"
                >
                  Current sprint
                </option>
                <option
                  className={fourthSelect.includes("33.3") ? "selected" : ""}
                  value="33.3"
                >
                  33.3
                </option>
                <option
                  className={fourthSelect.includes("33.2") ? "selected" : ""}
                  value="33.2"
                >
                  33.2
                </option>
                <option
                  className={fourthSelect.includes("33.1") ? "selected" : ""}
                  value="33.1"
                >
                  33.1
                </option>
                <option
                  className={fourthSelect.includes("32.5") ? "selected" : ""}
                  value="32.5"
                >
                  32.5
                </option>
                <option
                  className={fourthSelect.includes("32.4") ? "selected" : ""}
                  value="32.4"
                >
                  32.4
                </option>
                <option
                  className={fourthSelect.includes("32.3") ? "selected" : ""}
                  value="32.3"
                >
                  32.3
                </option>
                <option
                  className={fourthSelect.includes("32.2") ? "selected" : ""}
                  value="32.2"
                >
                  32.2
                </option>
                <option
                  className={fourthSelect.includes("32.1") ? "selected" : ""}
                  value="32.1"
                >
                  32.1
                </option>
              </select>
            )}

            {fourthSelect && (
              <button className="submit" onClick={() => makeQuery()}>
                Submit
              </button>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default App;
