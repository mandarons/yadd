# YADD - Yet Another Dashboard (Dockerized)

[![Main - Test, Coverage and Deploy](https://github.com/mandarons/yadd/actions/workflows/ci-main-test-coverege-deploy.yml/badge.svg?branch=main)](https://github.com/mandarons/yadd/actions/workflows/ci-main-test-coverege-deploy.yml)
[![Tests](https://mandarons.github.io/yadd/badges/tests.svg)](https://mandarons.github.io/yadd/test-results/)
[![Coverage](https://mandarons.github.io/yadd/badges/coverage.svg)](https://mandarons.github.io/yadd/test-coverage/index.html)
[![Docker](https://badgen.net/docker/pulls/mandarons/yadd)](https://hub.docker.com/r/mandarons/yadd)
[![Discord](https://img.shields.io/discord/871555550444408883?style=for-the-badge)](https://discord.gg/HfAXY2ykhp)

:love_you_gesture: ***Please star this repository if you end up using the container. It will help me continue supporting this product.*** :pray:

## Introduction

A minimalistic dashboard for all the services that you use and love. It also monitors if the service is up or not, provides url-shortening service etc.

## Key Features
* Dashboard for the services you want to track
* Automatic health check (shown as background green for success, red for failure)
* URL shortening for quick navigation - no need to open the dashboard page and then click to navigate
* Tracks when the service was online before failure
* Tracks number of hits (Work in progress ...)
* Easy to backup and restore (all data is in `db.sqlite` file and configuration is in `config.yaml` file)
* Configuration through YAML file
* Single user authentication (optional)

## Screenshot
### Sample dashboard
![services screenshot](https://user-images.githubusercontent.com/50469173/128587087-3c90744c-d820-4de9-bf0c-e74e04d356c1.png)
### Optional authentication - can be enabled in `config.yaml` file ([details below](https://github.com/mandarons/yadd#configuration-file))
![authentication screenshot](https://user-images.githubusercontent.com/50469173/130120350-180e8c67-d0cb-4407-b8f7-f9ff98980de8.png)


## Installation
1. Install Docker (if you haven't already)
2. Create `yadd` deployment folder and use it as `cwd`
3. Run `docker container run --name yadd -p 3334:3334 -v ${PWD}/config/:/app/config/ mandarons/yadd`
4. Navigate to `http://localhost:3334` to and start adding services!

## User Guide

### Adding a new service
   
   `NAME`: User friendly name of the service e.g. `Amazon`

   `URL`: Complete URL of the service e.g. `https://amazon.com`  
   
   `SHORT NAME`: Unique, short name to be used as short URL e.g. `amazon`
   
   `LOGO URL`: Relative path to icon to be used e.g. `/icons/amazon.png`. [Full list of available icons](https://github.com/mandarons/yadd/tree/main/clients/web/public/icons)
   
   Click on `CREATE SERVICE`

### Navigating to an existing service using short name

Simply navigate to `http://localhost:3334/amazon` (from example above) and it will take you to `https://amazon.com` (the service URL).

You may also click on service icon to navigate to the service URL.

### Checking the online status of an existing service

After adding a new service for first few seconds, the service background will be red. If the service is online, it should turn green and stay green.

### Editing an existing service

Simply click on `pencil` icon on the service card, make changes and click `SAVE CHANGES`.

### Deleting an existing service

Simply click on `pencil` icon on the service card that you want to delete and click `DELETE SERVICE`.

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
#### Sample `docker-compose.yaml` entry 

```yaml
yadd:
    image: mandarons/yadd
    container_name: yadd
    restart: unless-stopped
    environment:
      - PGID=1000
      - PUID=1000
    ports:
      - 3334:3334
    volumes:
      - ${PWD}/yadd/:/app/config/
    healthcheck:
      test: wget --quiet --tries=1 --spider http://localhost:3334/ || exit 1
      interval: 10s
      timeout: 10s
      retries: 3
      start_period: 30s
```

### Configuration File
Configuration file `config.yaml` is located in the `config` folder. Default configuration file looks like below:
```yaml
server:
  # Container port on which server to run
  port: 3334
  # `token` to expire after when authentication is enabled 
  authTokenExpiration: 7d
  # Interval for checking if the service is reachable or not
  statusCheckRefreshInterval: "5 * * * * *" # 5 seconds
  # Authentication
  auth:
    # If authentication is to be enabled -  container must be restarted if this value is changed
    enable: false
    # password - set this to something complex
    adminPassword: "admin"
    # Unused (TODO: use it instead of `authTokenExpiration` above
    tokenExpiration: "7d" # 7 days
    # Secret key - must be set to something long and random string
    secretKey: "some-random-long-string"
```
