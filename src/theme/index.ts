import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { colors } from "../utils/constants";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffb300",
    },
    secondary: {
      main: "#f50057",
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

export const loginStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    "& a": { color: "#b27d00" },
  },

  image: {
    // backgroundImage: "url(https://source.unsplash.com/random)",
    // backgroundRepeat: "no-repeat",
    // backgroundColor:
    //   theme.palette.type === "light"
    //     ? theme.palette.grey[50]
    //     : theme.palette.grey[900],
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
    backgroundSize: "400% 400%",
    animation: "gradient 10s ease infinite",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    //margin: theme.spacing(8, 4),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
  },
  avatar: {
    width: "64px",
    height: "64px",
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: colors[10].value,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  link: { color: "#b27d00" },
}));
