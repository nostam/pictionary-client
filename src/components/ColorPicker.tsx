import React from "react";
import { Popover } from "@material-ui/core";
import { SketchPicker } from "react-color";

import "../styles/ColorPicker.scss";
interface IProps {
  color: string;
}

// const useStyles = makeStyles((color) => ({
//   colorSample: {
//     height: "48px",
//     width: "48px",
//     outline: "1px solid rgba(0,0,0,0.25)",
//     borderRadius: "50%",
//   },
// }));

export default function ColorPicker({ color }: IProps) {
  // const classes = useStyles(color);
  const [bgColor, setBgColor] = React.useState(color);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <div
        className="colorSample"
        onClick={handleClick}
        style={{ backgroundColor: bgColor }}
      />
      <SketchPicker
        color={bgColor}
        onChangeComplete={(c) => {
          setBgColor(c.hex!);
        }}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        The content of the Popover.
      </Popover>
    </div>
  );
}
