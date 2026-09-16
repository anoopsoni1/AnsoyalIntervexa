"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const db_js_1 = require("./config/db.js");
const env_js_1 = require("./config/env.js");
async function startServer() {
    await (0, db_js_1.connectRecruiterDB)();
    const server = app_js_1.app.listen(env_js_1.ENV.PORT, () => {
        console.log(`====================================================`);
        console.log(`  ANSOYAL AI — RECRUITER PLATFORM BACKEND           `);
        console.log(`  Running on: http://localhost:${env_js_1.ENV.PORT}          `);
        console.log(`  Target Student API: ${env_js_1.ENV.STUDENT_API_URL}        `);
        console.log(`====================================================`);
    });
    const shutdown = () => {
        console.log("Shutting down Recruiter Platform backend...");
        server.close(() => {
            process.exit(0);
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
startServer().catch((err) => {
    console.error("Fatal error starting recruiter server:", err);
    process.exit(1);
});
