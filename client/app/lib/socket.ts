import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_API_URL, {
    autoConnect: false,
    withCredentials: true,
    path: "/api/ws",
});

const onConnect = () => {
    console.log("Connected to socket.io server");
};

const onDisconnect = () => {
    console.log("Disconnected from socket.io server");
};

const onError = (error: Error) => {
    console.error("Socket.io error", error);
};

const catchAll = (eventName: string, args: any[]) => {
    // console.log("CATCH_ALL EVENTS: ", eventName, "\n", args);
};

export const setup = () => {
    socket.connect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);

    socket.onAny(catchAll);
};

export const cleanUp = () => {
    socket.removeAllListeners();

    socket.disconnect();
};
