import http from "http";
import { MongoConnection } from "infra/databases/mongo/Mongo.config";
import app from "./app";
import { initSocket } from "infra/websocket/socket";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {
    await MongoConnection.connect();

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();