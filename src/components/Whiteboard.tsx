import React, { useRef, useState, useCallback, useEffect } from "react";
import io from "socket.io-client";
import "../styles/Whiteboard.scss";
import Slider from "@material-ui/core/Slider";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

interface IColor {
  label: string;
  value: string;
}
type Coordinate = { x: number; y: number };
const socket = io(process.env.REACT_APP_API_URL!, {
  transports: ["websocket"],
});

const marks = [
  {
    value: 8,
    label: "8px",
  },
  {
    value: 16,
    label: "16px",
  },
  {
    value: 24,
    label: "24px",
  },
  {
    value: 96,
    label: "96px",
  },
];

const colors: IColor[] = [
  { value: "#f44336", label: "Red" },
  { value: "#e91e63", label: "Pink" },
  { value: "#9c27b0", label: "Purple" },
  { value: "#673ab7", label: "Deep Purple" },
  { value: "#3f51b5", label: "Indigo" },
  { value: "#2196f3", label: "Blue" },
  { value: "#03a9f4", label: "Light Blue" },
  { value: "#00bcd4", label: "Cyan" },
  { value: "#fff", label: "White" },
  { value: "#009688", label: "Teal" },
  { value: "#4caf50", label: "Green" },
  { value: "#8bc34a", label: "Light Green" },
  { value: "#cddc39", label: "Lime" },
  { value: "#ffeb3b", label: "Yellow" },
  { value: "#ffc107", label: "Amber" },
  { value: "#ff9800", label: "Orange" },
  { value: "#ff5722", label: "Deep Orange" },
  { value: "#000", label: "Black" },
];

function valuetext(value: number) {
  return `${value}°C`;
}

function Whiteboard() {
  const width = 10;
  const height = 10;
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mouseCoordinates, setMouseCoordinates] = useState<
    Coordinate | undefined
  >();
  const [color, setColor] = useState<string>("black");
  const [stroke, setStroke] = useState<number>(16);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

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
    setTimeout(() => socket.emit("canvasData", dataURL), 500);
  }
  function draw(e: MouseEvent) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e;
    contextRef.current!.lineTo(offsetX, offsetY);
    contextRef.current!.stroke();
  }

  return (
    <div id="canvas">
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={(e) => startDrawing(e.nativeEvent)}
        onMouseUp={(e) => finishDrawing(e.nativeEvent)}
        onMouseMove={(e) => draw(e.nativeEvent)}
      />
      <div id="drawingTools">
        <div id="colorPalettes">
          <div id="currentColor" style={{ backgroundColor: color }}></div>
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
        <div id="brush">
          <Slider
            value={stroke}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-custom"
            step={4}
            valueLabelDisplay="auto"
            marks={marks}
            onChangeCommitted={(e, value) => {
              console.log(typeof value === "number");
              if (typeof value === "number") setStroke(value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;
