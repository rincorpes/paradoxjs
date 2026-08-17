import Paradox from "@rincorpes/paradoxjs";
import { ExamplePageProps } from "../types";

// Import components
import Divider from "../components/Divider";
import Button from "../components/Button";
import MessageContainer from "../components/MessageContainer";

// Define the About component.
// This component will be rendered when the user navigates to the /about route.
export default function About(props: ExamplePageProps = {}) {
  const { root } = props;
  if (!root) return;
  root.replaceChildren(
    Paradox.buildElement("div", {
      classList: "container",
      children: [
        Paradox.buildElement("h1", {
          text: "About"
        }),
        Paradox.buildElement("a", {
          text: "Go to home",
          attributes: {
            href: "/"
          }
        }),
        Divider(),
        Button({ message: "About button clicked" }),
        MessageContainer()
      ]
    })
  );
}

