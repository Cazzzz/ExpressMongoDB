import { ObjectId } from 'bson';

let customers;
let mflix;
const DEFAULT_SORT = [["tomatoes.viewer.numReviews", -1]]

class CustomersDAO {
    static async injectDB(conn) {
        if (customers) {
            return
        }
        try {
            mflix = await conn.db(process.env.DB_NAME);
            customers = await mflix.collection("customers");
        } 
        catch (e) {
            console.error(`Unable to establish a collection handle in customersDAO: ${e}`);
        }
    }

    static async getCustomers(query = {}, project = {}, sort = DEFAULT_SORT, page = 0, customersPerPage = 20) {
        let cursor;
        try {
            cursor = await customers.find(query).project(project).sort(sort);
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { customersList: [], totalNumCustomers: 0 }
        }
    
        const displayCursor = cursor.skip(customersPerPage*page).limit(customersPerPage);
    
        try {
            const customersList = await displayCursor.toArray();
            const totalNumCustomers = (page === 0) ? await customers.countDocuments(query) : 0;
        
            return { customersList, totalNumCustomers }
        } 
        catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { customersList: [], totalNumCustomers: 0 }
        }
    }

    static async getCustomerByID(id) {
        try {
            const pipeline = [
                {
                    '$match': {'_id': new ObjectId(id)}
                }, 
                {
                    '$lookup': {
                        'from': 'transactions', 
                        'let': {'id': '$accounts'}, 
                        'pipeline': [
                            {
                                '$match': {
                                    '$expr': {
                                        '$eq': [
                                        '$customer_id', '$$id'
                                        ]
                                    }
                                }
                            }, 
                            {
                                '$sort': {'date': -1}
                            }
                        ], 
                        'as': 'transactions'
                    }
                }
            ];
    
          return await customers.aggregate(pipeline).next();
        }
        catch (e) {
            console.error(`Something went wrong in getCustomerByID: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
        }
    }    

    static async addCustomer(customerDoc) {
        try {
            return await customers.insertOne(customerDoc);
        } 
        catch (e) {
            console.error(`Unable to post customer: ${e}`);
            return { error: e };
        }
    }
};

export default CustomersDAO;