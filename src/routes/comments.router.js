import { Router } from "express";

import CommentsController from "../controllers/comments.controller.js";

const router = new Router()

router.post("/", CommentsController.apiPostComment);
router.put("/", CommentsController.apiUpdateComment);
router.delete("/", CommentsController.apiDeleteComment);

export default router;