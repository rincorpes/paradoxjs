import Paradox from "@rincorpes/paradoxjs";

type ButtonProps = {
  message?: string;
  text?: string;
  onClick?: EventListener;
};

// Define the Button component.
// This component will be used to publish a message when the button is clicked and show the function of the pubsub module.
export default function Button(props: ButtonProps = {}) {
  function handleClick() {
    const { message } = props;
    Paradox.pubsub.publish("button-clicked", { message });
  }

  const { text = "Write message", onClick = handleClick } = props;

  return Paradox.buildElement("button", {
    text,
    events: {
      click: onClick
    }
  });
}

