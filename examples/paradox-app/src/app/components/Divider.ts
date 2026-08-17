import Paradox from "paradoxjs";

// Define the Divider component.
// This component will be used to separate the other components.
export default function Divider() {
  return Paradox.buildElement("hr", {
    classList: "my-4"
  });
}

