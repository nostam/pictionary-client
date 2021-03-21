import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Select,
  Modal,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { RootState } from "../store";
import { difficulties } from "../utils/constants";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      margin: theme.spacing(1),
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

interface IProps {
  handleModal: () => void;
  open: boolean;
}

export default function SimpleModal({ open, handleModal }: IProps) {
  const dispatch = useDispatch();
  const history = useHistory();

  const game = useSelector((state: RootState) => state.game);
  const settings = React.useRef(game);
  const updateGame = React.useCallback(
    (data) => dispatch({ type: "updateGame", action: data }),
    [dispatch]
  );
  // strict mode warning with material ui styling, will be fixed in @5
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const handleChange = (
    event: React.ChangeEvent<{ value: unknown; name?: string }>
  ) => {
    const { name, value } = event.target;
    if (name) settings.current = { ...settings.current, [name]: value };
  };

  const createNewGame = async () => {
    try {
      const { data } = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL + "/rooms/create",
        data: settings,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleButtonClick = async (event: React.MouseEvent) => {
    const data = await createNewGame();
    if (data) {
      updateGame(data);
      history.push(`/r/${data._id}`);
    }
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Create a new game</h2>
      <p id="simple-modal-description"></p>
      <div className={classes.row}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">
            Difficulty
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={settings.current.difficulty}
            onChange={handleChange}
            label="Difficulty"
            name="difficulty"
          >
            {difficulties.map((difficulty, i) => (
              <MenuItem
                key={`diff${i}`}
                value={difficulty.value}
                style={{ color: difficulty.color }}
              >
                {difficulty.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Mode</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={mode}
            onChange={handleChange}
            label="Difficulty"
          ></Select>
        </FormControl> */}
      </div>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        className={classes.button}
        onClick={handleButtonClick}
      >
        Start <PlayArrowIcon />
      </Button>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
