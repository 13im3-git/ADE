import { useState } from "react";
import type { Device } from "../types";

export interface ConnectionPanelProps {
  devices: Device[];
  onConnect: (sourceId: string, targetId: string) => void;
}

export default function ConnectionPanel({ devices, onConnect }: ConnectionPanelProps) {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [pending, setPending] = useState(false);

  const onlineDevices = devices.filter((d) => d.online);

  const handleConnect = async () => {
    if (!sourceId || !targetId) return;
    setPending(true);
    try {
      await onConnect(sourceId, targetId);
      alert(
        `Connect from ${devices.find((d) => d.id === sourceId)?.name} to ${devices.find((d) => d.id === targetId)?.name}`
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Create Remote Connection</h2>
        <p className="text-sm text-[#94a3b8] mb-6">
          Select source and target devices to establish a RustDesk connection.
          The devices must be in your Tailscale tailnet and running RustDesk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
          <label className="block text-sm font-medium text-[#94a3b8] mb-2">
            Source Device
          </label>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
          >
            <option value="">Select a device...</option>
            {onlineDevices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.tailnetIps?.[0] || d.id})
              </option>
            ))}
          </select>
          {sourceId && (
            <div className="mt-2 text-xs text-[#64748b]">
              {devices.find((d) => d.id === sourceId)?.name}
            </div>
          )}
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
          <label className="block text-sm font-medium text-[#94a3b8] mb-2">
            Target Device
          </label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
          >
            <option value="">Select a device...</option>
            {onlineDevices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.tailnetIps?.[0] || d.id})
              </option>
            ))}
          </select>
          {targetId && (
            <div className="mt-2 text-xs text-[#64748b]">
              {devices.find((d) => d.id === targetId)?.name}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleConnect}
        disabled={!sourceId || !targetId || sourceId === targetId || pending}
        className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] disabled:bg-[#334155] disabled:text-[#64748b] text-[#0f172a] font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        {pending ? "Connecting..." : "Connect Devices"}
      </button>

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 text-sm text-[#94a3b8]">
        <h3 className="font-semibold text-[#f1f5f9] mb-2">How it works</h3>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>Ensure both devices have RustDesk installed and point hbbs to your self-hosted server</li>
          <li>Both devices must be in your Tailscale tailnet (online in the Devices tab)</li>
          <li>Get the RustDesk ID from each device and use the Remote Desktop tab to connect</li>
        </ol>
      </div>
    </div>
  );
}
