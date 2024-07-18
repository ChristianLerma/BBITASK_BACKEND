import mongoose, { Document, Types } from "mongoose";
export interface IToken extends Document {
    token: string;
    user: Types.ObjectId;
    expiresAt: string;
}
declare const Token: mongoose.Model<IToken, {}, {}, {}, mongoose.Document<unknown, {}, IToken> & IToken & Required<{
    _id: unknown;
}>, any>;
export default Token;
