import Typography from "@material-ui/core/Typography";
import "../styles/Intro.scss";

export default function Intro() {
  return (
    <div id="intro-wrapper">
      <Typography variant="h3">Pictionary</Typography>
      <Typography variant="subtitle1">
        A word-guessing game with drawings
      </Typography>
      <br />
      <div id="intro-video">
        {/* <Video publicId="demo/2021-04-12_21-15-10_v7fs9u">
          <Transformation
            audioCodec="none"
            background="auto"
            effect="accelerate:100"
            quality="auto:good"
            width="1280"
            crop="scale"
          />
        </Video> */}

        <video
          style={{ display: "block" }}
          width="100%"
          autoPlay
          src="https://res.cloudinary.com/dnii0enil/video/upload/ac_none,c_scale,e_accelerate:100,q_auto:good,w_1280/v1618255457/demo/2021-04-12_21-15-10_v7fs9u.mp4"
        />
      </div>
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
          {/* <li className="intro-list">Voting for best illustrations</li> */}
        </ul>
      </Typography>
    </div>
  );
}
