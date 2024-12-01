import fastify, { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { ORM } from '../types/orm';
import {RegisterForm, AuthResult, LoginForm} from "../types/auth";
import fastifyJwt, {VerifyPayloadType} from "@fastify/jwt";
import {userProfile} from "../types/user";

export class UserService {
    private orm: ORM;
    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
    }

    async getUserById(id: number): Promise<userProfile> {
        const [user] = await this.orm.query(
            `
                SELECT
                    u.id,
                    u.password,
                    p.username,
                    p.avatar,
                    p.first_name as "firstName",
                    p.last_name as "lastName",
                    p.gender,
                    p.biography,
                    p.sexual_orientation as "sexualOrientation",
                    p.pictures,
                    p.tags
                FROM profiles p
                         JOIN users u ON p.user_id = u.id
                WHERE u.id = $1
            `,
            [id]
        );

        if (!user)
            throw new Error('User not found');

        return {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            biography: user.biography,
            sexualOrientation: user.sexualOrientation,
            pictures: user.pictures,
            tags: user.tags,
        };
    }
}
