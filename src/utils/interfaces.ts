export interface IColor {
  label: string;
  value: string;
}
export interface IRooms {
  rooms: IRoom[];
}
export interface IRoom {
  _id?: string;
  creator?: string;
  users?: IUser[];
  draw?: IPlayers[];
  guess?: IPlayers[];
  endedAt?: Date;
  words: string[] | null;
  difficulty: difficulty;
  createdAt?: Date;
  modifiedAt?: Date;
  status?: string;
  round?: number;
}
export interface IUser {
  _id?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  avatar?: string;
  status?: string;
  desciption?: string;
  role?: string;
  googleId?: string;
  socketId?: string;
  createdAt?: string;
  modifiedAt?: string;
  point?: number;
}
export interface IPlayers {
  round: number;
  users: IUser[];
}

export enum difficulty {
  easy = "Easy",
  normal = "Normal",
  hard = "Hard",
  lunatic = "Lunatic",
}

export interface IStatus {
  error: string | undefined;
  loading: boolean;
  alert: IAlert | undefined;
}

export type Severity = "error" | "success" | "warning" | "info";
export interface IAlert {
  type: Severity;
  message: string;
}
export interface IRoomChat {
  from: string;
  message: string;
  room?: string;
  round: number;
}

export enum mode {
  normal = "Normal",
  blindfold = "Blindfold",
  coop = "Co-op",
  relay = "Relay",
  solo = "solo",
}

export interface ICanvas {
  from: string;
  dataURL: string;
  room: string;
}

export interface IRegisterData {
  username?: string;
  password?: string;
  email?: string;
}
