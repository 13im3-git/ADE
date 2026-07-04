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
| Hosting | Railway (Docker) |

## Architecture

```
                          ┌─────────────────────────────────┐
                          │          Railway Cloud           │
                          │  ┌──────────────────────────┐    │
                          │  │  VSP Dashboard (Express) │    │
                          │  │  Port: 3000              │    │
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
- A cloud VM (Railway worker) with exposed ports

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
2. Set **ID Server**: `<your-railway-domain>:3000`
3. Set **Relay Server**: `<your-railway-domain>:3000`
4. Set **Key**: leave blank (or set if using key-based encryption)
5. Enable **"Encrypted Only"**

## Deploy to Railway

1. Push this `vsp/` folder to a GitHub repository
2. In Railway, create a new **Service** → select your repo
3. Set the **Service Root** to `vsp/` so Railway uses the config inside this directory
4. Railway will detect `railway.json` automatically (Dockerfile build)
5. Add environment variables:
   - `TS_AUTHKEY`: your Tailscale auth key
   - `TAILSCALE_API_KEY`: your Tailscale API key
6. Deploy. VSP will be available at `https://<service>.railway.app`

If Railway does not auto-detect, manually set:
- **Builder**: Dockerfile
- **Dockerfile Path**: `vsp/Dockerfile`
- **Start Command**: `node dist/index.js`

## Ports Used

| Service | Port | Protocol |
|---------|------|----------|
| RustDesk hbbs | 21115, 21116 | TCP/UDP |
| RustDesk hbbr | 21117, 21119 | TCP |
| Tailscale | 41641 | UDP |
| VSP Dashboard | 3000 | TCP |

## Project Structure

```
vsp/
├── docker-compose.yml        # Tailscale + RustDesk stack
├── Dockerfile                # Production Docker image
├── railway.json              # Railway deployment config
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
