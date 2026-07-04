import { Router } from "express";
import axios from "node-fetch";

const router = Router();

function getTailscaleApiKey(): string {
  const key = process.env.TS_API_KEY || process.env.TAILSCALE_API_KEY;
  if (!key) throw new Error("TAILSCALE_API_KEY not configured");
  return key;
}

async function tailscaleRequest(endpoint: string): Promise<any> {
  const key = getTailscaleApiKey();
  const tailnet = process.env.TS_TAILNET || "";
  const url = `https://api.tailscale.com/api/v2/${tailnet ? `tailnet/${tailnet}/` : ""}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Tailscale API error ${res.status}: ${body}`);
  }
  return res.json();
}

router.get("/", async (_req: express.Request, res: express.Response) => {
  try {
    const devices = await tailscaleRequest("devices");
    res.json(devices);
  } catch (err: any) {
    res.status(500).json({ error: err.message, devices: [] });
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const device = await tailscaleRequest(`devices/${req.params.id}`);
    res.json(device);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
