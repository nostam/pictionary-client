import React, { useRef, useState, useCallback, useEffect } from "react";
import io from "socket.io-client";
import { Container, Slider, Popover, Badge } from "@material-ui/core";
import { Create, LayersClear, BorderColor } from "@material-ui/icons";
import { colors, marks } from "../utils/constants";
import "../styles/Whiteboard.scss";

type Coordinate = { x: number; y: number };
const socket = io(process.env.REACT_APP_API_URL!, {
  transports: ["websocket"],
});

function valuetext(value: number) {
  return `${value}°C`;
}

function Whiteboard() {
  const width = window.innerWidth - 48; // drawing tools
  const height = window.innerHeight - 164; // navbar height + word topic
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mouseCoordinates, setMouseCoordinates] = useState<
    Coordinate | undefined
  >();
  const [color, setColor] = useState<string>("black");
  const [stroke, setStroke] = useState<number>(12);
  const [showBrush, setShowBrush] = useState<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
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
    socket.on("canvasData", (dataURL: string) => {
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

  useEffect(() => {
    const room = "test";
    socket.emit("joinRoom", { room });
    return () => {
      socket.disconnect();
    };
  }, []);

  function startDrawing(e: MouseEvent) {
    const { offsetX, offsetY } = e;
    contextRef.current!.beginPath();
    contextRef.current!.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }
  function finishDrawing(e: MouseEvent) {
    contextRef.current!.closePath();
    setIsDrawing(false);
    const dataURL = canvasRef.current!.toDataURL("image/webp", 0.75); // firefox does not support
    setTimeout(() => socket.emit("canvasData", dataURL), 100);
  }
  function draw(e: MouseEvent) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e;
    contextRef.current!.lineTo(offsetX, offsetY);
    contextRef.current!.stroke();
  }
  const handleClickPen = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <div id="whiteboard">
        <Container fixed id="drawingTools">
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
              <BorderColor id="currentColor" style={{ color }} />
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
        </Container>
        <canvas
          id="canvas"
          ref={canvasRef}
          onMouseDown={(e) => startDrawing(e.nativeEvent)}
          onMouseUp={(e) => finishDrawing(e.nativeEvent)}
          onMouseMove={(e) => draw(e.nativeEvent)}
        />
      </div>
    </>
  );
}

export default Whiteboard;
