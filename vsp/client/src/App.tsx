import { useState, useEffect } from "react";
import { fetchDevices } from "./api";
import type { Device } from "./types";
import DeviceList from "./pages/DeviceList";
import ConnectionPanel from "./pages/ConnectionPanel";
import RemoteDesktop from "./pages/RemoteDesktop";

type Tab = "devices" | "connections" | "remote";

export default function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("devices");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const loadDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDevices();
      setDevices(data);
    } catch {
      setError(
        "Failed to load devices. Check Tailscale API key and Docker network."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  const onlineDevices = devices.filter((d) => d.online).length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#334155] bg-[#0f172a]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#38bdf8] tracking-tight">
              VSP
            </h1>
            <span className="text-xs text-[#94a3b8] bg-[#1e293b] px-2 py-1 rounded-full">
              Device Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#94a3b8]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
              {onlineDevices}/{devices.length} online
            </span>
            <button
              onClick={loadDevices}
              className="px-3 py-1.5 bg-[#1e293b] border border-[#334155] rounded-lg hover:border-[#38bdf8] transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-[#334155] bg-[#0f172a]">
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          {[
            { key: "devices" as Tab, label: "Devices" },
            { key: "connections" as Tab, label: "Connections" },
            { key: "remote" as Tab, label: "Remote Desktop" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-[#38bdf8] text-[#38bdf8]"
                  : "border-transparent text-[#94a3b8] hover:text-[#f1f5f9]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {error && (
          <div className="mb-4 p-4 bg-[#ef4444]/10 border border-[#ef4444] rounded-lg text-[#ef4444] text-sm">
            {error}
          </div>
        )}

        {tab === "devices" && (
          <DeviceList
            devices={devices}
            loading={loading}
            onSelect={setSelectedDevice}
            selected={selectedDevice}
          />
        )}

        {tab === "connections" && (
          <ConnectionPanel
            devices={devices}
            onConnect={(a: string, b: string) => {
              alert(
                `Open RustDesk on ${devices.find((d) => d.id === a)?.name} and connect to ${devices.find((d) => d.id === b)?.name}`
              );
            }}
          />
        )}

        {tab === "remote" && (
          <RemoteDesktop
            devices={devices}
            selectedDevice={selectedDevice}
            onSelectDevice={setSelectedDevice}
          />
        )}
      </main>
    </div>
  );
}
