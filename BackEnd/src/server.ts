import { MongoConnection } from "infra/databases/mongo/Mongo.config"; 
import app from "./app";
// import { deleteUnverifiedUsersCron } from "@infra/cron/deleteUnverifiedUsersCron";

const PORT = process.env.PORT || 3000;

// deleteUnverifiedUsersCron();

const startServer = async () => {
    await MongoConnection.connect();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();