import fastify, { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { ORM } from '../types/orm';
import {RegisterForm, AuthResult, LoginForm, JwtPayload} from "../types/auth";
import fastifyJwt, {VerifyPayloadType} from "@fastify/jwt";

export class AuthService {
    private orm: ORM;
    private jwt: FastifyInstance['jwt'];

    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
        this.jwt = fastify.jwt;
    }

    /**
     * Register a new user.
     * @returns The created user without the password.
     * @param form
     */
    async register(form: RegisterForm): Promise<AuthResult> {
        const hashedPassword = await bcrypt.hash(form.password, 10);

        try {

            const [existingUser] = await this.orm.query('SELECT * FROM users WHERE email = $1', [form.email]);

            if (existingUser) {
                throw new Error('Email already exists');
            }

            await this.orm.query('BEGIN');

            const [newUser] = await this.orm.query(
                `
                INSERT INTO users (email, password, verified)
                VALUES ($1, $2, $3)
                RETURNING id, email
                `,
                [form.email, hashedPassword, false]
            );

            const [newProfile] = await this.orm.query(
                `INSERT INTO profiles (username, first_name, last_name, user_id) VALUES ($1, $2, $3, $4) RETURNING id, username, first_name, last_name`,
                [form.username, form.firstName, form.lastName, newUser.id]
            );

            // EDIT USER TO PROFILE
            await this.orm.query(
                `UPDATE users SET profile_id = $1 WHERE id = $2`,
                [newProfile.id, newUser.id]
            );

            await this.orm.query('COMMIT');

            const accessToken = this.jwt.sign(
                {
                    id: newUser.id,
                },
                { expiresIn: '1h' }
            );

            const refreshToken = this.jwt.sign(
                {
                    id: newUser.id,
                },
                { expiresIn: '7d' }
            );

            return {
                user: {
                    id: newUser.id,
                    username: newProfile.username,
                    avatar: newProfile.avatar,
                    firstName: newProfile.firstName,
                    lastName: newProfile.lastName,
                    gender: newProfile.gender,
                    biography: newProfile.biography,
                    sexualOrientation: newProfile.sexualOrientation,
                    pictures: newProfile.pictures,
                    tags: newProfile.tags,
                },
                accessToken,
                refreshToken
            };
        } catch (error) {
            await this.orm.query('ROLLBACK');
            throw error;
        }
    }

    /**
     * Log in a user.
     * @param username - The username of the user.
     * @param password - The raw password of the user.
     * @returns An access token and refresh token if authentication is successful.
     */
    async login(form: LoginForm): Promise<AuthResult> {
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
        WHERE p.username = $1
        `,
            [form.username]
        );

        if (!user) {
            throw new Error('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(form.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }

        const accessToken = this.jwt.sign(
            {
                id: user.id,
            },
            { expiresIn: '24h' }
        );

        const refreshToken = this.jwt.sign(
            {
                id: user.id,
            },
            { expiresIn: '7d' }
        );

        return {
            user: {
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
            },
            accessToken,
            refreshToken
        };
    }

    async verifyToken(token: string): Promise<JwtPayload> {
        try {
            const user: JwtPayload = await this.jwt.verify(token);

            return user;
        } catch (error) {
            console.log(error);
            throw new Error('Invalid or expired access token');
        }
    }
}
