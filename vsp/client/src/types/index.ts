export interface Device {
  id: string;
  name: string;
  addresses?: string[];
  tailnetIps?: string[];
  os?: string;
  lastSeen?: string;
  online?: boolean;
  tags?: string[];
}

export interface DevicesResponse {
  devices?: Device[];
  device?: Device;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  createdAt: string;
  sourceName?: string;
  targetName?: string;
}
