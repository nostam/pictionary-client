import { useState, useRef, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Logo from "../logo.svg";
import {
  Paper,
  Avatar,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@material-ui/core";
import { loginStyles } from "../theme";
import fetchAuth from "../utils/fetch";
import { IAlert, Severity } from "../utils/interfaces";
import { useAppDispatch } from "../utils/hooks";
import { setCurrentUser } from "../store/reducers/user";
import Snackbars from "../components/Snackbars";
import Intro from "../components/Intro";

export default function Login() {
  const singleCol = useMediaQuery("(min-width:600px)");
  const classes = loginStyles();
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
          if (res.data.rmb) localStorage.setItem("rmb", res.data.rmb);
          dispatch(setCurrentUser(res.data.user));
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 500);
        }
      }
    } catch (error) {
      setLoading(false);
      const msg = error.response!.data.error ?? error.message;
      handleAlert("error", msg);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (success) history.push("/home");
  }, [success, history]);

  return (
    <Grid container component="main" className={classes.root}>
      {singleCol && (
        <Grid item sm={7} md={8} className={classes.image}>
          <Intro />
        </Grid>
      )}
      <Grid item xs sm={5} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar
            className={classes.avatar}
            src={Logo}
            onClick={() => history.push("/home")}
          />

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleButtonClick}
          >
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
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
              </Grid>
              <Grid item>
                <Typography
                  className={classes.link}
                  onClick={() => history.push("/register")}
                >
                  Don't have an account? Sign Up
                </Typography>
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
      </Grid>
    </Grid>
  );
}
