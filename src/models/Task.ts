import mongoose, { Schema, Document, Types } from "mongoose";

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETE: 'complete'
} as const

export type taskStatus = typeof taskStatus[keyof typeof taskStatus]

//Tipado para los datos en TypeScript
export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId
    status: taskStatus
    completedBy: {
        user: Types.ObjectId,
        status: taskStatus
    }[]
}

//Tipos de datos para Mongoose
const TaskSchema: Schema = new Schema({ 
    name: {
        type: String,
        trim: true, 
        require: true
    },
    description: {
        type: String,
        trim: true, 
        require: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    }, 
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
]
}, {timestamps: true})

//Definir el modelo y registrarlo en la instancia de Mongoose
const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task