import type { Request, Response } from 'express'
import colors from 'colors'
import Project from '../models/Project'

export class ProjectController{
    
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        //Asignar el creador del Proyecto
        project.manager = req.user.id

        try {
            await project.save()
            res.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }
    
    static getAllProjects = async(req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}},
                ]
            }).populate('tasks')
            res.json(projects)
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }        
    }

    static getProjectById = async(req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            if(!project){
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({ error: error.message })
            }

            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)){
                const error = new Error('Acción no válida')
                return res.status(404).json({error: error.message})
            }
            
            res.json(project)
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }

    static updateProject = async(req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project){
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({ error: error.message })
            }

            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error('Solo el Manager puede actializar el proyecto')
                return res.status(404).json({error: error.message})
            }
            
            project.projectName = req.body.projectName
            project.clientName = req.body.clientName
            project.description = req.body.description

            await project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }

    static deleteProjectById = async(req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project){
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({ error: error.message })
            }

            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error('Solo el Manager puede actializar el proyecto')
                return res.status(404).json({error: error.message})
            }

            await project.deleteOne()

            res.send('Proyecto Eliminado')
        } catch (error) {
            console.log(colors.red.bold(error))
            return res.status(404).json({ error: 'Hubo un error' })
        }
    }
}