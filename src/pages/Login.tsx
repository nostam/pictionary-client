import { useState, useRef, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Logo from "../logo.svg";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Link,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { colors } from "../utils/constants";
import fetchAuth from "../utils/fetch";
import { IAlert, Severity } from "../utils/interfaces";
import { useAppDispatch } from "../utils/hooks";
import { setCurrentUser } from "../store/reducers/user";
import Snackbars from "../components/Snackbars";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [input, setInput] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState<IAlert | undefined>();
  const [openAlert, setOpenAlert] = useState(false);
  const timer = useRef<number>();

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const handleAlert = useCallback((type: Severity, message: string) => {
    setAlert({ type, message });
    setOpenAlert(true);
  }, []);

  const clearAlert = useCallback(() => {
    setOpenAlert(false);
    setAlert(undefined);
  }, []);

  const handleButtonClick = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      if (!loading) {
        clearAlert();
        setSuccess(false);
        setLoading(true);
        const res = await fetchAuth.post("/users/login", input);
        if (res.status === 200) {
          dispatch(setCurrentUser(res.data.user));
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 500);
        }
      }
    } catch (error) {
      setLoading(false);
      const msg = error.response.data.error ?? error.message;
      handleAlert("error", msg);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (success) history.push("/");
  }, [success, history]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar} src={Logo} />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleButtonClick}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleInput}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handleInput}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
              size="large"
            >
              Sign In
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {openAlert && (
        <Snackbars
          severity={alert!.type}
          content={alert!.message}
          isOpen={openAlert}
        />
      )}
    </Container>
  );
}
