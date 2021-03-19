import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import NavBar from "./components/NavBar";
import Room from "./pages/Room";
import Home from "./pages/Home";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Route path="/" component={NavBar} />
        <Route path="/r/:id" component={Room} />
        <Route path="/" exact component={Home} />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
