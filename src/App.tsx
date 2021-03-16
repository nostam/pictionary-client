import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Room from "./pages/Room";

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={NavBar} />
      <Route path="/" component={Room} />
    </BrowserRouter>
  );
}

export default App;
