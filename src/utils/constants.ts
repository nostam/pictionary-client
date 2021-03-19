import { IColor, difficulty } from "./interfaces";

export const colors: IColor[] = [
  { value: "#f44336", label: "Red" },
  { value: "#e91e63", label: "Pink" },
  { value: "#9c27b0", label: "Purple" },
  { value: "#673ab7", label: "Deep Purple" },
  { value: "#3f51b5", label: "Indigo" },
  { value: "#2196f3", label: "Blue" },
  { value: "#03a9f4", label: "Light Blue" },
  { value: "#00bcd4", label: "Cyan" },
  { value: "#009688", label: "Teal" },
  { value: "#4caf50", label: "Green" },
  { value: "#8bc34a", label: "Light Green" },
  { value: "#cddc39", label: "Lime" },
  { value: "#ffeb3b", label: "Yellow" },
  { value: "#ffc107", label: "Amber" },
  { value: "#ff9800", label: "Orange" },
  { value: "#ff5722", label: "Deep Orange" },
  { value: "#fff", label: "White" },
  { value: "#000", label: "Black" },
];

export const marks = [
  {
    value: 12,
    label: "12px",
  },
  {
    value: 24,
    label: "24px",
  },
  {
    value: 48,
    label: "48px",
  },
  {
    value: 96,
    label: "96px",
  },
];

export const difficulties = [
  difficulty.easy,
  difficulty.normal,
  difficulty.hard,
  difficulty.lunatic,
];
