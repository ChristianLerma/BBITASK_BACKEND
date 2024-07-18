import type { Request, Response } from 'express';
export declare class ProjectController {
    static createProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getAllProjects: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updateProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static deleteProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
