declare global {
  namespace Express {
    export interface Request {
      user?: {
        [key: string]: any;
      };
      admin?: {
        [key: string]: any;
      };
    }
  }
}
export {};
