import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import devicesRouter from "./routes/devices.js";
import connectionsRouter from "./routes/connections.js";
import healthRouter from "./routes/health.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/devices", devicesRouter);
app.use("/api/connections", connectionsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`VSP API running on :${PORT}`);
});
