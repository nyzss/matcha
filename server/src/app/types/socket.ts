import {Server, Socket} from "socket.io";

export interface SocketManagerOptions {
    secret: string,
}

export type SocketStore = Map<string, {
    userID: string,
    socket: Socket,
}>;

export enum SocketEvent {
    cookieNotFound = 'CookieNotFound',
    tokenNotFound = 'TokenNotFound',
    userNotFound = 'UserNotFound',
    userConnected = 'UserConnected',
    messageCreate = 'MessageCreate',
}

export interface SocketData {
    event: SocketEvent;
    data: any;
}


declare module 'fastify' {
    interface FastifyInstance {
        io: Server<Record<string, any>>;
        sendSocket: (userId: string, data: SocketData) => void;
        sendsSocket: (userIds: string[], data: SocketData) => void;
    }
}