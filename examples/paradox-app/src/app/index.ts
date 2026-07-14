import Paradox from "penrose-paradox";
import "../scss/main.scss";

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";

const normalizedBasePath = import.meta.env.BASE_URL === "/"
  ? ""
  : import.meta.env.BASE_URL.replace(/\/$/, "");
const baseUrl = `${window.location.origin}${normalizedBasePath}`; // This is the url of the client app and it is used to redirect the user to the appropriate route.
const root = document.querySelector("#root"); // This is the root element where the app will be rendered.
// Define the props that will be passed to each component.
// In this case, we are passing the root element to each component so that they can render themselves.
const props = { root };

// Define the routes for the app and their corresponding components.
const routes = [
  {
    path: "/",
    component: Home,
    props
  },
  {
    path: "/about",
    component: About,
    props
  }
];

// Create a new router instance.
const router = new Paradox.Router({ routes, baseUrl });

// Initialize the router and navigate to the appropriate route.
router.init()
  .then((path) => console.info(`Navigated to ${path}`))
  .catch(error => console.error(error));
