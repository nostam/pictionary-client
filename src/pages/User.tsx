import { Grid, Paper, Typography } from "@material-ui/core";
import { useAppSelector } from "../utils/hooks";
import "../styles/User.scss";

export default function User() {
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
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
