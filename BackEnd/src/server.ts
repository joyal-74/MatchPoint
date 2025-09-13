import { MongoConnection } from "@infra/persistence/database/mongo"; 
import app from "./app";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await MongoConnection.connect();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();