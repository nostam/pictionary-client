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
  users?: IUser[]; //TODO
  endedAt?: Date;
  startedAt?: Date;
  words: string[] | null;
  difficulty: difficulty;
  createdAt?: Date;
  modifiedAt?: Date;
  status: string | null;
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
export enum difficulty {
  easy = "Easy",
  normal = "Normal",
  hard = "Hard",
  lunatic = "Lunatic",
}

export interface IError {
  message: string | null;
}

export interface IRoomChat {
  from: string;
  message: string;
  room?: string;
  round: number;
}
