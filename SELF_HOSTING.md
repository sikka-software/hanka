# Self-Hosting Hanka

## Requirements
- Docker and Docker Compose
- A GitHub account (to create an OAuth App)

## Step 1 — Create a GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: Hanka (your instance)
   - **Homepage URL**: `http://your-domain.com`
   - **Authorization callback URL**: `http://your-domain.com/auth/callback`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

## Step 2 — Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
APP_URL=http://your-domain.com
GITHUB_CLIENT_ID=paste_client_id_here
GITHUB_CLIENT_SECRET=paste_client_secret_here
NEXT_PUBLIC_GITHUB_CLIENT_ID=paste_client_id_here
COOKIE_SECRET=run_openssl_rand_-base64_32
```

## Step 3 — Run

```bash
docker compose up -d
```

Open `http://your-domain.com`

## Updating

```bash
docker compose pull && docker compose up -d
```
