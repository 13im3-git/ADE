import { Router } from "express";

const router = Router();

router.get("/", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

export default router;
