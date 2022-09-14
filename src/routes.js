import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Carteiras from "./pages/Carteiras";
import Fundos from "./pages/Fundos";
import Investimentos from "./pages/Investimentos/Investimentos";

function Routes() {
  return (
    <BrowserRouter>
      <Header>
        <Switch>
          <Route exact path="/carteiras" component={Carteiras} />
          <Route exact path="/fundos" component={Fundos} />
          <Route exact path="/investimentos" component={Investimentos} />
          <Route component={() => <Redirect to="/carteiras" />} />
        </Switch>
      </Header>
    </BrowserRouter>
  );
}

export default Routes;
