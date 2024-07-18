import type { Request, Response } from 'express'
import colors from 'colors'
import Task from '../models/Task'

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([
                task.save(),
                req.project.save()
            ])
            res.send ('Tarea Creada Correctamente')
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }
    
    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }

    static getTasksById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task.id)
                .populate({path: 'completedBy.user', select: '_id name email'})
            
            res.json(task)
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {            
            req.task.name = req.body.name
            req.task.description = req.body.description
            req.task.save()

            res.json("Tarea Actualizada Correctamente")
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            if(req.task.project.toString() !== req.project.id.toString()){
                const error = new Error('Acción no válida')
                return res.status(400).json({ error: error.message })
            }
            
            const { taskId } = req.params
            
            const taskDelete = await Task.findById(taskId)
            if(!taskDelete){
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({ error: error.message })
            }            
            
            await taskDelete.deleteOne()
            
            const tasksProject = await Task.find({project: req.project.id})
            if(!tasksProject){
                req.project.tasks = []
            }else{
                const taskAdd = []
                tasksProject.forEach(task => {
                    taskAdd.push(task.id)
                });

                req.project.tasks = taskAdd
            }

            await req.project.save()

            res.json("Tarea Eliminada Correctamente")
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }
    
    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.task.status = status
            
            const data = {
                user: req.user.id,
                status
            }
            req.task.completedBy.push(data)
            
            await req.task.save()
            
            res.send("Tarea Actualizada Correctamente")
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }
}