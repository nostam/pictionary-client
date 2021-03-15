import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Room from "./pages/Room";
import Test from "./pages/Test";
function App() {
  return (
    <BrowserRouter>
      <Route path="/test" component={Test} />
      <Route path="/" component={Room} />
    </BrowserRouter>
  );
}

export default App;
