import React from "react";
import { useHistory } from "react-router-dom";
import Logo from "../logo.svg";
import { IRegisterData, IAlert, Severity } from "../utils/interfaces";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Paper,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import Snackbars from "../components/Snackbars";
import fetchAuth from "../utils/fetch";
import Intro from "../components/Intro";
import { loginStyles } from "../theme";

export default function Register() {
  const classes = loginStyles();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [input, setInput] = React.useState<IRegisterData | undefined>();
  const [alert, setAlert] = React.useState<IAlert | undefined>();
  const [openAlert, setOpenAlert] = React.useState(false);

  const timer = React.useRef<number>();

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const handleAlert = React.useCallback((type: Severity, message: string) => {
    setAlert({ type, message });
    setOpenAlert(true);
  }, []);

  const clearAlert = React.useCallback(() => {
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
        const res = await fetchAuth.post("/users/register", input);
        if (res.status === 201) {
          handleAlert(
            "success",
            "Account created successfully, redirecting back to login page."
          );
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 1000);
        }
      }
    } catch (error) {
      setLoading(false);
      const msg = error.response.data.error ?? error.message;
      handleAlert("error", msg);
    }
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  React.useEffect(() => {
    if (success) history.push("/login");
  }, [success, history]);

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image}>
        <Intro />
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar
            className={classes.avatar}
            src={Logo}
            onClick={() => history.push("/")}
          />

          <Typography component="h1" variant="h5">
            Sign up
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
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleInput}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
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
              autoComplete="current-password"
              onChange={handleInput}
            />
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
                Sign Up
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
            <Grid container justify="flex-end">
              <Grid item>
                <Typography
                  className={classes.link}
                  variant="body2"
                  onClick={() => history.push("/login")}
                >
                  Already have an account? Sign in
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
