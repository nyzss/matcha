import {Socket} from "socket.io";

export interface SocketManagerOptions {
    secret: string,
}

export type SocketStore = Map<string, Socket>;

export enum SocketEvent {
    CookieNotFound,



    messageCreate,
}

export interface SocketData {
    event: SocketEvent;
    data: any;
}


declare module 'fastify' {
    interface FastifyInstance {
        io: Server;
        socketStore: SocketStore;
        sendSocket: (userId: string, data: SocketData) => boolean;
    }
}