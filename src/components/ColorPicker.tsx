import React from "react";
import { Popover } from "@material-ui/core";
import { ChromePicker, ColorResult } from "react-color";
import { useAppDispatch } from "../utils/hooks";
import { setCurrentUser } from "../store/reducers/user";
import "../styles/ColorPicker.scss";
interface IProps {
  color: string;
  value: string;
}

export default function ColorPicker({ color, value }: IProps) {
  const dispatch = useAppDispatch();
  const [bgColor, setBgColor] = React.useState(color);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleColorPick = (c: ColorResult) => {
    dispatch(setCurrentUser({ color: { [value]: c.hex } }));
    setBgColor(c.hex!);
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
        <ChromePicker color={bgColor} onChange={handleColorPick} />
      </Popover>
    </div>
  );
}
