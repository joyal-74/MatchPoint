import http from "http";
import { MongoConnection } from "./infra/databases/mongo/Mongo.config.js";
import app from "./app.js";
import { initSocket } from "./presentation/socket/socketConfig.js";
import { startCronJobs } from "./infra/cron/initCronJobs.js";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {
    await MongoConnection.connect();

    startCronJobs();
    console.log("Background jobs started");

    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();