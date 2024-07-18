import mongoose, { Document, Types } from "mongoose";
declare const taskStatus: {
    readonly PENDING: "pending";
    readonly ON_HOLD: "onHold";
    readonly IN_PROGRESS: "inProgress";
    readonly UNDER_REVIEW: "underReview";
    readonly COMPLETE: "complete";
};
export type taskStatus = typeof taskStatus[keyof typeof taskStatus];
export interface ITask extends Document {
    name: string;
    description: string;
    project: Types.ObjectId;
    status: taskStatus;
    completedBy: {
        user: Types.ObjectId;
        status: taskStatus;
    }[];
}
declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask> & ITask & Required<{
    _id: unknown;
}>, any>;
export default Task;
