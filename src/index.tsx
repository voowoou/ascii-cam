import { render } from "preact";

import preactLogo from "./assets/preact.svg";
import "./style.css";

export function App() {
  return <div>Hello</div>;
}

render(<App />, document.getElementById("app"));
