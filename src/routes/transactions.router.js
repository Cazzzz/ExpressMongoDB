import { Router } from "express";

import TransactionsController from "../controllers/transactions.controller.js";

const router = new Router()

router.post("/", TransactionsController.apiPostTransaction);
router.get('/', TransactionsController.apiGetTransactions);
router.get('/:id', TransactionsController.apiGetTransactionById);
router.put("/", TransactionsController.apiUpdateTransaction);
router.delete("/", TransactionsController.apiDeleteTransaction);

export default router;