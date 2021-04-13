import { useState } from "react";
import { useHistory } from "react-router-dom";
import Logo from "../logo.svg";
import { Typography, Modal } from "@material-ui/core";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import "../styles/Intro.scss";

export default function Intro() {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div id="intro-wrapper">
      <div id="intro-heading" onClick={() => history.push("/home")}>
        <img src={Logo} id="intro-logo" alt="logo" />
        <Typography variant="h2" id="intro-title">
          Pictionary
        </Typography>
      </div>
      <Typography variant="h5">Draw, Guess, Have Fun</Typography>
      <div className="row" style={{ marginTop: "1rem" }}>
        <PlayCircleFilled
          fontSize="large"
          onClick={handleOpen}
          style={{
            color: "rgba(205,25,55,0.8)",
          }}
        />
        <Typography
          variant="subtitle1"
          style={{ textDecoration: "underline dotted", marginTop: "4px" }}
        >
          Learn how to play
        </Typography>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            width: "100%",
            maxWidth: "1280px",
          }}
        >
          <video
            id="intro-video"
            width="100%"
            autoPlay
            loop
            src="https://res.cloudinary.com/dnii0enil/video/upload/ac_none,c_scale,e_accelerate:100,q_auto:good,w_1280/v1618255457/demo/2021-04-12_21-15-10_v7fs9u.mp4"
          />
        </div>
      </Modal>
      <div className="row" style={{ marginTop: "2rem" }}>
        <div className="col user-box">
          <Typography variant="body1">Register Player:</Typography>
          <ul style={{ paddingLeft: "1rem" }}>
            <li className="intro-list-yes">Create game room and participate</li>
            <li className="intro-list-yes">
              Points - Player who drew or guessed correctly
            </li>
            <li className="intro-list-yes">Ranking</li>
            <li className="intro-list-yes">Customize site theme color</li>
            {/* <li className="intro-list-yes">Voting for best illustrations</li> */}
          </ul>
        </div>
        <div className="col user-box">
          <Typography variant="body1">Anonymous Player:</Typography>
          <ul style={{ paddingLeft: "1rem" }}>
            <li className="intro-list-yes">Create game room and participate</li>
            <li className="intro-list-no">
              Points - Player who drew or guessed correctly
            </li>
            <li className="intro-list-no">Ranking</li>
            <li className="intro-list-no">Customize site theme color</li>
            {/* <li className="intro-list">Voting for best illustrations</li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}
