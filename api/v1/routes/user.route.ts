import { Router} from "express";

const router: Router = Router();

import User from "../models/user.model";

import * as controller  from "../controllers/user.controller";

import * as authMiddleware from "../middlewares/auth.middleware"


router.post("/register",controller.register);

router.post("/login",controller.login);

router.post("/detail/:id",authMiddleware.requireAuth,controller.detail);


export const userRoutes: Router = router;