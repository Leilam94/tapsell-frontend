export interface IResult {
  error: boolean;
  result: any;
}
export interface ITask {
  _id?: string;
  title: string;
  date?: Date;
  description: string;
  done: boolean;
  list?: string;
}
export interface IList {
  _id?: string;
  title: string;
  date?: string
}
