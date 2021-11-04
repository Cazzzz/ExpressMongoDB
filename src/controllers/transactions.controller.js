import { ObjectId } from "bson";

import UsersDAO from "../dao/users.dao.js";
import TransactionsDAO from "../dao/transactions.dao.js";
import AccountsDAO from "../dao/accounts.dao.js";
import { User } from "./users.controller.js";

export default class TransactionsController {

    static async apiGetTransactions(req, res, next) {
        const TRANSACTIONS_PER_PAGE = 20
        const { transactionsList, totalNumTransactions } = await TransactionsDAO.getTransactions();
        let response = {
            transactions: transactionsList,
            page: 0,
            filters: {},
            entries_per_page: TRANSACTIONS_PER_PAGE,
            total_results: totalNumTransactions,
        }
        res.json(response);
    }

    static async apiGetTransactionById(req, res, next) {
        try {
            let id = req.params.id || {};
            let transaction = await TransactionsDAO.getTransactionByID(id);
            if (!transaction) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            let updated_type = transaction.lastupdated instanceof Date ? "Date" : "other";
            res.json({ transaction, updated_type });
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiPostTransaction(req, res, next) {
        try {
            const userJwt = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decoded(userJwt);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }

            const accountId = req.body.account_id;
            const transaction = req.body.transaction;
            const date = new Date();

            const transactionResponse = await TransactionsDAO.addTransaction(
                ObjectId(accountId),
                user,
                transaction,
                date,
            );

            const updatedTransactions = await AccountsDAO.getAccountByID(accountId);

            res.json({ status: "success", transactions: updatedTransactions.transactions });
        } catch (e) {
            res.status(500).json({ e });
        }
    }

    static async apiUpdateTransaction(req, res, next) {
        try {
            const userJwt = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decoded(userJwt);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }

            const transactionId = req.body.transaction_id;
            const text = req.body.updated_transaction;
            const date = new Date();

            const transactionResponse = await TransactionsDAO.updateTransaction(
                ObjectId(transactionId),
                user.email,
                text,
                date,
            );

            var { error } = transactionResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (transactionResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update transaction - user may not be original poster",
                );
            }

            const accountId = req.body.account_id;
            const updatedTransactions = await AccountsDAO.getAccountByID(accountId);

            res.json({ transactions: updatedTransactions.transactions });
        } 
        catch (e) {
            res.status(500).json({ e });
        }
    }

    static async apiDeleteTransaction(req, res, next) {
        try {
            const userJwt = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decoded(userJwt);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }

            const transactionId = req.body.transaction_id;
            const userEmail = user.email;
            const transactionResponse = await TransactionsDAO.deleteTransaction(
                ObjectId(transactionId),
                userEmail,
            );

            const accountId = req.body.account_id;

            const { transactions } = await AccountsDAO.getAccountByID(accountId);
            res.json({ transactions });
        } 
        catch (e) {
            res.status(500).json({ e });
        }
    }

    static async apiTransactionReport(req, res, next) {
        try {
            const userJwt = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decoded(userJwt);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }

            if (UsersDAO.checkAdmin(user.email)) {
                const report = await TransactionsDAO.mostActiveTransactioners();
                res.json({ report });
                return;
            }

            res.status(401).json({ status: "fail" });
        } 
        catch (e) {
            res.status(500).json({ e });
        }
    }
}
