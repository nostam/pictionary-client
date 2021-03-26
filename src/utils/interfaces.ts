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
  // users?: IUser[]; //TODO
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
  _id: string;
  nickname?: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  avatar?: string;
  status?: string;
  desciption?: string;
  role?: string;
  googleId?: string;
  socketId?: string;
  createdAt?: string;
  modifiedAt?: string;
}
export interface IPlayers {
  round: number;
  users: string[];
}

export enum difficulty {
  easy = "Easy",
  normal = "Normal",
  hard = "Hard",
  lunatic = "Lunatic",
}

export interface IStatus {
  error: string | null;
  loading: boolean;
  alert: IAlert | null;
}

export interface IAlert {
  type: string;
  message: string;
}
export interface IRoomChat {
  from: string;
  message: string;
  room?: string;
  round: number;
}

export enum mode {
  n = "Normal",
  b = "Blindfold",
  c = "Co-op",
  r = "Relay",
  s = "solo",
}

export interface ICanvas {
  from: string;
  dataURL: string;
  room: string;
}
