import React from "react";
import { Link } from "react-router-dom";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import {
  Snackbar,
  AppBar,
  Toolbar,
  MenuItem,
  Menu,
  Typography,
  IconButton,
  Button,
  Avatar,
  Container,
} from "@material-ui/core";
import fetchAuth from "../utils/fetch";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { clearUser, setCurrentUser } from "../store/reducers/user";
import { clearGame } from "../store/reducers/game";
import Logo from "../logo.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: { margin: "auto 0.25rem" },
    appbar: {
      boxShadow: `inset 0 -16px 16px -16px rgba(0,0,0,0.3)`,
      "& a": { color: "black", textDecoration: "none" },
      "& a:visited": { color: "black", textDecoration: "none" },
    },
    toolbar: { justifyContent: "space-between" },
    menu: {
      color: "black",
      "& a": { color: "black", textDecoration: "none" },
      "& a:visited": { color: "black", textDecoration: "none" },
    },
    left: { display: "flex", alignItems: "center" },
    grid: { textAlign: "right" },
    topic: {
      padding: "0.25rem 2.5rem",
      margin: "0 auto",
      color: "black",
      backgroundColor: "white",
      boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
  })
);

export default function MenuAppBar() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const ref = React.createRef<HTMLDivElement>();

  // User
  const { user } = useAppSelector((state) => state.user);
  const handleLogout = async () => {
    try {
      await fetchAuth.post("/users/logout");
      dispatch(clearUser());
      dispatch(clearGame());
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  // Theme
  let customTheme = useTheme();
  React.useEffect(() => {
    if (user.color !== undefined) {
      customTheme.palette.primary.main = user.color.primary;
    }
  }, [user, customTheme]);

  // Menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Topic
  const { game } = useAppSelector((state) => state.current);
  const [word, setWord] = React.useState<string>("");
  const [show, setShow] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (
      game.status === "started" &&
      game.draw![game.round!].users.some((u) => u.username === user.username)
    ) {
      setWord(game.words![game.round!]);
      setShow(true);
    } else {
      setWord("");
      setShow(false);
    }
  }, [game, user]);

  const handleSnackbarClose = () => {
    setShow(false);
  };

  React.useEffect(() => {
    const rmb = document.cookie.indexOf("rmb") !== -1;
    async function fetchMe() {
      try {
        const res = await fetchAuth.get("/users/me");
        if (res.status === 200) dispatch(setCurrentUser(res.data));
      } catch (error) {
        console.log(error.message);
      }
    }
    if (rmb) fetchMe();
  }, [dispatch]);

  return (
    <ThemeProvider theme={createMuiTheme(customTheme)}>
      <AppBar
        elevation={0}
        color="primary"
        position="static"
        className={classes.appbar}
      >
        <Container disableGutters>
          <Toolbar className={classes.toolbar}>
            <div className={classes.left}>
              <Avatar src={Logo} alt="Logo" className={classes.avatar} />
              <Typography variant="h6">
                <Link to="/home">Pictionary</Link>
              </Typography>
            </div>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={show}
              key={word}
              style={{ transform: "translate(-50%, 40%)" }}
            >
              <div className={classes.topic}>
                <span>Draw: {word}</span>
              </div>
            </Snackbar>
            {user._id ? (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar src={user.avatar} alt={user.username!} />
                </IconButton>
                <Menu
                  ref={ref}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                  className={classes.menu}
                >
                  <MenuItem onClick={handleClose}>
                    <Link to={`/u/${user._id}`}>Profile</Link>
                  </MenuItem>

                  {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <Link to="/login">
                <Button color="inherit">Login</Button>
              </Link>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
