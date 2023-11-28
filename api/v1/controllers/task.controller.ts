import { Request, Response } from "express";

import Task from "../models/task.model";

import paginationHelper from "../helpers/pagination.helper";

import searchHelper from "../helpers/search.helper";


export const index = async (req: Request, res: Response) => {
    
    // Find

    interface Find {
        deleted : boolean;
        status? : string;
        title?: RegExp
    }

    const find : Find = {
        deleted : false,
    };

    // if (req.query.status) {
    //     find["status"] = req.query.status;
    // }

    if (req.query.status) {
        find.status = req.query.status.toString(); 
    }

    // End find
    
    
    // Sort

    const sort = [];
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }

    // End sort

    // pagination

    let initPagination = {
        currentPage: 1,
        limitItems: 2,
    };
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    );

    // End pagination

    // Search

    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }


    // Emd search


    const tasks = await Task.find(find).sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

    res.json(tasks);
}

export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false
    });

    res.json(task);
}

// [PATCH] /api/v1/tasks/change-status / :id

export const changeStatus = async (req: Request, res: Response) => {

    try {
        const id : string = req.params.id;
        const status : string = req.body.status;

        await Task.updateOne({ 
            _id:id 
        },{
            status : status
        });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });

    } catch (err) {
        res.json ({
            code : 400,
            message : "Error updating",
        })
    }
}


// [PATCH] /api/v1/tasks/change-multi

export const changeMulti = async (req: Request, res: Response) => {

    try {

        enum Key {
            STATUS = "status",
            DELETE = "delete"
        }

        const ids : string[] = req.body.ids;
        const key : string = req.body.key;
        const value : string = req.body.value;
        
        switch (key) { 
            case Key.STATUS :
                await Task.updateMany ({
                    _id : {$in : ids},
                    },
                    {
                        status : value,
                    }
                );
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!"
                });
                break;
            case Key.DELETE : 
                await Task.updateMany (
                    {
                        _id : {$in : ids},
                    },
                    {
                        deleted : true,
                        deleteAt : new Date(),
                    },
                );
                res.json({
                    code: 200,
                    message: "Xoá sản phẩm thành công!"
                });
            

            default : 
                res.json({
                    code: 400,
                    message: "Không tồn tại!",
                });
                break;
        }

    } catch (err) {
        res.json ({
            code : 400,
            message : "Error updating",
        })
    }
}

// [POST] /api/v1/tasks/create

export const create = async (req: Request, res: Response) => {
    try {
        const product = new Task(req.body);
        const data = await product.save();

        res.json({
            code: 200,
            message: "Thêm sản phẩm thành công!",
            data : data
        });

    }  catch (err) {
        res.json ({
            code : 400,
            message : "Error updating",
        })
    }
}

// [PATCH] /api/v1/tasks/edit/:id

export const edit = async (req: Request, res: Response) => {
    try {
        
        const id: string = req.params.id;

        await Task.updateOne(
            {
                _id: id 
            } , req.body
        )


        res.json({
            code: 200,
            message: "Cập nhật sản phẩm thành công!",
        });

    }  catch (err) {
        res.json ({
            code : 400,
            message : "Error updating",
        })
    }
}

//  [PATCH] /api/v1/tasks/delete/:id

export const deleteTask = async (req: Request, res: Response) => {
    try {
        
        const id: string = req.params.id;

        await Task.updateOne(
            {
                _id: id 
            } , {
                deleted : true,
                deleteAt : new Date(),
            }
        )


        res.json({
            code: 200,
            message: "Xoá sản phẩm thành công!",
        });

    }  catch (err) {
        res.json ({
            code : 400,
            message : "Error",
        })
    }
}












