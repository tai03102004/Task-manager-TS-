import {Request , Response} from "express";
import md5 from "md5";
import { generateRandomString } from "../helpers/generate.helper";
import User from "../../../models/user.model";

// [POST] / api/v1/users/register

export const register = async (req: Request, res: Response) => {
    req.body.password = (md5)(req.body.password);

    const existEmail = await User.findOne({ 
        email: req.body.email,
        deleted : false,
    });
    if (existEmail) {
        res.json({
            code: 400,
            message:"Email already exists"
        })
    } else {

        req.body.password = md5(req.body.password);
        req.body.token = generateRandomString(30);
        
        const user = new User(req.body);

        const data = await user.save();
        const token = data.token;

        res.json({
            code: 200,
            message:"User saved successfully",
            token: token
        });
    }
}

// [POST] / api/v1/users/login

export const login = async (req, res) => {
    const password = (req.body.password);
    const email = (req.body.email); 
    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại",
        });
        return;
    }

    if (md5(password) != user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu",
        });
        return;
    }

    const token = user.token;
    res.cookie("token",token);

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: token,
    });
};

// [POST] / api/v1/users/detail/:id

export const detail = async (req, res) => {
    
    res.json ({
        code: 200,
        message : "Thành công",
        info :req["user"],
    })
};

