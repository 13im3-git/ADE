import { Router } from "express";

const router = Router();

router.get("/", (_req: express.Request, res: express.Response) => {
  // connections are stored client-side in localStorage for now
  res.json({
    connections: [],
    note: "Connections storage not yet implemented",
  });
});

router.post("/", (req: express.Request, res: express.Response) => {
  const { sourceId, targetId } = req.body;
  if (!sourceId || !targetId || sourceId === targetId) {
    return res.status(400).json({ error: "Invalid connection" });
  }
  const conn = {
    id: crypto.randomUUID(),
    sourceId,
    targetId,
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(conn);
});

router.delete("/:id", (_req: express.Request, res: express.Response) => {
  res.json({ deleted: true });
});

export default router;
