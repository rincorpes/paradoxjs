import Paradox from "penrose-paradox";
import { MessageContainerProps } from "../types";

// Define the MessageContainer component.
// This component will be used to show the message when the button is clicked by subscribing to the "button-clicked" event.
export default function MessageContainer(props: MessageContainerProps = {}) {
  const { callback = null } = props;
  let count = 0;
  Paradox.pubsub.subscribe("button-clicked", callback ? callback : (message) => {
    const messageContainer: HTMLElement | null = document.getElementById("messageContainer");
    if (!messageContainer) return;
    messageContainer.innerHTML = `${message} ${count}`;
    count++;
  });

  return Paradox.buildElement("div", {
    id: "messageContainer",
  });
}
