import React from "react";
import GlobalStyle from "./globalStyles";
import Routes from "./routes";
import "antd/dist/antd.css";

function App() {
  return (
    <div>
      <Routes />
      <GlobalStyle />
    </div>
  );
}
export default App;
