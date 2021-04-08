import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Room from "./pages/Room";
import Home from "./pages/Home";
import User from "./pages/User";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          <BrowserRouter>
            <Route path={["/", "/r/:id", "/u/:id"]} exact component={NavBar} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/r/:id" component={Room} />
            <Route path="/u/:id" component={User} />
            <Route path="/" exact component={Home} />
          </BrowserRouter>
        </>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
