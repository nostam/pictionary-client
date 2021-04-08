import { Grid, Typography } from "@material-ui/core";
import "../styles/Intro.scss";

export default function Intro() {
  return (
    <Grid md={false} lg={6} id="intro-wrapper">
      <Typography variant="h3">Pictionary</Typography>
      <Typography variant="subtitle1">
        A word-guessing game with drawings
      </Typography>
      <br />
      <div id="intro-video">demo video here</div>
      <Typography variant="h6">
        Everyone can join and play without any regisration
      </Typography>
      <br />
      <Typography variant="body1">
        Bonus features for register user:
        <ul>
          <li className="intro-list">
            Points - Player who drew or guessed correctly
          </li>
          <li className="intro-list">Ranking</li>
          <li className="intro-list">Customize site theme color</li>
          <li className="intro-list">Voting for best illustrations</li>
        </ul>
      </Typography>
    </Grid>
  );
}
