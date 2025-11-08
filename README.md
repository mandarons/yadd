# YADD - Yet Another Dashboard (Dockerized)

[![Main - Test, Coverage and Deploy](https://github.com/mandarons/yadd/actions/workflows/ci-main-test-coverege-deploy.yml/badge.svg?branch=main)](https://github.com/mandarons/yadd/actions/workflows/ci-main-test-coverege-deploy.yml)
[![Docker](https://badgen.net/docker/pulls/mandarons/yadd)](https://hub.docker.com/r/mandarons/yadd)
[![Discord](https://img.shields.io/discord/871555550444408883?style=for-the-badge)](https://discord.gg/HfAXY2ykhp)

:love*you_gesture: \*\*\_Please star this repository if you end up using the container. It will help me continue supporting this product.*\*\* :pray:

## Introduction

A minimalistic dashboard for all the services that you use and love. Built with SvelteKit, it monitors if your services are up or down and provides URL shortening for quick navigation.

## Key Features

- Dashboard for the services you want to track
- Automatic health check (shown as background green for success, red for failure)
- URL shortening for quick navigation - no need to open the dashboard page and then click to navigate
- Tracks when the service was online before failure
- Easy to backup and restore (all data is in a SQLite database via Prisma)
- Modern UI built with TailwindCSS and Skeleton UI components
- Responsive design for mobile and desktop

## Technology Stack

- **SvelteKit** - Modern web framework
- **TailwindCSS** - Utility-first CSS framework
- **Skeleton UI** - UI component library
- **Prisma** - Type-safe database ORM
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing

## Screenshot

### Sample dashboard

![services screenshot](https://user-images.githubusercontent.com/50469173/128587087-3c90744c-d820-4de9-bf0c-e74e04d356c1.png)

## Installation

### Using Docker

1. Install Docker (if you haven't already)
2. Create `yadd` deployment folder and use it as `cwd`
3. Run `docker container run --name yadd -p 3334:3334 -v ${PWD}/data:/app/data mandarons/yadd`
4. Navigate to `http://localhost:3334` and start adding services!

### Using Docker Compose

```yaml
yadd:
  image: mandarons/yadd
  container_name: yadd
  restart: unless-stopped
  ports:
    - '3334:3334'
  volumes:
    - ./data:/app/data
  environment:
    - DATABASE_URL=file:/app/data/yadd.db
```

## Development

Once you've cloned the repository and installed dependencies with `yarn install`, start a development server:

```bash
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

## Building

To create a production version of the app:

```bash
yarn build
```

You can preview the production build with `yarn preview`.

## Testing

Run unit tests:

```bash
yarn test:unit
```

Run end-to-end tests:

```bash
yarn test:integration
```

Run all tests:

```bash
yarn test
```

## User Guide

### Adding a new service

`NAME`: User friendly name of the service e.g. `Amazon`

`URL`: Complete URL of the service e.g. `https://amazon.com`

`SHORT NAME`: Unique, short name to be used as short URL e.g. `amazon`

`LOGO URL`: Relative path to icon to be used e.g. `/icons/amazon.png`. [Full list of available icons](https://github.com/mandarons/yadd/tree/main/static/icons)

Click on `CREATE SERVICE`

### Navigating to an existing service using short name

Simply navigate to `http://localhost:3334/amazon` (from example above) and it will take you to `https://amazon.com` (the service URL).

You may also click on service icon to navigate to the service URL.

### Checking the online status of an existing service

After adding a new service for first few seconds, the service background will be red. If the service is online, it should turn green and stay green. The dashboard automatically refreshes every 5 seconds to update service status.

### Editing an existing service

Simply click on `pencil` icon on the service card, make changes and click `UPDATE`.

### Deleting an existing service

Simply click on `pencil` icon on the service card that you want to delete and click `DELETE`.

### Recommended Setup (using `NGINX` at root)

Most common use case is repurpose existing system/VM to serve `yadd` from root using `NGINX`. Here is a sample configuration for NGINX (assuming `yadd` service is running on port `3334`).

```nginx
server {
	listen 80;
	server_name goto;

	location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://localhost:3334/;
    }
}
```

If you host a DNS server, you can add entry to resolve `http://goto` to above server. If not, you can update `/etc/hosts` on Linux/Mac, `C:\Windows\System32\drivers\etc\hosts` with the following entry:

```ini
# Resolve http://goto to IP address of above server which is serving YADD from its root
<ip_of_above_server> goto
```

## License

MIT License - See LICENSE file for details

## Support

- [Discord Community](https://discord.gg/HfAXY2ykhp)
- [GitHub Issues](https://github.com/mandarons/yadd/issues)
