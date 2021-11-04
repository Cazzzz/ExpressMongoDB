import { Router } from 'express';

import AccountsController from '../controllers/accounts.controller.js';

const router = Router();

router.get('/', AccountsController.apiGetAccounts);
router.get("/:id", AccountsController.apiGetAccountById);
router.post("/", AccountsController.apiPostAccount);

export default router;














