import fastify, { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { ORM } from '../types/orm';
import {RegisterForm, AuthResult, LoginForm, JwtPayload} from "../types/auth";
import fastifyJwt, {VerifyPayloadType} from "@fastify/jwt";
import crypto from "node:crypto"
import { sendMail } from '../utils/mail';
import { randomUrl } from '../utils/resetUtils';

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

            // Corrected INSERT query for users table
            const [newUser] = await this.orm.query(
                `INSERT INTO users (email, password, verified)
             VALUES ($1, $2, $3) 
             RETURNING id, email`,
                [form.email, hashedPassword, false] // Only 3 parameters now
            );

            // Corrected INSERT query for profiles table
            const [newProfile] = await this.orm.query(
                `INSERT INTO profiles (username, first_name, last_name, fame_rating, birth_date, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, username, first_name, last_name, birth_date, user_id`,
                [form.username, form.firstName, form.lastName, 0, form.birthDate, newUser.id]
            );

            const [emailVerification] = await this.orm.query(
                `INSERT INTO email_verifications (user_id, value)
             VALUES ($1, $2)
             RETURNING id, value`,
                [newUser.id, crypto.randomInt(10000, 100000)]
            )

            await this.orm.query(
                `UPDATE users SET profile_id = $1, email_verification_id = $2 WHERE id = $3`,
                [newProfile.id, emailVerification.id, newUser.id]
            )

            await this.orm.query('COMMIT');

            //TODO: to not hit the rate limiting of resend (email provider)
            if (process.env.NODE_ENV === "production") {
                sendMail(newUser.email, emailVerification.value, "confirmation");
            }

            const accessToken = this.jwt.sign(
                { id: newUser.id, email: newUser.email },
                { expiresIn: '1h' }
            );
            const refreshToken = this.jwt.sign(
                { id: newUser.id, email: newUser.email },
                { expiresIn: '7d' }
            );

            return {
                user: {
                    id: newUser.id,
                    username: form.username,
                    avatar: process.env.DEFAULT_AVATAR_URL as string,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    age: new Date().getFullYear() - new Date(form.birthDate).getFullYear(),
                    gender: null,
                    biography: null,
                    sexualOrientation: null,
                    pictures: [],
                    tags: [],
                },
                accessToken,
                refreshToken,
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
            u.email,
            p.username,
            p.avatar,
            p.birth_date as "birthDate",
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
                email: user.email
            },
            { expiresIn: '24h' }
        );

        const refreshToken = this.jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            { expiresIn: '7d' }
        );

        return {
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatar || process.env.DEFAULT_AVATAR_URL as string,
                firstName: user.firstName,
                lastName: user.lastName,
                age: new Date().getFullYear() - new Date(user.birthDate).getFullYear(),
                gender: user.gender,
                biography: user.biography,
                sexualOrientation: user.sexualOrientation,
                pictures: user.pictures || [],
                tags: user.tags || [],
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
            throw new Error('Invalid or expired access token');
        }
    }

    async verifyEmail(code: string): Promise<void> {
        const [emailVerification] = await this.orm.query(
            `SELECT * FROM email_verifications WHERE value = $1`,
            [code] 
        );

        if (!emailVerification) {
            throw new Error("Invalid verification code");
        }

        await this.orm.query(`UPDATE users SET verified = true WHERE id = $1`, [
            emailVerification.user_id,
        ]);
    }

    async checkResetPassword(code: string): Promise<number> {
        const [resetPassword] = await this.orm.query(
            `SELECT * FROM reset_passwords WHERE value = $1`,
            [code] 
        );

        if (!resetPassword || !resetPassword.valid) {
            throw new Error("Invalid verification code");
        }

        return resetPassword.user_id;
    }

    async resetPassword(id: number, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);

        await this.orm.query(
            `UPDATE users SET password = $1 WHERE id = $2`,
            [hashedPassword, id]
        )

        await this.orm.query(
            `UPDATE reset_passwords SET valid = false WHERE user_id = $1`,
            [id]
        )
    }

    async createResetPassword(email: string) {
        const [user] = await this.orm.query(
            `SELECT * FROM users where email = $1`,
            [email]
        );

        if (!user) {
            throw new Error("User not found");
        }

        const [resetPassword] = await this.orm.query(
            `INSERT INTO reset_passwords (user_id, value) VALUES ($1, $2) RETURNING value`,
            [user.id, randomUrl()]
        )

        sendMail(email, resetPassword.value, "reset");
    }
}
