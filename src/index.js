import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";

import App from "../src/components/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
