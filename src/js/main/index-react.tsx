import ReactDOM from "react-dom/client";
import { initBolt } from "../lib/utils/bolt";
import "../index.scss";
import App from "./main";
import "core-js/stable";

initBolt();

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <App />,
);
