export interface IRequest extends Request, IToken {}

export interface IToken {
  userId: string;
  role?: string;
}
