import mongoose, { Schema, Document } from "mongoose";

//Tipado para los datos en TypeScript
export interface IUser extends Document {
    email: string
    password: string
    name: string
    confirmed: boolean
}

//Tipos de datos para Mongoose
const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    confirmed: {
        type: Boolean,
        default: false
    },
})

//Definir el modelo y registrarlo en la instancia de Mongoose
const User = mongoose.model<IUser>('User', userSchema)
export default User