# Matcha

This is the Matcha project for Ecole 42. Made by [@nyzss](https://github.com/nyzss) and [@thomasbarret](https://github.com/thomasbarret).

## Tech Stack

-   **Frontend**: React, React-Router v7, Mantine
-   **Backend**: Fastify, Socket.IO

## Pre-requisites

To run this project locally, you need to install the [Caddy web server](https://caddyserver.com/docs/) for HTTPS support. It is available on package managers for all platforms.

We might add a Dockerfile in the future to make it easier to run the project locally.

## Development

To start the development servers, run the following command:

```sh
bash ./run.sh
```

To access the locally running site, navigate to:

-   **Frontend**: [https://localhost](https://localhost)
-   **Backend API**: [https://localhost/api](https://localhost/api)
    -   **WebSocket (socket.io) Endpoint**: [https://localhost/api/ws](https://localhost/api/ws)

The Caddy web server will handle proxying:

-   All frontend requests are proxied to `https://localhost/`
-   All backend API requests are proxied to `https://localhost/api`
