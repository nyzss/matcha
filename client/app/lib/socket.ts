import { notifications } from "@mantine/notifications";
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

const catchAll = (eventName: string, args: IBaseNotification) => {
    if (args.type === "View") {
        notifications.show({
            title: "Someone viewed your profile",
            message: `${args.sender.username} viewed your profile`,
        });
    } else if (args.type === "UnConnected") {
        notifications.show({
            title: "Someone unconnected from you",
            message: `${args.sender.username} unconnected from you`,
        });
    } else if (args.type === "Connected") {
        notifications.show({
            title: "New connection",
            message: `${args.sender.username} connected with you`,
        });
    } else if (args.type === "Like") {
        notifications.show({
            title: "New like",
            message: `${args.sender.username} liked you`,
        });
    } else if (args.type === "UnLike") {
        notifications.show({
            title: "Unliked",
            message: `${args.sender.username} unliked you`,
        });
    } else if (args.type === "Message") {
        try {
            const t = args as IMessage;
            const storage = localStorage.getItem("user");
            if (!storage) return;
            const user: IProfile | null = JSON.parse(storage);
            if (user) {
                if (t.sender.id === user.id) return;
                notifications.show({
                    title: "New message",
                    message: `${t.sender.username} sent you a message`,
                });
            }
        } catch {
            console.log("Couldn't parse message");
        }
    }

    if (args.type) console.log("CATCH_ALL EVENTS: ", eventName, "\n", args);
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
