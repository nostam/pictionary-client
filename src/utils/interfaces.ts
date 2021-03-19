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
  users: IUser[];
  endedAt?: Date;
  startedAt?: Date;
  words: string[];
  difficulty: difficulty;
  createdAt?: Date;
  modifiedAt?: Date;
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
