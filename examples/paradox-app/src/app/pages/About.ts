import Paradox from "penrose-paradox";
import { ExamplePageProps } from "../types";

// Import components
import Divider from "../components/Divider";
import Button from "../components/Button";
import MessageContainer from "../components/MessageContainer";

// Define the About component.
// This component will be rendered when the user navigates to the /about route.
export default function About(props: ExamplePageProps = {}) {
  const { root } = props;
  root.append(
    Paradox.buildElement(
      "div",
      {
        classList: "container",
        children: [
          {
            tag: "h1",
            options: {
              text: "About"
            }
          },
          {
            tag: "a",
            options: {
              text: "Go to home",
              attributes: {
                href: "/"
              }
            }
          },
          Divider(),
          Button({ message: "About button clicked" }),
          MessageContainer()
        ]
      }
    )
  );
}
