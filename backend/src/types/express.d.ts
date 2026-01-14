import { JwtPayload } from "jsonwebtoken";
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from "express";
import type { Multer } from "multer";

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
      headers?: any;
      file?: Express.Multer.File;
    }
    
    interface Response {
      status(code: number): Response;
      statusCode: number;
      json(body: any): Response;
      send(body?: any): Response;
      set(name: string, value: string): Response;
    }
    
    interface Application {
      use(...args: any[]): Application;
      listen(port: number, callback?: () => void): any;
    }
    
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination?: string;
        filename?: string;
        path?: string;
        buffer?: Buffer;
      }
    }
  }
}

export type Request = ExpressRequest;
export type Response = ExpressResponse;
export type NextFunction = ExpressNextFunction;

