import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import pool from "./db/db.config.js";
import { errorHandler } from "./middleware/error.js";
import apiRoutes from "./routes/index.js";
import installRoutes from "./routes/install.routes.js";

const app = express();

const allowedOrigins = new Set(
  [env.corsOrigin, "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"].filter(
    Boolean,
  ),
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
  }),
);
app.use(morgan("dev"));
app.use(express.json());

/** Dev helper — create schema + seed (see install.controller.js) */
app.use("/install", installRoutes);
app.use("/api/install", installRoutes);

/** All REST resources under /api */
app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}`, statusCode: 404 });
});

app.use(errorHandler);

async function startServer() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log(`Connected to MySQL: ${env.db.name}@${env.db.host}`);
  } catch (error) {
    console.warn("MySQL not connected. Start MySQL or run POST http://localhost:" + env.port + "/install");
    console.warn(error.message);
  }

  app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
  });
}

startServer();
