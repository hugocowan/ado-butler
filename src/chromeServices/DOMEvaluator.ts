import { DOMMessage, DOMMessageResponse } from "../types";

const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  // console.log("[content.js]. Message received", msg);

  if (msg.action === "makeQuery") {
    window.location.href =
      "https://vfuk-digital.visualstudio.com/Digital/_queries/query-edit/?newQuery=true";
  }

  const response: DOMMessageResponse = {
    title: document.title,
    headlines: Array.from(document.getElementsByTagName<"h1">("h1")).map(
      (h1) => h1.innerText
    ),
    menu: Array.from(document.querySelectorAll<any>('[role="menu"]')).map(
      (el) => {
        return el;
      }
    ),
    name: document.getElementById("mectrl_currentAccount_primary")?.innerHTML,
    image: document
      .querySelector(".vss-Persona-content using-image")
      ?.getAttribute("src"),
  };

  // console.log("[content.js]. Message response", response);

  sendResponse(response);
};

// "img-vss-Persona-content.using-image"

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
