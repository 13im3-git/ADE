import type { DevicesResponse, Device } from "../types";

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : "";

function resolveDevices(data: DevicesResponse | Device[]): Device[] {
  if (Array.isArray(data)) return data;
  return data.devices ?? [];
}

export async function fetchDevices(): Promise<Device[]> {
  const res = await fetch(`${API_BASE}/devices`);
  if (!res.ok) throw new Error("Failed to fetch devices");
  const data = (await res.json()) as DevicesResponse | Device[];
  return resolveDevices(data);
}

export async function fetchConnections() {
  const res = await fetch(`${API_BASE}/connections`);
  if (!res.ok) throw new Error("Failed to fetch connections");
  return res.json();
}

export async function createConnection(sourceId: string, targetId: string) {
  const res = await fetch(`${API_BASE}/connections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sourceId, targetId }),
  });
  if (!res.ok) throw new Error("Failed to create connection");
  return res.json();
}

export function getRustDeskRelayUrl(): string {
  const relay = import.meta.env.VITE_RUSTDESK_RELAY || "hbbr:21119";
  return relay;
}
