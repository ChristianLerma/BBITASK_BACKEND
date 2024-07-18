"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const colors_1 = __importDefault(require("colors"));
const Task_1 = __importDefault(require("../models/Task"));
class TaskController {
    static createTask = async (req, res) => {
        try {
            const task = new Task_1.default(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            await Promise.allSettled([
                task.save(),
                req.project.save()
            ]);
            res.send('Tarea Creada Correctamente');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
    static getProjectTasks = async (req, res) => {
        try {
            const tasks = await Task_1.default.find({ project: req.project.id }).populate('project');
            res.json(tasks);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
    static getTasksById = async (req, res) => {
        try {
            const task = await Task_1.default.findById(req.task.id)
                .populate({ path: 'completedBy.user', select: '_id name email' });
            res.json(task);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
    static updateTask = async (req, res) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;
            req.task.save();
            res.json("Tarea Actualizada Correctamente");
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
    static deleteTask = async (req, res) => {
        try {
            if (req.task.project.toString() !== req.project.id.toString()) {
                const error = new Error('Acción no válida');
                return res.status(400).json({ error: error.message });
            }
            const { taskId } = req.params;
            const taskDelete = await Task_1.default.findById(taskId);
            if (!taskDelete) {
                const error = new Error('Tarea no encontrada');
                return res.status(404).json({ error: error.message });
            }
            await taskDelete.deleteOne();
            const tasksProject = await Task_1.default.find({ project: req.project.id });
            if (!tasksProject) {
                req.project.tasks = [];
            }
            else {
                const taskAdd = [];
                tasksProject.forEach(task => {
                    taskAdd.push(task.id);
                });
                req.project.tasks = taskAdd;
            }
            await req.project.save();
            res.json("Tarea Eliminada Correctamente");
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
    static updateStatus = async (req, res) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            const data = {
                user: req.user.id,
                status
            };
            req.task.completedBy.push(data);
            await req.task.save();
            res.send("Tarea Actualizada Correctamente");
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error));
            return res.status(404).json({ error: 'Hubo un error' });
        }
    };
}
exports.TaskController = TaskController;
//# sourceMappingURL=TaskController.js.map