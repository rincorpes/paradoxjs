# Examples

These examples show Paradox as a vanilla JavaScript utility library.

The goal is not to introduce a new application architecture. The goal is to show a few practical browser-side utilities you can adopt incrementally:

- `Paradox.buildElement` for DOM creation
- `Paradox.Router` for simple route matching
- `Paradox.pubsub` for lightweight event distribution

## Table Of Contents

- [Overview](#overview)
- [Router Example](#router-example)
- [PubSub Example](#pubsub-example)
- [buildElement Example](#buildelement-example)
- [Example App](#example-app)

## Overview

Paradox is most useful when you want a little more structure than raw DOM APIs, but you do not want a framework.

You can use each utility on its own:

- Use `buildElement` to reduce repetitive `document.createElement` code
- Use `Router` for small multi-page or route-aware browser experiences
- Use `pubsub` when different parts of a page need to communicate without tight coupling

All documented consumer examples use the package root:

```js
import Paradox from "penrose-paradox";
```

Avoid building on deep internal paths from the published package, since they are intentionally not part of the supported public API.

## Router Example

`Paradox.Router` is a small routing helper. It is best suited for simple client-side route matching, not for full application frameworks.

```js
import Paradox from "penrose-paradox";

function Home({ root }) {
  root.append(
    Paradox.buildElement("div", {
      text: "Home page",
    })
  );
}

function About({ root }) {
  root.append(
    Paradox.buildElement("div", {
      text: "About page",
    })
  );
}

const root = document.getElementById("root");
const baseUrl =
  document.querySelector("base")?.href || "https://example.com";

const routes = [
  {
    path: "/",
    component: Home,
    props: { root },
  },
  {
    path: "/about",
    component: About,
    props: { root },
  },
];

const router = new Paradox.Router({ routes, baseUrl });

router.init().catch((error) => {
  console.error(error);
});
```

Use the router when you want:

- A tiny route matcher
- Props injection per route
- Support for simple layouts or route wrappers

Avoid treating it as a full SPA router until the router work in the roadmap is complete.

## PubSub Example

`Paradox.pubsub` is a lightweight event bus for page-level communication.

```js
import Paradox from "penrose-paradox";

function logMessage(data) {
  console.log("received:", data);
}

Paradox.pubsub.subscribe("message", logMessage);
Paradox.pubsub.publish("message", { text: "Hello from Paradox" });
Paradox.pubsub.unsubscribe("message", logMessage);
```

This is useful when:

- A button triggers an action somewhere else on the page
- A small widget needs to notify another widget
- You want looser coupling than direct function wiring

## buildElement Example

`Paradox.buildElement` helps create DOM nodes without forcing you into a component runtime.

```js
import Paradox from "penrose-paradox";

const element = Paradox.buildElement("section", {
  id: "message-box",
  className: ["card", "shadow-sm"],
  data: {
    role: "message-box",
  },
  aria: {
    live: "polite",
  },
  style: {
    padding: "1rem",
    border: "1px solid #ddd",
    "--message-accent": "#0ea5e9",
  },
  children: [
    Paradox.buildElement("h2", {
      text: "Hello",
    }),
    "This node was built with a DOM helper, not a template runtime.",
    Paradox.buildElement("button", {
      text: "Click me",
      events: {
        click: [
          () => console.log("clicked"),
          () => console.log("tracked"),
        ],
      },
    }),
  ],
});

document.body.appendChild(element);
```

Use it when you want a small abstraction over:

- `document.createElement`
- attribute assignment
- data and aria attribute wiring
- event binding
- nested DOM creation

## Example App

The `examples/paradox-app` folder contains a small demo app that uses the current utilities together.

It is intentionally simple and currently showcases:

- Route-based page rendering with `Paradox.Router`
- DOM creation with `Paradox.buildElement`
- Cross-page messaging with `Paradox.pubsub`

### Run The Example

```bash
cd examples/paradox-app
npm install
npm run dev
```

Then open `http://localhost:3040`.

### What To Look For

- The home and about pages are rendered with `Router`
- Buttons and page structure are created with `buildElement`
- Messages are sent through `pubsub`

This example should be understood as a utility showcase, not as the recommended architecture for every app.
