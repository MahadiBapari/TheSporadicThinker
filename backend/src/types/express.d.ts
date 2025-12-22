import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: number;
        email: string;
        role: string;
        username?: string;
      };
      body?: any;
      params?: any;
    }
    
    interface Response {
      status(code: number): Response;
      json(body: any): Response;
      set(name: string, value: string): Response;
    }
    
    interface Application {
      use(...args: any[]): Application;
      listen(port: number, callback?: () => void): any;
    }
  }
}

export {};

