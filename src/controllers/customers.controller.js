import CustomersDAO from "../dao/customers.dao.js";
import { User } from "./users.controller.js";

export default class CustomersController {
    static async apiGetCustomers(req, res, next) {
        const MOVIES_PER_PAGE = 20
        const { customersList, totalNumCustomers } = await CustomersDAO.getCustomers();
        let response = {
            customers: customersList,
            page: 0,
            filters: {},
            entries_per_page: MOVIES_PER_PAGE,
            total_results: totalNumCustomers,
        }
        res.json(response);
    }

    static async apiGetCustomerById(req, res, next) {
        try {
            let id = req.params.id || {};
            let customer = await CustomersDAO.getCustomerByID(id);
            if (!customer) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            let updated_type = customer.lastupdated instanceof Date ? "Date" : "other";
            res.json({ customer, updated_type });
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiPostCustomer(req, res, next) {
        try {
            const userJwt = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decoded(userJwt);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }

            const customerDoc = req.body.customer;
            const insertResponse = await CustomersDAO.addCustomer(customerDoc);
            const customerId = insertResponse.insertedId;

            const updated = await CustomersDAO.getCustomerByID(customerId);

            res.json({ status: "success", customer: updated });
        } 
        catch (e) {
            res.status(500).json({ e });
        }
    }
}
