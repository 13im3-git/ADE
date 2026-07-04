import { useEffect, useState } from "react";
import type { Device } from "../types";

export interface DeviceListProps {
  devices: Device[];
  loading: boolean;
  onSelect: (d: Device) => void;
  selected: Device | null;
}

function getStatusColor(online?: boolean): string {
  if (online) return "bg-[#22c55e]";
  return "bg-[#ef4444]";
}

function getOsIcon(os?: string): string {
  if (!os) return "💻";
  const o = os.toLowerCase();
  if (o.includes("linux")) return "🐧";
  if (o.includes("mac") || o.includes("darwin")) return "🍎";
  if (o.includes("windows")) return "🪟";
  if (o.includes("android")) return "🤖";
  if (o.includes("iphone") || o.includes("ios")) return "📱";
  return "💻";
}

function formatLastSeen(iso?: string): string {
  if (!iso) return "never";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function DeviceList({
  devices,
  loading,
  onSelect,
  selected,
}: DeviceListProps) {
  const [search, setSearch] = useState("");

  const filtered = devices.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38bdf8]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tailscale Devices</h2>
        <input
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-1.5 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#64748b]">
          {devices.length === 0
            ? "No devices found. Add devices to your Tailscale tailnet."
            : "No devices match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((device) => {
            const isSelected = selected?.id === device.id;
            return (
              <button
                key={device.id}
                onClick={() => onSelect(device)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "border-[#38bdf8] bg-[#38bdf8]/10"
                    : "border-[#334155] bg-[#1e293b] hover:border-[#38bdf8]"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getOsIcon(device.os)}</span>
                    <span className="font-medium text-sm truncate max-w-[180px]">
                      {device.name}
                    </span>
                  </div>
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColor(device.online)}`}
                    title={device.online ? "online" : "offline"}
                  ></span>
                </div>
                <div className="text-xs text-[#64748b] space-y-1">
                  {device.os && (
                    <div className="truncate">OS: {device.os}</div>
                  )}
                  {device.tailnetIps && device.tailnetIps.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {device.tailnetIps.map((ip) => (
                        <span
                          key={ip}
                          className="font-mono bg-[#0f172a] px-1.5 py-0.5 rounded"
                        >
                          {ip}
                        </span>
                      ))}
                    </div>
                  )}
                  <div>Last seen: {formatLastSeen(device.lastSeen)}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
