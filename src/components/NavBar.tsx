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
} from "@material-ui/core";
import fetchAuth from "../utils/fetch";
import MenuIcon from "@material-ui/icons/Menu";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { clearUser } from "../store/reducers/user";
import { clearGame } from "../store/reducers/game";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      "& a": { color: "white", textDecoration: "none" },
    },
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
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Link to="login">
              <Button color="inherit" style={{ color: "white" }}>
                Login
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
