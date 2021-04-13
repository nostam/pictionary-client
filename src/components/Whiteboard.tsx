import React, { useRef, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import io from "socket.io-client";
import {
  Container,
  Slider,
  Popover,
  Badge,
  Input,
  Button,
  Tooltip,
} from "@material-ui/core";
import { LayersClear, BorderColor, Send } from "@material-ui/icons";
import { colors, marks, apiURL } from "../utils/constants";
import { IRoomChat, ICanvas } from "../utils/interfaces";
import { updateError } from "../store/reducers/status";
import { updateGame } from "../store/reducers/game";

import fetchAuth from "../utils/fetch";
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
  const { user } = useAppSelector((state) => state.user);
  // const gameRef = useRef(game);
  // const { loading } = useAppSelector((state) => state.status);

  // Timer
  const [timer, setTimer] = useState<number>(180);
  const timerRef = useRef(timer);
  timerRef.current = timer;

  // Topic
  // const [word, setWord] = useState<string>("");
  const [initNextRound, setInitNextRound] = useState<boolean>(false);
  // Drawing

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  // const [mouseCoordinates, setMouseCoordinates] = useState<Coordinate[]>([]);
  const [logs, setLogs] = useState<IRoomChat[]>([]);
  const [msg, setMsg] = useState<IRoomChat>({
    from: user!.username,
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
    const height = window.innerHeight - 64; // navbar height + word topic
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
    setIsDrawing(true);
    contextRef.current!.beginPath();
    contextRef.current!.moveTo(e.offsetX, e.offsetY);
  }
  function finishDrawing(e: MouseEvent) {
    if (!isAuthor) return;
    contextRef.current!.lineTo(e.offsetX, e.offsetY);
    contextRef.current!.stroke();
    contextRef.current!.closePath();
    setIsDrawing(false);
    const dataURL = canvasRef.current!.toDataURL("image/webp", 0.75); // firefox does not support
    const msg: ICanvas = { room, dataURL, from: socket.id };
    socket.emit("canvasData", msg);
  }
  function draw(e: MouseEvent) {
    if (!isAuthor || !isDrawing) return;
    contextRef.current!.lineTo(e.offsetX, e.offsetY);
    contextRef.current!.stroke();
  }

  const handleClickPen = (e: React.MouseEvent<HTMLDivElement>) =>
    setShowBrush(e.currentTarget);

  const eraser = () => socket.emit("newCanvas", room);

  // Callbacks
  const checkRoomId = useCallback(async () => {
    try {
      const res = await fetchAuth.get(`/rooms/${room}`);
      if (res.status === 200) dispatch(updateGame(res.data));
    } catch (error) {
      dispatch(updateError("Room has expired or does not exist."));
      history.push("/home");
    }
  }, [dispatch, history]);

  // Status update
  const updateStatus = useCallback(
    (status = "started") => {
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
    socket.emit("joinRoom", { room, user });
    socket.on("roomData", (data: unknown) => {
      dispatch(updateGame(data));
    });
    socket.on("nextRound", () => {
      setInitNextRound(true);
    });
    if (room) checkRoomId();

    return () => {
      socket.emit("leaveRoom", { room, user });
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [checkRoomId, dispatch, user]);

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
      game.status === "started" &&
      game.round! <= game.words!.length &&
      game.draw![game.round!] !== undefined
    ) {
      game.guess![game.round!].users.some((u) => u.username === user.username)
        ? setIsAuthor(false)
        : setIsAuthor(true);
    } else {
      game.status === "ended" ? setIsAuthor(false) : setIsAuthor(true);
    }
  }, [game, isAuthor, isGameCompleted, user.username]);

  const gameIsCompleted = useCallback(() => {
    dispatch(updateGame({ status: "ended" }));
    updateStatus("ended");
    setIsAuthor(false);
  }, [dispatch, updateStatus]);

  const startNextRound = useCallback(() => {
    setMsg({ ...msg, round: game.round! + 1 });
    dispatch(updateGame({ round: game.round! + 1 }));
    // setWord(game.words![game.round!]);
    setInitNextRound(false);
    setTimer(180);
    if (game.status === "started" && isGameCompleted()) gameIsCompleted();
  }, [game, dispatch, msg, isGameCompleted, gameIsCompleted]);

  useEffect(() => {
    if (game.status === "started") {
      // setWord(game.words![game.round!]);
      if (timer && !isGameCompleted()) {
        const intervalId = setTimeout(() => {
          setTimer(timer - 1);
        }, 1000);
        return () => clearTimeout(intervalId);
      }
      if (timer === 0) {
        setInitNextRound(true);
        if (socket.id === game!.draw![game!.round!].users[0].socketId!)
          socket.emit("nextRound", { room, round: game.round! });
      }
    }
  }, [game, timer, isGameCompleted]);

  useEffect(() => {
    if (initNextRound) startNextRound();
  }, [initNextRound, startNextRound]);

  // Chat
  useEffect(() => {
    socket.on("message", (data: IRoomChat) => {
      setLogs(logs.concat(data));
    });
    return () => {
      socket.off("message");
    };
  }, [logs]);

  function sendMsg() {
    setLogs(logs.concat(msg));
    socket.emit("message", msg);
    setMsg({ ...msg, message: "" });
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isAuthor || game.status === "waiting")
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
          style={{
            visibility: isAuthor ? "visible" : "hidden",
          }}
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
            <div
              id="brush"
              style={{ height: "330px", padding: "1rem 2rem 1rem 0.5rem" }}
            >
              <Slider
                id="slider"
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
              <Tooltip
                placement="right"
                title="Bursh Size"
                aria-label="Bursh Size"
              >
                <BorderColor className="drawingtoolsIcon" style={{ color }} />
              </Tooltip>
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
          <Tooltip
            placement="right"
            title="Start a new page"
            aria-label="Start a new page"
          >
            <LayersClear
              className="drawingtoolsIcon"
              onClick={() => eraser()}
            />
          </Tooltip>
        </Container>
        <canvas
          id="canvas"
          ref={canvasRef}
          onMouseDown={(e) => startDrawing(e.nativeEvent)}
          onMouseUp={(e) => finishDrawing(e.nativeEvent)}
          onMouseMove={(e) => draw(e.nativeEvent)}
        />
        {/* <div
          id="word"
          style={{
            visibility:
              isAuthor && game.status === "started" ? "visible" : "hidden",
          }}
        >
          <h1>Draw: {word}</h1>
        </div> */}
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
              disabled={isAuthor && game.status === "started" ? true : false}
              placeholder={
                isAuthor && game.status === "started"
                  ? "Shhh! You are muted!"
                  : "Enter your message here"
              }
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
