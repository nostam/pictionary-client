import React, { useRef, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import io from "socket.io-client";
import axios from "axios";
import {
  Container,
  Slider,
  Popover,
  Badge,
  Input,
  Button,
} from "@material-ui/core";
import { LayersClear, BorderColor, Send } from "@material-ui/icons";
import { colors, marks, apiURL } from "../utils/constants";
import { IRoomChat, ICanvas } from "../utils/interfaces";
import { updateError } from "../store/reducers/status";
import { updateGame } from "../store/reducers/game";
import "../styles/Whiteboard.scss";

// type Coordinate = { x: number; y: number };
const socket = io(apiURL, { transports: ["websocket"] });
let room = "";

function valuetext(value: number) {
  return `${value}px`;
}

function Whiteboard() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  room = history.location.pathname.slice(3);

  const { game } = useAppSelector((state) => state.current);
  // const gameRef = useRef(game);
  // const { loading } = useAppSelector((state) => state.status);

  // Timer
  const [timer, setTimer] = useState<number>(180);
  const timerRef = useRef(timer);
  timerRef.current = timer;

  // Topic
  const [word, setWord] = useState<string>("");
  const [initNextRound, setInitNextRound] = useState<boolean>(false);
  // Drawing

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  // const [mouseCoordinates, setMouseCoordinates] = useState<
  //   Coordinate | undefined
  // >();
  const [logs, setLogs] = useState<IRoomChat[]>([]);
  const [msg, setMsg] = useState<IRoomChat>({
    from: `demo${Math.floor(Math.random() * 10)}`,
    message: "",
    round: 0,
    room,
  });
  const [color, setColor] = useState<string>("black");
  const [stroke, setStroke] = useState<number>(12);
  const [showBrush, setShowBrush] = useState<HTMLDivElement | null>(null);
  const [isAuthor, setIsAuthor] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const width = window.innerWidth - 48; // drawing tools
    const height = window.innerHeight - 164; // navbar height + word topic
    const canvas = canvasRef.current!;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d")!;
    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;

    //receiver side
    socket.on("canvasData", ({ dataURL }: ICanvas) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => context!.drawImage(img, 0, 0);
    });
    socket.on("newCanvas", () => {
      contextRef.current!.clearRect(0, 0, width, height);
    });
    return () => {
      socket.off("canvasData");
      socket.off("newCanvas");
    };
  }, []);

  // drawing tools config
  useEffect(() => {
    const context = canvasRef.current!.getContext("2d")!;
    context.strokeStyle = color;
    context.lineWidth = stroke;
  }, [stroke, color]);

  function startDrawing(e: MouseEvent) {
    if (!isAuthor) return;
    const { offsetX, offsetY } = e;
    contextRef.current!.beginPath();
    contextRef.current!.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }
  function finishDrawing(e: MouseEvent) {
    const { offsetX, offsetY } = e;
    contextRef.current!.lineTo(offsetX, offsetY);
    contextRef.current!.stroke();
    contextRef.current!.closePath();
    setIsDrawing(false);
    const dataURL = canvasRef.current!.toDataURL("image/webp", 0.75); // firefox does not support
    const msg: ICanvas = { room, dataURL, from: socket.id };
    socket.emit("canvasData", msg);
  }
  function draw(e: MouseEvent) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e;
    contextRef.current!.lineTo(offsetX, offsetY);
    contextRef.current!.stroke();
  }
  const handleClickPen = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowBrush(e.currentTarget);
  };

  // Callbacks
  const checkRoomId = useCallback(async () => {
    try {
      const res = await axios.get(`${apiURL}/rooms/${room}`);
      if (res.status === 200) dispatch(updateGame(res.data));
    } catch (error) {
      dispatch(updateError("Room doesn't exists"));
      history.push("/");
    }
  }, [dispatch, history]);

  // Status update
  const updateStatus = useCallback(
    (status = "started") => {
      socket.emit("");
      socket.emit("gameStatus", {
        from: socket.id,
        room,
        status,
        difficulty: game.difficulty,
      });
    },
    [game.difficulty]
  );

  // emit join room and handle disconnect
  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", room);
    socket.on("roomData", (data: unknown) => {
      dispatch(updateGame(data));
    });
    socket.on("nextRound", () => {
      setInitNextRound(true);
    });
    if (room) checkRoomId();

    return () => {
      socket.emit("leaveRoom", room);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [checkRoomId, dispatch]);

  const isGameCompleted = useCallback(() => {
    if (game.status !== "waiting" && game.words![game.round! + 1] === undefined)
      return true;
    else return false;
  }, [game]);

  useEffect(() => {
    socket.emit("connection", (socketId: string) => {
      console.log(socketId);
    });
  }, []);
  // check if user is Author or not
  useEffect(() => {
    if (
      game.status &&
      game.status === "started" &&
      game.round! <= game.words!.length &&
      game.draw![game.round!] !== undefined
    ) {
      game.draw![game.round!].users!.includes(socket.id)
        ? setIsAuthor(true)
        : setIsAuthor(false);
    } else {
      setIsAuthor(true);
    }
  }, [game, isAuthor, isGameCompleted]);

  const gameIsCompleted = useCallback(() => {
    dispatch(updateGame({ status: "ended" }));
    updateStatus("ended");
  }, [dispatch, updateStatus]);

  const startNextRound = useCallback(() => {
    setMsg({ ...msg, round: game.round! + 1 });
    dispatch(updateGame({ round: game.round! + 1 }));
    socket.emit("nextRound", { room, round: game.round! });
    setWord(game.words![game.round!]);
    setInitNextRound(false);
    setTimer(180);
    if (game.status === "started" && isGameCompleted()) gameIsCompleted();
  }, [game, dispatch, msg, isGameCompleted, gameIsCompleted]);

  useEffect(() => {
    if (game.status === "started") {
      setWord(game.words![game.round!]);
      if (timer && !isGameCompleted()) {
        const intervalId = setTimeout(() => {
          setTimer(timer - 1);
        }, 1000);
        return () => clearTimeout(intervalId);
      }
      if (timer === 0) setInitNextRound(true);
    }
  }, [game, timer, startNextRound, isGameCompleted]);

  useEffect(() => {
    if (initNextRound) {
      console.log("logger");
      startNextRound();
    }
  }, [initNextRound, startNextRound]);

  // Chat
  useEffect(() => {
    socket.on("message", (data: IRoomChat) => {
      setLogs(logs.concat(data));
    });
    return () => {
      socket.off("message");
    };
  }, [logs, startNextRound]);

  function sendMsg() {
    setLogs(logs.concat(msg));
    socket.emit("message", msg);
    setMsg({ ...msg, message: "" });
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setMsg({ ...msg, message: e.target.value });
  }
  function handleInputMsg(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.key === "Enter") {
      sendMsg();
    }
  }

  return (
    <>
      <div id="whiteboard">
        <Container
          id="drawingTools"
          style={{ visibility: isAuthor ? "visible" : "hidden" }}
        >
          <Popover
            open={Boolean(showBrush)}
            anchorEl={showBrush}
            onClose={() => setShowBrush(null)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <div id="brush" style={{ height: "200px", padding: "1rem" }}>
              <Slider
                value={stroke}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-custom"
                step={4}
                valueLabelDisplay="off"
                marks={marks}
                min={4}
                max={256}
                orientation="vertical"
                onChange={(e, value) => {
                  if (typeof value === "number") setStroke(value);
                }}
              />
            </div>
          </Popover>
          <div onClick={handleClickPen}>
            <Badge
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              badgeContent={stroke}
              overlap="circle"
              color="primary"
            >
              <BorderColor className="drawingtoolsIcon" style={{ color }} />
            </Badge>
          </div>
          <div id="colorPalettes">
            <div id="palettes">
              {colors.map((c) => (
                <div
                  className="color"
                  key={c.label.trim()}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                />
              ))}
            </div>
          </div>
          <LayersClear className="drawingtoolsIcon" />
        </Container>
        <canvas
          id="canvas"
          ref={canvasRef}
          onMouseDown={(e) => startDrawing(e.nativeEvent)}
          onMouseUp={(e) => finishDrawing(e.nativeEvent)}
          onMouseMove={(e) => draw(e.nativeEvent)}
        />
        <div
          id="word"
          style={{
            visibility:
              isAuthor && game.status === "started" ? "visible" : "hidden",
          }}
        >
          <h1>Draw: {word}</h1>
        </div>
      </div>
      <div id="sidebar">
        <div id="status">
          {game.status === "waiting" || undefined ? (
            <>
              <h4>Waiting for others to join</h4>
              <Button
                variant="contained"
                color="secondary"
                disableElevation
                onClick={() => updateStatus()}
              >
                Game Start
              </Button>
            </>
          ) : game.status === "ended" ? (
            <h2>Game Clear! 🎉</h2>
          ) : (
            <div id="timer">
              <h4>{`round: ${game.round! + 1}`}</h4>
              <h1>{`${timer}s`}</h1>
            </div>
          )}
        </div>
        <div id="chatbox">
          <div id="messages">
            {logs.map((l, i) =>
              l.from === "SYSTEM" ? (
                <p key={`log${i}`} className="systemMsg">{`${l.message}`}</p>
              ) : (
                <p
                  key={`log${i}`}
                  className="msg"
                >{`${l.from}: ${l.message}`}</p>
              )
            )}
          </div>
          <div id="inputChat">
            <Input
              id="inputbox"
              value={msg.message}
              placeholder="Enter your message here"
              onChange={handleInput}
              onKeyUp={handleInputMsg}
              inputProps={{ "aria-label": "description" }}
            />
            <Send />
          </div>
        </div>
      </div>
    </>
  );
}

export default Whiteboard;
