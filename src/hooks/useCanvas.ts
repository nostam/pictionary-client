import React, { useContext, useRef, useState } from "react";

// const CanvasContext = React.createContext();

// interface ICanvasContextProps {
//   state: any;
//   dispatch: ({ type }: { type: string }) => void;
// }

export const CanvasProvider = ({ children }: any) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const prepareCanvas = () => {
    const canvas = canvasRef.current!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d")!;

    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  };

  const startDrawing = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    contextRef.current!.beginPath();
    contextRef.current!.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current!.closePath();
    setIsDrawing(false);
  };

  const draw = (e: MouseEvent) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e;
    contextRef.current!.lineTo(offsetX, offsetY);
    contextRef.current!.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d")!;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas!.width, canvas!.height);
  };

  return;
  // (<CanvasContext.Provider
  //   value={{
  //     canvasRef,
  //     contextRef,
  //     prepareCanvas,
  //     startDrawing,
  //     finishDrawing,
  //     clearCanvas,
  //     draw,
  //   }}
  // >
  //   {children}
  // </CanvasContext.Provider>)
};

// export const useCanvas = () => useContext(CanvasContext);

export {};
