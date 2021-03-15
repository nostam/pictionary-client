import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Room from "./pages/Room";

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={Room} />
    </BrowserRouter>
  );
}

export default App;
