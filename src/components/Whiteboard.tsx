import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import io from "socket.io-client";
import { Container, Slider, Popover, Badge, Input } from "@material-ui/core";
import { LayersClear, BorderColor, Send } from "@material-ui/icons";
import { colors, marks } from "../utils/constants";
import { IRoom, IRoomChat, ICanvas } from "../utils/interfaces";
import { updateError } from "../store/reducers/status";
import { updateGame } from "../store/reducers/game";
import "../styles/Whiteboard.scss";

const apiURL = process.env.REACT_APP_API_URL!;
// type Coordinate = { x: number; y: number };
const socket = io(apiURL, { transports: ["websocket"] });
let room = "";
let sid = "";

function valuetext(value: number) {
  return `${value}px`;
}

function Whiteboard() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  room = history.location.pathname.slice(3);
  const { game } = useAppSelector((state) => state.current);

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
  }, []);
  useEffect(() => {
    const context = canvasRef.current!.getContext("2d")!;
    context.strokeStyle = color;
    context.lineWidth = stroke;
  }, [stroke, color]);

  function startDrawing(e: MouseEvent) {
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
    const msg: ICanvas = { room, dataURL, from: sid };
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

  // Game
  const checkRoomId = React.useCallback(async () => {
    const res = await fetch(`${apiURL}/rooms/${room}`);
    if (res.status === 404) {
      dispatch(updateError("Room doesn't exists"));
      history.push("/");
    }
  }, [dispatch, history]);

  useEffect(() => {
    socket.on("connection", (socketId: string) => {
      console.log(socketId);
      sid = socketId;
      setMsg({ ...msg, from: socketId });
    });
    socket.on("roomData", (data: IRoom) => {
      dispatch(updateGame(data));
    });
  }, [dispatch, msg]);

  // emit join room and handle disconnect
  useEffect(() => {
    if (room) checkRoomId();
    socket.emit("joinRoom", { room });
    return () => {
      socket.emit("leaveRoom", room);
      socket.disconnect();
    };
  }, [checkRoomId]);

  // Status update
  const updateStatus = (status: string) => {
    socket.emit("gameStatus", { from: sid, room, status });
  };

  // Timer
  const [timer, setTimer] = useState<number>(180);
  useEffect(() => setTimer(180), [game.round]);

  // Topic
  const [word, setWord] = useState<string>("");
  useEffect(() => {
    if (game.status === "started") {
      setWord(game.words![game.round!]);
      setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [game, timer]);

  // Chat
  useEffect(() => {
    socket.on("message", (data: IRoomChat) => {
      setLogs(logs.concat(data));
    });
  }, [logs]);
  const sendMsg = () => {
    setLogs(logs.concat(msg));
    socket.emit("message", msg);
    setMsg({ ...msg, message: "" });
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg({ ...msg, message: e.target.value });
  };
  const handleInputMsg = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key === "Enter") sendMsg();
  };
  return (
    <>
      <div id="whiteboard">
        <Container id="drawingTools">
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
                max={96}
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
        <div id="word">
          <h1>{word}</h1>
        </div>
      </div>
      <div id="sidebar">
        <div id="timer">
          {game.status === "waiting" ? (
            <>
              <h4>Waiting for others to join</h4>
              <button onClick={() => updateStatus("started")}>
                Game Start
              </button>
            </>
          ) : (
            <>
              <h4>{game.round}</h4>
              <h1>{`${timer}s`}</h1>
            </>
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
