import fastify, { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { ORM } from '../types/orm';
import {RegisterForm, AuthResult, LoginForm} from "../types/auth";
import fastifyJwt, {VerifyPayloadType} from "@fastify/jwt";

export class UserService {
    private orm: ORM;
    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
    }

    async getUserById(id: number) {
        const [user] = await this.orm.query(
            `
                SELECT
                    u.id,
                    u.email,
                    p.username,
                    p.first_name,
                    p.last_name
                FROM profiles p
                         JOIN users u ON p.user_id = u.id
                WHERE u.id = $1
            `,
            [id]
        );

        if (!user)
            throw new Error('User not found');

        return user;
    }
}
