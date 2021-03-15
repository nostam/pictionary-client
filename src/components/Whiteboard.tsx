import React, { useRef, useState, useCallback, useEffect } from "react";
import io from "socket.io-client";

type Coordinate = { x: number; y: number };

function Whiteboard() {
  const width = 1500;
  const height = 1000;
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mouseCoordinates, setMouseCoordinates] = useState<
    Coordinate | undefined
  >();
  const [color, setColor] = useState<string>("black");
  const [stroke, setStroke] = useState<number>(12);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    console.log("init canvas");
    const canvas = canvasRef.current!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d")!;

    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = stroke;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    let socket = io(process.env.REACT_APP_API_URL!, {
      transports: ["websocket"],
    });
    const room = "test";
    socket.emit("joinRoom", { room });
    return () => {
      socket.disconnect();
    };
  }, []);

  function handleMouseDown(e: MouseEvent) {
    const { offsetX, offsetY } = e;
    contextRef.current!.beginPath();
    contextRef.current!.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }
  function handleMouseUp(e: MouseEvent) {
    contextRef.current!.closePath();
    setIsDrawing(false);
  }
  function handleMouseMove(e: MouseEvent) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e;
    contextRef.current!.lineTo(offsetX, offsetY);
    contextRef.current!.stroke();
  }

  return (
    <div id="canvas">
      <canvas
        ref={canvasRef}
        height={height}
        width={width}
        onMouseDown={(e) => handleMouseDown(e.nativeEvent)}
        onMouseUp={(e) => handleMouseUp(e.nativeEvent)}
        onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
      />
    </div>
  );
}

export default Whiteboard;
