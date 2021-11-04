import AccountsDAO from "../dao/accounts.dao.js";
import { User } from "./users.controller.js";

export default class AccountsController {
    static async apiGetAccounts(req, res, next) {
        const MOVIES_PER_PAGE = 20
        const { accountsList, totalNumAccounts } = await AccountsDAO.getAccounts();
        let response = {
            accounts: accountsList,
            page: 0,
            filters: {},
            entries_per_page: MOVIES_PER_PAGE,
            total_results: totalNumAccounts,
        }
        res.json(response);
    }

    static async apiGetAccountById(req, res, next) {
        try {
            // let id = 794875;
            let id = req.params.id;
            id = parseInt(id);

            let account = await AccountsDAO.getAccountByID(id);
            if (!account) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            let updated_type = account.lastupdated instanceof Date ? "Date" : "other";
            res.json({ account, updated_type });
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiPostAccount(req, res, next) {
        try {
            const userJwt = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decoded(userJwt);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }

            const accountDoc = req.body.account;
            const insertResponse = await AccountsDAO.addAccount(accountDoc);
            const accountId = insertResponse.insertedId;

            const updated = await AccountsDAO.getAccountByID(accountId);

            res.json({ status: "success", account: updated });
        } 
        catch (e) {
            res.status(500).json({ e });
        }
    }
}
