import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./styles/app.scss";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

const rootElem = document.getElementById("root");

if (rootElem) {
  const root = ReactDOM.createRoot(rootElem);
  root.render(
    <BrowserRouter basename="/space-test">
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>,
  );
}
