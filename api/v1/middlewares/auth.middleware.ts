
import User from "../models/user.model";
import { Request,Response, NextFunction } from "express";

export const requireAuth = async(req : Request,res : Response,next: NextFunction): Promise<void> => {
    
    if (req.headers.authorization){
        // Kiểm tra xem người dùng có gửi token hay ko
        // req.headers.authorization nó sẽ kèm theo Bearer 'token' nên phải tách ra 
        const token = req.headers.authorization.split(' ')[1]; 

        // Nếu nhập token bừa sẽ ko vào đc trang detail
        const user = await User.findOne({
            token: token,
            deleted: false,
        }).select("-password");

        if (!user) {
            res.json({ 
                code: 400,
                message: 'Token không hợp lệ'
            });
        }

        req["user"] = user;

        next();
    } else {
        res.json({
            code: 400,
            message: "Vui lòng gửi kèm token!",
        });
    }

    next();
}