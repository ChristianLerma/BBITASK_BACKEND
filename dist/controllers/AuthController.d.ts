import { Request, Response } from 'express';
export declare class AuthController {
    static createAcount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static confirmAccount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static requestConfirmationCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static forgotPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static validateToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updatePasswordWithToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static user: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static checkPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
