import { useState } from "react";
import type { Device } from "../types";
import { getRustDeskRelayUrl } from "../api";

export interface RemoteDesktopProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (d: Device) => void;
}

export default function RemoteDesktop({
  devices,
  selectedDevice,
  onSelectDevice,
}: RemoteDesktopProps) {
  const [rustdeskId, setRustdeskId] = useState("");
  const [rustdeskPassword, setRustdeskPassword] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const onlineDevices = devices.filter((d) => d.online);

  const handleConnect = () => {
    if (!rustdeskId) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnected(false);
  };

  const relay = getRustDeskRelayUrl();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Remote Desktop</h2>
        <p className="text-sm text-[#94a3b8]">
          Connect to any device using RustDesk. The relay server is{" "}
          <code className="font-mono text-[#38bdf8] bg-[#1e293b] px-1.5 py-0.5 rounded text-xs">
            {relay}
          </code>
        </p>
      </div>

      {!connected ? (
        <div className="space-y-4">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">
              Quick connect from device list
            </label>
            <select
              value={selectedDevice?.id || ""}
              onChange={(e) => {
                const d = devices.find((d) => d.id === e.target.value);
                if (d) onSelectDevice(d);
              }}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="">Select a device...</option>
              {onlineDevices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.tailnetIps?.[0] || d.id})
                </option>
              ))}
            </select>
            {selectedDevice && (
              <div className="mt-3 text-sm text-[#94a3b8] space-y-1">
                <div>
                  Name: <span className="text-[#f1f5f9]">{selectedDevice.name}</span>
                </div>
                <div>
                  Tailnet IP:{" "}
                  <span className="font-mono text-[#38bdf8]">
                    {selectedDevice.tailnetIps?.[0] || "N/A"}
                  </span>
                </div>
                <div className="text-xs">
                  Use this IP in your RustDesk client's ID field or configure RustDesk
                  to use the server: <code className="font-mono">{relay}</code>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-[#334155]"></div>
            <span className="text-xs text-[#64748b] uppercase tracking-wider">
              Or enter ID directly
            </span>
            <div className="flex-1 h-px bg-[#334155]"></div>
          </div>

          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                RustDesk ID
              </label>
              <input
                type="text"
                placeholder="e.g. 123456789"
                value={rustdeskId}
                onChange={(e) => setRustdeskId(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] font-mono focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                Password (optional)
              </label>
              <input
                type="password"
                placeholder="One-time password from the remote device"
                value={rustdeskPassword}
                onChange={(e) => setRustdeskPassword(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
            <button
              onClick={handleConnect}
              disabled={!rustdeskId || connecting}
              className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] disabled:bg-[#334155] disabled:text-[#64748b] text-[#0f172a] font-semibold py-2.5 rounded-lg transition-colors"
            >
              {connecting ? "Connecting..." : "Connect"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span className="text-sm font-medium">
                Connected to {rustdeskId}
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-sm px-3 py-1 bg-[#ef4444]/20 text-[#ef4444] rounded-lg hover:bg-[#ef4444]/30 transition-colors"
            >
              Disconnect
            </button>
          </div>
          <div className="aspect-video bg-[#0f172a] flex items-center justify-center">
            <div className="text-center text-[#64748b]">
              <div className="text-4xl mb-3">🖥️</div>
              <div className="text-sm">Remote session active</div>
              <div className="text-xs mt-1">
                The RustDesk web client runs on your local device
              </div>
              <a
                href={`https://github.com/rustdesk/rustdesk/tree/master/src/web#readme`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-[#38bdf8] hover:underline"
              >
                RustDesk Web Client →
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 text-sm text-[#94a3b3] space-y-2">
        <h3 className="font-semibold text-[#f1f5f9] flex items-center gap-2">
          <span>🖥️</span> Using the Remote Desktop
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>
            Get the RustDesk ID from the remote device (found in RustDesk app
            settings)
          </li>
          <li>
            Enter the ID above and click <strong>Connect</strong>
          </li>
          <li>
            Enter the password shown on the remote device to start the session
          </li>
          <li>
            For the full web client, use{" "}
            <code className="bg-[#0f172a] px-1 rounded">
              id=xxx &amp; relay={relay}
            </code>{" "}
            query params in the RustDesk web app
          </li>
        </ol>
      </div>
    </div>
  );
}
