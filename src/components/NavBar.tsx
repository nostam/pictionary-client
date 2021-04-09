import React from "react";
import { Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
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
import { clearUser } from "../store/reducers/user";
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
    title: {
      display: "flex",
      flex: 1,
    },
    grid: { textAlign: "right" },
  })
);

export default function MenuAppBar() {
  const classes = useStyles();
  const { user } = useAppSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const ref = React.createRef<HTMLDivElement>();
  const dispatch = useAppDispatch();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetchAuth.post("/users/logout");
      dispatch(clearUser());
      dispatch(clearGame());
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };
  return (
    <AppBar
      elevation={0}
      color="primary"
      position="static"
      className={classes.appbar}
    >
      <Container disableGutters>
        <Toolbar>
          <Avatar src={Logo} alt="Logo" className={classes.avatar} />
          <Typography variant="h6" className={classes.title}>
            <Link to="/">Pictionary</Link>
          </Typography>
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
              >
                <Link to={`/u/${user._id}`}>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
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
  );
}
