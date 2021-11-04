import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

dotenv.config();

const port = process.env.PORT;
const dbUri = process.env.DB_URI;
const client = new MongoClient(dbUri);

try {
    
    const accountdb = await client.db(process.env.DB_NAME);
    const accounts = await accountdb.collection("accounts");

    const pipeline = [
            {
              '$match': {
                'account_id': id
              }
            }
             
        // {
        //     '$lookup': {
        //         'from': 'transactions', 
        //         'let': {'id': '$account_id'}, 
        //         'pipeline': [
        //             {
        //                 '$match': {
        //                     '$expr': {
        //                         '$eq': [
        //                         '$account_id', '$$id'
        //                         ]
        //                     }
        //                 }
        //             }, 
        //             {
        //                 '$sort': {'bucket_end_date': -1}
        //             }
        //         ], 
        //         'as': 'transactions'
        //     }
        // }
    ];


//   return await accounts.findOne({"account_id": id});
//   return await accounts.aggregate(pipeline).next();

}
catch (e) {
    console.error(`Something went wrong in getAccountByID: ${e}`);
    console.error(`e log: ${e.toString()}`);
    return null;
}