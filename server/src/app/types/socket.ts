import {Server, Socket} from "socket.io";

export interface SocketManagerOptions {
    secret: string,
}

export type SocketStore = Map<string, {
    userID: string,
    socket: Socket,
}>;

export enum NotificationType {
    like = 'Like',
    unLike = 'UnLike',
    view = 'View',
    connected = 'Connected',
    unConnected = 'UnConnected',
    requestMatch = 'RequestMatch',
}

export enum SocketEvent {
    cookieNotFound = 'CookieNotFound',
    tokenNotFound = 'TokenNotFound',
    userNotFound = 'UserNotFound',
    userConnected = 'UserConnected',
    notificationCreate = 'NotificationCreate',
    messageCreate = 'MessageCreate',
    messageRead = 'MessageRead',
}

export interface SocketData {
    event: SocketEvent;
    data: any;
}


declare module 'fastify' {
    interface FastifyInstance {
        io: Server<Record<string, any>>;
        userOnline: (userId: string) => boolean;
        sendSocket: (userId: string, data: SocketData) => void;
        sendsSocket: (userIds: string[], data: SocketData) => void;
    }
}