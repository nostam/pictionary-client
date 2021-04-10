import React from "react";
import { SketchPicker } from "react-color";

interface IProps {
  color: string;
}
export default function ColorPicker({ color }: IProps) {
  const [bgColor, setBgColor] = React.useState(color);

  return (
    <div>
      <SketchPicker
        color={bgColor}
        onChangeComplete={(c) => {
          setBgColor(c.hex!);
        }}
      />
    </div>
  );
}
