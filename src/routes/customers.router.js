import { Router } from 'express';

import CustomersController from '../controllers/customers.controller.js';

const router = Router();

router.get('/', CustomersController.apiGetCustomers);
router.get("/:id", CustomersController.apiGetCustomerById);
router.post("/", CustomersController.apiPostCustomer);

export default router;














