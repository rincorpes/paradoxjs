import Paradox from "penrose-paradox";
import { ExamplePageProps } from "../types";

// Import components
import Divider from "../components/Divider";
import Button from "../components/Button";
import MessageContainer from "../components/MessageContainer";

// Define the Home component.
// This component will be rendered when the user navigates to the / route.
export default function Home(props: ExamplePageProps = {}) {
  const { root } = props;
  if (!root) return;

  let count = 0;
  function handlePubsubSubscription(message: string) {
    const messageContainer: HTMLElement | null = document.getElementById("messageContainer");
    if (!messageContainer) return;
    messageContainer.innerHTML = `${message} ${count}`;
    count++;
  }

  function handleRemovePubsubSubscription() {
    Paradox.pubsub.unsubscribe("button-clicked", handlePubsubSubscription);
  }

  root.replaceChildren(
    Paradox.buildElement("div", {
      classList: "container",
      children: [
        Paradox.buildElement("h1", {
          text: "Home"
        }),
        Paradox.buildElement("a", {
          text: "Go to about",
          attributes: {
            href: "/about"
          }
        }),
        Divider(),
        Paradox.buildElement("div", {
          classList: "d-flex align-items-center",
          children: [
            Button({ message: "Home button clicked" }),
            Button({ message: "Remove pubsub subscription clicked", text: "Remove pubsub subscription", onClick: handleRemovePubsubSubscription }),
            Button({ message: "Add pubsub subscription clicked again", text: "Add pubsub subscription", onClick: () => Paradox.pubsub.subscribe("button-clicked", handlePubsubSubscription) }),
          ]
        }),
        MessageContainer({ callback: handlePubsubSubscription }),
      ]
    })
  );
}
