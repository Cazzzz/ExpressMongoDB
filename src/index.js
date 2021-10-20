import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

import app from "./server.js";
import MoviesDAO from "./dao/movies.dao.js";
import UsersDAO from "./dao/users.dao.js";
import CommentsDAO from "./dao/comments.dao.js";

dotenv.config();

const port = process.env.PORT;
const dbUri = process.env.DB_URI;
const client = new MongoClient(dbUri);

try {
    await client.connect();
    await MoviesDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    await CommentsDAO.injectDB(client);

    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });
}
catch(err) {
    console.error(err.stack);
    process.exit(1);
}
