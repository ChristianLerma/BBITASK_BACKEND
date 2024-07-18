import mongoose, { Schema, Document, Types } from "mongoose";

//Tipado para los datos en TypeScript
export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    expiresAt: string
}

const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        require: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: '10m'
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token
