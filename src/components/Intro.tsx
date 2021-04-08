import React from "react";
import Typography from "@material-ui/core/Typography";

export default function Intro() {
  return (
    <div>
      <div
        style={{ width: "480px", height: "320px", backgroundColor: "white" }}
      >
        demo video here
      </div>
      <Typography component="h2" variant="h5">
        What is pictionary?
      </Typography>
      <Typography component="h4" variant="h6">
        A word-guessing game with drawings for everyone!
      </Typography>
    </div>
  );
}
