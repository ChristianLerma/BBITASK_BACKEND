import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

//Tipado para los datos en TypeScript
export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

//Tipos de datos para Mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        require: true,
        trim: true,
    },
    clientName: {
        type: String,
        require: true,
        trim: true,
    },
    description: {
        type: String,
        require: true,
        trim: true,
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true})

//Definir el modelo y registrarlo en la instancia de Mongoose
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project
