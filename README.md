# YADD - Yet Another Dashboard

[![Main - Test, Coverage and Deploy](https://github.com/mandarons/yadd/actions/workflows/ci-main-test-coverege-deploy.yml/badge.svg?branch=main)](https://github.com/mandarons/yadd/actions/workflows/ci-main-test-coverege-deploy.yml)
[![Tests](https://mandarons.github.io/yadd/badges/tests.svg)](https://mandarons.github.io/yadd/test-results/)
[![Coverage](https://mandarons.github.io/yadd/badges/coverage.svg)](https://mandarons.github.io/yadd/test-coverage/index.html)
[![Docker](https://badgen.net/docker/pulls/mandarons/yadd)](https://hub.docker.com/r/mandarons/yadd)

## Introduction

A minimalistic dashboard for all the services that you use and love. It also monitors if the service is up or not, provides url-shortening service etc.

## Key Features
* Dashboard for the services you want to track
* Automatic health check (shown as background green for success, red for failure)
* URL shortening for quick navigation - no need to open the dashboard page and then click to navigate
* Tracks when the service was online before failure
* Tracks number of hits (Work in progress ...)
* Easy to backup and restore (all data is in `db.sqlite` file)
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

### Checking the online status of an existing service

After adding a new service for first few seconds, the service background will be red. If the service is online, it should turn green and stay green.

### Editing an existing service

Simply click on `pencil` icon on the service card, make changes and click `SAVE CHANGES`.

### Deleting an existing service

Simply click on `pencil` icon on the service card that you want to delete and click `DELETE SERVICE`.

### Recommended Setup (using `NGINX` and `docker compose`)

TODO