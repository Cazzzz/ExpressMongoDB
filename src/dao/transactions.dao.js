import { ObjectId } from "bson";

let transactions
const DEFAULT_SORT = [["tomatoes.viewer.numReviews", -1]]


export default class TransactionsDAO {
    static async injectDB(conn) {
        if (transactions) {
            return;
        }
        try {
            transactions = await conn.db(process.env.DB_NAME).collection("transactions");
        } 
        catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`);
        }
    }
//Get One
     static async getTransactions(query = {}, project = {}, sort = DEFAULT_SORT, page = 0, transactionsPerPage = 20) {
        let cursor;
        try {
            cursor = await transactions.find(query).project(project).sort(sort);
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { transactionsList: [], totalNumTransactions: 0 }
        }
    
        const displayCursor = cursor.skip(transactionsPerPage*page).limit(transactionsPerPage);
    
        try {
            const transactionsList = await displayCursor.toArray();
            const totalNumTransactions = (page === 0) ? await transactions.countDocuments(query) : 0;
        
            return { transactionsList, totalNumTransactions }
        } 
        catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { transactionsList: [], totalNumTransactions: 0 }
        }
    }

    static async getTransactionByID(id) {
        try {
            const pipeline = [
                {
                    '$match': {'_id': new ObjectId(id)}
                }, 
                {
                    '$lookup': {
                        'from': 'customers', 
                        'let': {'id': '$_id'}, 
                        'pipeline': [
                            {
                                '$match': {
                                    '$expr': {
                                        '$eq': [
                                        '$transaction_id', '$$id'
                                        ]
                                    }
                                }
                            }, 
                            {
                                '$sort': {'date': -1}
                            }
                        ], 
                        'as': 'customers'
                    }
                }
            ];
    
          return await transactions.aggregate(pipeline).next();
        }
        catch (e) {
            console.error(`Something went wrong in getTransactionByID: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
        }
    }    


    static async addTransaction(customerId, user, transaction, date) {
        try {
            const transactionDoc = {
                name: user.name,
                email: user.email,
                customer_id: ObjectId(customerId),
                text: transaction,
                date: date
            };

            return await transactions.insertOne(transactionDoc);
        } 
        catch (e) {
            console.error(`Unable to post transaction: ${e}`);
            return { error: e };
        }
    }

    static async updateTransaction(transactionId, userEmail, text, date) {
        try {
            const updateResponse = await transactions.updateOne(
                { _id: ObjectId(transactionId), email: userEmail },
                { $set: { text: text, date: date } },
            );

            return updateResponse;
        } 
        catch (e) {
            console.error(`Unable to update transaction: ${e}`);
            return { error: e };
        }
    }

    static async deleteTransaction(transactionId, userEmail) {
        try {
            const deleteResponse = await transactions.deleteOne({
                _id: ObjectId(transactionId),
                email: userEmail
            });

            return deleteResponse;
        } 
        catch (e) {
            console.error(`Unable to delete transaction: ${e}`);
            return { error: e };
        }
    }

    static async mostActiveTransactioners() {
        try {
            const pipeline = [
                {
                    '$group': {
                        '_id': '$email', 
                        'count': {
                        '$sum': 1
                        }
                    }
                },
                {
                    '$sort': {
                        'count': -1
                    }
                }, 
                {
                    '$limit': 20
                }
            ];

            const readConcern = "majority";

            const aggregateResult = await transactions.aggregate(pipeline, {
                readConcern,
            });

            return await aggregateResult.toArray();
        } 
        catch (e) {
            console.error(`Unable to retrieve most active transactioners: ${e}`);
            return { error: e };
        }
    }
}