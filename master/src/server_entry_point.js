const Hapi = require("@hapi/hapi");
const routes = require("./server_routes");
const process = require("process");

console.log(process.env.NODE_ENV);

const init = async () => {

    const server = Hapi.server({
        host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
        port: 9000,
        routes: {
            cors: {
                origin: ["*"]
            },
        },
    });

    server.route(routes);
    await server.start();

    console.log(`Server is running at ${server.info.uri}`);

};

init();