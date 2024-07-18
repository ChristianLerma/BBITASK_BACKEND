"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const colors_1 = __importDefault(require("colors"));
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static createProject = async (req, res) => {
        const project = new Project_1.default(req.body);
        //Asignar el creador del Proyecto
        project.manager = req.user.id;
        try {
            await project.save();
            res.send('Proyecto Creado Correctamente');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            const projects = await Project_1.default.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } },
                ]
            }).populate('tasks');
            res.json(projects);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
    static getProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id).populate('tasks');
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Acción no válida');
                return res.status(404).json({ error: error.message });
            }
            res.json(project);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
    static updateProject = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id);
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Solo el Manager puede actializar el proyecto');
                return res.status(404).json({ error: error.message });
            }
            project.projectName = req.body.projectName;
            project.clientName = req.body.clientName;
            project.description = req.body.description;
            await project.save();
            res.send('Proyecto Actualizado');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
    static deleteProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id);
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Solo el Manager puede actializar el proyecto');
                return res.status(404).json({ error: error.message });
            }
            await project.deleteOne();
            res.send('Proyecto Eliminado');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectController.js.map