import { Grid, Paper, Typography } from "@material-ui/core";
import { useAppSelector } from "../utils/hooks";
import ColorPicker from "../components/ColorPicker";
import { IPalette } from "../utils/interfaces";
import { useTheme } from "@material-ui/core/styles";
import "../styles/User.scss";

export default function User() {
  const theme = useTheme();
  const color: IPalette = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
  };
  const { user } = useAppSelector((state) => state.user);

  return (
    <div id="user-wrapper">
      <Grid container direction="row" justify="center">
        <Grid item xs={12} md={8} lg={6}>
          <Paper id="user-container" elevation={4}>
            <div className="row userinfo">
              <img src={user.avatar} alt="avatar" id="user-avatar" />
              <Typography variant="h4">{`${user.username}`}</Typography>
            </div>
            <Typography
              variant="h6"
              id="userstat"
            >{`Total Points : ${user.point}`}</Typography>
            <Grid
              xs={3}
              justify="space-evenly"
              direction="row"
              container
              style={{ margin: "1rem 0 1rem 0.5rem" }}
            >
              <>
                <Typography variant="subtitle1">Primary color: </Typography>
                <ColorPicker color={color.primary} value="primary" />
              </>
              <>
                {/* <Typography variant="subtitle1">Secondary color: </Typography>
                <ColorPicker color={color.secondary} value="sceondary" /> */}
              </>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
