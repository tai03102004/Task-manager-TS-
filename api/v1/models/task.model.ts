import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: String,
        status: String,
        content: String,
        timeStart: Date,
        timeFinish: Date,
        createBy: String,
        listUser : Array,
        taskParentId: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    { timestamps: true }
);

const Task =  mongoose.model("Task", taskSchema, "tasks");;

export default Task; // default chỉ dùng đc 1 lần và td là ko cần khai báo {} khi import 
