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
  Grid,
} from "@material-ui/core";
import fetchAuth from "../utils/fetch";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { clearUser } from "../store/reducers/user";
import { clearGame } from "../store/reducers/game";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      "& a": { color: "white" },
    },
    avatar: { outline: "3px solid rgba(255,255,255,0.5)" },
    appbar: { boxShadow: `inset 0 -16px 16px -16px rgba(0,0,0,0.3)` },
    title: {
      alignItems: "flex-end",
      textAlign: "right",
      "& a": { color: "white", textDecoration: "none" },
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
    <div className={classes.root}>
      <AppBar
        elevation={0}
        color="primary"
        position="static"
        className={classes.appbar}
      >
        <Toolbar>
          <Grid xs={1} lg={2} item>
            <Typography variant="h6" className={classes.title}>
              <Link to="/">Pictionary</Link>
            </Typography>
          </Grid>
          <Grid xs={10} lg={8} item />
          <Grid xs={1} item>
            {user._id ? (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.username!}
                    className={classes.avatar}
                  />
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
                <Button color="inherit">Login</Button>
              </Link>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
