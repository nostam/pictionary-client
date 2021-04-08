import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffb300",
    },
  },
  overrides: {
    MuiTextField: {
      root: {
        borderRadius: 0,
      },
    },
    MuiButton: {
      root: {
        borderRadius: 0,
      },
    },
  },
});

export default theme;
