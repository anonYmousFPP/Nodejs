import Hapi from "@hapi/hapi";
import { adminRoutes, userRoutes } from "./routes/user";

import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;

const init = async () => {
    const server = Hapi.server({
        port: PORT,
        host: "localhost",
    });

    server.route(adminRoutes);
    server.route(userRoutes);

    await server.start();
    console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err: any) => {
    console.log(err);
    process.exit(1);
});

init();