# VSP - Visual Service Panel

Self-hosted web dashboard for managing remote device connections via Tailscale, RustDesk, and Docker.

## Stack

| Layer | Technology |
|-------|-----------|
| Orchestration | Docker Compose |
| Mesh VPN | Tailscale |
| Remote Desktop | RustDesk (hbbs + hbr) |
| Dashboard API | Express / TypeScript |
| Dashboard UI | React + Vite |
| Hosting | Render (Docker) |

## Architecture

```
                         ┌─────────────────────────────────┐
                         │           Render Cloud           │
                         │  ┌──────────────────────────┐    │
                         │  │  VSP Dashboard (Express) │    │
                         │  │  Port: 10000             │    │
                         │  └──────────────────────────┘    │
                         └─────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
       ┌──────▼──────┐     ┌───────▼──────┐      ┌──────▼──────┐
       │  Tailscale  │     │  RustDesk    │      │  Devices    │
       │  Mesh VPN   │     │  hbbs + hbr  │      │  (clients)  │
       │  :41641/udp │     │  :21115-20   │      │             │
       └─────────────┘     └──────────────┘      └─────────────┘
```

## Prerequisites

- Docker + Docker Compose
- Tailscale account ([sign up](https://tailscale.com))
- Tailscale API key (Settings → Keys → Generate API key)
- A cloud VM (Render worker) with exposed ports

## Local Development

1. Clone and navigate:
   ```bash
   cd vsp
   cp .env.example .env
   ```

2. Edit `.env` with your Tailscale auth key:
   ```
   TS_AUTHKEY=tskey-auth-REPLACE_WITH_YOUR_KEY
   ```

3. Start the stack:
   ```bash
   docker compose up -d
   ```

4. Open the dashboard:
   ```bash
   docker compose exec dashboard npm run dev
   # Then open http://localhost:5173
   ```

## Environment Variables

### `docker-compose.yml`

| Variable | Default | Description |
|----------|---------|-------------|
| `TS_AUTHKEY` | _(required)_ | Tailscale auth key (from tailscale.com) |
| `TS_HOSTNAME` | `vsp-tailscale` | Tailscale device hostname |
| `RELAY_SERVER` | `hbbr:21119` | RustDesk relay endpoint |
| `ENCRYPTED_ONED` | `1` | Enable encrypted RustDesk connections |
| `PORT` | `3000` | Dashboard API port |

### `server/.env`

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `CORS_ORIGIN` | Allowed CORS origin |
| `TAILSCALE_API_KEY` | Tailscale API key (optional if using `TS_AUTHKEY` via Docker env) |

### `client/.env`

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_RUSTDESK_RELAY` | RustDesk relay server address |

## RustDesk Client Setup

On each device you want to access remotely, configure RustDesk to use your self-hosted server:

1. Open RustDesk → Settings → Network
2. Set **ID Server**: `<your-render-domain>:21115`
3. Set **Relay Server**: `<your-render-domain>:21119`
4. Set **Key**: leave blank (or set if using key-based encryption)
5. Enable **"Encrypted Only"**

## Deploy to Render

1. Push this `vsp/` folder to a GitHub repository
2. In Render, create a new **Web Service**
3. Select your repo and set:
   - **Environment**: Docker
   - **Dockerfile path**: `vsp/Dockerfile`
   - **Port**: `10000` (Render default)
4. Add environment variables:
   - `TS_AUTHKEY`: your Tailscale auth key
   - `TAILSCALE_API_KEY`: your Tailscale API key
   - `PORT`: `10000`
5. Deploy. VSP will be available at `https://vsp-dashboard.onrender.com`

## Ports Used

| Service | Port | Protocol |
|---------|------|----------|
| RustDesk hbbs | 21115, 21116 | TCP/UDP |
| RustDesk hbbr | 21117, 21119 | TCP |
| Tailscale | 41641 | UDP |
| VSP Dashboard | 3000 / 10000 | TCP |

## Project Structure

```
vsp/
├── docker-compose.yml        # Tailscale + RustDesk stack
├── Dockerfile                # Production Docker image
├── render.yaml               # Render deployment config
├── package.json              # Root scripts
├── server/
│   ├── src/
│   │   ├── index.ts          # Express entry
│   │   └── routes/
│   │       ├── devices.ts    # Tailscale device proxy
│   │       ├── connections.ts # Device pair management
│   │       └── health.ts      # Health check
│   └── package.json
├── client/
│   ├── src/
│   │   ├── main.tsx          # React entry
│   │   ├── App.tsx           # Main shell (tabs + layout)
│   │   ├── api/              # Fetch clients
│   │   ├── types/            # TypeScript interfaces
│   │   └── pages/
│   │       ├── DeviceList.tsx# Tailscale device grid
│   │       ├── ConnectionPanel.tsx # Select & connect pairs
│   │       └── RemoteDesktop.tsx   # Remote session panel
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── .env.example
```
