import { Router } from 'express';

import UsersController from '../controllers/users.controller.js';
import TransactionsController from '../controllers/transactions.controller.js';

const router = Router();

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.post("/logout", UsersController.logout);
router.delete("/delete", UsersController.delete);
router.put("/update-preferences", UsersController.save);
router.get("/Transaction-report", TransactionsController.apiTransactionReport);
router.post("/make-admin", UsersController.createAdminUser);

export default router;