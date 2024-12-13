import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {SocketManagerOptions, SocketStore} from "../types/socket";
import {Server, Socket} from "socket.io";

const customSocketManager: FastifyPluginAsync<SocketManagerOptions> = async (
    fastify: FastifyInstance,
    options: SocketManagerOptions
) => {
    const io = new Server(fastify.server, {
        cors: {
            origin: '*', // TODO: Change this to the client URL
            methods: ['GET', 'POST'],
        },
    });

    fastify.log.info(`WebSocket disponible sur le chemin : ${fastify.server.address()}`);

    const socketStore: SocketStore = new Map()

    //TODO: Je n'arrive pas a recevoir les event de connexion sur postma

    io.on('connection', (socket) => {
        const cookies = socket.handshake.headers.cookie;

        if (!cookies) {
            fastify.log.warn('Connexion refusée : Aucun cookie fourni');

            socket.emit("hello", "world");
            fastify.log.info('Événement CookieNotFound émis');
            setTimeout(() => {
                fastify.log.info('Déconnexion du socket');
                socket.disconnect();
            }, 100);
        }
        socket.on('error', (err) => {
            console.error('Erreur côté serveur:', err);
        });

        socket.on('disconnect', (reason) => {
            console.log('Déconnexion du socket:', reason);
        });
    });

    //
    // io.on('connection', async (socket: Socket) => {
    //
    //     const cookies = socket.handshake.headers.cookie;
    //
    //     if (!cookies) {
    //         fastify.log.warn('Connexion refusée : Aucun cookie fourni');
    //
    //         // Émettre un événement personnalisé avant la déconnexion
    //         socket.emit('CookieNotFound', {
    //             error: 'No cookies found',
    //         });
    //         fastify.log.info('Événement CookieNotFound émis');
    //         setTimeout(() => {
    //             fastify.log.info('Déconnexion du socket');
    //             socket.disconnect();
    //         }, 100);
    //
    //         return;
    //     }
    // });


    fastify.decorate('io', io);

};

export default fp(customSocketManager, {
    name: 'customSocketManager',
    dependencies: []
});
