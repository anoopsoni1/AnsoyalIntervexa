import { app } from "./app.js";
import { connectRecruiterDB } from "./config/db.js";
import { ENV } from "./config/env.js";

async function startServer() {
  await connectRecruiterDB();

  const server = app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`  ANSOYAL AI — RECRUITER PLATFORM BACKEND           `);
    console.log(`  Running on: http://localhost:${ENV.PORT}          `);
    console.log(`  Target Student API: ${ENV.STUDENT_API_URL}        `);
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
