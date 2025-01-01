import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {SocketData, SocketEvent, SocketManagerOptions, SocketStore} from "../types/socket";
import {Server, Socket} from "socket.io";
import {AuthService} from "../services/authService";
import {UserService} from "../services/userService";

const customSocketManager: FastifyPluginAsync<SocketManagerOptions> = async (
    fastify: FastifyInstance,
    options: SocketManagerOptions
) => {

    const authService = new AuthService(fastify);
    const userService = new UserService(fastify);

    const users: SocketStore = new Map();

    const userOnline = (userId: string) => {
        return [...users.values()].some((user) => user.userID === userId);
    }

    const sendSocket = async (userId: string, data: SocketData): Promise<void> => {
        fastify.io.to(userId).emit(data.event, data.data)
    };

    const sendsSocket = (userIds: string[], data: SocketData) => {
        userIds.forEach((userId) => {
            fastify.io.to(userId).emit(data.event, data.data);
        });
    }


    fastify.decorate('userOnline', userOnline);
    fastify.decorate('sendSocket', sendSocket);
    fastify.decorate('sendsSocket', sendsSocket);

    fastify.ready().then(async () => {
        fastify.io.on('connection', async (socket: Socket) => {
            try {
                const cookies = socket.handshake.headers.cookie;

                if (!cookies) {
                    socket.emit(SocketEvent.cookieNotFound, {
                        error: 'No cookies found',
                    });

                    socket.disconnect();
                }

                const accessToken = cookies?.split(';').find((cookie: string) => cookie.includes('accessToken'))?.split('=')[1];
                const refreshToken = cookies?.split(';').find((cookie: string) => cookie.includes('refreshToken'))?.split('=')[1];

                if (!accessToken || !refreshToken) {
                    socket.emit(SocketEvent.tokenNotFound, {
                        error: 'No access token or refresh token found',
                    });

                    socket.disconnect();
                }


                const token = await authService.verifyToken(accessToken as string);

                const user = await userService.getUserById(token?.id);

                if (!user) {
                    socket.emit(SocketEvent.userNotFound, {
                        error: 'User not found',
                    });
                }
                socket.emit(SocketEvent.userConnected, {user})

                socket.join(user.id.toString());
                users.set(socket.id, {
                    userID: user.id.toString(),
                    socket,
                });

                socket.on("disconnect", async () => {
                    //set last connection data profile

                    await fastify.orm.query(
                        `UPDATE profiles SET last_connection = NOW() WHERE user_id = $1`,
                        [user.id]
                    )




                    users.delete(socket.id);
                });
            } catch (error: Error | any) {
                socket.emit(SocketEvent.tokenNotFound, {
                    error: error?.message,
                });
                socket.disconnect();
            }
        });
    });


};

export default fp(customSocketManager, {
    name: 'customSocketManager',
    dependencies: []
});
