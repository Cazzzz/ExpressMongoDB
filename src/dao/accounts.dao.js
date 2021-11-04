import { ObjectId } from 'bson';

let accounts;
let accountdb;
const DEFAULT_SORT = [["tomatoes.viewer.numReviews", -1]]

class AccountsDAO {
    static async injectDB(conn) {
        if (accounts) {
            return
        }
        try {
            accountdb = await conn.db(process.env.DB_NAME);
            accounts = await accountdb.collection("accounts");
        } 
        catch (e) {
            console.error(`Unable to establish a collection handle in accountsDAO: ${e}`);
        }
    }

    static async getAccounts(query = {}, project = {}, sort = DEFAULT_SORT, page = 0, accountsPerPage = 20) {
        let cursor;
        try {
            cursor = await accounts.find(query).project(project).sort(sort);
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { accountsList: [], totalNumAccounts: 0 }
        }
    
        const displayCursor = cursor.skip(accountsPerPage*page).limit(accountsPerPage);
    
        try {
            const accountsList = await displayCursor.toArray();
            const totalNumAccounts = (page === 0) ? await accounts.countDocuments(query) : 0;
        
            return { accountsList, totalNumAccounts }
        } 
        catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { accountsList: [], totalNumAccounts: 0 }
        }
    }

    static async getAccountByID(id) {
        try {
            const pipeline = [
                    {
                      '$match': {
                        'account_id': id
                      }
                    },
                {
                    '$lookup': {
                        'from': 'transactions', 
                        'let': {'id': '$account_id'}, 
                        'pipeline': [
                            {
                                '$match': {
                                    '$expr': {
                                        '$eq': [
                                        '$account_id', '$$id'
                                        ]
                                    }
                                }
                            }, 
                            {
                                '$sort': {'bucket_end_date': -1}
                            }
                        ], 
                        'as': 'transactions'
                    }
                }
            ];

    
        //   return await accounts.findOne({"account_id": id});
          return await accounts.aggregate(pipeline).next();

        }
        catch (e) {
            console.error(`Something went wrong in getAccountByID: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
        }
    }    

    static async addAccount(accountDoc) {
        try {
            return await accounts.insertOne(accountDoc);
        } 
        catch (e) {
            console.error(`Unable to post account: ${e}`);
            return { error: e };
        }
    }
};

export default AccountsDAO;